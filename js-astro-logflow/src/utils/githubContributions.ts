import { request as httpsRequest } from "node:https";

export type GitHubContribution = {
  date: string;
  count: number;
  level: number;
};

export type GitHubContributionData = {
  contributions: GitHubContribution[];
  totalCount: number;
};

const GRAPHQL_URL = "https://api.github.com/graphql";
const DAY_MS = 86_400_000;

async function requestGraphQL(body: string, token: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const request = httpsRequest(GRAPHQL_URL, {
      method: "POST",
      agent: false,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        Connection: "close",
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
        "User-Agent": "logflow-theme-build",
      },
    }, (response) => {
      let responseBody = "";
      response.setEncoding("utf8");
      response.on("data", (chunk: string) => { responseBody += chunk; });
      response.on("end", () => {
        if (response.statusCode !== 200) {
          reject(new Error(`GitHub GraphQL returned ${response.statusCode ?? "unknown"}`));
          return;
        }
        try { resolve(JSON.parse(responseBody)); }
        catch { reject(new Error("GitHub GraphQL returned invalid JSON")); }
      });
    });
    request.setTimeout(10_000, () => request.destroy(new Error("GitHub GraphQL timed out")));
    request.on("error", reject);
    request.write(body);
    request.end();
  });
}

export async function fetchGitHubContributions(username: string): Promise<GitHubContributionData> {
  const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is required for GitHub GraphQL");

  const to = new Date();
  const from = new Date(to.valueOf() - 365 * DAY_MS);
  const query = `query($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date contributionCount contributionLevel } }
        }
      }
    }
  }`;
  const payload = await requestGraphQL(JSON.stringify({
    query,
    variables: { login: username, from: from.toISOString(), to: to.toISOString() },
  }), token) as {
    errors?: Array<{ message?: string }>;
    data?: { user?: { contributionsCollection?: { contributionCalendar?: {
      totalContributions: number;
      weeks: Array<{ contributionDays: Array<{
        date: string; contributionCount: number; contributionLevel: string;
      }> }>;
    } } } | null };
  };

  if (payload.errors?.length) throw new Error(payload.errors.map((error) => error.message).join("; "));
  const calendar = payload.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar) throw new Error("GitHub GraphQL returned no contribution calendar");

  const levels: Record<string, number> = {
    NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4,
  };
  const contributions = calendar.weeks.flatMap((week) => week.contributionDays.map((day) => ({
    date: day.date,
    count: day.contributionCount,
    level: levels[day.contributionLevel] ?? 0,
  })));
  if (!contributions.length) throw new Error("GitHub GraphQL returned no contributions");
  return { contributions, totalCount: calendar.totalContributions };
}
