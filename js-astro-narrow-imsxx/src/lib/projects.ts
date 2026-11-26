import { getCollection } from "astro:content"

export async function getProjects() {
  const projects = await getCollection("projects", ({ data }) => !data.draft)
  return projects.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
}

export async function getFeaturedProjects(limit = 4) {
  const projects = await getProjects()
  return projects.filter((project) => project.data.featured).slice(0, limit)
}
