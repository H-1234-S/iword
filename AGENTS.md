# Coding Rules

1. Fail fast with explicit errors: do not add fallback logic unless explicitly requested.
2. Let exceptions and errors bubble up as early as possible: do not handle errors inside the business layer.
3. Use effective tests: first prove that the bug or issue exists by making the test fail. Do not only write tests that pass, since they prove nothing.
4. Document externally exposed types, interfaces, functions, and classes, and add functional comments to key logic branches.
5. Reuse utility functions from `utils` whenever possible. If a general-purpose function does not exist but can be extracted and reused, add it to `utils` and reuse it there.
6. When writing unit tests, strictly mirror the source structure in `tests` directory. Each unit test file must test only the functionality of its corresponding source file.
7. Do not add unit tests that match stylesheets or source files with regular expressions; styles should be verified through component behavior and the toolchain.
8. Always use source types from the owning library or module. Do not create local duplicate types, and do not assert values as locally substituted types just to work around TypeScript issues.
9. Avoid abstraction layers that do not simplify the code or maintain a real boundary. Prefer calling the owning module or service directly instead of passing values through broad wrapper objects layer by layer.
10. Do not add explicit return types to functions unless TypeScript cannot infer them correctly or an explicit annotation is required to preserve a public contract.
11. Do not extract one-off helper functions unless they maintain a real boundary, hide meaningful complexity, or are expected to be reused. Prefer inlining simple one-use logic.
12. Do not revert files that are already staged in Git.
13. Keep source files under 500 lines where practical; split them as needed to keep files short and focused. This limit does not apply to unit test files.

# 仓库结构约定

本仓库是 pnpm workspace 单体仓库，根目录是唯一的 workspace 根（唯一 `pnpm-workspace.yaml`、唯一 `pnpm-lock.yaml`、唯一的 `packageManager` / `engines` 声明）。

- `apps/api`：NestJS 12 + ESM + vitest + oxlint，默认端口 3001
- `apps/web`：Next.js 16 App Router + React 19 + Tailwind 4 + eslint，默认端口 3000
- `packages/*`：纯 TS 源码包，无构建步骤，入口即 `src/index.ts`

补充约定：

1. 依赖版本统一写 `"catalog:"`，新依赖先登记到 `pnpm-workspace.yaml` 的 `catalog`，不要在子包里写死版本号。
2. 不要在 `apps/*`、`packages/*` 下新建 `pnpm-workspace.yaml` 或 `pnpm-lock.yaml`，也不要在子目录执行 `pnpm install`。
3. `packages/*` 中禁止 `enum` / `namespace` / 构造函数参数属性：Node 的类型擦除模式无法处理，`erasableSyntaxOnly` 会直接报错。需要枚举时用 `as const` 对象。
4. 提交前跑通：`pnpm typecheck && pnpm lint && pnpm test && pnpm build`。
