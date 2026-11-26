export const site = {
  // site settings
  title: "Forty",
  subtitle: "by HTML5 UP",
  email: "youremailaddress@gmail.com",
  description:
    'A responsive site template designed by HTML5 Up<br /> and released under the Creative Commons.',
  author: "",

  // contact/address
  street_address: "1234 Somewhere Road",
  city: "Nashville",
  state: "TN",
  zip_code: "55555",
  country: "United States of America",
  phone: "(716) 555-5555",

  // homepage tiles (you’ll implement this logic in Astro)
  tilesSource: "posts" as const, // or "pages"
  tilesCount: 6,


  // socials (keys map to font-awesome icon names used in your markup)
  socials: {
    "GitHub": "https://github.com/andrewbanchich",
    "GitLab": "",
    "Google-Plus": "https://plus.google.com/u/0/+AndrewBanchich",
    "Instagram": "",
    "LinkedIn": "https://www.linkedin.com/in/andrew-banchich-a4ba1195",
    "Twitter": "https://twitter.com/andrewbanchich",
    "Facebook": "",
    "Slack": "",
  } as Record<string, string>,
};
