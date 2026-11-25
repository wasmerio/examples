declare module "@config" {
    export const CONFIG: {
      TITLE: string;
      URL: string;
      DESCRIPTION: string;
      LANG: string;
      DATE_LANG: string;

      STYLE: string;

      AUTHOR: string;
      CONTACT: boolean;
      EMAIL: string;
      
      POST_COVER: boolean;
      POST_THUMBNAILS: boolean;
      POST_SUGGESTIONS: boolean;
      
      HOME_NB_POSTS: number;

      // Uncomment to add link to header. Copy structure for more links.
      // Edit also 'src/components/header.astro' and 'blog-config.yaml'.
      // MY_SWITCH: boolean
      // MY_LINK: string

      BLOG_COVER: {
        src: string,
        alt: string
      }
      
      BANNER: {
        src: string,
        alt: string
      }
      
      MENU: {
        label: string,
        url: string
      }[]

      EDITOR: {
        GITHUBUSER: string,
        GITHUBREPO: string
      }
      
    };
  }