import type { PracticeScreen } from './types';
import CounterScreen from './counter/CounterScreen';
import FormsScreen from './forms/FormsScreen';
import LaunchScreen from './launch/LaunchScreen';
import ListsScreen from './lists/ListsScreen';
import SelectorsScreen from './selectors/SelectorsScreen';

export const SCREENS: PracticeScreen[] = [
  { lesson: 1, slug: 'launch', title: 'Launch', Component: LaunchScreen },
  { lesson: 2, slug: 'counter', title: 'Counter', Component: CounterScreen },
  { lesson: 3, slug: 'selectors', title: 'Selectors', Component: SelectorsScreen },
  { lesson: 4, slug: 'forms', title: 'Forms', Component: FormsScreen },
  { lesson: 5, slug: 'lists', title: 'Lists', Component: ListsScreen },
];
