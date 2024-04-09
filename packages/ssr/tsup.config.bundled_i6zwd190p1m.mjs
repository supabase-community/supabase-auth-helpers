// package.json
var package_default = {
  name: "@supabase/ssr",
  version: "0.1.0",
  main: "dist/index.js",
  module: "dist/index.mjs",
  types: "dist/index.d.ts",
  publishConfig: {
    access: "public"
  },
  files: [
    "dist"
  ],
  scripts: {
    lint: "tsc",
    build: "tsup",
    test: "vitest run",
    "test:watch": "vitest"
  },
  repository: {
    type: "git",
    url: "git+https://github.com/supabase/auth-helpers.git"
  },
  keywords: [
    "Supabase",
    "Auth",
    "Next.js",
    "Svelte Kit",
    "Remix",
    "Express"
  ],
  author: "Supabase",
  license: "MIT",
  bugs: {
    url: "https://github.com/supabase/auth-helpers/issues"
  },
  homepage: "https://github.com/supabase/auth-helpers#readme",
  dependencies: {
    cookie: "^0.5.0",
    ramda: "^0.29.0"
  },
  devDependencies: {
    "@supabase/supabase-js": "2.33.1",
    "@types/cookie": "^0.5.1",
    "@types/ramda": "^0.29.3",
    tsconfig: "workspace:*",
    tsup: "^6.7.0",
    vitest: "^0.34.6"
  },
  peerDependencies: {
    "@supabase/supabase-js": "^2.33.1"
  }
};

