import LevelDOWN from 'leveldown';
import LevelUp from 'levelup';

import type { Filter, Identifiable, Registry } from './types';

export * from './types';

export type RegistryInfo = {
    localPath: string;
};

export const leveldbRegistry = <TItem extends Identifiable>({
    localPath
}: RegistryInfo): Registry<TItem> => {
    const withLeveldb = async <T>(
        fn: (s: LevelUp.LevelUp) => Promise<T>
    ): Promise<T> => {
        const db = LevelUp(LevelDOWN(localPath));
        const result = await fn(db);
        await db.close();
        return result;
    };

    const add = async (item: TItem): Promise<TItem> => {
        return withLeveldb<TItem>(async (r) => {
            await r.put(item.id, JSON.stringify(item));
            return item;
        });
    };

    const remove = async (id: string): Promise<TItem | undefined> => {
        return withLeveldb<TItem>(async (r) => {
            const found = await r
                .get(id)
                .then(JSON.parse)
                .catch(() => {
                    // ignored
                });
            await r.del(id);
            return found;
        });
    };

    const fetch = async (id: string): Promise<TItem | undefined> => {
        return withLeveldb<TItem>(async (r) => {
            return await r
                .get(id)
                .then(JSON.parse)
                .catch(() => {
                    // ignored
                });
        });
    };

    const list = async (
        filter: Filter<TItem> = () => true
    ): Promise<TItem[]> => {
        return withLeveldb<TItem[]>((r) => {
            return new Promise<TItem[]>((resolve, reject) => {
                const items: TItem[] = [];
                r.createValueStream()
                    .on('data', (data: string) => {
                        const item = JSON.parse(data) as TItem;
                        if (filter(item)) items.push(item);
                    })
                    .on('close', () => resolve(items))
                    .on('end', () => resolve(items))
                    .on('error', () => reject());
            });
        });
    };

    const ids = async (): Promise<string[]> => {
        return withLeveldb<string[]>((r) => {
            return new Promise<string[]>((resolve, reject) => {
                const keys: string[] = [];
                r.createKeyStream()
                    .on('data', (key: Buffer) => {
                        keys.push(key.toString());
                    })
                    .on('close', () => resolve(keys))
                    .on('end', () => resolve(keys))
                    .on('error', () => reject());
            });
        });
    };

    return { add, remove, fetch, list, ids };
};
