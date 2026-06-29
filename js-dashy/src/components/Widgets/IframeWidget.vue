<template>
<div class="iframe-widget">
  <iframe
    v-if="frameUrl"
    :key="updateCount"
    :src="frameUrl"
    :id="frameId"
    title="Iframe Widget"
    allow="fullscreen; clipboard-write"
    :style="frameHeight ? `height: ${frameHeight}px` : ''"
  />
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';

export default {
  mixins: [WidgetMixin],
  data: () => ({
    updateCount: 0,
  }),
  computed: {
    /* Gets users specified URL to load into the iframe */
    frameUrl() {
      const usersChoice = this.options.url;
      if (!usersChoice || typeof usersChoice !== 'string') {
        this.error('Iframe widget expects a URL');
        return null;
      }
      return usersChoice;
    },
    frameHeight() {
      return this.options.frameHeight;
    },
    /* Generates an ID for the iframe */
    frameId() {
      return `iframe-${btoa(this.frameUrl || 'empty').substring(0, 16)}`;
    },
  },
  methods: {
    /* Refreshes iframe contents, called by parent */
    update() {
      this.startLoading();
      this.updateCount += 1;
      this.finishLoading();
    },
  },
};
</script>

<style scoped lang="scss">
.iframe-widget {
  iframe {
    width: 100%;
    min-height: 80px;
    border: 0;
  }
}

</style>
