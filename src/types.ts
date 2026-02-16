/** TODO アイテムの型定義 */
export interface Todo {
  id: number;
  text: string;
  createdAt: string;
}

/** 統計情報の型定義 */
export interface TodoStats {
  count: number;
  latest: Todo | null;
}
