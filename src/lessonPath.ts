import type { PracticeScreen } from './screens/types';

export function lessonFileName(
  screen: Pick<PracticeScreen, 'lesson' | 'slug'>,
): string {
  return `${String(screen.lesson).padStart(2, '0')}-${screen.slug}`;
}
