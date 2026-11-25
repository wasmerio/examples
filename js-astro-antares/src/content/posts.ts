import type { CollectionEntry } from 'astro:content';
import { getCollection, render } from 'astro:content';
import getReadingTime from 'reading-time';
import moment from 'moment';
import fs from 'fs'
import * as ase256cbc from '@/utils/crypt-aes256cbc'
import { readFileSync } from '@/utils';
import { markdown2html } from '@/utils/markdown';

type Post = CollectionEntry<'posts'> & { data: PostData }
type PostData = CollectionEntry<'posts'>['data'] & PostDataExtra
type PostDataExtra = {
  publishDateISOString: string,
  publishDateFormatString: string,
  updatedDateISOString: string,
  updatedDateFormatString: string,
  readingTimeWords: number,
  readingTimeHumanizeText: string,
  categoriesItems: { depth: number; name: string; path: string; } [],
  encrypt: {
    encryptedPostBody: string,
    keySaltHex: string,
    ivSaltHex: string,
  },
  bodyJoinHtml?: string
}

const sort = (posts: Post[]) => posts.sort(({data:a}, {data:b}) => {
  if(a.top && b.top) {
    //top值相同，最新的文章在前
    if(a.top == b.top) return b.publishDate!.valueOf() - a.publishDate!.valueOf();
    //top值不同，top大的在前
    else return b.top - a.top; 
    //只有一篇文章top有定义，有top在前
  } else if(a.top && !b.top) {
    return -1;
  } else if(!a.top && b.top) {
    return 1;
  } else {
    //都没有top，最新的文章在前
    return b.publishDate!.valueOf() - a.publishDate!.valueOf();
  }
})

const posts = sort(await Promise.all((await getCollection("posts") as Post[]).map(async post => {
  post.data.bodyJoinHtml = post.data.bodyJoin ? (await Promise.all(post.data.bodyJoin.map(readFileSync).map(async content => markdown2html(content)))).join('\n') : ''
  
  const fileStat = await fs.promises.stat(post.filePath!)
  post.data.publishDate = post.data.publishDate || fileStat.birthtime
  post.data.publishDateISOString = post.data.publishDate!.toISOString()
  post.data.publishDateFormatString = moment(post.data.publishDate!).format('yyyy-MM-DD')
  post.data.updatedDate = post.data.updatedDate || fileStat.mtime
  post.data.updatedDateISOString = post.data.updatedDate!.toISOString()
  post.data.updatedDateFormatString = moment(post.data.updatedDate!).format('yyyy-MM-DD')

  const readingTime = getReadingTime((post.body||'')+ post.data.bodyJoinHtml)
  post.data.readingTimeWords = readingTime.words
  post.data.readingTimeHumanizeText = moment.duration(readingTime.time * 1.2).humanize();

  post.data.categoriesItems = post.data.categories.reduce((result, category, index) => {
    const categoryPath = result.length > 0 ? `${result[result.length - 1].path}/${category}` : `/${category}`;
    const categoryItem = { depth: index + 1, name: category, path: categoryPath };
    result.push(categoryItem);
    return result;
  }, [] as PostDataExtra['categoriesItems']);

  if (post.data.password) {
    const { password, encrypt } = post.data
    const renderedPostBody = await render(post).then(_=>post.rendered?.html || '')
    const { content: encryptedPostBody, keySaltHex, ivSaltHex } = ase256cbc.encrypt(password, renderedPostBody)
    Object.assign(encrypt, { encryptedPostBody, keySaltHex, ivSaltHex })
  }
  
  return post
})))

type CategoryItem =  PostDataExtra['categoriesItems'][0]
type CategoryItemWithPostCount = CategoryItem & { postCount: number }
type CategoryItemWithSubcategories = CategoryItemWithPostCount & { subcategories?:CategoryItemWithSubcategories[] }

const categoriesItemsWithPostCount = posts.map(({data})=>data.categoriesItems).flat().reduce((accumulator, current) => {
  const find = accumulator.find(c => c.path === current!.path)
  if (!find) {
    accumulator.push({...current!,postCount:1});
  } else {
    find.postCount++
  }
  return accumulator;
}, [] as CategoryItemWithPostCount[]).sort((a,b) => a.path.localeCompare(b.path));

const categoryItemsWithSubcategories = categoriesItemsWithPostCount.reduce((array, category) => {
  if (category.depth === 1) {
    array.push({ ...category, subcategories: [] });
  } else if (category.depth === 2) {
    array.at(-1)?.subcategories?.push({ ...category, subcategories: [] });
  } else if (category.depth === 3) {
    array.at(-1)?.subcategories?.at(-1)?.subcategories?.push({ ...category })
  }
  return array;
}, [] as CategoryItemWithSubcategories[]).sort((rootA,rootB) => rootB.postCount - rootA.postCount);

const tagsWithPostCount = posts.filter(post=>post.data.tags).map(post=>post.data.tags!).flat().reduce((accumulator, tag) => {
  accumulator[tag] = (accumulator[tag] || 0) + 1;
  return accumulator;
}, {} as {[key: string]: number})

const postsStatistics = {
  count : posts.length,
  readingTimeWordsSum : posts.reduce((accumulator, post) => accumulator + post.data.readingTimeWords, 0),
  tagsCount : Object.keys(tagsWithPostCount).length,
  categoriesCount : new Set(posts.map(({data})=>data.categoriesItems).flat().map(({path})=>path)).size
}

export default posts
export {
  sort,
  type Post,
  type CategoryItemWithSubcategories,
  categoryItemsWithSubcategories,
  tagsWithPostCount,
  postsStatistics
}