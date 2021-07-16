import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator} from 'react-native';


// Nav
import RootStack from './navigators/RootStack';

import Welcome from './screens/Welcome';
import Splash from './screens/Splash';
export default function App() {
  
  return <RootStack />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
