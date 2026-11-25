import Parser from 'rss-parser';

async function getRss(url) {
    console.log("getRss started ", url)

    const parser = new Parser({
        timeout: 5000, // 5 second timeout
        headers: {
            'User-Agent': 'OBR Open Blog Renaissance',
            'Accept': 'application/rss+xml, application/xml, text/xml; q=0.9, */*; q=0.8'
        },
    });
    try {
        const feed = await parser.parseURL(url);
        return {success: true, title: feed.title, items: feed.items}
    } catch (err) {
        console.error("RSS error:", err);
        return { success: false, error: `error: ${err}`}
    }
}

export const loadBlogroll = async (allBlogRollUrls) => {
    console.log("loadBlogroll started")
    const blogroll = [];

    for (const url of allBlogRollUrls) {
        const rss = await getRss(url.url);
    
        if (!rss.success || !Array.isArray(rss.items) || rss.items.length ===0) {continue;}
        
        rss.items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    
        const topItem = rss.items[0];
        
        if (topItem) {
            topItem.blogTitle = rss.title || null;
            blogroll.push({category: url.category, ...topItem})
        }
    }

    blogroll.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    const blogRollObject = blogroll.map( (item, index) => ({id: index.toString(), category: item.category, blogTitle: item.blogTitle, title: item.title, link: item.link, pubDate: item.pubDate  }))

    return blogRollObject;
}
        
        
           





