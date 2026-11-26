// Everything a visitor reads lives here. Change this file and the whole page follows.
// The AI features read the rendered page, so keep the copy specific: numbers, limits, names.

export const site = {
	name: 'Harbor',
	tagline: 'Invoicing that fits a one-person business.',
	description:
		'Harbor is invoicing software for freelancers and solo consultants: send invoices in your own currency, get paid by card or bank transfer, and see what is owed at a glance.',
	url: 'https://fengyiqicoder.github.io/astro-ai-landing/',
	nav: [
		{ label: 'How it works', href: '#how' },
		{ label: 'Features', href: '#features' },
		{ label: 'Pricing', href: '#pricing' },
		{ label: 'FAQ', href: '#faq' },
	],
	cta: { label: 'Start free', href: '#contact' },

	hero: {
		headline: 'Send the invoice. Forget the spreadsheet.',
		sub: 'Harbor turns a line of work into a paid invoice in under a minute, in 28 currencies, with reminders that go out while you sleep. Built for people who bill five clients, not five hundred.',
	},

	how: [
		{ title: 'Add a client once', text: 'Name, address, currency, payment terms. Harbor remembers the rest, including their VAT number and preferred language.' },
		{ title: 'Write the invoice', text: 'Type what you did and the amount. Numbering, taxes, due dates and the PDF are handled for you. Duplicate last month in one click.' },
		{ title: 'Get paid and move on', text: 'Clients pay by card, bank transfer or PayPal from the invoice page. Harbor marks it paid, sends the receipt and updates your totals.' },
	],

	features: [
		{ title: '28 currencies, your rates', text: 'Bill in EUR, USD, GBP, JPY and 24 more. Exchange rates are shown at invoice time and frozen on the PDF.' },
		{ title: 'Automatic reminders', text: 'A friendly nudge 3 days before the due date, a firmer one 7 days after. You write the wording once.' },
		{ title: 'Recurring invoices', text: 'Monthly retainers go out on the 1st without you touching them. Pause or edit any time.' },
		{ title: 'Expenses and receipts', text: 'Photograph a receipt from your phone; Harbor files it against the right client or project.' },
		{ title: 'Tax-ready exports', text: 'Quarterly and yearly CSV and PDF exports your accountant can open without asking questions.' },
		{ title: 'Works offline', text: 'Draft on a train, send when you have signal. Nothing is lost between the two.' },
	],

	pricing: [
		{ name: 'Free', price: '$0', period: 'forever', line: 'For your first clients.', items: ['3 active clients', 'Unlimited invoices', 'Card and bank payments', 'Harbor branding on PDFs'], cta: 'Start free', featured: false },
		{ name: 'Solo', price: '$9', period: 'per month', line: 'For a full freelance workload.', items: ['Unlimited clients', 'Automatic reminders', 'Recurring invoices', 'Your logo, no Harbor branding', 'Expense tracking'], cta: 'Try Solo free for 30 days', featured: true },
		{ name: 'Studio', price: '$24', period: 'per month', line: 'For two to five people.', items: ['Everything in Solo', 'Up to 5 team members', 'Approval before sending', 'Shared client list', 'Priority support'], cta: 'Talk to us', featured: false },
	],

	testimonials: [
		{ quote: 'I used to spend the first Monday of every month on invoices. Now it is twenty minutes, and the reminders mean I no longer chase anyone.', name: 'Mara Lindqvist', role: 'Illustrator, Gothenburg' },
		{ quote: 'The currency handling is the reason I switched. Half my clients are in the US and I bill in EUR; the PDF shows both and nobody argues.', name: 'Tomás Reyes', role: 'Software consultant, Lisbon' },
		{ quote: 'My accountant asked what I was using because the export was the first one she did not have to fix.', name: 'Priya Natarajan', role: 'Copywriter, Toronto' },
	],

	faq: [
		{ q: 'Is there a free plan?', a: 'Yes. The Free plan is free forever: up to 3 active clients, unlimited invoices, card and bank payments. PDFs carry a small Harbor line in the footer.' },
		{ q: 'What does Harbor cost once I grow?', a: 'Solo is $9 a month for unlimited clients, reminders, recurring invoices and expenses. Studio is $24 a month for teams of up to five. Both include a 30-day free trial; no card needed to start.' },
		{ q: 'Which payment methods can my clients use?', a: 'Card (Visa, Mastercard, Amex), bank transfer with the details printed on the invoice, and PayPal. Card payments cost 2.9% + $0.30; bank transfer and PayPal cost nothing extra from Harbor.' },
		{ q: 'Which currencies are supported?', a: '28 currencies, including EUR, USD, GBP, CAD, AUD, JPY, CHF, SEK, NOK, DKK, PLN, CZK, INR, SGD, HKD, NZD, BRL and MXN. You can bill each client in a different one.' },
		{ q: 'Can I import clients and old invoices?', a: 'Clients and invoices import from CSV, and directly from FreshBooks, Wave and Invoice Ninja. Imported invoices keep their original numbers and dates.' },
		{ q: 'Does it handle VAT and sales tax?', a: 'Yes. Set a default rate per client, override it per line, and include VAT numbers on the PDF. EU reverse-charge wording is added automatically when both VAT numbers are present.' },
		{ q: 'Where is my data stored, and can I leave?', a: 'Data is stored in the EU (Frankfurt) with daily backups. Export everything as CSV and PDF at any time from Settings; deleting the account removes it within 30 days.' },
		{ q: 'Is there a mobile app?', a: 'Harbor is a web app that works on any phone, with offline drafts. Receipt capture uses the phone camera from the browser; there is nothing to install.' },
	],

	contact: {
		title: 'Start with three clients, free.',
		text: 'Leave your email and we send a sign-in link. No card, no sales call.',
		// Point this at your form service (Web3Forms, Formspree, Formspark…). Empty: the form explains it is a demo.
		endpoint: '',
	},

	footer: {
		company: 'Harbor Software OÜ, Tallinn',
		links: [
			{ label: 'Privacy', href: '#' },
			{ label: 'Terms', href: '#' },
			{ label: 'Status', href: '#' },
		],
	},
};
