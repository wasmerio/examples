interface Language {
    name: string;
    level: string;
    description: string;
    show: boolean;
}

const languages: Language[] = [
    {
        name: "English",
        level: "Native",
        description: "I speak fluently and write fluently",
        show: true
    },
    {
        name: "Spanish",
        level: "Bilingual",
        description: "I speak fluently and write fluently",
        show: true
    },
    {
        name: "French",
        level: "B1",
        description: "I speak fluently and write fluently",
        show: true
    },
    {
        name: "Italian",
        level: "B2",
        description: "I speak fluently and write fluently",
        show: false
    }
];

export default languages;