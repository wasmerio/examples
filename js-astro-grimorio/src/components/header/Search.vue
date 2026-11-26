<script setup lang="ts">
import {
  formatDate,
  localizePath,
  useTranslations,
  type Language,
} from "../../i18n";
import { categoryLabel } from "../../data/post-options";
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import type { PostSummary } from "../../lib/posts";
const props = defineProps<{ posts: PostSummary[]; lang: Language }>();
const t = useTranslations(props.lang);
const postsPath = localizePath(props.lang, "/posts/");
const dialog = ref<HTMLDialogElement>();
const input = ref<HTMLInputElement>();
const query = ref("");
const results = computed(() => {
  const terms = query.value
    .trim()
    .toLocaleLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  if (!terms.length) return props.posts.slice(0, 4);
  return props.posts.filter((p) =>
    terms.every((term) =>
      [
        p.title,
        p.description,
        p.category,
        categoryLabel(props.lang, p.category),
        ...p.tags,
      ]
        .join(" ")
        .toLocaleLowerCase()
        .includes(term),
    ),
  );
});
let opener: HTMLElement | null = null;
const open = async () => {
  if (dialog.value?.open) return;
  opener = document.activeElement as HTMLElement | null;
  query.value = "";
  dialog.value?.showModal();
  document.body.style.overflow = "hidden";
  await nextTick();
  input.value?.focus();
};
const close = () => {
  dialog.value?.close();
};
const afterClose = () => {
  document.body.style.overflow = "";
  opener?.focus();
};
const keydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && dialog.value?.open) {
    e.preventDefault();
    close();
    return;
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    open();
  }
};
onMounted(() => {
  window.addEventListener("site:search", open);
  window.addEventListener("keydown", keydown, true);
});
onUnmounted(() => {
  window.removeEventListener("site:search", open);
  window.removeEventListener("keydown", keydown, true);
  document.body.style.overflow = "";
});
</script>
<template>
  <dialog
    ref="dialog"
    class="search-dialog"
    aria-labelledby="search-title"
    @close="afterClose"
    @click="
      (e) => {
        if (e.target === dialog) close();
      }
    "
  >
    <h2 id="search-title" class="sr-only">{{ t("search.title") }}</h2>
    <div class="search-field">
      <span class="icon-[lucide--search]" aria-hidden="true"></span
      ><input
        ref="input"
        v-model="query"
        type="search"
        :placeholder="t('search.placeholder')"
        :aria-label="t('search.keywords')"
      /><button
        class="search-close"
        :aria-label="t('search.close')"
        @click="close"
      >
        ESC
      </button>
    </div>
    <div class="search-body">
      <p class="search-meta" aria-live="polite">
        {{
          query.trim()
            ? t("search.results", { count: results.length })
            : t("search.recent")
        }}
      </p>
      <div class="search-results">
        <a
          v-for="post in results"
          :key="post.id"
          :href="`${postsPath}${post.id}/`"
          class="search-result"
          ><span class="result-icon" aria-hidden="true"
            ><span class="icon-[lucide--file-text]"></span
          ></span>
          <div>
            <strong>{{ post.title }}</strong>
            <p>
              {{ categoryLabel(lang, post.category) }} ·
              {{ formatDate(lang, post.date) }}
            </p>
          </div>
          <span
            class="result-arrow icon-[lucide--corner-down-left]"
            aria-hidden="true"
          ></span
        ></a>
        <div v-if="!results.length" class="empty-state">
          <span class="icon-[lucide--search-x]"></span>
          <h3>{{ t("search.emptyTitle") }}</h3>
          <p>{{ t("search.emptyHint") }}</p>
        </div>
      </div>
    </div>
    <div class="search-footer">
      <span>{{ t("search.footer") }}</span>
      <span>{{ t("search.shortcuts") }}</span>
    </div>
  </dialog>
</template>
<style scoped>
.search-dialog {
  position: fixed;
  margin: 12vh auto auto;
  padding: 0;
  width: min(620px, calc(100% - 28px));
  max-height: 72vh;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--card);
  color: var(--text);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  flex-direction: column;
}
.search-dialog[open] {
  display: flex;
}
.search-dialog::backdrop {
  background: #0000004d;
}
.search-field {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--line);
  color: var(--muted);
  font-size: 18px;
}
.search-field input {
  border: 0;
  outline: none;
  min-width: 0;
  flex: 1;
  background: transparent;
  color: var(--text);
  font-size: 17px;
}
.search-field input::-webkit-search-cancel-button {
  display: none;
}
.search-close {
  color: var(--muted);
  font-size: 12px;
  padding: 2px 8px;
  border: 1px solid var(--line);
  border-radius: 4px;
  background: transparent;
}
.search-close:hover {
  color: var(--text);
}
.search-body {
  padding: 6px 8px 8px;
  overflow: auto;
}
.search-meta {
  font-size: 13px;
  color: var(--muted);
  margin: 8px 10px 4px;
}
.search-result {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: 6px;
}
.search-result:hover,
.search-result:focus-visible {
  background: var(--surface);
  outline: none;
}
.search-result div {
  flex: 1;
  min-width: 0;
}
.search-result strong {
  display: block;
  font-size: 15px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.search-result p {
  font-size: 13px;
  color: var(--muted);
  margin: 1px 0 0;
}
.result-icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  font-size: 18px;
  color: var(--muted);
}
.result-arrow {
  color: var(--muted);
  opacity: 0;
}
.search-result:hover .result-arrow,
.search-result:focus-visible .result-arrow {
  opacity: 1;
}
.search-footer {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 16px;
  border-top: 1px solid var(--line);
  color: var(--muted);
  font-size: 13px;
}
</style>
