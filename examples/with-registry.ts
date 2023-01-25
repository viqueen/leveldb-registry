import { leveldbRegistry } from '../src';
import { randomUUID } from 'crypto';

const internal = async () => {
    const registry = leveldbRegistry<{ id: string; name: string }>({
        localPath: '.example'
    });

    const user = await registry.add({ id: randomUUID(), name: 'haz' });
    return await registry.fetch(user.id);
};

internal().then(console.info).catch(console.error);
