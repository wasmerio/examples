import type { Notification } from "../types";

export const notifications: Notification[] = [
	{ id: 1, title: "Nouvelle commande", description: "La commande CMD-1048 de 178,00 $ vient d'être confirmée.", time: "Il y a 5 min", unread: true, type: "user" },
	{ id: 2, title: "Stock faible", description: "Le stock du Sac Nomad est passé sous le seuil de 10 unités.", time: "Il y a 2 heures", unread: true, type: "alert" },
	{ id: 3, title: "Paiement reçu", description: "Le paiement de la commande CMD-1046 a été validé.", time: "Hier à 14:30", unread: false, type: "system" },
	{ id: 4, title: "Produit en rupture", description: "La Montre Horizon n'est actuellement plus disponible.", time: "Il y a 2 jours", unread: false, type: "alert" },
];
