/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import AlarmFlow from './src/screens/AlarmFlow';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent('WaWaAlarmScreen', () => AlarmFlow);