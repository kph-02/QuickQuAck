import React from 'react';
import { Colors } from './../components/styles';
const { primary, yellow, background, lightgray, darkgray, black } = Colors;

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, HeaderTitle } from '@react-navigation/stack';

//screens
import Login from './../screens/Login';
import Signup from './../screens/Signup';
import Welcome from './../screens/Welcome';
import Splash from './../screens/Splash';
import CreatePost from '../screens/CreatePost';
import TabNav from './TabNav';
import PostView from './../screens/PostView';
import FeedViews from '../screens/FeedViews';
import FlagPost from '../screens/FlagPost';
import EllipsisMenu from '../components/EllipsisMenu';
import ChatRoom from '../screens/ChatRoom';

const Stack = createStackNavigator();

const RootStack = () => {
    return(
        <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={({route, navigation}) => ({
            gestureEnabled: true,
            headerShown: false,
            headerTransparent: true})
            }>
                <Stack.Screen name="Splash" component={Splash} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Signup" component={Signup} />
                <Stack.Screen name="TabNav" component={TabNav} />
                <Stack.Screen name="Create Post" component={CreatePost} />
                <Stack.Screen name="Post View" component={PostView} />
                <Stack.Screen name="Feed Views" component={FeedViews} />
                <Stack.Screen name="Flag Post" component={FlagPost} />
                <Stack.Screen name="Menu" component={EllipsisMenu} />
                <Stack.Screen name="Chat" component={ChatRoom} />
        </Stack.Navigator>
       
    )
}

export default RootStack;
