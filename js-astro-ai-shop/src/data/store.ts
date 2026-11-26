// Everything about the store that is not a product lives here: name, contact, policies.
// The "Ask about this product" box reads `policies` too, so write them as plainly and specifically
// as you would answer a customer by email: real numbers, real countries, real days.

export const store = {
	name: 'Quire Bindery',
	// Short name for the header wordmark.
	short: 'Quire',
	tagline: 'Hand-sewn notebooks and the desk things that go with them.',
	description:
		'Quire Bindery is a two-person bindery that sews notebooks by hand and makes a short list of desk goods. Every product ships from our workshop.',
	email: 'hello@quire.example',
	location: 'Providence, Rhode Island, USA',
	// Shown on the contact page. Leave empty to hide.
	hours: 'We answer email Monday to Friday, usually within one working day.',
	currency: 'USD',
	// How checkout works, in one line. Shown under every Buy button and given to the Ask box.
	// If you do not tick "Let customers adjust quantity" on your Payment Links, remove the sentence about quantity.
	checkout: 'Each checkout is one product on a secure Stripe page. For more than one of the same product, change the quantity on the Stripe page. For two different products, check out once for each, because there is no cart.',
	locale: 'en-US',
	// Categories in the order the shop shows them. `id` must match `category:` in product files.
	categories: [
		{ id: 'notebooks', label: 'Notebooks' },
		{ id: 'paper', label: 'Paper' },
		{ id: 'desk', label: 'Desk' },
		{ id: 'tools', label: 'Binding tools' },
	],
	nav: [
		{ label: 'Shop', href: '/shop/' },
		{ label: 'About', href: '/about/' },
		{ label: 'Shipping and returns', href: '/shipping/' },
		{ label: 'Contact', href: '/contact/' },
	],
};

// Shipping and returns. Rendered on /shipping/ and given to the Ask box on every product page.
export const policies: { heading: string; text: string }[] = [
	{
		heading: 'When your order ships',
		text: 'In-stock items leave the workshop within 2 working days of your order. Items marked "sewn to order" ship within 5 working days, because we sew them after you buy. We ship Monday to Friday and email you a tracking number the day it goes out.',
	},
	{
		heading: 'Shipping cost and where we ship',
		text: 'Each checkout is one product, and its shipping is added at checkout: a flat 6 USD within the United States, 14 USD to Canada, and 18 USD to the United Kingdom, the European Union, Australia, New Zealand and Japan. We do not ship to other countries yet. US orders travel by USPS Ground Advantage and usually arrive 3 to 6 working days after they ship. International orders go by USPS First-Class International and usually take 7 to 21 working days. These are carrier estimates, not promises.',
	},
	{
		heading: 'Taxes and customs',
		text: 'Prices on this site do not include sales tax or VAT. Where tax applies, Stripe adds it at checkout before you pay, so the total you see there is the total you pay us. For orders outside the US, import duties or VAT charged on arrival are paid by the recipient.',
	},
	{
		heading: 'Returns',
		text: 'You can return any unused item within 30 days of delivery for a full refund of the product price. Email us first with your order email address, then post it back in its original sleeve. Return postage is paid by you, unless the item arrived damaged or was not what you ordered. We refund to the original card within 5 working days of receiving the parcel. Shipping charges are not refunded.',
	},
	{
		heading: 'Damaged or wrong item',
		text: 'If something arrives damaged or is not what you ordered, email a photo within 14 days of delivery. We send a replacement at our cost, or refund in full if we are out of stock. You do not need to send the damaged item back.',
	},
	{
		heading: 'Changing or cancelling an order',
		text: 'Email us within 12 hours of ordering and we will change the color or cancel the order for a full refund. After an order has shipped it can only be returned.',
	},
	{
		heading: 'Payment',
		text: 'Checkout is handled by Stripe. You can pay by card, Apple Pay or Google Pay; Stripe may also show local payment methods and prices in your currency. We never see or store your card number.',
	},
];
