<script setup lang="ts">
import {
  languages,
  localizePath,
  stripLanguage,
  useTranslations,
  type Language,
} from "../../i18n";
import { ref, onMounted, onUnmounted } from "vue";
import { getHeaderConfig } from "../../config";
import { initTheme, toggleTheme } from "../../scripts/theme";
const props = defineProps<{ pathname: string; lang: Language }>();
const t = useTranslations(props.lang);
const headerConfig = getHeaderConfig(props.lang);
const home = localizePath(props.lang, "/");
// Highlight any "0" in the logo text (e.g. a name like "r0ot").
const brandParts = headerConfig.title.split(/(0)/).filter(Boolean);
const otherLanguage = languages.find((value) => value !== props.lang)!;
const otherLanguageUrl = localizePath(
  otherLanguage,
  stripLanguage(props.pathname),
);
const isDark = ref(false);
const isAtTop = ref(true);
const menuOpen = ref(false);
const active = (url: string) =>
  url === home ? props.pathname === home : props.pathname.startsWith(url);
const handleScroll = () => {
  isAtTop.value = window.scrollY < 48;
};
const toggle = () => {
  isDark.value = toggleTheme() === "dark";
};
const openSearch = () => {
  menuOpen.value = false;
  window.dispatchEvent(new Event("site:search"));
};
const handleKey = (event: KeyboardEvent) => {
  if (event.key === "Escape") menuOpen.value = false;
};
onMounted(() => {
  isDark.value = initTheme() === "dark";
  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("keydown", handleKey);
});
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("keydown", handleKey);
});
</script>

<template>
  <header
    class="nav-header"
    :class="{ scrolled: !isAtTop, 'menu-open': menuOpen }"
  >
    <div class="nav-inner shell">
      <a
        :href="home"
        class="brand"
        :aria-label="t('nav.brandHome', { site: headerConfig.title })"
        ><template v-for="(part, index) in brandParts" :key="index"
          ><span v-if="part === '0'" class="brand-zero">0</span
          ><template v-else>{{ part }}</template></template
        ></a
      >
      <nav
        :aria-label="t('nav.main')"
        :class="{ expanded: menuOpen }"
        id="main-navigation"
      >
        <a
          v-for="item in headerConfig.navLinks"
          :key="item.url"
          :href="item.url"
          :aria-current="active(item.url) ? 'page' : undefined"
          :class="{ active: active(item.url) }"
        >
          {{ item.name }}
        </a>
      </nav>
      <div class="nav-actions">
        <button
          class="search-trigger"
          @click="openSearch"
          :aria-label="t('nav.search')"
          :title="t('nav.searchHint')"
        >
          <span class="icon-[lucide--search]" aria-hidden="true"></span>
          <span class="search-label" aria-hidden="true">{{
            t("nav.search")
          }}</span>
        </button>
        <a
          class="icon-button language-switch"
          :href="otherLanguageUrl"
          :hreflang="otherLanguage"
          :lang="otherLanguage"
          :aria-label="`${otherLanguage.toUpperCase()} · ${t('nav.language')}`"
          :title="t('nav.language')"
          >{{ otherLanguage.toUpperCase() }}</a
        >
        <button
          class="icon-button"
          @click="toggle"
          :aria-label="isDark ? t('nav.light') : t('nav.dark')"
          :title="t('nav.theme')"
        >
          <span
            :class="isDark ? 'icon-[lucide--moon]' : 'icon-[lucide--sun]'"
          ></span>
        </button>
        <button
          class="icon-button menu-toggle"
          @click="menuOpen = !menuOpen"
          :aria-expanded="menuOpen"
          aria-controls="main-navigation"
          :aria-label="menuOpen ? t('nav.closeMenu') : t('nav.openMenu')"
        >
          <span
            :class="menuOpen ? 'icon-[lucide--x]' : 'icon-[lucide--menu]'"
          ></span>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.nav-header {
  position: fixed;
  inset: 0 0 auto;
  height: 60px;
  z-index: 40;
  background: var(--card);
  border-bottom: 1px solid var(--line);
  color: var(--text);
  transition: box-shadow 0.25s;
}
.nav-header.scrolled,
.nav-header.menu-open {
  box-shadow: 0 1px 8px #00000012;
}
.nav-inner {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 16px;
  height: 100%;
  width: 100%;
}
.brand {
  grid-column: 1;
  justify-self: start;
  font-size: 19px;
  font-weight: 600;
  white-space: nowrap;
}
nav {
  grid-column: 2;
  display: flex;
  align-self: stretch;
  gap: 26px;
}
nav a {
  display: flex;
  align-items: center;
  gap: 7px;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  font-size: 15px;
  color: var(--muted);
}
nav a:hover {
  color: var(--text);
}
nav a.active {
  color: var(--text);
  border-bottom-color: var(--accent);
}
.nav-actions {
  grid-column: 3;
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 6px;
}
.icon-button {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: var(--muted);
  font-size: 18px;
}
.icon-button:hover {
  color: var(--text);
  border-color: var(--line);
}
.language-switch {
  font-size: 13px;
  font-weight: 600;
}
.search-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  min-width: 170px;
  padding: 0 12px;
  margin-right: 6px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--bg);
  color: var(--muted);
  font-size: 14px;
}
.search-trigger:hover {
  border-color: var(--line-strong);
  color: var(--text);
}
.search-label {
  flex: 1;
  text-align: left;
}
.menu-toggle {
  display: none;
}
@media (max-width: 990px) {
  nav {
    gap: 18px;
  }
  .search-trigger {
    min-width: 0;
    width: 36px;
    padding: 0;
    margin: 0;
    justify-content: center;
    border-color: transparent;
    background: transparent;
    font-size: 18px;
  }
  .search-label {
    display: none;
  }
}
@media (max-width: 760px) {
  .nav-header {
    height: 56px;
  }
  .nav-actions {
    gap: 2px;
  }
  .menu-toggle {
    display: grid;
  }
  nav {
    display: none;
  }
  nav.expanded {
    display: flex;
    flex-direction: column;
    gap: 0;
    position: absolute;
    inset: 56px 0 auto;
    padding: 6px 16px 10px;
    border-bottom: 1px solid var(--line);
    background: var(--card);
  }
  nav.expanded a {
    padding: 12px 0;
    border-bottom: 1px solid var(--line);
    margin: 0;
  }
  nav.expanded a:last-child {
    border-bottom: 0;
  }
  nav.expanded a.active {
    color: var(--accent);
  }
}
</style>
