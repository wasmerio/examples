import { getCollection } from 'astro:content';

export async function GET() {
  const posts = await getCollection('blog');
  
  const searchData = await Promise.all(
    posts.map(async (post) => {
      if (post.data.draft) {
        return null;
      }

      // Remove image paths from content
      const cleanContent = post.body.replace(/!\[.*?\]\(.*?\)/g, '')  // Remove markdown images
        .replace(/<img[^>]*>/g, '')  // Remove HTML images
        .replace(/<(video|audio)[^>]*>.*?<\/(video|audio)>/gs, '')  // Remove video/audio tags
        .replace(/\.(png|jpg|jpeg|gif|webp|svg|avif|mp4|webm|mp3|wav|ogg)/gi, ''); // Remove media file extensions

      return {
        title: post.data.title,
        description: post.data.description,
        tags: post.data.tags,
        slug: post.slug,
        content: cleanContent,
      };
    })
  );

  // filter out null values
  const filteredData = searchData.filter(Boolean);

  return new Response(JSON.stringify(filteredData), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
