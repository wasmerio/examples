<script lang="ts">
import { onMount } from "svelte";

import I18nKey from "../i18n/i18nKey";
import { i18n } from "../i18n/translation";
import type { PostForList } from "../utils/content-utils";
import { getPostUrlBySlug } from "../utils/url-utils";

export let tags: string[] = [];
export let categories: string[] = [];
export let sortedPosts: PostForList[] = [];

const params = new URLSearchParams(window.location.search);
tags = params.has("tag") ? params.getAll("tag") : [];
categories = params.has("category") ? params.getAll("category") : [];
const uncategorized = params.get("uncategorized");

interface Group {
	year: number;
	posts: PostForList[];
}

let groups: Group[] = [];

function formatDate(date: Date) {
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const day = date.getDate().toString().padStart(2, "0");
	return `${month}-${day}`;
}

function formatTag(tagList: string[]) {
	return tagList.map((t) => `#${t}`).join(" ");
}

onMount(async () => {
	let filteredPosts: PostForList[] = sortedPosts;

	if (tags.length > 0) {
		filteredPosts = filteredPosts.filter(
			(post) =>
				Array.isArray(post.data.tags) &&
				post.data.tags.some((tag) => tags.includes(tag)),
		);
	}

	if (categories.length > 0) {
		filteredPosts = filteredPosts.filter(
			(post) => post.data.category && categories.includes(post.data.category),
		);
	}

	if (uncategorized) {
		filteredPosts = filteredPosts.filter((post) => !post.data.category);
	}

	const grouped = filteredPosts.reduce(
		(acc, post) => {
			const year = post.data.published.getFullYear();
			if (!acc[year]) {
				acc[year] = [];
			}
			acc[year].push(post);
			return acc;
		},
		{} as Record<number, PostForList[]>,
	);

	const groupedPostsArray = Object.keys(grouped).map((yearStr) => ({
		year: Number.parseInt(yearStr, 10),
		posts: grouped[Number.parseInt(yearStr, 10)],
	}));

	groupedPostsArray.sort((a, b) => b.year - a.year);

	groups = groupedPostsArray;
});
</script>

<div class="card card-compact bg-(--card-bg) border border-(--border-divider) shadow-[0_16px_32px_-26px_rgba(30,40,80,0.55)]">
    <div class="card-body px-8 py-6">
        {#each groups as group}
            <div>
                <div class="flex flex-row w-full items-center h-[3.75rem]">
                    <div class="w-[15%] md:w-[10%] transition text-2xl font-bold text-right text-75">
                        {group.year}
                    </div>
                    <div class="w-[15%] md:w-[10%]">
                        <div
                            class="h-3 w-3 bg-none rounded-full outline-(--primary) mx-auto
                            -outline-offset-2 z-50 outline-3"
                        ></div>
                    </div>
                    <div class="w-[70%] md:w-[80%] transition text-left text-50">
                        {group.posts.length} {i18n(group.posts.length === 1 ? I18nKey.postCount : I18nKey.postsCount)}
                    </div>
                </div>

                {#each group.posts as post}
                    <a
                        href={getPostUrlBySlug(post.slug)}
                        aria-label={post.data.title}
                        class="group archive-post-link"
                    >
                        <div class="archive-post-row">
                            <!-- date -->
                            <div class="archive-post-date">
                                {formatDate(post.data.published)}
                            </div>

                            <!-- dot and line -->
                            <div class="archive-post-track dash-line">
                                <div
                                    class="archive-post-dot"
                                ></div>
                            </div>

                            <!-- post title -->
                            <div class="archive-post-title">
                                {post.data.title}
                            </div>

                            <!-- tag list -->
                            <div class="archive-post-tags">
                                {formatTag(post.data.tags)}
                            </div>
                        </div>
                    </a>
                {/each}
            </div>
        {/each}
    </div>
</div>

