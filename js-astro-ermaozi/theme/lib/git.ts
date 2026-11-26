import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { dirname, relative, resolve } from 'node:path'
import MarkdownIt from 'markdown-it'

export type GitProvider = 'bitbucket' | 'gitee' | 'github' | 'gitlab'

export interface ContributorInfo {
  username: string
  name?: string
  alias?: string | string[]
  email?: string
  emailAlias?: string | string[]
  avatar?: string
  url?: string
}

export interface GitContributor {
  name: string
  username: string
  email: string
  commits: number
  avatar?: string
  url?: string
}

export interface GitChangelogItem {
  hash: string
  time: number
  message: string
  author: string
  email: string
  tag?: string
  commitUrl?: string
  tagUrl?: string
}

export interface ContributorsOptions {
  mode?: 'inline' | 'block'
  info?: ContributorInfo[]
  avatar?: boolean
  avatarPattern?: string
  transform?: (contributors: GitContributor[]) => GitContributor[]
}

export interface ChangelogOptions {
  maxCount?: number
  repoUrl?: string
  commitUrlPattern?: string
  issueUrlPattern?: string
  tagUrlPattern?: string
}

interface RawCommit {
  hash: string
  time: number
  author: string
  email: string
  body: string
  message: string
  refs: string
  coAuthors: Array<{ name: string, email: string }>
}

export interface GitPageData {
  createdTime?: number
  updatedTime?: number
  contributors: GitContributor[]
  changelog: GitChangelogItem[]
}

const md = new MarkdownIt({ html: false, linkify: false })
const list = (value?: string | string[]) => value == null ? [] : Array.isArray(value) ? value : [value]
const coAuthorPattern = /^\s*Co-authored-by:\s*([^<]+?)\s*<([^>]+)>\s*$/gimu

const normalizeRepoUrl = (url = '') => {
  const cleaned = url.trim().replace(/\.git$/u, '')
  const scp = /^git@([^:]+):(.+)$/u.exec(cleaned)
  if (scp) return `https://${scp[1]}/${scp[2]}`
  const ssh = /^ssh:\/\/git@([^/]+)\/(.+)$/u.exec(cleaned)
  if (ssh) return `https://${ssh[1]}/${ssh[2]}`
  const git = /^git:\/\/([^/]+)\/(.+)$/u.exec(cleaned)
  return git ? `https://${git[1]}/${git[2]}` : cleaned
}

const providerOf = (url: string): GitProvider | undefined =>
  url.includes('github.com') ? 'github'
    : url.includes('gitlab.com') ? 'gitlab'
      : url.includes('gitee.com') ? 'gitee'
        : url.includes('bitbucket.org') ? 'bitbucket'
          : undefined

const patternsFor = (provider?: GitProvider) => provider ? ({
  github: { commit: ':repo/commit/:hash', issue: ':repo/issues/:issue', tag: ':repo/releases/tag/:tag' },
  gitlab: { commit: ':repo/-/commit/:hash', issue: ':repo/-/issues/:issue', tag: ':repo/-/releases/:tag' },
  gitee: { commit: ':repo/commit/:hash', issue: ':repo/issues/:issue', tag: ':repo/releases/tag/:tag' },
  bitbucket: { commit: ':repo/commits/:hash', issue: ':repo/issues/:issue', tag: ':repo/src/:hash' },
}[provider]) : {}

const expand = (pattern: string | undefined, values: Record<string, string>) => pattern
  ? Object.entries(values).reduce((url, [key, value]) => url.replaceAll(`:${key}`, value), pattern)
  : undefined

const usernameOf = (name: string, email: string) => email.endsWith('@users.noreply.github.com')
  ? email.slice(0, -'@users.noreply.github.com'.length).split('+').at(-1) || name
  : name

const infoFor = (name: string, email: string, info: ContributorInfo[]) => info.find(item =>
  item.username === name
  || list(item.alias).includes(name)
  || item.email === email
  || list(item.emailAlias).includes(email))

const contributorList = (commits: RawCommit[], options: ContributorsOptions, provider?: GitProvider) => {
  const contributors = new Map<string, GitContributor>()
  for (const commit of [...commits].reverse()) {
    for (const author of [{ name: commit.author, email: commit.email }, ...commit.coAuthors]) {
      const inferred = usernameOf(author.name, author.email)
      const info = infoFor(inferred, author.email, options.info ?? [])
      const username = info?.username ?? inferred
      const key = username || author.name
      const existing = contributors.get(key)
      if (existing) {
        existing.commits += 1
        continue
      }
      const avatar = options.avatar === false ? undefined
        : info?.avatar
          ?? (username && options.avatarPattern?.replace(':username', username))
          ?? (provider === 'github' && username ? `https://avatars.githubusercontent.com/${username}?v=4` : `https://gravatar.com/avatar/${createHash('sha256').update(author.email).digest('hex')}?d=retro`)
      const url = info?.url ?? (provider === 'github' && username ? `https://github.com/${username}` : undefined)
      contributors.set(key, {
        name: info?.name ?? username ?? author.name,
        username,
        email: info?.email ?? author.email,
        commits: 1,
        ...(avatar ? { avatar } : {}),
        ...(url ? { url } : {}),
      })
    }
  }
  const result = [...contributors.values()].filter((contributor, index, all) => {
    if (!/no-?reply/u.test(contributor.email.split('@')[1] ?? '')) return true
    const duplicate = all.findIndex(item => item.name === contributor.name)
    if (duplicate === index) return true
    all[duplicate].commits += contributor.commits
    return false
  })
  return options.transform?.(result) ?? result
}

