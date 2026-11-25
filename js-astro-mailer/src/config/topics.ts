export const topics = ["Craft", "Design", "Growth", "Money", "Tools", "Interviews"] as const;

export type Topic = (typeof topics)[number];

export const topicSlug = (topic: Topic) => topic.toLowerCase().replace(/\s+/g, "-");

export const topicMeta: Record<Topic, { summary: string }> = {
  Craft: {
    summary: "Writing the thing: openings, endings, voice, and what to cut before you send.",
  },
  Design: {
    summary: "How an issue looks in an inbox and on the web, and why the two rarely match.",
  },
  Growth: {
    summary: "Finding readers and keeping them, without buying a list or begging for shares.",
  },
  Money: {
    summary: "Paid tiers, sponsorship, and what the whole thing costs to keep running.",
  },
  Tools: {
    summary: "Sending software, deliverability, analytics, and what is worth paying for.",
  },
  Interviews: {
    summary: "Conversations with people who have been publishing long enough to have opinions.",
  },
};
