export type NavigationIcon =
	| "analytics"
	| "dashboard"
	| "products"
	| "settings"
	| "orders"
	| "customers";

export interface NavigationItem {
	label: string;
	href: string;
	icon: NavigationIcon;
}

export interface AnalyticsMetric {
	label: string;
	value: string;
	change: number;
}

export type ProductStatus = "En stock" | "Stock faible" | "Rupture";
export interface Product {
	id: number;
	name: string;
	category: string;
	price: string;
	stock: number;
	status: ProductStatus;
}

export type OrderStatus = "En attente" | "Payée" | "Expédiée" | "Livrée" | "Annulée";
export interface Order {
	id: string;
	customer: string;
	date: string;
	total: string;
	payment: string;
	status: OrderStatus;
}

export type CustomerStatus = "Actif" | "Nouveau" | "Inactif";
export interface Customer {
	id: number;
	name: string;
	email: string;
	orders: number;
	spent: string;
	status: CustomerStatus;
}

export interface Activity {
	id: number;
	title: string;
	description: string;
	time: string;
}

export interface Notification {
	id: number;
	title: string;
	description: string;
	time: string;
	unread: boolean;
	type: "alert" | "system" | "user";
}

export interface TableColumn {
	key: string;
	label: string;
}

export type TableRow = object;
