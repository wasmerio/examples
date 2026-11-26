<script setup lang="ts">
import {
  formatDate,
  localizePath,
  useTranslations,
  type Language,
} from "../../i18n";
import { ref, computed, onMounted, onUnmounted } from "vue";
import type { PostSummary } from "../../lib/posts";
import {
  categoryNames as configuredCategories,
  categoryLabel,
  normalizeCategory,
} from "../../data/post-options";
const props = defineProps<{
  posts: PostSummary[];
  lang: Language;
  archive?: boolean;
}>();
const t = useTranslations(props.lang);
const postsPath = localizePath(props.lang, "/posts/");
const label = (category: string) => categoryLabel(props.lang, category);
const category = ref("");
const tag = ref("");
const month = ref("");
const query = ref("");
const page = ref(1);
const ready = ref(false);
const feed = ref<HTMLElement>();
const pageSize = 5;
const categoryNames: readonly string[] = configuredCategories;
const filtered = computed(() =>
  props.posts.filter(
    (p) =>
      (!category.value || p.category === category.value) &&
      (!tag.value || p.tags.includes(tag.value)) &&
      (!month.value || p.date.startsWith(month.value)) &&
      (!query.value.trim() ||
        [p.title, p.description, label(p.category), ...p.tags]
          .join(" ")
          .toLowerCase()
          .includes(query.value.trim().toLowerCase())),
  ),
);
const totalPages = computed(() =>
  Math.max(1, Math.ceil(filtered.value.length / pageSize)),
);
const displayed = computed(() =>
  filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize),
);
function syncUrl() {
  const url = new URL(window.location.href);
  for (const [key, value] of Object.entries({
    category: category.value,
    tag: tag.value,
    month: month.value,
    q: query.value.trim(),
    page: page.value > 1 ? String(page.value) : "",
  })) {
    value ? url.searchParams.set(key, value) : url.searchParams.delete(key);
  }
  window.history.replaceState(null, "", url);
}
function readUrl() {
  const params = new URLSearchParams(window.location.search);
  category.value = normalizeCategory(params.get("category") || "");
  tag.value = params.get("tag") || "";
  month.value = params.get("month") || "";
  query.value = params.get("q") || "";
  const value = Number(params.get("page"));
  page.value =
    Number.isInteger(value) && value > 0
      ? Math.min(value, totalPages.value)
      : 1;
}
function setCategory(value: string) {
  category.value = value;
  tag.value = "";
  month.value = "";
  page.value = 1;
  syncUrl();
}
function reset() {
  category.value = "";
  tag.value = "";
  month.value = "";
  query.value = "";
  page.value = 1;
  syncUrl();
}
function search() {
  page.value = 1;
  syncUrl();
}
function turnPage(value: number) {
  page.value = value;
  syncUrl();
  feed.value?.scrollIntoView({
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth",
    block: "start",
  });
}
onMounted(() => {
  readUrl();
  ready.value = true;
  window.addEventListener("popstate", readUrl);
});
onUnmounted(() => window.removeEventListener("popstate", readUrl));
</script>
<template>
  <section ref="feed" class="post-feed" :data-ready="ready">
    <div v-if="archive" class="card archive-intro">
      <span class="eyebrow">{{ t("post.archiveEyebrow") }}</span>
      <h2>{{ t("post.archiveTitle") }}</h2>
      <p>{{ t("post.archiveIntro", { count: posts.length }) }}</p>
      <label class="archive-search"
        ><span class="icon-[lucide--search]"></span
        ><input
          v-model="query"
          @input="search"
          type="search"
          :aria-label="t('post.filter')"
          :placeholder="t('post.filterPlaceholder')"
      /></label>
    </div>
    <div v-else class="feed-title">
      <h2>{{ t("post.latest") }}</h2>
      <span class="feed-count">{{
        t("post.records", { count: posts.length })
      }}</span>
    </div>
    <div class="feed-tabs" :aria-label="t('sidebar.categories')">
      <button
        :class="{ selected: !category && !tag && !month }"
        :aria-pressed="!category && !tag && !month"
        @click="reset"
      >
        {{ t("post.all") }}<span>{{ posts.length }}</span>
      </button>
      <button
        v-for="name in categoryNames"
        :key="name"
        :class="{ selected: category === name }"
        :aria-pressed="category === name"
        @click="setCategory(name)"
      >
        {{ label(name) }}
      </button>
    </div>
    <div
      v-if="tag || month || (category && !categoryNames.includes(category))"
      class="filter-summary"
    >
      <span>{{
        t("post.browsing", { filter: tag || month || label(category) })
      }}</span
      ><button @click="reset">{{ t("post.clear") }}</button>
    </div>
    <div class="post-list" aria-live="polite">
      <article
        v-for="post in displayed"
        :key="post.id"
        class="post-card card"
        :data-category="post.category"
      >
        <a
          v-if="post.cover"
          :href="`${postsPath}${post.id}/`"
          class="cover-link"
          aria-hidden="true"
          tabindex="-1"
          ><img
            class="cover-img"
            :src="post.cover"
            :alt="post.title"
            width="1200"
            height="480"
            loading="lazy"
        /></a>
        <div class="post-info">
          <div class="post-kicker">
            <span v-if="post.featured" class="pin"
              ><span class="icon-[lucide--pin]"></span
              >{{ t("post.featured") }}</span
            ><a
              :href="`${postsPath}?category=${encodeURIComponent(post.category)}`"
              >{{ label(post.category) }}</a
            ><span class="meta-divider">/</span
            ><time :datetime="post.date">{{
              formatDate(lang, post.date)
            }}</time>
          </div>
          <h3>
            <a :href="`${postsPath}${post.id}/`">{{ post.title }}</a>
          </h3>
          <p class="post-description">{{ post.description }}</p>
          <div class="post-bottom">
            <div class="post-tags">
              <a
                v-for="item in post.tags.slice(0, 2)"
                :key="item"
                :href="`${postsPath}?tag=${encodeURIComponent(item)}`"
                ># {{ item }}</a
              >
            </div>
            <a
              class="read-post"
              :href="`${postsPath}${post.id}/`"
              :aria-label="`${t('post.minutes', { count: post.minutes })} · ${t('post.readFull', { title: post.title })}`"
              >{{ t("post.minutes", { count: post.minutes })
              }}<span class="icon-[lucide--arrow-up-right]"></span
            ></a>
          </div>
        </div>
      </article>
      <div v-if="!displayed.length" class="empty-state card">
        <span class="icon-[lucide--notebook]"></span>
        <h3>{{ t("post.emptyTitle") }}</h3>
        <p>{{ t("post.emptyDescription") }}</p>
        <button class="btn secondary" @click="reset">
          {{ t("post.viewAll") }}
        </button>
      </div>
    </div>
    <nav
      v-if="totalPages > 1"
      class="pagination"
      :aria-label="t('post.pagination')"
    >
      <button
        @click="turnPage(page - 1)"
        :disabled="page === 1"
        :aria-label="t('post.previousPage')"
      >
        <span class="icon-[lucide--chevron-left]"></span>
      </button>
      <button
        v-for="index in totalPages"
        :key="index"
        @click="turnPage(index)"
        :class="{ current: page === index }"
        :aria-current="page === index ? 'page' : undefined"
        :aria-label="t('post.page', { count: index })"
      >
        {{ index }}
      </button>
      <button
        @click="turnPage(page + 1)"
        :disabled="page === totalPages"
        :aria-label="t('post.nextPage')"
      >
        <span class="icon-[lucide--chevron-right]"></span>
      </button>
      <span>{{ t("post.total", { count: filtered.length }) }}</span>
    </nav>
  </section>
