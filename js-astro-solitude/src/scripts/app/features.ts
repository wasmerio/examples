import { Solitude } from '@/scripts/core/api';
import { lifecycle } from '@/scripts/core/lifecycle';

export let coverColor: (music?: boolean) => void | Promise<void> = () => {};
export let initializeMusicPlayer: () => void = () => {};
export const loadFeatureModules = async () => {
  const signal = lifecycle.signal;
  const features = Solitude.config
    .feature_modules as import('@/types/runtime').FeatureModules;
  const requests = [];
  if (features.search === 'local')
    requests.push(
      import('@/scripts/features/search/local').then((module) => {
        if (!signal.aborted) module.initializeLocalSearch();
      }),
    );
  if (features.search === 'algolia')
    requests.push(import('@/scripts/features/search/algolia'));
  if (features.search === 'docsearch')
    requests.push(import('@/scripts/features/search/docsearch'));
  if (features.friend_links)
    requests.push(import('@/scripts/features/friend-links'));
  if (features.keyboard) requests.push(import('@/scripts/features/keyboard'));
  if (features.right_menu)
    requests.push(import('@/scripts/features/right-menu'));
  if (features.translate) requests.push(import('@/scripts/features/translate'));
  if (features.music) {
    requests.push(
      import('@/scripts/features/music/player').then((module) => {
        initializeMusicPlayer = module.initializeMusicPlayer;
      }),
    );
  }
  if (features.covercolor) {
    const coverColorLoaders = {
      local: () => import('@/scripts/features/cover-color/local'),
      api: () => import('@/scripts/features/cover-color/api'),
      ave: () => import('@/scripts/features/cover-color/ave'),
    };
    const loader = coverColorLoaders[features.covercolor];
    if (loader)
      requests.push(
        loader().then((module) => {
          coverColor = module.coverColor;
          Solitude.coverColor = coverColor;
        }),
      );
  }
  await Promise.all(requests);
};
