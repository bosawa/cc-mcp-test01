// 日付を読みやすい形式にフォーマット
function formatDate(isoString) {
  const date = new Date(isoString);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${y}/${m}/${d} ${h}:${min}`;
}

// TODO の統計情報を取得
function getStats(todos) {
  if (todos.length === 0) {
    return { count: 0, latest: null };
  }
  const sorted = [...todos].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  return {
    count: todos.length,
    latest: sorted[0],
  };
}

module.exports = { formatDate, getStats };
