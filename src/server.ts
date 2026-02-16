import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { TodoRepository } from "./repository.js";
import { TodoService } from "./service.js";
import { formatDate } from "./utils.js";

const app = express();
app.use(express.json());

// CORS: cc-mcp-test02 のフロントエンドからのアクセスを許可
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (_req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

const repository = new TodoRepository();
const service = new TodoService();

// Swagger 定義
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TODO 管理 API",
      version: "1.0.0",
      description: "TODO の追加・一覧・削除・統計を提供する REST API",
    },
    servers: [{ url: "http://localhost:3000" }],
    components: {
      schemas: {
        Todo: {
          type: "object",
          properties: {
            id: { type: "integer", description: "TODO の ID", example: 1 },
            text: { type: "string", description: "TODO の内容", example: "買い物に行く" },
            createdAt: { type: "string", format: "date-time", description: "作成日時" },
            createdAtFormatted: { type: "string", description: "表示用の作成日時", example: "2026/02/16 17:30" },
          },
        },
        TodoStats: {
          type: "object",
          properties: {
            count: { type: "integer", description: "TODO の件数", example: 3 },
            latest: { $ref: "#/components/schemas/Todo" },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string", description: "エラーメッセージ" },
          },
        },
      },
    },
  },
  apis: ["./src/server.ts"],
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/swagger.json", (_req, res) => {
  res.json(swaggerSpec);
});

/**
 * @openapi
 * /api/todos:
 *   get:
 *     summary: TODO 一覧を取得
 *     tags: [TODO]
 *     responses:
 *       200:
 *         description: TODO の配列
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 */
app.get("/api/todos", (_req, res) => {
  const todos = repository.loadAll();
  const result = todos.map((todo) => ({
    ...todo,
    createdAtFormatted: formatDate(todo.createdAt),
  }));
  res.json(result);
});

/**
 * @openapi
 * /api/todos:
 *   post:
 *     summary: TODO を追加
 *     tags: [TODO]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [text]
 *             properties:
 *               text:
 *                 type: string
 *                 description: TODO の内容
 *                 example: 買い物に行く
 *     responses:
 *       201:
 *         description: 追加された TODO
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       400:
 *         description: バリデーションエラー
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post("/api/todos", (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== "string") {
    res.status(400).json({ error: "text は必須です" });
    return;
  }
  const todos = repository.loadAll();
  const result = service.add(todos, text);
  repository.saveAll(result.todos);
  res.status(201).json({
    ...result.added,
    createdAtFormatted: formatDate(result.added.createdAt),
  });
});

/**
 * @openapi
 * /api/todos/{id}:
 *   delete:
 *     summary: TODO を削除
 *     tags: [TODO]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 削除する TODO の ID
 *     responses:
 *       200:
 *         description: 削除された TODO
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: TODO が見つからない
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.delete("/api/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const todos = repository.loadAll();
  const result = service.delete(todos, id);
  if ("error" in result) {
    res.status(404).json({ error: result.error });
    return;
  }
  repository.saveAll(result.todos);
  res.json(result.removed);
});

/**
 * @openapi
 * /api/stats:
 *   get:
 *     summary: TODO の統計情報を取得
 *     tags: [統計]
 *     responses:
 *       200:
 *         description: 統計情報
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TodoStats'
 */
app.get("/api/stats", (_req, res) => {
  const todos = repository.loadAll();
  const stats = service.getStats(todos);
  const result = {
    count: stats.count,
    latest: stats.latest
      ? { ...stats.latest, createdAtFormatted: formatDate(stats.latest.createdAt) }
      : null,
  };
  res.json(result);
});

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`🚀 サーバー起動: http://localhost:${PORT}`);
  console.log(`📖 Swagger UI: http://localhost:${PORT}/docs`);
  console.log(`📄 OpenAPI JSON: http://localhost:${PORT}/swagger.json`);
});

export { app };
