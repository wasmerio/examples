// src/set-array.ts
var SetArray = class {
  constructor() {
    this._indexes = { __proto__: null };
    this.array = [];
  }
};
function cast(set) {
  return set;
}
function get(setarr, key) {
  return cast(setarr)._indexes[key];
}
function put(setarr, key) {
  const index = get(setarr, key);
  if (index !== void 0) return index;
  const { array, _indexes: indexes } = cast(setarr);
  const length = array.push(key);
  return indexes[key] = length - 1;
}
function remove(setarr, key) {
  const index = get(setarr, key);
  if (index === void 0) return;
  const { array, _indexes: indexes } = cast(setarr);
  for (let i = index + 1; i < array.length; i++) {
    const k = array[i];
    array[i - 1] = k;
    indexes[k]--;
  }
  indexes[key] = void 0;
  array.pop();
}

// src/gen-mapping.ts
import { encode, encodeRangeMappings } from "@jridgewell/sourcemap-codec";
import { TraceMap, decodedMappings } from "@jridgewell/trace-mapping";

// src/sourcemap-segment.ts
var COLUMN = 0;
var SOURCES_INDEX = 1;
var SOURCE_LINE = 2;
var SOURCE_COLUMN = 3;
var NAMES_INDEX = 4;

// src/gen-mapping.ts
var NO_NAME = -1;
var GenMapping = class {
  constructor({ file, sourceRoot } = {}) {
    this._names = new SetArray();
    this._sources = new SetArray();
    this._sourcesContent = [];
    this._mappings = [];
    this.file = file;
    this.sourceRoot = sourceRoot;
    this._ignoreList = new SetArray();
    this._rangeMappings = [];
  }
};
function cast2(map) {
  return map;
}
function addSegment(map, genLine, genColumn, source, sourceLine, sourceColumn, name, content) {
  return addSegmentInternal(
    false,
    map,
    genLine,
    genColumn,
    source,
    sourceLine,
    sourceColumn,
    name,
    content
  );
}
function addMapping(map, mapping) {
  return addMappingInternal(false, map, mapping);
}
var maybeAddSegment = (map, genLine, genColumn, source, sourceLine, sourceColumn, name, content) => {
  return addSegmentInternal(
    true,
    map,
    genLine,
    genColumn,
    source,
    sourceLine,
    sourceColumn,
    name,
    content
  );
};
var maybeAddMapping = (map, mapping) => {
  return addMappingInternal(true, map, mapping);
};
function setSourceContent(map, source, content) {
  const { _sources: sources, _sourcesContent: sourcesContent } = cast2(map);
  const index = put(sources, source);
  sourcesContent[index] = content;
}
function setIgnore(map, source, ignore = true) {
  const { _sources: sources, _sourcesContent: sourcesContent, _ignoreList: ignoreList } = cast2(map);
  const index = put(sources, source);
  if (index === sourcesContent.length) sourcesContent[index] = null;
  if (ignore) put(ignoreList, index);
  else remove(ignoreList, index);
}
function setRangeSegment(map, line, column, add = true) {
  const { _mappings: mappings, _rangeMappings: rangeMappings } = cast2(map);
  const segments = getLine(mappings, line);
  const index = getSegmentIndex(segments, column) - 1;
  const ranges = getLine(rangeMappings, line);
  const i = getRangeIndex(ranges, index);
  if (add) {
    if (i >= 0) return;
    insert(ranges, ~i, index);
  } else {
    if (i < 0) return;
    ranges.splice(i, 1);
  }
}
function toDecodedMap(map) {
  const {
    _mappings: mappings,
    _sources: sources,
    _sourcesContent: sourcesContent,
    _names: names,
    _ignoreList: { array: ignoreList },
    _rangeMappings: rangeMappings
  } = cast2(map);
  removeEmptyFinalLines(mappings);
  removeEmptyFinalLines(rangeMappings);
  return {
    version: 3,
    file: map.file || void 0,
    names: names.array,
    sourceRoot: map.sourceRoot || void 0,
    sources: sources.array,
    sourcesContent,
    mappings,
    ignoreList: ignoreList.length > 0 ? ignoreList : void 0,
    rangeMappings: rangeMappings.length > 0 ? rangeMappings : void 0
  };
}
function toEncodedMap(map) {
  const decoded = toDecodedMap(map);
  const encoded = decoded;
  encoded.mappings = encode(decoded.mappings);
  if (decoded.rangeMappings) encoded.rangeMappings = encodeRangeMappings(decoded.rangeMappings);
  return encoded;
}
function fromMap(input) {
  const map = new TraceMap(input);
  const gen = new GenMapping({ file: map.file, sourceRoot: map.sourceRoot });
  putAll(cast2(gen)._names, map.names);
  putAll(cast2(gen)._sources, map.sources);
  cast2(gen)._sourcesContent = map.sourcesContent || map.sources.map(() => null);
  cast2(gen)._mappings = decodedMappings(map);
  if (map.ignoreList) putAll(cast2(gen)._ignoreList, map.ignoreList);
  return gen;
}
function allMappings(map) {
  const out = [];
  const {
    _mappings: mappings,
    _sources: { array: sources },
    _names: { array: names }
  } = cast2(map);
  for (let i = 0; i < mappings.length; i++) {
    const line = mappings[i];
    for (let j = 0; j < line.length; j++) {
      const seg = line[j];
      const generated = { line: i + 1, column: seg[COLUMN] };
      let source = void 0;
      let original = void 0;
      let name = void 0;
      if (seg.length !== 1) {
        source = sources[seg[SOURCES_INDEX]];
        original = { line: seg[SOURCE_LINE] + 1, column: seg[SOURCE_COLUMN] };
        if (seg.length === 5) name = names[seg[NAMES_INDEX]];
      }
      out.push({ generated, source, original, name });
    }
  }
  return out;
}
function addSegmentInternal(skipable, map, genLine, genColumn, source, sourceLine, sourceColumn, name, content) {
  const {
    _mappings: mappings,
    _sources: sources,
    _sourcesContent: sourcesContent,
    _names: names,
    _rangeMappings: rangeMappings
  } = cast2(map);
  const line = getLine(mappings, genLine);
  const index = getSegmentIndex(line, genColumn);
  if (!source) {
    if (skipable && skipSourceless(line, index) && !isRangeOpen(mappings, rangeMappings, genLine, index - 1))
      return;
    if (index < line.length) adjustRangeMappings(rangeMappings, genLine, index);
    insert(line, index, [genColumn]);
    return;
  }
  assert(sourceLine);
  assert(sourceColumn);
  const sourcesIndex = put(sources, source);
  const namesIndex = name ? put(names, name) : NO_NAME;
  if (sourcesIndex === sourcesContent.length) sourcesContent[sourcesIndex] = content != null ? content : null;
  if (skipable && skipSource(line, index, sourcesIndex, sourceLine, sourceColumn, namesIndex) && !isRangeOpen(mappings, rangeMappings, genLine, index - 1)) {
    return;
  }
  if (index < line.length) adjustRangeMappings(rangeMappings, genLine, index);
  insert(
    line,
    index,
    // The ternary allows us to create arrays with the exact size, which is
    // required for later checking if the tuple carries name information.
    name ? [genColumn, sourcesIndex, sourceLine, sourceColumn, namesIndex] : [genColumn, sourcesIndex, sourceLine, sourceColumn]
  );
}
function assert(_val) {
}
function getLine(arr, index) {
  for (let i = arr.length; i <= index; i++) {
    arr[i] = [];
  }
  return arr[index];
}
function getSegmentIndex(line, genColumn) {
  for (let i = line.length; i > 0; i--) {
    const current = line[i - 1];
    if (genColumn >= current[COLUMN]) return i;
  }
  return 0;
}
function isRangeOpen(mappings, rangeMappings, genLine, index) {
  if (rangeMappings.length === 0) return false;
  if (index < 0) {
    while (--genLine >= 0) {
      const segments = mappings[genLine];
      if (segments.length > 0) {
        index = segments.length - 1;
        break;
      }
    }
  }
  if (genLine < 0) return false;
  if (genLine >= rangeMappings.length) return false;
  const ranges = rangeMappings[genLine];
  return getRangeIndex(ranges, index) >= 0;
}
function insert(array, index, value) {
  for (let i = array.length; i > index; i--) {
    array[i] = array[i - 1];
  }
  array[index] = value;
}
function removeEmptyFinalLines(mappings) {
  for (let i = mappings.length - 1; i >= 0; i--) {
    if (mappings[i].length > 0) break;
    mappings.pop();
  }
}
function putAll(setarr, array) {
  for (let i = 0; i < array.length; i++) put(setarr, array[i]);
}
function getRangeIndex(ranges, index) {
  for (let i = ranges.length; i > 0; i--) {
    const range = ranges[i - 1];
    if (range === index) return i - 1;
    if (range < index) return ~i;
  }
  return ~0;
}
function adjustRangeMappings(rangeMappings, genLine, index) {
  if (genLine >= rangeMappings.length) return;
  const line = rangeMappings[genLine];
  for (let i = line.length - 1; i >= 0; i--) {
    if (line[i] < index) break;
    line[i]++;
  }
}
function skipSourceless(line, index) {
  if (index === 0) return true;
  const prev = line[index - 1];
  return prev.length === 1;
}
function skipSource(line, index, sourcesIndex, sourceLine, sourceColumn, namesIndex) {
  if (index === 0) return false;
  const prev = line[index - 1];
  if (prev.length === 1) return false;
  return sourcesIndex === prev[SOURCES_INDEX] && sourceLine === prev[SOURCE_LINE] && sourceColumn === prev[SOURCE_COLUMN] && namesIndex === (prev.length === 5 ? prev[NAMES_INDEX] : NO_NAME);
}
function addMappingInternal(skipable, map, mapping) {
  const { generated, source, original, name, content, isRange } = mapping;
  if (!source) {
    addSegmentInternal(
      skipable,
      map,
      generated.line - 1,
      generated.column,
      null,
      null,
      null,
      null,
      null
    );
  } else {
    assert(original);
    addSegmentInternal(
      skipable,
      map,
      generated.line - 1,
      generated.column,
      source,
      original.line - 1,
      original.column,
      name,
      content
    );
  }
  if (isRange) setRangeSegment(map, generated.line - 1, generated.column);
}
export {
  GenMapping,
  addMapping,
  addSegment,
  allMappings,
  fromMap,
  maybeAddMapping,
  maybeAddSegment,
  setIgnore,
  setRangeSegment,
  setSourceContent,
  toDecodedMap,
  toEncodedMap
};
//# sourceMappingURL=gen-mapping.mjs.map
