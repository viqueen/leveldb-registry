## leveldb-registry

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=viqueen_leveldb-registry&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=viqueen_leveldb-registry)
[![Known Vulnerabilities](https://snyk.io/test/github/viqueen/leveldb-registry/badge.svg?targetFile=package.json)](https://snyk.io/test/github/viqueen/leveldb-registry?targetFile=package.json)

### install it

- **npm**

```bash
npm install leveldb-registry --save
```

- **yarn**

```bash
yarn add leveldb-registry
```

### use it

```typescript
import { Identifiable, leveldbRegistry } from "leveldb-registry";

type User = Identifiable & {
  name: string;
};

const registry = leveldbRegistry<User>({
  localPath: ".example",
});

const user = await registry.add({ id: randomUUID(), name: "haz" });
const found = await registry.fetch(user.id);

const users = await registry.list();
const userIds = await registry.ids();
```
