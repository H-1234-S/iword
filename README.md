# iword

pnpm workspace 单体仓库：`apps/web`（Next.js）+ `apps/api`（NestJS）+ `packages/*`（共享代码）。

## 目录结构

```
apps/
  api/          NestJS 后端（ESM，端口 3001）
  web/          Next.js 前端（App Router，端口 3000）
packages/
  constants/    共享常量（@iword/constants）
  types/        共享类型（@iword/types）
tsconfig.base.json    共享 TS 编译选项
pnpm-workspace.yaml   workspace 定义 + catalog 版本表
```

## 环境要求

- **Node >= 22.18**：`packages/*` 不产出构建物，直接以 `src/index.ts` 作为入口，运行时依赖 Node 内置的 TypeScript 类型擦除（type stripping）。
- **pnpm 12**：版本由根 `package.json` 的 `packageManager` 字段锁定。

## 常用命令

所有命令都在仓库根执行：

| 命令             | 说明                                         |
| ---------------- | -------------------------------------------- |
| `pnpm dev`       | 并行启动 web + api                           |
| `pnpm build`     | 构建全部应用                                 |
| `pnpm typecheck` | 全仓类型检查（web 会先跑 `next typegen`）    |
| `pnpm lint`      | 全仓代码检查（api 用 oxlint，web 用 eslint） |
| `pnpm test`      | 运行全部测试（api 用 vitest）                |
| `pnpm format`    | prettier 格式化                              |

只操作单个应用：`pnpm --filter ./apps/web run build`。

## 工作区约定

1. **依赖版本统一走 catalog**。新增公共依赖时先在 `pnpm-workspace.yaml` 的 `catalog` 里登记，子包写 `"catalog:"`，不要在子包里写死版本号。
2. **共享包不打包**。`packages/*` 通过 `exports` 直接暴露 `src/index.ts`，由消费方（Nest 的 tsc / Next 的 Turbopack）编译。新增共享包照抄现有两个包的 `package.json` + `tsconfig.json` 即可。
3. **共享包里禁用不可擦除语法**。`tsconfig.base.json` 已开启 `erasableSyntaxOnly`，`enum`、`namespace`、构造函数参数属性会直接报错——它们在 Node 的类型擦除模式下无法运行。需要枚举时用 `as const` 对象代替。
4. **不要在各子目录跑 `pnpm install`**。仓库根是唯一 workspace 根、唯一 lockfile；子目录里的独立 lockfile / `pnpm-workspace.yaml` 会让 pnpm 把该目录当成独立工作区，导致依赖被装两份。

## 端口

| 应用 | 默认端口 | 覆盖方式             |
| ---- | -------- | -------------------- |
| web  | 3000     | `next dev -p <port>` |
| api  | 3001     | 环境变量 `PORT`      |
