/**
 * Copyright 2023 Hasnae Rehioui
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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

        const ids = await registry.ids();
        expect(ids).toEqual([item.id]);

        const removed = await registry.remove(item.id);
        expect(removed).toBeDefined();
        expect(removed).toEqual(item);

        const notFoundRemoved = await registry.remove('not-found');
        expect(notFoundRemoved).toBeUndefined();

        const empty = await registry.list();
        expect(empty).toEqual([]);
    });
});
