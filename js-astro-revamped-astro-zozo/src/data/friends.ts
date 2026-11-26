export interface FriendLink {
	id?: string;
	avatar?: string;
	bio?: string;
	link?: string;
}

// Edit this list only, the /friends page will update automatically.
export const friends: FriendLink[] = [
	{
		id: 'Alex Notes',
		avatar: '/sample/friends/alex.jpg',
		bio: 'Writes about interface details, content systems, and the small things that make templates easier to reuse.',
		link: 'https://example.com/alex',
	},
	{
		id: 'Lin Studio',
		avatar: '/sample/friends/lin.jpg',
		bio: 'Collects references for layouts, motion, and editorial landing pages.',
		link: 'https://example.com/lin',
	},
	{
		id: 'Mika Builds',
		avatar: '/sample/friends/mika.jpg',
		bio: 'Turns rough concepts into maintainable Astro components.',
		link: 'https://example.com/mika',
	},
	{
		id: 'Noa Archive',
		avatar: '/sample/friends/noa.jpg',
		bio: 'Keeps track of changelogs, content migrations, and release notes.',
		link: 'https://example.com/noa',
	},
];