const repoRootOf = (file: string) => {
  try {
    return execFileSync('git', ['-C', dirname(file), 'rev-parse', '--show-toplevel'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  }
  catch {
    return ''
  }
}

const remoteOf = (root: string) => {
  try {
    return normalizeRepoUrl(execFileSync('git', ['-C', root, 'remote', 'get-url', 'origin'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }))
  }
  catch {
    return ''
  }
}

const commitsFor = (file: string, root: string): RawCommit[] => {
  const path = relative(root, file)
  if (!path || path.startsWith('..')) return []
  try {
    const output = execFileSync('git', [
      '-C', root,
      'log', '--follow',
      '--format=%H%x00%at%x00%an%x00%ae%x00%b%x00%s%x00%D%x1e',
      '--', path,
    ], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
    return output.split('\x1e').map(record => record.trim()).filter(Boolean).map(record => {
      const [hash, time, author, email, body, message, refs] = record.split('\x00')
      return {
        hash,
        time: Number(time) * 1000,
        author,
        email,
        body,
        message,
        refs,
        coAuthors: [...body.matchAll(coAuthorPattern)].map(match => ({ name: match[1].trim(), email: match[2].trim() })),
      }
    })
  }
  catch {
    return []
  }
}

const tagOf = (refs: string) => refs.replace(/[()]/gu, '').split(',').map(ref => ref.trim())
  .find(ref => ref.startsWith('tag:'))?.slice(4).trim()

export const getGitPageData = ({
  file,
  includes = [],
  contributors = true,
  changelog = false,
  repositoryUrl = '',
}: {
  file?: string
  includes?: string[]
  contributors?: boolean | ContributorsOptions
  changelog?: boolean | ChangelogOptions
  repositoryUrl?: string
}): GitPageData => {
  const empty = { contributors: [], changelog: [] }
  if (!file) return empty
  const root = repoRootOf(file)
  if (!root) return empty
  const files = [file, ...includes.map(include => resolve(dirname(file), include))]
    .filter(candidate => !relative(root, candidate).startsWith('..'))
  const commits = [...new Map(files.flatMap(candidate => commitsFor(candidate, root)).map(commit => [commit.hash, commit])).values()]
    .sort((left, right) => right.time - left.time)
  if (!commits.length) return empty

  const repoUrl = normalizeRepoUrl(typeof changelog === 'object' && changelog.repoUrl || repositoryUrl || remoteOf(root))
  const provider = providerOf(repoUrl)
  const contributorOptions = typeof contributors === 'object' ? { avatar: true, ...contributors } : { avatar: true }
  const changelogOptions = typeof changelog === 'object' ? changelog : {}
  const defaults = patternsFor(provider)
  const commitPattern = changelogOptions.commitUrlPattern ?? defaults.commit
  const tagPattern = changelogOptions.tagUrlPattern ?? defaults.tag
  const issuePattern = changelogOptions.issueUrlPattern ?? defaults.issue
  const history = changelog ? commits.slice(0, changelogOptions.maxCount || undefined).map(commit => {
    const tag = tagOf(commit.refs)
    const linkedMessage = repoUrl && issuePattern
      ? commit.message.replace(/#(\d+)/gu, match => `[${match}](${expand(issuePattern, { repo: repoUrl, issue: match.slice(1) })})`)
      : commit.message
    return {
      hash: commit.hash,
      time: commit.time,
      author: commit.author,
      email: commit.email,
      message: md.renderInline(linkedMessage),
      ...(tag ? { tag } : {}),
      ...(repoUrl && commitPattern ? { commitUrl: expand(commitPattern, { repo: repoUrl, hash: commit.hash }) } : {}),
      ...(repoUrl && tag && tagPattern ? { tagUrl: expand(tagPattern, { repo: repoUrl, tag, hash: commit.hash }) } : {}),
    }
  }) : []

  return {
    createdTime: commits.at(-1)?.time,
    updatedTime: commits[0]?.time,
    contributors: contributors ? contributorList(commits, contributorOptions, provider) : [],
    changelog: history,
  }
}
