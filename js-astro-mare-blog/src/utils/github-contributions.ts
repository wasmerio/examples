export interface GitHubContributionDay {
  date: string;
  count: number;
  level: number;
}

const usernamePattern = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/;
const userAgent = "Mare Blog contribution calendar";
const requestTimeoutMs = 10_000;
const maxProfileResponseLength = 2_000_000;
const minimumDayCount = 350;
const maximumDayCount = 371;
const millisecondsPerDay = 24 * 60 * 60 * 1000;

const contributionCellPattern =
  /<td\b(?=[^>]*\bdata-date="(?<date>\d{4}-\d{2}-\d{2})")(?=[^>]*\bdata-level="(?<level>[0-4])")[^>]*><\/td>\s*<tool-tip\b[^>]*>(?<label>[\s\S]*?)<\/tool-tip>/g;
const contributionCountPattern = /(\d[\d,]*)\s+contributions?\b/i;

export async function fetchGitHubContributions(
  username: string,
): Promise<GitHubContributionDay[]> {
  if (!usernamePattern.test(username)) {
    throw new Error("The configured GitHub username is invalid.");
  }

  const days = await fetchFromProfilePage(username);
  return validateContributionDays(days);
}

async function fetchWithRetry(
  url: string,
  init: RequestInit,
  attempts = 2,
): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...init,
        signal: AbortSignal.timeout(requestTimeoutMs),
      });

      if (response.ok || response.status < 500 || attempt === attempts) {
        return response;
      }

      lastError = new Error(`HTTP ${response.status} from ${url}`);
    } catch (error) {
      lastError = error;
      if (attempt === attempts) throw error;
    }
  }

  throw lastError;
}

async function fetchFromProfilePage(
  username: string,
): Promise<GitHubContributionDay[]> {
  const response = await fetchWithRetry(
    `https://github.com/users/${encodeURIComponent(username)}/contributions`,
    {
      headers: {
        Accept: "text/html",
        "User-Agent": userAgent,
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `GitHub returned HTTP ${response.status} while loading contributions.`,
    );
  }

  const html = await response.text();
  if (html.length > maxProfileResponseLength) {
    throw new Error("GitHub's contribution response exceeded the size limit.");
  }

  const days: GitHubContributionDay[] = [];
  for (const match of html.matchAll(contributionCellPattern)) {
    const { date, level, label } = match.groups ?? {};
    if (!date || !level || !label) {
      throw new Error("GitHub's contribution calendar markup has changed.");
    }

    const parsedDate = new Date(`${date}T00:00:00Z`);
    if (parsedDate.toISOString().slice(0, 10) !== date) {
      throw new Error("GitHub returned an invalid contribution date.");
    }

    const plainLabel = label
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const countMatch = plainLabel.match(contributionCountPattern);
    const count = countMatch ? Number(countMatch[1].replaceAll(",", "")) : 0;

    if (!Number.isSafeInteger(count)) {
      throw new Error("GitHub returned an invalid contribution count.");
    }

    days.push({ date, count, level: Number(level) });
  }

  return days;
}

function validateContributionDays(
  days: GitHubContributionDay[],
): GitHubContributionDay[] {
  const sorted = [...days].sort((left, right) =>
    left.date.localeCompare(right.date),
  );

  if (sorted.length < minimumDayCount || sorted.length > maximumDayCount) {
    throw new Error(
      `GitHub's contribution calendar contained an unexpected number of days (${sorted.length}).`,
    );
  }

  if (new Date(`${sorted[0].date}T00:00:00Z`).getUTCDay() !== 0) {
    throw new Error("GitHub's contribution calendar does not start on Sunday.");
  }

  for (let index = 1; index < sorted.length; index += 1) {
    const previousDate = new Date(`${sorted[index - 1].date}T00:00:00Z`);
    const currentDate = new Date(`${sorted[index].date}T00:00:00Z`);
    if (currentDate.getTime() - previousDate.getTime() !== millisecondsPerDay) {
      throw new Error("GitHub's contribution calendar contains a date gap.");
    }
  }

  return sorted;
}
