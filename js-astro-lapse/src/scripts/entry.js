/**
 * Every effect is a small ES module that enhances markup already on the page.
 * An element opts in with data-fx="name" (space-separated for several).
 * Modules load on demand, so a page only downloads the effects it uses.
 * Without JavaScript every section renders complete at its resting state.
 */
import { boot } from './boot.js';

// Every file in ./fx is a lazily loaded effect, named after its file.
const modules = import.meta.glob('./fx/*.js');
const loaders = Object.fromEntries(
  Object.entries(modules).map(([path, load]) => [path.replace('./fx/', '').replace('.js', ''), load]),
);

boot(loaders);
