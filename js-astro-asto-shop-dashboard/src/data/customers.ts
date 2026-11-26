import type { Customer } from "../types";

export const customers: Customer[] = [
	{ id: 1, name: "Aline Kabeya", email: "aline@example.com", orders: 12, spent: "1 248,00 $", status: "Actif" },
	{ id: 2, name: "Marc Ilunga", email: "marc@example.com", orders: 1, spent: "64,50 $", status: "Nouveau" },
	{ id: 3, name: "Sarah Mbuyi", email: "sarah@example.com", orders: 8, spent: "876,40 $", status: "Actif" },
	{ id: 4, name: "Patrick Kalala", email: "patrick@example.com", orders: 5, spent: "492,00 $", status: "Actif" },
	{ id: 5, name: "Grâce Tshibangu", email: "grace@example.com", orders: 7, spent: "731,90 $", status: "Actif" },
	{ id: 6, name: "David Mwamba", email: "david@example.com", orders: 2, spent: "118,90 $", status: "Inactif" },
	{ id: 7, name: "Chantal Kasongo", email: "chantal@example.com", orders: 1, spent: "193,00 $", status: "Nouveau" },
	{ id: 8, name: "Junior Kabasele", email: "junior@example.com", orders: 4, spent: "356,00 $", status: "Actif" },
];
