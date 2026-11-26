import { getCollection, getEntry } from "astro:content";
import {
    isLink,
    projectFromId,
    slugFromId,
    stripLink,
} from "$lib/content-utils";
import type { CharacterMetadata } from "$lib/schema/codex-article";
import { CustomDate } from "$lib/custom-date";

export type FamilyChartPerson = {
    id: string;
    data: {
        gender: "M" | "F";
        name: string;
        birth?: string;
        death?: string;
        avatar?: string;
    };
    rels: { parents: string[]; spouses: string[]; children: string[] };
};

export async function buildFamilyChartData(
    projectId: string,
    mainSlug: string,
): Promise<FamilyChartPerson[]> {
    const project = await getEntry("projects", projectId);
    const calendar = project?.data.calendar;

    const characters = await getCollection(
        "articles",
        (a) =>
            projectFromId(a.id) === projectId &&
            a.data.meta?.type === "character",
    );

    const characterMap: Map<
        string,
        { id: string; title: string; meta: CharacterMetadata }
    > = new Map();
    for (const char of characters) {
        if (char.data.meta?.type != "character") continue;
        characterMap.set(slugFromId(char.id), {
            id: char.id,
            title: char.data.title,
            meta: char.data.meta,
        });
    }

    const persons = new Map<string, FamilyChartPerson>();

    function addPerson(
        slug: string,
        link: boolean = true,
        rels?: { parent?: string; spouse?: string; child?: string },
    ) {
        let person = persons.get(slug);

        // If this is not a link we create relationships
        if (!link) {
            if (!person) {
                person = {
                    id: slug,
                    data: {
                        name: slug,
                        gender: "M",
                    },
                    rels: {
                        parents: [],
                        spouses: [],
                        children: [],
                    },
                };
            }

            if (rels) {
                if (rels.parent && !person.rels.parents.includes(rels.parent)) {
                    person.rels.parents.push(rels.parent);
                }
                if (rels.spouse && !person.rels.spouses.includes(rels.spouse)) {
                    person.rels.spouses.push(rels.spouse);
                }
                if (rels.child && !person.rels.children.includes(rels.child)) {
                    person.rels.children.push(rels.child);
                }
            }

            persons.set(slug, person);
            return;
        }

        if (person) return;

        const data = characterMap.get(slug);
        if (!data) return;
        const { title, meta } = data;

        let avatar: string | undefined;
        if (meta.image) {
            if (typeof meta.image === "string") {
                avatar = meta.image;
            } else {
                avatar = meta.image.src;
            }
        }

        persons.set(slug, {
            id: slug,
            data: {
                gender: meta?.gender ?? "M",
                name: title ?? slug,
                birth:
                    calendar && meta.birth
                        ? CustomDate.parse(calendar, meta.birth).toStringF("Y")
                        : undefined,
                death:
                    calendar && meta.death
                        ? CustomDate.parse(calendar, meta.death).toStringF("Y")
                        : undefined,
                avatar: avatar,
            },
            rels: {
                parents: (meta.parents ?? []).map((v) =>
                    isLink(v) ? stripLink(v) : v,
                ),
                spouses: (meta.spouses ?? []).map((v) =>
                    isLink(v) ? stripLink(v) : v,
                ),
                children: (meta.children ?? []).map((v) =>
                    isLink(v) ? stripLink(v) : v,
                ),
            },
        });

        for (const char of meta?.parents ?? []) {
            isLink(char)
                ? addPerson(stripLink(char))
                : addPerson(char, false, { child: slug });
        }
        for (const char of meta?.spouses ?? []) {
            isLink(char)
                ? addPerson(stripLink(char))
                : addPerson(char, false, { spouse: slug });
        }
        for (const char of meta?.children ?? []) {
            isLink(char)
                ? addPerson(stripLink(char))
                : addPerson(char, false, { parent: slug });
        }
    }
    addPerson(mainSlug);

    return Array.from(persons.values());
}
