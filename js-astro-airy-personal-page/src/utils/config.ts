import { getCollection } from 'astro:content';

/**
 * 获取网站全局配置
 */
export async function getSiteConfig() {
  const siteCollection = await getCollection('site');
  if (!siteCollection || siteCollection.length === 0) {
    throw new Error('未能在 config/site.yaml 中找到网站配置');
  }
  return siteCollection[0].data;
}