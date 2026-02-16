import type { Todo, TodoStats } from "./types.js";

/** TODO のビジネスロジック（純粋関数） */
export class TodoService {
  /** 新しい TODO を作成して配列に追加する */
  add(todos: Todo[], text: string): { todos: Todo[]; added: Todo } {
    const id = todos.length > 0 ? Math.max(...todos.map((t) => t.id)) + 1 : 1;
    const added: Todo = {
      id,
      text,
      createdAt: new Date().toISOString(),
    };
    return { todos: [...todos, added], added };
  }

  /** 指定 ID の TODO を削除する */
  delete(
    todos: Todo[],
    id: number
  ): { todos: Todo[]; removed: Todo } | { error: string } {
    const index = todos.findIndex((todo) => todo.id === id);
    if (index === -1) {
      return { error: `ID: ${id} の TODO は見つかりません` };
    }
    const removed = todos[index];
    const updated = todos.filter((todo) => todo.id !== id);
    return { todos: updated, removed };
  }

  /** 統計情報を取得する */
  getStats(todos: Todo[]): TodoStats {
    if (todos.length === 0) {
      return { count: 0, latest: null };
    }
    const sorted = [...todos].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return {
      count: todos.length,
      latest: sorted[0],
    };
  }
}
