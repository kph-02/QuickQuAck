import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, HeaderTitle } from '@react-navigation/stack';

// Nav
import RootStack from './navigators/RootStack';
import TabNav from './navigators/TabNav';


import Welcome from './screens/Welcome';
import Splash from './screens/Splash';
import { StackActions } from '@react-navigation/native';

const Stack = createStackNavigator();
// export default function App() {
  
//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//       initialRouteName="Root"
//       screenOptions={({route, navigation}) => ({
//         headerShown: false
//       })}>
//         <Stack.Screen name="Root" component={RootStack} />
//         <Stack.Screen name="TabNav" component={TabNav} />

//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

export default function App() {
  return (
    <NavigationContainer>
      <RootStack/>
      {/* <TabNav/> */}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
