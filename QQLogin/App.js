import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, HeaderTitle } from '@react-navigation/stack';
import {MenuProvider} from 'react-native-popup-menu';

// Nav
import RootStack from './navigators/RootStack';
import TabNav from './navigators/TabNav';
import CreatePost from './screens/CreatePost';
import PostView from './screens/PostView';
import FlagPost from './screens/FlagPost';
import EllipsisMenu from './components/EllipsisMenu';
import TagSelection from './screens/TagSelection';

// import { StackActions } from '@react-navigation/native';

const Stack = createStackNavigator();

export default function App() {
  return (
  <MenuProvider>
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="RootStack"
        screenOptions={({ route, navigation }) => ({
          headerShown: false,
        })}
      >
        <Stack.Screen name="RootStack" component={RootStack} />
        <Stack.Screen name="TabNav" component={TabNav} />
        <Stack.Screen name="Create Post" component={CreatePost} />
        <Stack.Screen name="Post View" component={PostView} />
        <Stack.Screen name="Flag Post" component={FlagPost} />
        <Stack.Screen name="Menu" component={EllipsisMenu} />
        <Stack.Screen name="TagSelection" component={TagSelection} />
      </Stack.Navigator>
    </NavigationContainer>
  </MenuProvider>
    
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
