import {
    getCollection,
    getEntry,
    render,
    type CollectionEntry,
    type DataEntryMap,
} from "astro:content";
import {
    slugFromId,
    projectFromId,
    pushOrSet,
    collectFrontmatterRefs,
} from "./content-utils";
import { CustomDate } from "./custom-date";
import type { HistoricKind } from "./schema/codex-article";

/**
 * Retrieve all items of a collection that math the given project id.
 * ```
 * const articles = getProjectCollection(project)
 */
export async function getProjectCollection<C extends keyof DataEntryMap>(
    projectId: string,
    collection: C,
): Promise<CollectionEntry<C>[]> {
    return getCollection(
        collection,
        ({ id }) => projectFromId(id) === projectId,
    );
}

export async function getProjectCollections(
    project?: CollectionEntry<"projects">,
) {
    const [
        categories,
        articles,
        maps,
        timelines,
        documents,
        handouts,
        tables,
        statblocks,
    ] = project
        ? await Promise.all([
              getProjectCollection(project.id, "categories"),
              getProjectCollection(project.id, "articles"),
              getProjectCollection(project.id, "maps"),
              getProjectCollection(project.id, "timelines"),
              getProjectCollection(project.id, "documents"),
              getProjectCollection(project.id, "handouts"),
              getProjectCollection(project.id, "tables"),
              getProjectCollection(project.id, "statblocks"),
          ])
        : [[], [], [], [], [], [], [], []];
    return {
        categories,
        articles,
        maps,
        timelines,
        documents,
        handouts,
        tables,
        statblocks,
    };
}

/**
 * Builds a lookup map keyed by `"{projectId}/{slug}"` and `"{projectId}/{alias}"`.
 * ```
 * const map = buildArticleMap(articles);
 * const article = map.get('test/example');
 * ```
 */
export function buildArticleMap(
    articles: CollectionEntry<"articles">[],
): Map<string, CollectionEntry<"articles">> {
    const map = new Map<string, CollectionEntry<"articles">>();
    for (const article of articles) {
        const projectId = projectFromId(article.id);
        map.set(`${projectId}/${slugFromId(article.id)}`, article);
        for (const alias of article.data.aliases ?? []) {
            map.set(`${projectId}/${alias}`, article);
        }
    }
    return map;
}

/**
 * Builds a reverse index of article references: for each article, every
 * other article that links to it.
 * ```
 * const backlinks = await buildBacklinkIndex(articles, buildArticleMap(articles));
 * const referencedBy = backlinks.get(article.id) ?? [];
 * ```
 */
export async function buildBacklinkIndex(
    articles: CollectionEntry<"articles">[],
    articleMap: Map<string, CollectionEntry<"articles">>,
): Promise<Map<string, CollectionEntry<"articles">[]>> {
    const backlinks = new Map<string, CollectionEntry<"articles">[]>();

    await Promise.all(
        articles.map(async (article) => {
            const projectId = projectFromId(article.id);
            const { remarkPluginFrontmatter } = await render(article);
            const outgoingLinks: string[] =
                remarkPluginFrontmatter.outgoingLinks ?? [];
            const frontmatterRefs = collectFrontmatterRefs(article.data.meta);
            const targets = new Set(
                [...outgoingLinks, ...frontmatterRefs]
                    .map((slug) => articleMap.get(`${projectId}/${slug}`))
                    .filter(
                        (target): target is CollectionEntry<"articles"> =>
                            !!target && target.id !== article.id,
                    ),
            );

            for (const target of targets) {
                pushOrSet(backlinks, target.id, article);
            }
        }),
    );

    return backlinks;
}

/**
 * Retrieve the project from the id of a another collection item. Throws if
 * the project cannot be found.
 * ```
 * const project = await getProjectFromId(article.id);
 * ```
 */
export async function getProjectFromId(id: string) {
    const projectId = projectFromId(id);
    const project = await getEntry("projects", projectId);
    if (!project) throw `No project with id ${projectId}`;
    return project;
}

/**
 * Finds an article by project and slug, resolving aliases.
 * Prefer `buildArticleMap` when resolving multiple references at once.
 * ```
 * const article = await getArticleFromSlug('test', 'example');
 * ```
 */
export async function getArticleFromSlug(projectId: string, slug: string) {
    const articles = await getCollection("articles", (article) => {
        const articleProjectId = projectFromId(article.id);
        const articleSlug = slugFromId(article.id);

        return (
            articleProjectId === projectId &&
            (articleSlug === slug ||
                (article.data.aliases && article.data.aliases.includes(slug)))
        );
    });

    if (articles.length == 0) {
        return;
    }

    if (articles.length > 1) {
        console.error(
            `Duplicate result for slug ${slug}, probably caused by aliases.`,
        );
    }

    return articles[0];
}

/**
 * Returns the auto-extracted abstract for an article (first paragraph),
 * falling back to the raw body if the remark plugin data is unavailable.
 * ```
 * const abstract = await getAbstract(article);
 * ```
 */
export async function getAbstract(
    article: CollectionEntry<"articles"> | undefined,
) {
    try {
        if (!article) return undefined;
        const renderData = await render(article);
        return renderData.remarkPluginFrontmatter.abstract ?? article.body;
    } catch (err) {
        console.error(err);
        return undefined;
    }
}

export type TimelineEvent = {
    id: string;
    date: CustomDate;
    dateString: string;
    title: string;
    kind: HistoricKind | undefined;
    abstract: string;
};

/**
 * Returns all historic events for a given timeline by extracting them
 * from articles.
 * ```
 * const events = await getTimelineEvents(projectId, "my-timeline");
 * ```
 */
export async function getTimelineEvents(
    projectId: string,
    timeline: string,
): Promise<TimelineEvent[]> {
    const calendar = (await getEntry("projects", projectId))?.data.calendar;

    const entries = await getCollection("articles", (article) => {
        return projectId == projectFromId(article.id);
    });

    const events: TimelineEvent[] = (
        await Promise.all(
            entries.map(async (entry) => {
                if (
                    entry.data.meta?.type !== "historic" ||
                    !entry.data.meta?.timelines?.includes(timeline)
                ) {
                    return null;
                }
                const meta = entry.data.meta;
                if (!meta.date) return null;

                const abstract = await getAbstract(entry);

                if (typeof meta.date === "string") {
                    const date = CustomDate.parse(calendar, meta.date);
                    return {
                        id: entry.id,
                        date,
                        dateString: date.toString(),
                        title: entry.data.title,
                        kind: meta.kind,
                        abstract,
                    };
                } else {
                    const start = CustomDate.parse(calendar, meta.date.start);
                    const end = CustomDate.parse(calendar, meta.date.end);
                    return {
                        id: entry.id,
                        date: start,
                        dateString: `${start.toString()} - ${end.toString()}`,
                        title: entry.data.title,
                        kind: meta.kind,
                        abstract,
                    };
                }
            }),
        )
    ).filter((e) => !!e);
    events.sort((a, b) => a.date.compare(b.date));
    return events;
}
