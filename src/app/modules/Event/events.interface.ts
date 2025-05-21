export type IEventFilterRequest = {
    searchTerm?: string | undefined;
    filterData?: string | undefined;
};

export type ToggleHeroSectionInput = {
    id: string;
    heroSection?: boolean;
};
