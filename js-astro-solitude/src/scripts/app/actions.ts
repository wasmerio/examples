import { Solitude } from '@/scripts/core/api';
import { asideActions } from '@/scripts/features/aside';
import { musicActions } from '@/scripts/features/music/actions';
import { navigationActions } from '@/scripts/features/navigation';
import { postActions } from '@/scripts/features/post';
import { themeActions } from '@/scripts/features/theme';

export const actions = {
  ...musicActions,
  ...asideActions,
  ...navigationActions,
  ...postActions,
  ...themeActions,
};

export function registerActions() {
  Object.assign(Solitude, actions);
  Solitude.toggleTheme = () => Solitude.switchDarkMode();
}
