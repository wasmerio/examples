<script setup lang="ts">
import { localizePath, useTranslations, type Language } from "../../i18n";
import { getPersonalInfo } from "../../config";
import { getTags, type PostSummary } from "../../lib/posts";
const props = defineProps<{
  posts: PostSummary[];
  lang: Language;
  avatar: { src: string; srcset: string };
}>();
const t = useTranslations(props.lang);
const personalInfo = getPersonalInfo(props.lang);
const postsPath = localizePath(props.lang, "/posts/");
</script>
<template>
  <section class="card profile-card">
    <a :href="localizePath(lang, '/about/')" class="avatar-link"
      ><img
        :src="avatar.src"
        :srcset="avatar.srcset"
        :alt="personalInfo.name"
        width="64"
        height="64"
        loading="lazy"
        decoding="async"
    /></a>
    <h2>{{ personalInfo.name }}</h2>
    <p class="profile-role">{{ personalInfo.role }}</p>
    <div class="profile-stats">
      <a :href="postsPath"
        ><strong>{{ posts.length }}</strong
        ><span>{{ t("nav.posts") }}</span></a
      ><a :href="postsPath"
        ><strong>{{ new Set(posts.map((p) => p.category)).size }}</strong
        ><span>{{ t("common.categories") }}</span></a
      ><a :href="`${postsPath}#tags`"
        ><strong>{{ getTags(props.posts).length }}</strong
        ><span>{{ t("common.tags") }}</span></a
      >
    </div>
    <div class="profile-social">
      <a
        v-for="link in personalInfo.socialLinks"
        :key="link.url"
        :href="link.url"
        :target="link.url.startsWith('https') ? '_blank' : undefined"
        rel="noopener noreferrer"
        :aria-label="link.name"
        :title="link.name"
        ><span :class="link.icon" aria-hidden="true"></span
        ><span>{{ link.name }}</span></a
      >
    </div>
  </section>
</template>
<style scoped>
.profile-card {
  padding: 20px;
}
.avatar-link {
  display: block;
  width: 88px;
  margin: 4px auto 0;
}
.avatar-link img {
  width: 88px;
  height: 88px;
  object-fit: cover;
  border-radius: 50%;
}
h2 {
  margin: 14px 0 0;
  font-size: 19px;
  font-weight: 600;
  text-align: center;
}
.profile-role {
  margin: 2px 0 16px;
  font-size: 14px;
  color: var(--accent);
  text-align: center;
}
.profile-stats {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 12px 0;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}
.profile-stats a {
  display: flex;
  flex-direction: column;
}
.profile-stats strong {
  font-size: 17px;
  font-weight: 600;
  line-height: 1.3;
}
.profile-stats span {
  white-space: nowrap;
  font-size: 13px;
  color: var(--muted);
}
.profile-stats a:hover strong {
  color: var(--accent);
}
.profile-social {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  margin-top: 14px;
}
.profile-social a {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--muted);
}
.profile-social a:hover {
  color: var(--accent);
}
</style>
