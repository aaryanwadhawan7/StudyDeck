1. Initialize an empty npm project

```javascript
npm init -y
```

2. Create a new React-Typescript project via vite bundler

```javascript
npm create vite@latest . -- --template react-ts
npm install
npm run dev
```

3. TypeScript Execution for Backend

- Runs typescript file directly without compiling
- Hot-reload your backend when your file change (watch mode)
- Much faster backend experience
- Runs tsx watch server/index.ts

```javascript
npm install -D tsx
```

- Add this script inside package.json file
- This will run the backend via 'npm run dev:backend'
- 'npm run dev' : This will run both frontend and backend

```javascript
'dev:backend': 'tsx watch server/index.ts'
```

4. Eslint : Code quality checker

```javascript
npm install -D eslint
npm run lint
```

5. Prettier - Code Formatter

```javascript
npm install -D prettier
```

- We can format the code via

```javascript
npm run format
```

6. Husky - Git Hooks Manager [Optional]
   - This will run lint and prettier and blocks the commit if error occurs

```javascript
npm install -D husky
```

7. lint-staged - Run Scripts on Staged Files Only [Optional]
   - This format only files which are going to commit (Files in staging phase)

```javascript
npm instrall -D lint-staged
npx lint-staged
```

8. Concurrently - Run Multiple Commands at Once [Optional]
   - Run multiple scripts simultaneously in one terminal

```javascript
npm install -D concurrently
```
