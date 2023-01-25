import path from 'path';
import { Identifiable, leveldbRegistry } from './index';
import * as fs from 'fs';
import { randomUUID } from 'crypto';

type TestItem = Identifiable & {
    value: string;
};

describe('leveldb-registry', () => {
    const localPath = path.resolve(process.cwd(), '.test-registry');
    const registry = leveldbRegistry<TestItem>({ localPath });

    afterAll(() => {
        fs.rmSync(localPath, { recursive: true });
    });

    it('should add identifiable item to registry', async () => {
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
    });
});
