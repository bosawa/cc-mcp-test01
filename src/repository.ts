import fs from "fs";
import path from "path";
import type { Todo } from "./types.js";

const DEFAULT_DATA_FILE = path.join(process.cwd(), "todos.json");

/** TODO データの永続化を担当するリポジトリ */
export class TodoRepository {
  private dataFile: string;

  constructor(dataFile?: string) {
    this.dataFile = dataFile ?? DEFAULT_DATA_FILE;
  }

  /** 全 TODO を読み込む */
  loadAll(): Todo[] {
    if (!fs.existsSync(this.dataFile)) {
      return [];
    }
    const data = fs.readFileSync(this.dataFile, "utf-8");
    return JSON.parse(data) as Todo[];
  }

  /** 全 TODO を保存する */
  saveAll(todos: Todo[]): void {
    fs.writeFileSync(this.dataFile, JSON.stringify(todos, null, 2), "utf-8");
  }
}
