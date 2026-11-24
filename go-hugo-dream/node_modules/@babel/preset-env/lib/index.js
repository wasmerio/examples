import { isLessThan, coerce, parse, normalize } from 'verkit';
import getTargets, { getInclusionReasons, filterItems, prettifyTargets } from '@babel/helper-compilation-targets';
import transformAsyncGeneratorFunctions from '@babel/plugin-transform-async-generator-functions';
import transformAsyncToGenerator from '@babel/plugin-transform-async-to-generator';
import transformArrowFunctions from '@babel/plugin-transform-arrow-functions';
import transformBlockScopedFunctions from '@babel/plugin-transform-block-scoped-functions';
import transformBlockScoping from '@babel/plugin-transform-block-scoping';
import transformClasses from '@babel/plugin-transform-classes';
import transformClassProperties from '@babel/plugin-transform-class-properties';
import transformClassStaticBlock from '@babel/plugin-transform-class-static-block';
import transformComputedProperties from '@babel/plugin-transform-computed-properties';
import transformDestructuring from '@babel/plugin-transform-destructuring';
import transformDotallRegex from '@babel/plugin-transform-dotall-regex';
import transformDuplicateKeys from '@babel/plugin-transform-duplicate-keys';
import transformDuplicateNamedCapturingGroupsRegex from '@babel/plugin-transform-duplicate-named-capturing-groups-regex';
import transformDynamicImport from '@babel/plugin-transform-dynamic-import';
import transformExplicitResourceManagement from '@babel/plugin-transform-explicit-resource-management';
import transformExponentialOperator from '@babel/plugin-transform-exponentiation-operator';
import transformExportNamespaceFrom from '@babel/plugin-transform-export-namespace-from';
import transformForOf from '@babel/plugin-transform-for-of';
import transformFunctionName from '@babel/plugin-transform-function-name';
import transformJsonStrings from '@babel/plugin-transform-json-strings';
import transformLiterals from '@babel/plugin-transform-literals';
import transformLogicalAssignmentOperators from '@babel/plugin-transform-logical-assignment-operators';
import transformMemberExpressionLiterals from '@babel/plugin-transform-member-expression-literals';
import transformModulesAmd from '@babel/plugin-transform-modules-amd';
import transformModulesCommonjs from '@babel/plugin-transform-modules-commonjs';
import transformModulesSystemjs from '@babel/plugin-transform-modules-systemjs';
import transformModulesUmd from '@babel/plugin-transform-modules-umd';
import transformNamedCapturingGroupsRegex from '@babel/plugin-transform-named-capturing-groups-regex';
import transformNewTarget from '@babel/plugin-transform-new-target';
import transformNullishCoalescingOperator from '@babel/plugin-transform-nullish-coalescing-operator';
import transformNumericSeparator from '@babel/plugin-transform-numeric-separator';
import transformObjectRestSpread from '@babel/plugin-transform-object-rest-spread';
import transformObjectSuper from '@babel/plugin-transform-object-super';
import transformOptionalCatchBinding from '@babel/plugin-transform-optional-catch-binding';
import transformOptionalChaining from '@babel/plugin-transform-optional-chaining';
import transformParameters from '@babel/plugin-transform-parameters';
import transformPrivateMethods from '@babel/plugin-transform-private-methods';
import transformPrivatePropertyInObject from '@babel/plugin-transform-private-property-in-object';
import transformPropertyLiterals from '@babel/plugin-transform-property-literals';
import transformRegenerator from '@babel/plugin-transform-regenerator';
import transformRegExpModifiers from '@babel/plugin-transform-regexp-modifiers';
import transformReservedWords from '@babel/plugin-transform-reserved-words';
import transformShorthandProperties from '@babel/plugin-transform-shorthand-properties';
import transformSpread from '@babel/plugin-transform-spread';
import transformStickyRegex from '@babel/plugin-transform-sticky-regex';
import transformTemplateLiterals from '@babel/plugin-transform-template-literals';
import transformTypeofSymbol from '@babel/plugin-transform-typeof-symbol';
import transformUnicodeEscapes from '@babel/plugin-transform-unicode-escapes';
import transformUnicodePropertyRegex from '@babel/plugin-transform-unicode-property-regex';
import transformUnicodeRegex from '@babel/plugin-transform-unicode-regex';
import transformUnicodeSetsRegex from '@babel/plugin-transform-unicode-sets-regex';
import bugfixAsyncArrowsInClass from '@babel/preset-modules/lib/plugins/transform-async-arrows-in-class/index.js';
import bugfixEdgeDefaultParameters from '@babel/preset-modules/lib/plugins/transform-edge-default-parameters/index.js';
import bugfixEdgeFunctionName from '@babel/preset-modules/lib/plugins/transform-edge-function-name/index.js';
import bugfixFirefoxClassInComputedKey from '@babel/plugin-bugfix-firefox-class-in-computed-class-key';
import bugfixTaggedTemplateCaching from '@babel/preset-modules/lib/plugins/transform-tagged-template-caching/index.js';
import bugfixSafariBlockShadowing from '@babel/preset-modules/lib/plugins/transform-safari-block-shadowing/index.js';
import bugfixSafariForShadowing from '@babel/preset-modules/lib/plugins/transform-safari-for-shadowing/index.js';
import bugfixSafariIdDestructuringCollisionInFunctionExpression from '@babel/plugin-bugfix-safari-id-destructuring-collision-in-function-expression';
import bugfixSafariRestDestructuringRhsArray from '@babel/plugin-bugfix-safari-rest-destructuring-rhs-array';
import bugfixSafariClassFieldInitializerScope from '@babel/plugin-bugfix-safari-class-field-initializer-scope';
import bugfixV8SpreadParametersInOptionalChaining from '@babel/plugin-bugfix-v8-spread-parameters-in-optional-chaining';
import bugfixV8StaticClassFieldsRedefineReadonly from '@babel/plugin-bugfix-v8-static-class-fields-redefine-readonly';
import corejs3Polyfills from 'core-js-compat/data.json' with { type: 'json' };
import originalPlugins from '@babel/compat-data/plugins' with { type: 'json' };
import originalPluginsBugfixes from '@babel/compat-data/plugin-bugfixes' with { type: 'json' };
import originalOverlappingPlugins from '@babel/compat-data/overlapping-plugins' with { type: 'json' };
import { OptionValidator } from '@babel/helper-validator-option';
import pluginCoreJS3 from 'babel-plugin-polyfill-corejs3';
import { declarePreset } from '@babel/helper-plugin-utils';

