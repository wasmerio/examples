/**
 * Infinite Scroll utility for listing posts in page feeds.
 */
export function initInfiniteScroll(selector = '.post-feed') {
  const postFeed = document.querySelector(selector) as HTMLElement | null;
  if (postFeed) {
    let currentPage = 1;
    const maxPages = parseInt(postFeed.getAttribute('data-max-pages') || '1', 10);
    const baseUrl = postFeed.getAttribute('data-base-url') || '/';
    let isLoading = false;
    
    const infiniteScroll = async () => {
      if (isLoading || currentPage >= maxPages) return;
      
      const threshold = 100;
      const scrollPos = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      if (scrollPos >= documentHeight - threshold) {
        isLoading = true;
        currentPage++;
        
        try {
          const nextPageUrl = `${baseUrl}page${currentPage}/`;
          const res = await fetch(nextPageUrl);
          if (!res.ok) throw new Error('Page fetch failed');
          
          const html = await res.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          
          const newPosts = doc.querySelectorAll(`${selector} .post-card`);
          newPosts.forEach((post) => {
            const el = post as HTMLElement;
            el.style.opacity = '0';
            postFeed.appendChild(el);
            setTimeout(() => {
              el.style.transition = 'opacity 0.3s ease';
              el.style.opacity = '1';
            }, 50);
          });
        } catch (err) {
          console.error('Error loading next page:', err);
          currentPage = maxPages;
        } finally {
          isLoading = false;
        }
      }
    };
    
    const cleanup = () => {
      window.removeEventListener('scroll', infiniteScroll);
      window.removeEventListener('resize', infiniteScroll);
      document.removeEventListener('astro:before-swap', cleanup);
    };
    document.addEventListener('astro:before-swap', cleanup);

    window.addEventListener('scroll', infiniteScroll, { passive: true });
    window.addEventListener('resize', infiniteScroll, { passive: true });
  }
}
