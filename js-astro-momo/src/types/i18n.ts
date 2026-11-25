export type CoverConfig = {
    title: {
        home: string;
        archive: string;
        about: string;
        friends: string;
    };
    subTitle: {
        home: string;
        archive: string;
        about: string;
        friends: string;
    };
}

export type I18nConfig = {
    defaultLanguage: string;
    supportedLanguages: string[];
    translations: {
        "zh-cn": {
            Cover: CoverConfig;
        };
        "en": {
            Cover: CoverConfig;
        };
    };
}
