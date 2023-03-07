import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

import { Identifiable, leveldbRegistry } from './index';

type TestItem = Identifiable & {
    value: string;
};

describe('leveldb-registry', () => {
    const localPath = path.resolve(process.cwd(), '.test-registry');
    const registry = leveldbRegistry<TestItem>({ localPath });

    afterAll(() => {
        fs.rmSync(localPath, { recursive: true });
    });

    it('should add and remove identifiable item to registry', async () => {
        const item: TestItem = {
            id: randomUUID(),
            value: randomUUID()
        };

        const added = await registry.add(item);
        expect(added).toEqual(item);

        const found = await registry.fetch(item.id);
        expect(found).toBeDefined();
        expect(found).toEqual(item);

        const notFound = await registry.fetch('not-found');
        expect(notFound).toBeUndefined();

        const items = await registry.list();
        expect(items).toEqual([item]);

        const removed = await registry.remove(item.id);
        expect(removed).toBeDefined();
        expect(removed).toEqual(item);

        const empty = await registry.list();
        expect(empty).toEqual([]);
    });
});
