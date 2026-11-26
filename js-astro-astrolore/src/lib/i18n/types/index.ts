import type { Dnd5eTranslations } from "./dnd5e";
import type { ShadowdarkTranslations } from "./shadowdark";
import type { Pathfinder1eTranslations } from "./pathfinder1e";

export interface Translations {
    common: {
        lore: string;
        codex: string;
        binder: string;
        projects: string;
        project: string;
        category: string;
        categories: string;
        article: string;
        articles: string;
        map: string;
        maps: string;
        timeline: string;
        timelines: string;
        document: string;
        documents: string;
        handout: string;
        handouts: string;
        table: string;
        tables: string;
        statblock: string;
        statblocks: string;
        pinned: string;
        familyTree: string;
        familyTrees: string;
        parent: string;
        referencedIn: string;
        graph: string;
    };
    theme: {
        label: string;
        light: string;
        dark: string;
        system: string;
    };
    search: {
        placeholder: string;
        noResults: string;
    };
    meta: {
        types: {
            character: string;
            creature: string;
            location: string;
            organization: string;
            historic: string;
            family: string;
            title: string;
            language: string;
            culture: string;
            other: string;
        };
        kinds: {
            character: { divinity: string };
            creature: {
                aberration: string;
                celestial: string;
                construct: string;
                fae: string;
                humanoid: string;
            };
            location: {
                cosmic: string;
                continent: string;
                region: string;
                landmark: string;
                settlement: string;
                temple: string;
                ocean: string;
                sea: string;
                lake: string;
                river: string;
                forest: string;
            };
            historic: {
                generic: string;
                celestial: string;
                natural: string;
                settlement: string;
                political: string;
                conflict: string;
            };
            language: {
                major: string;
                regional: string;
                secret: string;
                dead: string;
            };
            organization: { country: string };
            culture: {
                urban: string;
                rural: string;
                nomadic: string;
                primitive: string;
            };
        };
        character: {
            portrait: string;
            creature: string;
            titles: string;
            epithets: string;
            family: string;
            cultures: string;
            organizations: string;
            formerOrganizations: string;
            birth: string;
            bornIn: string;
            death: string;
            diedIn: string;
            parents: string;
            children: string;
            spouses: string;
        };
        creature: {
            image: string;
            parentCreature: string;
            foundIn: string;
        };
        location: {
            image: string;
            parentLocation: string;
            foundedBy: string;
            founding: string;
            destruction: string;
        };
        organization: {
            symbol: string;
            leaders: string;
            formerLeaders: string;
            foundedBy: string;
            founding: string;
            termination: string;
            capital: string;
            cultures: string;
            languages: string;
        };
        historic: {
            image: string;
            date: string;
        };
        family: {
            emblem: string;
            head: string;
        };
        title: {
            organization: string;
        };
        culture: {
            parentCulture: string;
        };
    };
    statblock: {
        selectSystem: string;
        systems: {
            dnd5e: string;
            shadowdark: string;
            pathfinder1e: string;
        };
        dnd5e: Dnd5eTranslations;
        shadowdark: ShadowdarkTranslations;
        pathfinder1e: Pathfinder1eTranslations;
    };
}
