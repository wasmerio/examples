import type { AnalyticsMetric } from "../types";

export const analyticsMetrics: AnalyticsMetric[] = [
	{ label: "Chiffre d'affaires", value: "48 250 $", change: 12.5 },
	{ label: "Commandes", value: "1 429", change: 8.2 },
	{ label: "Panier moyen", value: "33,77 $", change: 4.6 },
	{ label: "Taux de conversion", value: "3,8 %", change: 1.4 },
];

export const monthlyRevenue = [32, 38, 35, 44, 49, 53, 58, 62, 68, 72, 77, 84];
export const trafficSources = [
	{ name: "Recherche", value: 48 },
	{ name: "Direct", value: 27 },
	{ name: "Réseaux sociaux", value: 17 },
	{ name: "Référents", value: 8 },
];
export const conversionRates = [2.1, 2.4, 2.3, 2.8, 3.1, 3.4, 3.2, 3.8];
