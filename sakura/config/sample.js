// 定数と変数
const PI: number = 3.14159;
let radius: number = 10;
let message: string = "Hello, world!";
let isVisible: boolean = true;

// 型定義とインターフェース
interface Shape {
  name: string;
  area(): number;
}

// クラスとメソッド
class Circle implements Shape {
  constructor(public radius: number) {}

  area(): number {
    return PI * this.radius ** 2;
  }
}

// 関数宣言と引数
function greet(name: string): string {
  return `Hello, ${name}!`;
}

// 制御構文
if (isVisible && radius > 0) {
  console.log(greet("NeoVim User"));
} else {
  console.warn("Circle is not visible.");
}

// 配列とループ
const numbers: number[] = [1, 2, 3, 4, 5];
for (const num of numbers) {
  console.log(`Number: ${num}`);
}

// 演算子と式
let result = (radius + 5) * 2 / PI;

// 例外処理
try {
  throw new Error("Something went wrong!");
} catch (e) {
  console.error(e.message);
}

// ジェネリクスと型推論
function identity<T>(value: T): T {
  return value;
}

const id = identity<string>("TypeScript");

// モジュールのインポートとエクスポート
import fs from "fs";
export { Circle, greet };
