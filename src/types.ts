export type Identifiable = {
    id: string;
};

export interface Filter<TItem> {
    (item: TItem): boolean;
}

export type Registry<TItem extends Identifiable> = {
    add: (item: TItem) => Promise<TItem>;
    fetch: (id: string) => Promise<TItem | undefined>;
    list: (filter?: Filter<TItem>) => Promise<TItem[]>;
};
