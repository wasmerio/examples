import { CONTACTS, SHARES } from "@/config";

export const activeContacts = CONTACTS.filter(social => social.active);
export const activeShares = SHARES.filter(social => social.active);
