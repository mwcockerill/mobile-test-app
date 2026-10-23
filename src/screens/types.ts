import type React from 'react';

export type PracticeScreen = {
  lesson: number;
  slug: string;
  title: string;
  Component: React.ComponentType;
};
