export interface Identifiable {
    id: string;
}

export interface Filter<TItem> {
    (item: TItem): boolean;
}

export interface Registry<TItem extends Identifiable> {
    add: (item: TItem) => Promise<TItem>;
    remove: (id: string) => Promise<TItem | undefined>;
    fetch: (id: string) => Promise<TItem | undefined>;
    list: (filter?: Filter<TItem>) => Promise<TItem[]>;
}
