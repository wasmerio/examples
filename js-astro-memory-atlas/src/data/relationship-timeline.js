export const relationshipOrigins = [
  { year: 2021, person: { zh: '林岚', en: 'Lin Lan' }, label: { zh: '林岚来到这个世界', en: 'Lin Lan was born' } },
  { year: 2021, person: { zh: '周屿', en: 'Zhou Yu' }, label: { zh: '周屿来到这个世界', en: 'Zhou Yu was born' } },
];

export const relationshipPhases = [
  { startYear: 2021, endYear: 2021, id: 'separate', title: { zh: '各自成长', en: 'Growing Up Apart' }, description: { zh: '这是一段虚构故事的开场。', en: 'This is where the fictional story begins.' } },
  { startYear: 2022, endYear: 2022, id: 'meeting', title: { zh: '第一次相遇', en: 'The First Meeting' }, description: { zh: '在一场朋友聚会上，两个人开始认识。', en: 'They met at a gathering hosted by friends.' } },
  { startYear: 2023, endYear: 2023, id: 'intertwined', title: { zh: '一起探索', en: 'Exploring Together' }, description: { zh: '散步、读书，也开始计划周末的小旅行。', en: 'They took walks, read together, and started planning weekend trips.' } },
  { startYear: 2024, endYear: 2025, id: 'merged', title: { zh: '共享日常', en: 'Sharing Everyday Life' }, description: { zh: '一起把平凡日子过成值得收藏的回忆。', en: 'They turned ordinary days into memories worth keeping.' } },
];

export const relationshipLocationMilestones = [
  { year: 2022, period: { zh: '2022 年', en: '2022' }, personA: { zh: '云杉河岸附近', en: 'Near Spruce Riverbank' }, personB: { zh: '云杉河岸附近', en: 'Near Spruce Riverbank' } },
  { year: 2024, period: { zh: '2024 年起', en: 'From 2024' }, personA: { zh: '星河社区', en: 'Starlight Neighborhood' }, personB: { zh: '星河社区', en: 'Starlight Neighborhood' }, note: { zh: '开始共享日常', en: 'They began sharing everyday life' } },
];

export const relationshipTimelineMemoryIds = ['first-walk', 'paper-lanterns', 'garden-picnic', 'mountain-train', 'small-celebration', 'coast-weekend', 'winter-market'];

export function getRelationshipPhase(year) {
  return relationshipPhases.find(({ startYear, endYear }) => year >= startYear && year <= endYear);
}

export function getRelationshipTrackPositions(year) {
  if (year >= 2024) return [50, 50];
  if (year === 2022) return [50, 50];
  return year % 2 === 0 ? [32, 68] : [68, 32];
}