// tsup.config.ts
var tsup = {
  dts: true,
  entryPoints: ["src/index.ts"],
  external: ["react", "next", /^@supabase\//],
  format: ["cjs", "esm"],
  //   inject: ['src/react-shim.js'],
  // ! .cjs/.mjs doesn't work with Angular's webpack4 config by default!
  legacyOutput: false,
  sourcemap: true,
  splitting: false,
  bundle: true,
  clean: true,
  define: {
    PACKAGE_NAME: JSON.stringify(package_default.name.replace("@", "").replace("/", "-")),
    PACKAGE_VERSION: JSON.stringify(package_default.version)
  }
};
export {
  tsup
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGFja2FnZS5qc29uIiwgInRzdXAuY29uZmlnLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJ7XG5cdFwibmFtZVwiOiBcIkBzdXBhYmFzZS9zc3JcIixcblx0XCJ2ZXJzaW9uXCI6IFwiMC4xLjBcIixcblx0XCJtYWluXCI6IFwiZGlzdC9pbmRleC5qc1wiLFxuXHRcIm1vZHVsZVwiOiBcImRpc3QvaW5kZXgubWpzXCIsXG5cdFwidHlwZXNcIjogXCJkaXN0L2luZGV4LmQudHNcIixcblx0XCJwdWJsaXNoQ29uZmlnXCI6IHtcblx0XHRcImFjY2Vzc1wiOiBcInB1YmxpY1wiXG5cdH0sXG5cdFwiZmlsZXNcIjogW1xuXHRcdFwiZGlzdFwiXG5cdF0sXG5cdFwic2NyaXB0c1wiOiB7XG5cdFx0XCJsaW50XCI6IFwidHNjXCIsXG5cdFx0XCJidWlsZFwiOiBcInRzdXBcIixcblx0XHRcInRlc3RcIjogXCJ2aXRlc3QgcnVuXCIsXG5cdFx0XCJ0ZXN0OndhdGNoXCI6IFwidml0ZXN0XCJcblx0fSxcblx0XCJyZXBvc2l0b3J5XCI6IHtcblx0XHRcInR5cGVcIjogXCJnaXRcIixcblx0XHRcInVybFwiOiBcImdpdCtodHRwczovL2dpdGh1Yi5jb20vc3VwYWJhc2UvYXV0aC1oZWxwZXJzLmdpdFwiXG5cdH0sXG5cdFwia2V5d29yZHNcIjogW1xuXHRcdFwiU3VwYWJhc2VcIixcblx0XHRcIkF1dGhcIixcblx0XHRcIk5leHQuanNcIixcblx0XHRcIlN2ZWx0ZSBLaXRcIixcblx0XHRcIlJlbWl4XCIsXG5cdFx0XCJFeHByZXNzXCJcblx0XSxcblx0XCJhdXRob3JcIjogXCJTdXBhYmFzZVwiLFxuXHRcImxpY2Vuc2VcIjogXCJNSVRcIixcblx0XCJidWdzXCI6IHtcblx0XHRcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9zdXBhYmFzZS9hdXRoLWhlbHBlcnMvaXNzdWVzXCJcblx0fSxcblx0XCJob21lcGFnZVwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9zdXBhYmFzZS9hdXRoLWhlbHBlcnMjcmVhZG1lXCIsXG5cdFwiZGVwZW5kZW5jaWVzXCI6IHtcblx0XHRcImNvb2tpZVwiOiBcIl4wLjUuMFwiLFxuXHRcdFwicmFtZGFcIjogXCJeMC4yOS4wXCJcblx0fSxcblx0XCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuXHRcdFwiQHN1cGFiYXNlL3N1cGFiYXNlLWpzXCI6IFwiMi4zMy4xXCIsXG5cdFx0XCJAdHlwZXMvY29va2llXCI6IFwiXjAuNS4xXCIsXG5cdFx0XCJAdHlwZXMvcmFtZGFcIjogXCJeMC4yOS4zXCIsXG5cdFx0XCJ0c2NvbmZpZ1wiOiBcIndvcmtzcGFjZToqXCIsXG5cdFx0XCJ0c3VwXCI6IFwiXjYuNy4wXCIsXG5cdFx0XCJ2aXRlc3RcIjogXCJeMC4zNC42XCJcblx0fSxcblx0XCJwZWVyRGVwZW5kZW5jaWVzXCI6IHtcblx0XHRcIkBzdXBhYmFzZS9zdXBhYmFzZS1qc1wiOiBcIl4yLjMzLjFcIlxuXHR9XG59XG4iLCAiY29uc3QgX19pbmplY3RlZF9maWxlbmFtZV9fID0gXCIvVXNlcnMva2FuZ21pbmd0YXkvV29yay9TdXBhYmFzZS9hdXRoLWhlbHBlcnMvcGFja2FnZXMvc3NyL3RzdXAuY29uZmlnLnRzXCI7Y29uc3QgX19pbmplY3RlZF9kaXJuYW1lX18gPSBcIi9Vc2Vycy9rYW5nbWluZ3RheS9Xb3JrL1N1cGFiYXNlL2F1dGgtaGVscGVycy9wYWNrYWdlcy9zc3JcIjtjb25zdCBfX2luamVjdGVkX2ltcG9ydF9tZXRhX3VybF9fID0gXCJmaWxlOi8vL1VzZXJzL2thbmdtaW5ndGF5L1dvcmsvU3VwYWJhc2UvYXV0aC1oZWxwZXJzL3BhY2thZ2VzL3Nzci90c3VwLmNvbmZpZy50c1wiO2ltcG9ydCB0eXBlIHsgT3B0aW9ucyB9IGZyb20gJ3RzdXAnO1xuaW1wb3J0IHBrZyBmcm9tICcuL3BhY2thZ2UuanNvbic7XG5cbmV4cG9ydCBjb25zdCB0c3VwOiBPcHRpb25zID0ge1xuXHRkdHM6IHRydWUsXG5cdGVudHJ5UG9pbnRzOiBbJ3NyYy9pbmRleC50cyddLFxuXHRleHRlcm5hbDogWydyZWFjdCcsICduZXh0JywgL15Ac3VwYWJhc2VcXC8vXSxcblx0Zm9ybWF0OiBbJ2NqcycsICdlc20nXSxcblx0Ly8gICBpbmplY3Q6IFsnc3JjL3JlYWN0LXNoaW0uanMnXSxcblx0Ly8gISAuY2pzLy5tanMgZG9lc24ndCB3b3JrIHdpdGggQW5ndWxhcidzIHdlYnBhY2s0IGNvbmZpZyBieSBkZWZhdWx0IVxuXHRsZWdhY3lPdXRwdXQ6IGZhbHNlLFxuXHRzb3VyY2VtYXA6IHRydWUsXG5cdHNwbGl0dGluZzogZmFsc2UsXG5cdGJ1bmRsZTogdHJ1ZSxcblx0Y2xlYW46IHRydWUsXG5cdGRlZmluZToge1xuXHRcdFBBQ0tBR0VfTkFNRTogSlNPTi5zdHJpbmdpZnkocGtnLm5hbWUucmVwbGFjZSgnQCcsICcnKS5yZXBsYWNlKCcvJywgJy0nKSksXG5cdFx0UEFDS0FHRV9WRVJTSU9OOiBKU09OLnN0cmluZ2lmeShwa2cudmVyc2lvbilcblx0fVxufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBQTtBQUFBLEVBQ0MsTUFBUTtBQUFBLEVBQ1IsU0FBVztBQUFBLEVBQ1gsTUFBUTtBQUFBLEVBQ1IsUUFBVTtBQUFBLEVBQ1YsT0FBUztBQUFBLEVBQ1QsZUFBaUI7QUFBQSxJQUNoQixRQUFVO0FBQUEsRUFDWDtBQUFBLEVBQ0EsT0FBUztBQUFBLElBQ1I7QUFBQSxFQUNEO0FBQUEsRUFDQSxTQUFXO0FBQUEsSUFDVixNQUFRO0FBQUEsSUFDUixPQUFTO0FBQUEsSUFDVCxNQUFRO0FBQUEsSUFDUixjQUFjO0FBQUEsRUFDZjtBQUFBLEVBQ0EsWUFBYztBQUFBLElBQ2IsTUFBUTtBQUFBLElBQ1IsS0FBTztBQUFBLEVBQ1I7QUFBQSxFQUNBLFVBQVk7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNEO0FBQUEsRUFDQSxRQUFVO0FBQUEsRUFDVixTQUFXO0FBQUEsRUFDWCxNQUFRO0FBQUEsSUFDUCxLQUFPO0FBQUEsRUFDUjtBQUFBLEVBQ0EsVUFBWTtBQUFBLEVBQ1osY0FBZ0I7QUFBQSxJQUNmLFFBQVU7QUFBQSxJQUNWLE9BQVM7QUFBQSxFQUNWO0FBQUEsRUFDQSxpQkFBbUI7QUFBQSxJQUNsQix5QkFBeUI7QUFBQSxJQUN6QixpQkFBaUI7QUFBQSxJQUNqQixnQkFBZ0I7QUFBQSxJQUNoQixVQUFZO0FBQUEsSUFDWixNQUFRO0FBQUEsSUFDUixRQUFVO0FBQUEsRUFDWDtBQUFBLEVBQ0Esa0JBQW9CO0FBQUEsSUFDbkIseUJBQXlCO0FBQUEsRUFDMUI7QUFDRDs7O0FDaERPLElBQU0sT0FBZ0I7QUFBQSxFQUM1QixLQUFLO0FBQUEsRUFDTCxhQUFhLENBQUMsY0FBYztBQUFBLEVBQzVCLFVBQVUsQ0FBQyxTQUFTLFFBQVEsY0FBYztBQUFBLEVBQzFDLFFBQVEsQ0FBQyxPQUFPLEtBQUs7QUFBQTtBQUFBO0FBQUEsRUFHckIsY0FBYztBQUFBLEVBQ2QsV0FBVztBQUFBLEVBQ1gsV0FBVztBQUFBLEVBQ1gsUUFBUTtBQUFBLEVBQ1IsT0FBTztBQUFBLEVBQ1AsUUFBUTtBQUFBLElBQ1AsY0FBYyxLQUFLLFVBQVUsZ0JBQUksS0FBSyxRQUFRLEtBQUssRUFBRSxFQUFFLFFBQVEsS0FBSyxHQUFHLENBQUM7QUFBQSxJQUN4RSxpQkFBaUIsS0FBSyxVQUFVLGdCQUFJLE9BQU87QUFBQSxFQUM1QztBQUNEOyIsCiAgIm5hbWVzIjogW10KfQo=
