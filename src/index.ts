import LevelUp from 'levelup';
import LevelDOWN from 'leveldown';
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
            const found = await r.get(id).then((data) => {
                if (data) return JSON.parse(data);
                else return undefined;
            });
            await r.del(id);
            return found;
        });
    };

    const fetch = async (id: string): Promise<TItem | undefined> => {
        return withLeveldb<TItem>(async (r) => {
            try {
                return await r.get(id).then(JSON.parse);
            } catch (error) {
                return undefined;
            }
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

    return { add, remove, fetch, list };
};
