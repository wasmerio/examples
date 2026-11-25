import { visit } from 'unist-util-visit';

function textFrom(node) {
  if (!node) return '';
  if (node.type === 'text' || node.type === 'inlineCode') return node.value || '';
  return (node.children || []).map(textFrom).join('');
}

function tabTitle(node, index) {
  const attrs = node.attributes || {};
  return String(
    attrs.title || attrs.label || textFrom(node.children?.[0]).trim() || `Tab ${index + 1}`
  );
}

function htmlProps(className, extra = {}) {
  return { className, ...extra };
}

export function remarkTabs() {
  return (tree) => {
    visit(tree, 'containerDirective', (node, index, parent) => {
      if (!parent || node.name !== 'tabs') return;

      const tabNodes = (node.children || []).filter(
        (child) => child.type === 'containerDirective' && child.name === 'tab'
      );
      if (tabNodes.length === 0) return;

      const groupId = `markdown-tabs-${index || 0}`;
      const labels = tabNodes.map(tabTitle);

      node.data ||= {};
      node.data.hName = 'div';
      node.data.hProperties = htmlProps(['markdown-tabs', 'not-prose'], {
        dataTabs: '',
        id: groupId
      });

      node.children = [
        {
          type: 'html',
          value: `<div class="tabs-nav-shell"><div class="tabs-nav" role="tablist" aria-label="Content tabs">${labels
            .map((label, tabIndex) => {
              const selected = tabIndex === 0 ? 'true' : 'false';
              const tabId = `${groupId}-tab-${tabIndex}`;
              const panelId = `${groupId}-panel-${tabIndex}`;
              return `<button class="tabs-trigger" type="button" role="tab" id="${tabId}" aria-selected="${selected}" aria-controls="${panelId}" tabindex="${tabIndex === 0 ? '0' : '-1'}">${label}</button>`;
            })
            .join('')}</div></div>`
        },
        {
          type: 'containerDirective',
          name: 'tabs-panels',
          children: tabNodes.map((tab, tabIndex) => {
            tab.data ||= {};
            tab.data.hName = 'section';
            tab.data.hProperties = htmlProps(['tabs-panel'], {
              role: 'tabpanel',
              id: `${groupId}-panel-${tabIndex}`,
              ariaLabelledBy: `${groupId}-tab-${tabIndex}`,
              dataTabsPanel: '',
              hidden: tabIndex === 0 ? undefined : true
            });
            return tab;
          }),
          data: {
            hName: 'div',
            hProperties: htmlProps(['tabs-panels'])
          }
        }
      ];
    });
  };
}
