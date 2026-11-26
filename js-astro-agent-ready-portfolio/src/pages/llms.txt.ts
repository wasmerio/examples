import { site } from "$lib/site";
import { profileSummary } from "$lib/agent/knowledge";
import { profile } from "$content/profile";
import { blogPosts } from "$lib/content/blog";


export const GET = () => {
  const links = profile.links
    .filter((link) => link.href.startsWith("http"))
    .map((link) => `- [${link.label}](${link.href}): ${link.username}`);

  const posts = site.features.blog ? blogPosts : [];
  const postLinks = posts.map(
    (post) =>
      `- [${post.title}](${site.url}/blog/${post.slug}.md): ${post.description}`,
  );
  const blogSection = posts.length
    ? [
        "## Blog",
        "",
        ...postLinks,
        `- [RSS](${site.url}/rss.xml) and [JSON Feed](${site.url}/feed.json)`,
      ].join("\n")
    : "";

  const body = `# ${profile.name}

> ${site.shortDescription}

${profileSummary()}

## Portfolio

- [Full portfolio as Markdown](${site.url}/llms-full.txt): experience, selected work, projects, skills, contact, and every blog post in one file
- [Website](${site.url}): the human-readable version

${blogSection}

## Contact

- [Email](mailto:${profile.email}): ${profile.email}
${links.join("\n")}
`;

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
};
