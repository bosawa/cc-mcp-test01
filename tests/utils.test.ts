import { describe, it, expect } from "vitest";
import { formatDate } from "../src/utils.js";

describe("formatDate", () => {
  it("ISO 8601 文字列を YYYY/MM/DD HH:mm 形式に変換する", () => {
    // UTC の時刻を渡し、ローカルタイムゾーンで変換されることを確認
    const result = formatDate("2026-01-15T00:00:00.000Z");
    // タイムゾーンに依存するため、フォーマットのパターンのみ検証
    expect(result).toMatch(/^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}$/);
  });

  it("月・日・時・分が 1 桁の場合にゼロ埋めされる", () => {
    // 2026/01/01 をテスト（ローカルタイムゾーン考慮で日付部分を確認）
    const result = formatDate("2026-01-01T01:05:00.000+09:00");
    expect(result).toBe("2026/01/01 01:05");
  });

  it("異なる日付でも正しくフォーマットされる", () => {
    const result = formatDate("2026-12-25T23:59:00.000+09:00");
    expect(result).toBe("2026/12/25 23:59");
  });
});