const logPlugin = (item, targetVersions, list) => {
  const filteredList = getInclusionReasons(item, targetVersions, list);
  const support = list[item];
  if (!support) {
    console.log(`  ${item}`);
    return;
  }
  let formattedTargets = `{`;
  let first = true;
  for (const target of Object.keys(filteredList)) {
    if (!first) formattedTargets += `,`;
    first = false;
    formattedTargets += ` ${target}`;
    if (support[target]) formattedTargets += ` < ${support[target]}`;
  }
  formattedTargets += ` }`;
  console.log(`  ${item} ${formattedTargets}`);
};

const availablePlugins = {
  "bugfix/transform-async-arrows-in-class": () => bugfixAsyncArrowsInClass,
  "bugfix/transform-edge-default-parameters": () => bugfixEdgeDefaultParameters,
  "bugfix/transform-edge-function-name": () => bugfixEdgeFunctionName,
  "bugfix/transform-firefox-class-in-computed-class-key": () => bugfixFirefoxClassInComputedKey,
  "bugfix/transform-safari-block-shadowing": () => bugfixSafariBlockShadowing,
  "bugfix/transform-safari-class-field-initializer-scope": () => bugfixSafariClassFieldInitializerScope,
  "bugfix/transform-safari-for-shadowing": () => bugfixSafariForShadowing,
  "bugfix/transform-safari-id-destructuring-collision-in-function-expression": () => bugfixSafariIdDestructuringCollisionInFunctionExpression,
  "bugfix/transform-safari-rest-destructuring-rhs-array": () => bugfixSafariRestDestructuringRhsArray,
  "bugfix/transform-tagged-template-caching": () => bugfixTaggedTemplateCaching,
  "bugfix/transform-v8-spread-parameters-in-optional-chaining": () => bugfixV8SpreadParametersInOptionalChaining,
  "bugfix/transform-v8-static-class-fields-redefine-readonly": () => bugfixV8StaticClassFieldsRedefineReadonly,
  "transform-arrow-functions": () => transformArrowFunctions,
  "transform-async-generator-functions": () => transformAsyncGeneratorFunctions,
  "transform-async-to-generator": () => transformAsyncToGenerator,
  "transform-block-scoped-functions": () => transformBlockScopedFunctions,
  "transform-block-scoping": () => transformBlockScoping,
  "transform-class-properties": () => transformClassProperties,
  "transform-class-static-block": () => transformClassStaticBlock,
  "transform-classes": () => transformClasses,
  "transform-computed-properties": () => transformComputedProperties,
  "transform-destructuring": () => transformDestructuring,
  "transform-dotall-regex": () => transformDotallRegex,
  "transform-duplicate-keys": () => transformDuplicateKeys,
  "transform-duplicate-named-capturing-groups-regex": () => transformDuplicateNamedCapturingGroupsRegex,
  "transform-dynamic-import": () => transformDynamicImport,
  "transform-explicit-resource-management": () => transformExplicitResourceManagement,
  "transform-exponentiation-operator": () => transformExponentialOperator,
  "transform-export-namespace-from": () => transformExportNamespaceFrom,
  "transform-for-of": () => transformForOf,
  "transform-function-name": () => transformFunctionName,
  "transform-json-strings": () => transformJsonStrings,
  "transform-literals": () => transformLiterals,
  "transform-logical-assignment-operators": () => transformLogicalAssignmentOperators,
  "transform-member-expression-literals": () => transformMemberExpressionLiterals,
  "transform-modules-amd": () => transformModulesAmd,
  "transform-modules-commonjs": () => transformModulesCommonjs,
  "transform-modules-systemjs": () => transformModulesSystemjs,
  "transform-modules-umd": () => transformModulesUmd,
  "transform-named-capturing-groups-regex": () => transformNamedCapturingGroupsRegex,
  "transform-new-target": () => transformNewTarget,
  "transform-nullish-coalescing-operator": () => transformNullishCoalescingOperator,
  "transform-numeric-separator": () => transformNumericSeparator,
  "transform-object-rest-spread": () => transformObjectRestSpread,
  "transform-object-super": () => transformObjectSuper,
  "transform-optional-catch-binding": () => transformOptionalCatchBinding,
  "transform-optional-chaining": () => transformOptionalChaining,
  "transform-parameters": () => transformParameters,
  "transform-private-methods": () => transformPrivateMethods,
  "transform-private-property-in-object": () => transformPrivatePropertyInObject,
  "transform-property-literals": () => transformPropertyLiterals,
  "transform-regenerator": () => transformRegenerator,
  "transform-regexp-modifiers": () => transformRegExpModifiers,
  "transform-reserved-words": () => transformReservedWords,
  "transform-shorthand-properties": () => transformShorthandProperties,
  "transform-spread": () => transformSpread,
  "transform-sticky-regex": () => transformStickyRegex,
  "transform-template-literals": () => transformTemplateLiterals,
  "transform-typeof-symbol": () => transformTypeofSymbol,
  "transform-unicode-escapes": () => transformUnicodeEscapes,
  "transform-unicode-property-regex": () => transformUnicodePropertyRegex,
  "transform-unicode-regex": () => transformUnicodeRegex,
  "transform-unicode-sets-regex": () => transformUnicodeSetsRegex
};
const minVersions = {};

