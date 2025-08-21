import { AppRegistry } from 'react-native';
import App from './App';

AppRegistry.registerComponent('MobileTestApp', () => App);
AppRegistry.runApplication('MobileTestApp', {
  rootTag: document.getElementById('root')
});