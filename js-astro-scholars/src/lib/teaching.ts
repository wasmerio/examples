interface TeachingOffering {
	data: {
		title: string;
		code: string;
		term: string;
	};
}

export function isSameCourse(a: TeachingOffering, b: TeachingOffering) {
	return a.data.title === b.data.title && a.data.code === b.data.code;
}

export function groupTeachingLedger<T extends TeachingOffering>(offerings: T[]) {
	const families = new Map<string, { course: T; terms: string[] }>();

	for (const course of offerings) {
		const key = JSON.stringify([course.data.title, course.data.code]);
		const family = families.get(key);
		if (family) family.terms.push(course.data.term);
		else families.set(key, { course, terms: [course.data.term] });
	}

	return [...families.values()];
}
