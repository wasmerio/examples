export function categoriesOf(img: {
  categories?: string[];
  category?: string;
}): string[] {
  if (Array.isArray(img.categories) && img.categories.length > 0) {
    return img.categories;
  }
  if (typeof img.category === 'string' && img.category.trim()) {
    return [img.category];
  }
  return [];
}

export function formatCategories(img: {
  categories?: string[];
  category?: string;
}): string {
  return categoriesOf(img).join(' · ');
}
