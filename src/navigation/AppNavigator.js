import { createDrawerNavigator } from 'react-navigation';
import screens from './screens';
import AppNavigator from './MainNavigator';
import Drawer from '../components/Drawer/Drawer';

export default createDrawerNavigator(
  {
    [screens.Main]: AppNavigator,
  },
  {
    initialRouteName: screens.Main,
    contentComponent: Drawer,
    drawerWidth: 300,
  },
);
