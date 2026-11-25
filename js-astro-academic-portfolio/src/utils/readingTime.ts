export function getReadingTime(text: string): number {
    const wordsPerMinute = 200;
    const noOfWords = text.split(/\s+/g).length;
    const minutes = noOfWords / wordsPerMinute;
    return Math.ceil(minutes);
}
