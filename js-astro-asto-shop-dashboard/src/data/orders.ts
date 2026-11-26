import type { Order } from "../types";

export const orders: Order[] = [
	{ id: "CMD-1048", customer: "Aline Kabeya", date: "17 juil. 2026", total: "178,00 $", payment: "Carte", status: "Payée" },
	{ id: "CMD-1047", customer: "Marc Ilunga", date: "17 juil. 2026", total: "64,50 $", payment: "Mobile Money", status: "En attente" },
	{ id: "CMD-1046", customer: "Sarah Mbuyi", date: "16 juil. 2026", total: "223,90 $", payment: "Carte", status: "Expédiée" },
	{ id: "CMD-1045", customer: "Patrick Kalala", date: "16 juil. 2026", total: "99,00 $", payment: "PayPal", status: "Livrée" },
	{ id: "CMD-1044", customer: "Grâce Tshibangu", date: "15 juil. 2026", total: "148,00 $", payment: "Carte", status: "Livrée" },
	{ id: "CMD-1043", customer: "David Mwamba", date: "15 juil. 2026", total: "29,90 $", payment: "Mobile Money", status: "Annulée" },
	{ id: "CMD-1042", customer: "Chantal Kasongo", date: "14 juil. 2026", total: "193,00 $", payment: "Carte", status: "Expédiée" },
	{ id: "CMD-1041", customer: "Junior Kabasele", date: "14 juil. 2026", total: "74,00 $", payment: "PayPal", status: "Livrée" },
];