</template>
<style scoped>
.post-feed {
  scroll-margin-top: 92px;
}
.feed-title {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin: 0 0 10px;
}
.feed-title h2 {
  font-size: 22px;
  font-weight: 600;
  line-height: 1.3;
  margin: 0;
}
.feed-count {
  font-size: 14px;
  color: var(--muted);
}
.feed-tabs {
  display: flex;
  gap: 22px;
  align-items: center;
  margin-bottom: 18px;
  border-bottom: 1px solid var(--line);
  overflow-x: auto;
  scrollbar-width: none;
}
.feed-tabs button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 0;
  margin-bottom: -1px;
  color: var(--muted);
  font-size: 15px;
  background: transparent;
  border: 0;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
}
.feed-tabs button.selected {
  color: var(--text);
  font-weight: 500;
  border-bottom-color: var(--accent);
}
.feed-tabs button:not(.selected):hover {
  color: var(--text);
}
.feed-tabs button > span {
  font-size: 13px;
  color: var(--muted);
}
.post-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.post-card {
  display: grid;
  grid-template-columns: 30% minmax(0, 1fr);
  overflow: hidden;
  min-height: 180px;
  transition: border-color 0.2s;
}
.post-card:hover {
  border-color: var(--line-strong);
}
.cover-link {
  display: block;
  overflow: hidden;
  margin: 12px 0 12px 12px;
  border-radius: 6px;
}
.cover-img {
  width: 100%;
  height: 100%;
  min-height: 150px;
  object-fit: cover;
  display: block;
}
.post-info {
  padding: 16px 20px 14px;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.post-kicker {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--muted);
}
.post-kicker a {
  color: var(--accent);
  font-weight: 500;
}
.post-kicker a:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}
.pin {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
  color: var(--text);
}
.meta-divider {
  color: var(--line-strong);
}
.post-info h3 {
  font-size: 19px;
  line-height: 1.35;
  font-weight: 600;
  margin: 6px 0 6px;
}
.post-info h3 a:hover {
  color: var(--accent);
}
.post-description {
  color: var(--muted);
  font-size: 15px;
  line-height: 1.55;
  margin: 0 0 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.post-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  gap: 8px;
  font-size: 14px;
}
.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  color: var(--muted);
}
.post-tags a:hover {
  color: var(--accent);
}
.read-post {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  color: var(--muted);
}
.read-post:hover {
  color: var(--accent);
}
.read-post > span {
  font-size: 15px;
}
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin: 26px 0 8px;
}
.pagination button {
  border: 1px solid var(--line);
  border-radius: 6px;
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  background: var(--card);
  color: var(--muted);
  font-size: 14px;
}
.pagination button:not(:disabled):not(.current):hover {
  border-color: var(--accent);
  color: var(--accent);
}
.pagination button.current {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--accent-contrast);
}
.pagination > span {
  font-size: 14px;
  color: var(--muted);
  margin-left: 10px;
}
.archive-intro {
  padding: 24px;
  margin-bottom: 18px;
}
.archive-intro h2 {
  font-size: 26px;
  font-weight: 600;
  margin: 2px 0 6px;
}
.archive-intro p {
  font-size: 15px;
  color: var(--muted);
  margin: 0 0 16px;
}
.archive-search {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--muted);
  padding: 8px 12px;
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: 6px;
}
.archive-search:focus-within {
  border-color: var(--accent);
}
.archive-search input {
  min-width: 0;
  flex: 1;
  border: 0;
  outline: 0;
  background: none;
  color: var(--text);
  font-size: 15px;
}
.filter-summary {
  display: flex;
  justify-content: space-between;
  color: var(--accent);
  font-size: 14px;
  margin: 0 0 14px;
}
.filter-summary button {
  border: 0;
  background: none;
  color: var(--muted);
}
@media (max-width: 760px) {
  .feed-tabs {
    gap: 18px;
  }
  .post-card {
    grid-template-columns: 1fr;
    min-height: 0;
  }
  .cover-link {
    margin: 12px 12px 0;
  }
  .cover-img {
    min-height: 140px;
    aspect-ratio: 1200 / 480;
    height: auto;
  }
  .post-info {
    padding: 14px;
  }
  .post-info h3 {
    font-size: 17px;
  }
  .post-description {
    font-size: 14px;
  }
}
</style>
