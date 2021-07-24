import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, HeaderTitle } from '@react-navigation/stack';

// Nav
import RootStack from './navigators/RootStack';
import TabNav from './navigators/TabNav';
import CreatePost from './screens/CreatePost';
import PostView from './screens/PostView';


// import { StackActions } from '@react-navigation/native';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="RootStack"
        screenOptions={({route, navigation}) => ({
        gestureEnabled: false,
        headerShown: false,
      })}>
        <Stack.Screen name='RootStack' component={RootStack} />
        <Stack.Screen name='TabNav' component={TabNav} />
        <Stack.Screen name="Create Post" component={CreatePost} />
        <Stack.Screen name="Post View" component={PostView} />
      </Stack.Navigator>
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
