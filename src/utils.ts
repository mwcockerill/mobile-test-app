export function generateRandomNumber(min: number = 1, max: number = 100): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateMathProblem(): { a: number; b: number; answer: number } {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  return { a, b, answer: a + b };
}

const COLORS = [
  '❤️ Red - Passionate',
  '💙 Blue - Calm',
  '💚 Green - Peaceful',
  '💛 Yellow - Happy',
  '💜 Purple - Creative',
];

export function getRandomColor(): string {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}
