import type { CustomCalendar } from "./schema/codex-calendar.ts";

export class CustomDate {
    public calendar: CustomCalendar | undefined;
    public afterZero: boolean;
    public year: number;
    public month: number;
    public day: number;

    constructor(
        calendar: CustomCalendar | undefined,
        afterZero: boolean,
        year: number,
        month: number | undefined,
        day: number | undefined,
    ) {
        this.calendar = calendar;
        this.afterZero = afterZero;
        this.year = year;
        this.month = month ?? 0;
        this.day = day ?? 0;
    }

    static parse(calendar: CustomCalendar | undefined, str: string) {
        const splits = str.split("/").map((el) => {
            const n = parseInt(el);
            if (isNaN(n))
                throw new Error(`Invalid date component "${el}" in "${str}"`);
            return n;
        });
        return new CustomDate(
            calendar,
            Math.sign(splits[0]) >= 1,
            splits.at(0)!,
            splits.at(1),
            splits.at(2),
        );
    }

    get monthName(): string | undefined {
        const months = this.calendar?.year?.months;
        if (!months || this.month < 1 || this.month > months.length)
            return undefined;
        return months[this.month - 1].name;
    }

    get splitShort(): string | undefined {
        return this.afterZero
            ? this.calendar?.splits?.post.short
            : this.calendar?.splits?.pre.short;
    }

    toStringF(format: string = "y/m/d"): string {
        let result = "";
        for (var char of format) {
            switch (char) {
                case "y":
                    result += `${this.year}`;
                    break;
                case "Y":
                    result += `${Math.abs(this.year)}${this.splitShort ? ` ${this.splitShort}` : ""}`;
                    break;
                case "m":
                    result += `${this.month}`;
                    break;
                case "M":
                    result += `${this.monthName}`;
                    break;
                case "d":
                    result += `${this.day}`;
                    break;
                default:
                    result += char;
                    break;
            }
        }
        return result;
    }

    toString(): string {
        if (this.month && this.day) {
            return this.toStringF("Y, M d");
        } else {
            return this.toStringF("Y");
        }
    }

    compare(other: CustomDate): number {
        if (this.year !== other.year) return this.year - other.year;
        else if (this.month !== other.month) return this.month - other.month;
        else if (this.day !== other.day) return this.day - other.day;
        else return 0;
    }
}
