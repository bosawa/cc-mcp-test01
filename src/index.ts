import { TodoRepository } from "./repository.js";
import { TodoService } from "./service.js";
import { formatDate } from "./utils.js";

const repository = new TodoRepository();
const service = new TodoService();

const command = process.argv[2];
const argument = process.argv[3];

switch (command) {
  case "add": {
    if (!argument) {
      console.log('⚠️  使い方: npx tsx src/index.ts add "TODOの内容"');
      process.exit(1);
    }
    const todos = repository.loadAll();
    const result = service.add(todos, argument);
    repository.saveAll(result.todos);
    console.log(`✅ TODO を追加しました: "${result.added.text}" (ID: ${result.added.id})`);
    break;
  }
  case "list": {
    const todos = repository.loadAll();
    if (todos.length === 0) {
      console.log("📋 TODO はまだありません。");
      break;
    }
    console.log("📋 TODO 一覧:");
    console.log("-".repeat(40));
    todos.forEach((todo) => {
      console.log(`  [${todo.id}] ${todo.text}  (${formatDate(todo.createdAt)})`);
    });
    console.log("-".repeat(40));
    console.log(`合計: ${todos.length} 件`);
    break;
  }
  case "delete": {
    if (!argument) {
      console.log("⚠️  使い方: npx tsx src/index.ts delete <ID>");
      process.exit(1);
    }
    const todos = repository.loadAll();
    const result = service.delete(todos, Number(argument));
    if ("error" in result) {
      console.log(`⚠️  ${result.error}`);
      process.exit(1);
    }
    repository.saveAll(result.todos);
    console.log(`🗑️  TODO を削除しました: "${result.removed.text}" (ID: ${result.removed.id})`);
    break;
  }
  case "stats": {
    const todos = repository.loadAll();
    const stats = service.getStats(todos);
    console.log("📊 TODO 統計:");
    console.log(`  合計: ${stats.count} 件`);
    if (stats.latest) {
      console.log(`  最新: "${stats.latest.text}" (${formatDate(stats.latest.createdAt)})`);
    }
    break;
  }
  default:
    console.log("📝 TODO 管理ツール");
    console.log("");
    console.log("使い方:");
    console.log('  npx tsx src/index.ts add "TODOの内容"  - TODO を追加');
    console.log("  npx tsx src/index.ts list              - TODO 一覧を表示");
    console.log("  npx tsx src/index.ts delete <ID>       - TODO を削除");
    console.log("  npx tsx src/index.ts stats             - 統計情報を表示");
    break;
}
