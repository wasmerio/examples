import { DEFAULT_LOCALE, getLocaleMeta } from "@/config/locales"
import { canonicalUrl } from "@/utils/routes"
import type { PostEntry } from "@/utils/posts"
import { postPath, postSlug } from "@/utils/posts"

type PostLike = Pick<PostEntry, "id" | "data" | "collection">

export function postLocaleAlternates(
  post: PostLike,
  posts: readonly PostLike[]
) {
  const slug = postSlug(post as PostEntry)
  const translations = posts.filter((entry) => postSlug(entry as PostEntry) === slug)
  const entries = Object.fromEntries(
    translations.map((entry) => [
      getLocaleMeta(entry.data.locale).hreflang,
      canonicalUrl(entry.data.locale, postPath(entry as PostEntry)),
    ])
  )
  const defaultTranslation =
    translations.find((entry) => entry.data.locale === DEFAULT_LOCALE) ?? post

  return {
    ...entries,
    "x-default": canonicalUrl(
      defaultTranslation.data.locale,
      postPath(defaultTranslation as PostEntry)
    ),
  }
}
