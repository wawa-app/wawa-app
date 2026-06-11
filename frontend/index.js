/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import AlarmRingingScreen from './src/screens/AlarmRingingScreen';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent('WaWaAlarmScreen', () => AlarmRingingScreen);