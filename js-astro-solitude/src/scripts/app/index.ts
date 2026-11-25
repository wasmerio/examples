import { Solitude } from '@/scripts/core/api';
import { initActionDelegation } from '@/scripts/core/actions';
import { lifecycle } from '@/scripts/core/lifecycle';
import { percent } from '@/scripts/features/scroll';
import { registerActions } from './actions';
import { initializeGlobalEvents } from './events';
import { refreshPage } from './page';

const asideStatus = () => {
  const status = Solitude.saveToLocal.get('aside-status');
  document.documentElement.classList.toggle('hide-aside', status === 'hide');
};
export const initializeApp = async (isCurrent = () => true) => {
  registerActions();
  Solitude.refresh = refreshPage;
  initActionDelegation(Solitude);
  initializeGlobalEvents();
  await Solitude.refresh();
  if (!isCurrent()) return;
  asideStatus();
  window.onscroll = percent;
  Solitude.initConsoleState();
  lifecycle.emit('ready', { config: Solitude.config, page: Solitude.page });
};