function addProposalSyntaxPlugins(items, proposalSyntaxPlugins) {
  proposalSyntaxPlugins.forEach(plugin => {
    items.add(plugin);
  });
}
function removeUnnecessaryItems(items, overlapping) {
  items.forEach(item => {
    overlapping[item]?.forEach(name => items.delete(name));
  });
}
function removeUnsupportedItems(items, babelVersion) {
  items.forEach(item => {
    if (Object.hasOwn(minVersions, item) && isLessThan(babelVersion, minVersions[item])) {
      items.delete(item);
    }
  });
}

const moduleTransformations = {
  amd: "transform-modules-amd",
  commonjs: "transform-modules-commonjs",
  cjs: "transform-modules-commonjs",
  systemjs: "transform-modules-systemjs",
  umd: "transform-modules-umd"
};

const keys = Object.keys;
const plugins = filterAvailable(originalPlugins);
const pluginsBugfixes = filterAvailable(originalPluginsBugfixes);
const overlappingPlugins = filterAvailable(originalOverlappingPlugins);
function filterAvailable(data) {
  const result = {};
  for (const plugin of keys(data)) {
    if (Object.hasOwn(availablePlugins, plugin)) {
      result[plugin] = data[plugin];
    }
  }
  return result;
}

const TopLevelOptions = {
  configPath: "configPath",
  corejs: "corejs",
  debug: "debug",
  exclude: "exclude",
  forceAllTransforms: "forceAllTransforms",
  ignoreBrowserslistConfig: "ignoreBrowserslistConfig",
  include: "include",
  modules: "modules",
  shippedProposals: "shippedProposals",
  targets: "targets",
  useBuiltIns: "useBuiltIns",
  browserslistEnv: "browserslistEnv"
};
const ModulesOption = {
  false: false,
  auto: "auto",
  amd: "amd",
  commonjs: "commonjs",
  cjs: "cjs",
  systemjs: "systemjs",
  umd: "umd"
};
const UseBuiltInsOption = {
  false: false,
  entry: "entry",
  usage: "usage"
};

