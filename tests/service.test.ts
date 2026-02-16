import { describe, it, expect } from "vitest";
import { TodoService } from "../src/service.js";
import type { Todo } from "../src/types.js";

const service = new TodoService();

function createTodo(id: number, text: string, createdAt: string): Todo {
  return { id, text, createdAt };
}

describe("TodoService.add", () => {
  it("空の配列に TODO を追加できる", () => {
    const result = service.add([], "テスト");
    expect(result.added.id).toBe(1);
    expect(result.added.text).toBe("テスト");
    expect(result.added.createdAt).toBeDefined();
    expect(result.todos).toHaveLength(1);
  });

  it("既存の TODO がある場合、ID が最大値 + 1 になる", () => {
    const existing = [createTodo(1, "既存", "2026-01-01T00:00:00.000Z")];
    const result = service.add(existing, "新規");
    expect(result.added.id).toBe(2);
    expect(result.todos).toHaveLength(2);
  });

  it("削除後に追加しても ID が重複しない", () => {
    const existing = [
      createTodo(1, "一番目", "2026-01-01T00:00:00.000Z"),
      createTodo(3, "三番目", "2026-01-03T00:00:00.000Z"),
    ];
    const result = service.add(existing, "新規");
    expect(result.added.id).toBe(4);
  });

  it("元の配列を変更しない（イミュータブル）", () => {
    const original: Todo[] = [];
    service.add(original, "テスト");
    expect(original).toHaveLength(0);
  });
});

describe("TodoService.delete", () => {
  const todos = [
    createTodo(1, "一番目", "2026-01-01T00:00:00.000Z"),
    createTodo(2, "二番目", "2026-01-02T00:00:00.000Z"),
    createTodo(3, "三番目", "2026-01-03T00:00:00.000Z"),
  ];

  it("指定 ID の TODO を削除できる", () => {
    const result = service.delete(todos, 2);
    expect("error" in result).toBe(false);
    if (!("error" in result)) {
      expect(result.removed.text).toBe("二番目");
      expect(result.todos).toHaveLength(2);
      expect(result.todos.find((t) => t.id === 2)).toBeUndefined();
    }
  });

  it("存在しない ID を指定するとエラーを返す", () => {
    const result = service.delete(todos, 99);
    expect("error" in result).toBe(true);
    if ("error" in result) {
      expect(result.error).toContain("99");
    }
  });

  it("元の配列を変更しない（イミュータブル）", () => {
    const original = [...todos];
    service.delete(original, 1);
    expect(original).toHaveLength(3);
  });
});

describe("TodoService.getStats", () => {
  it("空の配列の場合、count: 0, latest: null を返す", () => {
    const stats = service.getStats([]);
    expect(stats.count).toBe(0);
    expect(stats.latest).toBeNull();
  });

  it("件数と最新の TODO を返す", () => {
    const todos = [
      createTodo(1, "古い", "2026-01-01T00:00:00.000Z"),
      createTodo(2, "新しい", "2026-01-03T00:00:00.000Z"),
      createTodo(3, "中間", "2026-01-02T00:00:00.000Z"),
    ];
    const stats = service.getStats(todos);
    expect(stats.count).toBe(3);
    expect(stats.latest?.text).toBe("新しい");
  });

  it("1 件の場合、その TODO が latest になる", () => {
    const todos = [createTodo(1, "唯一", "2026-01-01T00:00:00.000Z")];
    const stats = service.getStats(todos);
    expect(stats.count).toBe(1);
    expect(stats.latest?.text).toBe("唯一");
  });
});
