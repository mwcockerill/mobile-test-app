import type { PracticeScreen } from './types';
import CounterScreen from './counter/CounterScreen';
import DialogsScreen from './dialogs/DialogsScreen';
import FormsScreen from './forms/FormsScreen';
import LaunchScreen from './launch/LaunchScreen';
import ListsScreen from './lists/ListsScreen';
import RandomnessScreen from './randomness/RandomnessScreen';
import SelectorsScreen from './selectors/SelectorsScreen';
import WaitingScreen from './waiting/WaitingScreen';

export const SCREENS: PracticeScreen[] = [
  { lesson: 1, slug: 'launch', title: 'Launch', Component: LaunchScreen },
  { lesson: 2, slug: 'counter', title: 'Counter', Component: CounterScreen },
  { lesson: 3, slug: 'selectors', title: 'Selectors', Component: SelectorsScreen },
  { lesson: 4, slug: 'forms', title: 'Forms', Component: FormsScreen },
  { lesson: 5, slug: 'lists', title: 'Lists', Component: ListsScreen },
  { lesson: 6, slug: 'dialogs', title: 'Dialogs', Component: DialogsScreen },
  { lesson: 7, slug: 'waiting', title: 'Waiting', Component: WaitingScreen },
  { lesson: 8, slug: 'randomness', title: 'Randomness', Component: RandomnessScreen },
];
