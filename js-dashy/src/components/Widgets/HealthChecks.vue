<template>
<div class="health-checks-wrapper" v-if="crons">
  <template
    v-for="cron in crons"
    :key="cron.id"
  >
    <div class="status">
      <p :class="cron.status || 'unknown'">{{ formatStatus(cron.status) }}</p>
    </div>
    <div
      class="info"
      v-tooltip="pingTimeTooltip(cron)"
    >
      <p class="cron-name">{{ cron.name }}</p>
      <p class="cron-desc">{{ cron.desc }}</p>
    </div>
  </template>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import { capitalize, timestampToDateTime } from '@/utils/MiscHelpers';

export default {
  mixins: [WidgetMixin],
  components: {},
  data() {
    return {
      crons: null,
    };
  },
  computed: {
    baseUrl() {
      return this.options.host || 'https://healthchecks.io';
    },
    /* API endpoint, either for self-hosted or managed instance */
    endpoint() {
      return `${this.baseUrl}/api/v1/checks/`;
    },
    /* User's API key(s), normalised to an array, or null if unset */
    apiKeys() {
      const { apiKey } = this.options;
      if (!apiKey) return null;
      const keys = Array.isArray(apiKey) ? apiKey : [apiKey];
      return keys.map((key) => this.parseAsEnvVar(key));
    },
  },
  methods: {
    /* Make status summary (emoji + name) */
    formatStatus(status) {
      const symbols = {
        up: '✔', down: '✘', new: '❖', paused: '⏸', grace: '⚠', started: '▶',
      };
      return `${symbols[status] || '❔'} ${capitalize(status || 'unknown')}`;
    },
    formatDate(timestamp) {
      return timestampToDateTime(timestamp);
    },
    fetchData() {
      if (!this.apiKeys) {
        this.error('An API key is required, please see the docs for more info');
        this.finishLoading();
        return;
      }
      this.overrideProxyChoice = true;
      const requests = this.apiKeys.map(
        (key) => this.makeRequest(this.endpoint, { 'X-Api-Key': key }),
      );
      Promise.allSettled(requests).then((outcomes) => {
        const results = [];
        outcomes.forEach((outcome) => {
          if (outcome.status === 'fulfilled') this.processData(outcome.value, results);
        });
        results.sort((a, b) => (a.name > b.name ? 1 : -1));
        this.crons = results;
      });
    },
    /* Map the API response into the cron list, guarding against bad responses */
    processData(data, results) {
      if (!data || !Array.isArray(data.checks)) {
        this.error(
          'Unexpected response, please check your host URL and API key are correct.'
          + ' useProxy may be required if your Healchecks API is blocking Dashy with CORS'
        );
        return;
      }
      data.checks.forEach((cron) => {
        results.push({
          id: cron.slug,
          name: cron.name,
          desc: cron.desc,
          status: cron.status,
          pingCount: cron.n_pings,
          lastPing: cron.last_ping,
          nextPing: cron.next_ping,
          url: this.makeUrl(cron.unique_key),
        });
      });
    },
    makeUrl(cronId) {
      return `${this.baseUrl}/checks/${cronId}/details`;
    },
    pingTimeTooltip(cron) {
      const { lastPing, nextPing, pingCount } = cron;
      const content = `<b>Total number of Pings:</b> ${pingCount}<br>`
        + `<b>Last Ping:</b> ${timestampToDateTime(lastPing)}<br>`
        + `<b>Next Ping:</b>${timestampToDateTime(nextPing)}`;
      return {
        content, html: true, popperClass: 'ping-times-tt',
      };
    },
  },
};
</script>

<style scoped lang="scss">
.health-checks-wrapper {
  display: grid;
  justify-content: center;
  grid-template-columns: 1fr 2fr;
  color: var(--widget-text-color);
  padding: 0.25rem 0;
  .status {
    min-width: 5rem;
    font-size: 1.2rem;
    font-weight: bold;
    p {
      margin: 0;
      color: var(--info);
      &.up { color: var(--success); }
      &.down { color: var(--danger); }
      &.new { color: var(--widget-text-color); }
      &.grace { color: var(--warning); }
      &.unknown { color: var(--warning); }
      &.started { color: var(--info); }
      &.paused { color: var(--info); }
    }
  }
  .info {
    p.cron-name {
      margin: 0.25rem 0;
      font-weight: bold;
      color: var(--widget-text-color);
    }
    p.cron-desc {
      margin: 0;
      color: var(--widget-text-color);
      opacity: var(--dimming-factor);
    }
  }
  &:not(:last-child) {
    border-bottom: 1px dashed var(--widget-text-color);
  }
}

</style>

<style lang="scss">
.ping-times-tt {
  min-width: 20rem;
}
</style>
