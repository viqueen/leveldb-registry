## environment

I use **[nvm](https://github.com/nvm-sh/nvm)** to manage my node versions.

```bash
brew install nvm
```

## development setup

- create a fork of the repo, clone it, and install the dependencies

```bash
cd leveldb-registry
nvm install
yarn
```

- setup git hooks

```bash
npx husky install
```

- build it in watch mode

```bash
yarn build --watch
```