const v = new OptionValidator("@babel/preset-env");
const allPluginsList = [...Object.keys(plugins), ...Object.keys(pluginsBugfixes)];
const modulePlugins = ["transform-dynamic-import", ...Object.keys(moduleTransformations).map(m => moduleTransformations[m])];
const getValidIncludesAndExcludes = (type, corejs) => {
  const set = new Set(allPluginsList);
  if (type === "exclude") modulePlugins.map(set.add, set);
  if (corejs) {
    Object.keys(corejs3Polyfills).map(set.add, set);
  }
  return Array.from(set);
};
const normalizePluginName = plugin => plugin.replace(/^(?:@babel\/|babel-)(?:plugin-)?/, "");
const expandIncludesAndExcludes = (filterList = [], type, corejs) => {
  if (filterList.length === 0) return [];
  const filterableItems = getValidIncludesAndExcludes(type, corejs);
  const invalidFilters = [];
  const selectedPlugins = filterList.flatMap(filter => {
    let re;
    if (typeof filter === "string") {
      try {
        re = new RegExp(`^${normalizePluginName(filter)}$`);
      } catch (_) {
        invalidFilters.push(filter);
        return [];
      }
    } else {
      re = filter;
    }
    const items = filterableItems.filter(item => {
      return re.test(item);
    });
    if (items.length === 0) invalidFilters.push(filter);
    return items;
  });
  v.invariant(invalidFilters.length === 0, `The plugins/built-ins '${invalidFilters.join(", ")}' passed to the '${type}' option are not
    valid. Please check data/[plugin-features|built-in-features].js in babel-preset-env`);
  return selectedPlugins;
};
const checkDuplicateIncludeExcludes = (include = [], exclude = []) => {
  const duplicates = include.filter(opt => exclude.includes(opt));
  v.invariant(duplicates.length === 0, `The plugins/built-ins '${duplicates.join(", ")}' were found in both the "include" and
    "exclude" options.`);
};
const normalizeTargets = targets => {
  if (typeof targets === "string" || Array.isArray(targets)) {
    return {
      browsers: targets
    };
  }
  return {
    ...targets
  };
};
const validateModulesOption = (modulesOpt = ModulesOption.auto) => {
  v.invariant(ModulesOption[modulesOpt.toString()] || modulesOpt === ModulesOption.false, `The 'modules' option must be one of \n` + ` - 'false' to indicate no module processing\n` + ` - a specific module type: 'commonjs', 'amd', 'umd', 'systemjs'` + ` - 'auto' (default) which will automatically select 'commonjs' if the current\n` + `   process is known to *not* support ES module syntax, or 'false' otherwise\n`);
  return modulesOpt;
};
const validateUseBuiltInsOption = (builtInsOpt = false) => {
  v.invariant(UseBuiltInsOption[builtInsOpt.toString()] || builtInsOpt === UseBuiltInsOption.false, `The 'useBuiltIns' option must be either
    'false' (default) to indicate no polyfill,
    '"entry"' to indicate replacing the entry polyfill, or
    '"usage"' to import only used polyfills per file`);
  return builtInsOpt;
};
function normalizeCoreJSOption(corejs, useBuiltIns) {
  let proposals = false;
  let rawVersion;
  {
    rawVersion = corejs;
  }
  const coercedVersion = rawVersion ? coerce(String(rawVersion)) : null;
  const version = coercedVersion ? parse(coercedVersion) : false;
  if (version) {
    if (useBuiltIns) {
      if (version.major !== 3) {
        throw new RangeError("Invalid Option: The version passed to `corejs` is invalid. Currently, " + "only core-js@3 is supported.");
      }
      if (typeof rawVersion !== "string" || !String(rawVersion).includes(".")) {
        throw new Error('Invalid Option: The version passed to `corejs` is invalid. Please use string and specify the minor version, such as `"3.33"`.');
      }
    } else {
      console.warn("\nWARNING (@babel/preset-env): The `corejs` option only has an effect when the `useBuiltIns` option is not `false`\n");
    }
  }
  return {
    version,
    proposals
  };
}
function normalizeOptions(opts) {
  v.invariant(!Object.hasOwn(opts, "bugfixes"), "The 'bugfixes' option has been removed, and now bugfix plugins are" + " always enabled. Please remove it from your config.");
  v.validateTopLevelOptions(opts, TopLevelOptions);
  if (opts.useBuiltIns) {
    throw new Error("The 'useBuiltIns' option has been removed. Please use babel-plugin-polyfill-corejs3 instead.");
  }
  const useBuiltIns = validateUseBuiltInsOption(false);
  const corejs = normalizeCoreJSOption(null, useBuiltIns);
  const include = expandIncludesAndExcludes(opts.include, TopLevelOptions.include, !!corejs.version && corejs.version.major);
  const exclude = expandIncludesAndExcludes(opts.exclude, TopLevelOptions.exclude, !!corejs.version && corejs.version.major);
  checkDuplicateIncludeExcludes(include, exclude);
  return {
    configPath: v.validateStringOption(TopLevelOptions.configPath, opts.configPath, process.cwd()),
    corejs,
    debug: v.validateBooleanOption(TopLevelOptions.debug, opts.debug, false),
    include,
    exclude,
    forceAllTransforms: v.validateBooleanOption(TopLevelOptions.forceAllTransforms, opts.forceAllTransforms, false),
    ignoreBrowserslistConfig: v.validateBooleanOption(TopLevelOptions.ignoreBrowserslistConfig, opts.ignoreBrowserslistConfig, false),
    modules: validateModulesOption(opts.modules),
    shippedProposals: v.validateBooleanOption(TopLevelOptions.shippedProposals, opts.shippedProposals, false),
    targets: normalizeTargets(opts.targets),
    useBuiltIns: useBuiltIns,
    browserslistEnv: v.validateStringOption(TopLevelOptions.browserslistEnv, opts.browserslistEnv)
  };
}

