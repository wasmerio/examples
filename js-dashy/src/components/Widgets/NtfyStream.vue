<template>
  <div class="ntfy-stream">
    <div class="ntfy-stream-widget-title" v-if="title">
        {{ title }}
    </div>
    <div v-for="(item, key) in messages" :key="key" class="ntfy-stream-row">
      <div v-if="item.title" class="ntfy-stream-title">
          {{ item.title }}
      </div>
      <div v-if="item.message" class="ntfy-stream-content">
        {{ item.message }}
      </div>
    </div>
  </div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';

export default {
  mixins: [WidgetMixin],
  components: {},
  data() {
    return {
      messages: [],
    };
  },
  beforeUnmount() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  },
  computed: {
    serverUrl() {
      if (!this.options.server_url) this.error('The server URL is required.');
      return this.parseAsEnvVar(this.options.server_url) || '';
    },
    topic() {
      if (!this.options.topic) this.error('The topic is required.');
      return this.parseAsEnvVar(this.options.topic) || '';
    },
    auth() {
      return this.parseAsEnvVar(this.options.auth) || '';
    },
    title() {
      return this.parseAsEnvVar(this.options.title) || '';
    },
    limit() {
      return parseInt(this.options.limit, 10) || 50;
    },
  },
  methods: {
    fetchData() {
      // @see https://docs.ntfy.sh/subscribe/api/#subscribe-as-sse-stream
      this.finishLoading();
      if (this.eventSource) {
        this.eventSource.close();
      }
      let url = `${this.serverUrl}/${this.topic}/sse`;
      if (this.auth !== '') {
        url = `${url}?auth=${encodeURIComponent(this.auth)}`;
      }
      this.eventSource = new EventSource(url);
      this.eventSource.onmessage = (e) => {
        this.messages.unshift(JSON.parse(e.data));
        if (this.messages.length > this.limit) {
          this.messages = this.messages.slice(0, this.limit);
        }
      };
      this.eventSource.onerror = (e) => {
        const msg = this.eventSource.readyState === EventSource.CLOSED ?
          'ntfy connection closed by the server (check URL, topic and auth).'
          : 'Unable to reach the ntfy server, reconnecting...';
        this.error(msg, e);
      };
    },
  },
};

</script>

<style scoped lang="scss">

.ntfy-stream {
  .ntfy-stream-widget-title {
    outline: 2px solid transparent;
    border: 1px solid var(--outline-color);
    border-radius: var(--curve-factor);
    box-shadow: var(--item-shadow);
    color: var(--item-text-color);
    margin: .5rem;
    padding: 0.3rem;
    background: var(--item-background);
    text-align: center;

  }
  .ntfy-stream-row {
    color: var(--widget-text-color);
    font-size: 1.1rem;
    .ntfy-stream-title {
      font-weight: bold;
    }
    &:not(:last-child) {
      border-bottom: 1px dashed var(--widget-text-color);
    }
  }
}
</style>
