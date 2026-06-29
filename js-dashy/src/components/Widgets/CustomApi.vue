<template>
  <div class="customapi-wrapper" :class="display">
    <div class="row" v-for="(row, i) in results" :key="i">
      <span class="lbl" v-if="row.label">{{ row.label }}</span>
      <span class="val">
        {{ row.value }}
        <span
          v-if="row.additional"
          class="additional"
          :class="`color-${row.additional.color || 'default'}`"
        >{{ row.additional.value }}</span>
      </span>
    </div>
  </div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import { resolveField, formatValue, adaptiveColor } from '@/utils/CustomApiHelpers';

export default {
  mixins: [WidgetMixin],
  data() {
    return {
      results: [],
    };
  },
  computed: {
    url() {
      return this.parseAsEnvVar(this.options.url);
    },
    /* Basic-auth header, when username and password are supplied */
    authHeaders() {
      if (this.options.username && this.options.password) {
        const username = this.parseAsEnvVar(this.options.username);
        const password = this.parseAsEnvVar(this.options.password);
        return { Authorization: `Basic ${window.btoa(`${username}:${password}`)}` };
      }
      return {};
    },
    /* User headers (env-vars resolved) merged over the auth header */
    mergedHeaders() {
      const userHeaders = this.options.headers || {};
      const resolved = {};
      Object.keys(userHeaders).forEach((key) => {
        resolved[key] = this.parseAsEnvVar(userHeaders[key]);
      });
      const headers = { ...this.authHeaders, ...resolved };
      // Default a JSON content-type for body-bearing methods, unless the user set one
      const hasBody = this.options.requestBody != null && this.method !== 'GET' && this.method !== 'HEAD';
      const hasContentType = Object.keys(headers).some((k) => k.toLowerCase() === 'content-type');
      if (hasBody && !hasContentType) headers['Content-Type'] = 'application/json';
      return headers;
    },
    method() {
      return (this.options.method || 'GET').toUpperCase();
    },
    display() {
      return this.options.display === 'list' ? 'list' : 'block';
    },
    mappings() {
      const { mappings } = this.options;
      return Array.isArray(mappings) && mappings.length ? mappings : [{ label: '', format: 'text' }];
    },
    /* Prefer homepage-style refreshInterval (ms), else fall back to native updateInterval (secs) */
    updateInterval() {
      const ms = this.options.refreshInterval;
      if (ms === 0 || ms === false) return 0;
      if (typeof ms === 'number' && ms >= 1000) return ms;
      const secs = this.options.updateInterval;
      if (typeof secs === 'boolean') return secs ? 30000 : 0;
      if (typeof secs === 'number' && secs >= 2 && secs <= 7200) return secs * 1000;
      return 10000;
    },
  },
  methods: {
    fetchData() {
      if (!this.url) { this.error('A `url` is required'); this.finishLoading(); return; }
      this.makeRequest(this.url, this.mergedHeaders, this.method, this.options.requestBody)
        .then(this.processData)
        .catch(() => { /* error already surfaced by the mixin */ });
    },
    /* Map each configured field to a labelled, formatted value */
    processData(data) {
      try {
        this.results = this.mappings.map((m) => ({
          label: m.label || '',
          value: formatValue(resolveField(data, m.field), m, data),
          additional: this.buildAdditional(m.additionalField, data),
        }));
      } catch (e) {
        this.error('Failed to parse API response', e);
      }
    },
    /* Resolve an optional secondary value; `adaptive` colour derives from the value's sign */
    buildAdditional(field, data) {
      if (!field) return null;
      const raw = resolveField(data, field.field);
      return {
        value: formatValue(raw, field, data),
        color: field.color === 'adaptive' ? adaptiveColor(raw) : (field.color || ''),
      };
    },
  },
};
</script>

<style scoped lang="scss">
.customapi-wrapper {
  color: var(--widget-text-color);
  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.25rem 0.1rem;
    &:not(:last-child) {
      border-bottom: 1px dashed var(--widget-text-color);
    }
    .lbl {
      font-weight: bold;
      margin-right: 0.5rem;
    }
    .val {
      font-family: var(--font-monospace);
      text-align: right;
      min-width: 0;
      overflow-wrap: anywhere;
      .additional {
        margin-left: 0.5rem;
        opacity: var(--dimming-factor);
        &.color-theme { color: var(--primary); }
        &.color-success { color: var(--success); }
        &.color-warning { color: var(--warning); }
        &.color-error { color: var(--error); }
        &.color-info { color: var(--info); }
        &.color-black { color: #000; }
        &.color-white { color: #fff; }
      }
    }
  }
  &.list .row {
    flex-direction: column;
    align-items: flex-start;
    .val { text-align: left; }
  }
}
</style>