const proposalPlugins = new Set([]);
const proposalSyntaxPlugins = [];
const pluginSyntaxObject = {};
const pluginSyntaxEntries = Object.keys(pluginSyntaxObject).map(function (key) {
  return [key, pluginSyntaxObject[key]];
});
const pluginSyntaxMap = new Map(pluginSyntaxEntries);

function isPluginRequired(targets, support) {
  throw new Error("`isPluginRequired` has been removed in Babel 8. Please use `isRequired` from `@babel/helper-compilation-targets` instead.");
}
function filterStageFromList(list, stageList) {
  return Object.keys(list).reduce((result, item) => {
    if (!stageList.has(item)) {
      result[item] = list[item];
    }
    return result;
  }, {});
}
const pluginsListWithProposals = Object.assign({}, plugins, pluginsBugfixes);
const pluginsListWithoutProposals = filterStageFromList(pluginsListWithProposals, proposalPlugins);
const getPlugin = pluginName => {
  const plugin = availablePlugins[pluginName]();
  if (!plugin) {
    throw new Error(`Could not find plugin "${pluginName}". Ensure there is an entry in ./available-plugins.js for it.`);
  }
  return plugin;
};
const transformIncludesAndExcludes = opts => {
  return opts.reduce((result, opt) => {
    const target = /^(?:es|es6|es7|esnext|web)\./.test(opt) ? "builtIns" : "plugins";
    result[target].add(opt);
    return result;
  }, {
    all: opts,
    plugins: new Set(),
    builtIns: new Set()
  });
};
function getSpecialModulesPluginNames(modules, shouldTransformDynamicImport) {
  const modulesPluginNames = [];
  if (modules) {
    modulesPluginNames.push(moduleTransformations[modules]);
  }
  if (shouldTransformDynamicImport) {
    if (modules && modules !== "umd") {
      modulesPluginNames.push("transform-dynamic-import");
    } else {
      console.warn("Dynamic import can only be transformed when transforming ES" + " modules to AMD, CommonJS or SystemJS.");
    }
  }
  return modulesPluginNames;
}
const getCoreJSOptions = ({
  useBuiltIns,
  corejs,
  polyfillTargets,
  include,
  exclude,
  proposals,
  shippedProposals,
  debug
}) => ({
  method: `${useBuiltIns}-global`,
  version: corejs ? normalize(corejs) : undefined,
  targets: polyfillTargets,
  include,
  exclude,
  proposals,
  shippedProposals,
  debug,
  "#__secret_key__@babel/preset-env__compatibility": {
    noRuntimeName: true
  }
});
function getLocalTargets(optionsTargets, ignoreBrowserslistConfig, configPath, browserslistEnv, api) {
  if (optionsTargets?.esmodules && optionsTargets.browsers) {
    console.warn(`
@babel/preset-env: esmodules and browsers targets have been specified together.
\`browsers\` target, \`${optionsTargets.browsers.toString()}\` will be ignored.
`);
  }
  return getTargets(optionsTargets, {
    ignoreBrowserslistConfig,
    configPath,
    browserslistEnv,
    onBrowserslistConfigFound(config) {
      api.addExternalDependency(config);
    }
  });
}
function supportsStaticESM(caller) {
  return caller?.supportsStaticESM ?? true;
}
function supportsDynamicImport(caller) {
  return caller?.supportsDynamicImport ?? true;
}
function supportsExportNamespaceFrom(caller) {
  return caller?.supportsExportNamespaceFrom ?? null;
}
const index = declarePreset((api, opts) => {
  api.assertVersion("^7.0.0-0 || ^8.0.0");
  const babelTargets = api.targets();
  if ("loose" in opts || "spec" in opts) {
    throw new Error("@babel/preset-env: The 'loose' and 'spec' options have been removed, " + "and you should configure granular compiler assumptions instead. See " + "https://babeljs.io/assumptions for more information.");
  }
  const {
    configPath,
    debug,
    exclude: optionsExclude,
    forceAllTransforms,
    ignoreBrowserslistConfig,
    include: optionsInclude,
    modules: optionsModules,
    shippedProposals,
    targets: optionsTargets,
    useBuiltIns,
    corejs: {
      version: corejs,
      proposals
    },
    browserslistEnv
  } = normalizeOptions(opts);
  let targets = babelTargets;
  if (isLessThan(api.version, "7.13.0") || opts.targets || opts.configPath || opts.browserslistEnv || opts.ignoreBrowserslistConfig) {
    targets = getLocalTargets(optionsTargets, ignoreBrowserslistConfig, configPath, browserslistEnv, api);
  }
  const transformTargets = forceAllTransforms ? {} : targets;
  const include = transformIncludesAndExcludes(optionsInclude);
  const exclude = transformIncludesAndExcludes(optionsExclude);
  const compatData = shippedProposals ? pluginsListWithProposals : pluginsListWithoutProposals;
  const modules = optionsModules === "auto" ? api.caller(supportsStaticESM) ? false : "commonjs" : optionsModules;
  const shouldTransformDynamicImport = optionsModules === "auto" ? !api.caller(supportsDynamicImport) : !!modules;
  if (!exclude.plugins.has("transform-export-namespace-from") && (modules !== false || optionsModules === "auto" && !api.caller(supportsExportNamespaceFrom))) {
    include.plugins.add("transform-export-namespace-from");
  }
  const pluginNames = filterItems(compatData, include.plugins, exclude.plugins, transformTargets, getSpecialModulesPluginNames(modules, shouldTransformDynamicImport), undefined, pluginSyntaxMap);
  if (shippedProposals) {
    addProposalSyntaxPlugins(pluginNames, proposalSyntaxPlugins);
  }
  removeUnsupportedItems(pluginNames, api.version);
  removeUnnecessaryItems(pluginNames, overlappingPlugins);
  const polyfillPlugins = useBuiltIns ? [[pluginCoreJS3, getCoreJSOptions({
    useBuiltIns,
    corejs,
    polyfillTargets: targets,
    include: include.builtIns,
    exclude: exclude.builtIns,
    proposals,
    shippedProposals,
    debug
  })]] : [];
  const pluginUseBuiltIns = useBuiltIns !== false;
  const plugins = Array.from(pluginNames).map(pluginName => {
    return [getPlugin(pluginName), {
      useBuiltIns: pluginUseBuiltIns
    }];
  }).concat(polyfillPlugins);
  if (debug) {
    console.log("@babel/preset-env: `DEBUG` option");
    console.log("\nUsing targets:");
    console.log(JSON.stringify(prettifyTargets(targets), null, 2));
    console.log(`\nUsing modules transform: ${optionsModules.toString()}`);
    console.log("\nUsing plugins:");
    pluginNames.forEach(pluginName => {
      logPlugin(pluginName, targets, compatData);
    });
    if (!useBuiltIns) {
      console.log("\nUsing polyfills: No polyfills were added, since the `useBuiltIns` option was not set.");
    }
  }
  return {
    plugins
  };
});

export { index as default, isPluginRequired, transformIncludesAndExcludes };
