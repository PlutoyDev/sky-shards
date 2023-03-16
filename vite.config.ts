import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __NETLIFY_GIT_BRANCH__: `'${process.env.BRANCH}'`,
    __NETLIFY_GIT_COMMIT_REF__: `'${process.env.COMMIT_REF}'`,
  },
});
