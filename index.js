const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "todos.json");

// TODOデータの読み込み
function loadTodos() {
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }
  const data = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(data);
}

// TODOデータの保存
function saveTodos(todos) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2), "utf-8");
}

// TODO を追加
function addTodo(text) {
  const todos = loadTodos();
  const todo = {
    id: todos.length + 1,
    text: text,
    createdAt: new Date().toISOString(),
  };
  todos.push(todo);
  saveTodos(todos);
  console.log(`✅ TODO を追加しました: "${text}" (ID: ${todo.id})`);
}

// TODO の一覧表示
function listTodos() {
  const todos = loadTodos();
  if (todos.length === 0) {
    console.log("📋 TODO はまだありません。");
    return;
  }
  console.log("📋 TODO 一覧:");
  console.log("-".repeat(40));
  todos.forEach((todo) => {
    console.log(`  [${todo.id}] ${todo.text}`);
  });
  console.log("-".repeat(40));
  console.log(`合計: ${todos.length} 件`);
}

// メイン処理: コマンドライン引数を解析して実行
const command = process.argv[2];
const argument = process.argv[3];

switch (command) {
  case "add":
    if (!argument) {
      console.log('⚠️  使い方: node index.js add "TODOの内容"');
      process.exit(1);
    }
    addTodo(argument);
    break;
  case "list":
    listTodos();
    break;
  default:
    console.log("📝 TODO 管理ツール");
    console.log("");
    console.log("使い方:");
    console.log('  node index.js add "TODOの内容"  - TODO を追加');
    console.log("  node index.js list              - TODO 一覧を表示");
    break;
}
