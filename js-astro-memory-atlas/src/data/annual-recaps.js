export const annualRecaps = [
  { id: 'recap-2022', year: 2022, theme: { zh: '一段散步，开启新的故事', en: 'A Walk That Began a New Story' }, highlights: [{ id: 'walk', memoryId: 'first-walk', title: { zh: '河边的第一段散步', en: 'Our First Walk by the River' } }, { id: 'lanterns', memoryId: 'paper-lanterns', title: { zh: '秋夜与纸灯笼', en: 'Paper Lanterns on an Autumn Night' } }] },
  { id: 'recap-2023', year: 2023, theme: { zh: '把周末留给小小的探险', en: 'Little Weekend Adventures' }, highlights: [{ id: 'garden', memoryId: 'garden-picnic', title: { zh: '春日野餐', en: 'A Spring Picnic' } }, { id: 'train', memoryId: 'mountain-train', title: { zh: '坐慢车去看山', en: 'A Slow Train to the Mountains' } }] },
  { id: 'recap-2024', year: 2024, theme: { zh: '在平凡日常里一起庆祝', en: 'Celebrating the Little Things' }, highlights: [{ id: 'home', memoryId: 'home-cooking', title: { zh: '第一次一起做晚饭', en: 'Our First Dinner at Home' } }, { id: 'celebrate', memoryId: 'small-celebration', title: { zh: '小小的庆祝', en: 'A Little Celebration' } }] },
  { id: 'recap-2025', year: 2025, theme: { zh: '海风和冬日灯火', en: 'Sea Breezes and Winter Lights' }, highlights: [{ id: 'coast', memoryId: 'coast-weekend', title: { zh: '海边的周末', en: 'A Weekend by the Sea' } }, { id: 'market', memoryId: 'winter-market', title: { zh: '冬日集市', en: 'The Winter Market' } }] },
];
export const annualRecapByYear = new Map(annualRecaps.map((recap) => [recap.year, recap]));
