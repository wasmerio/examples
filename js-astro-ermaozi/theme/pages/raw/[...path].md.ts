import { legacyRawPath, rawMarkdownEntries, rawMarkdownResponse } from '../../lib/raw-markdown'

export async function getStaticPaths() {
  return (await rawMarkdownEntries()).map(entry => ({ params: { path: legacyRawPath(entry) }, props: { entry } }))
}

export function GET({ props }: { props: { entry: Parameters<typeof rawMarkdownResponse>[0] } }) {
  return rawMarkdownResponse(props.entry)
}
