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
import Profile from '../screens/Profile';
import Settings from '../screens/Settings';
import Notifications from './../screens/Notifications';
import CreatePost from '../screens/CreatePost';
import TabNav from './TabNav';
import PostView from './../screens/PostView';
import FeedViews from '../screens/FeedViews';
import FlagPost from '../screens/FlagPost';
import EllipsisMenu from '../components/EllipsisMenu';
import ChatRoom from '../screens/ChatRoom';
import ChatRoomEllipsis from '../components/ChatRoomEllipsis';
import TagSelection from '../screens/TagSelection';
import TagSettings from '../screens/TagSettings';
import Map from '../screens/Map';
import UserInfo from '../screens/UserInfo';
import UserActivity from '../screens/UserActivity';

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
                <Stack.Screen name="Profile" component={Profile} />
                <Stack.Screen name="Settings" component={Settings} />
                <Stack.Screen name="Notifications" component={Notifications} />
                <Stack.Screen name="TabNav" component={TabNav} />
                <Stack.Screen name="Create Post" component={CreatePost} />
                <Stack.Screen name="Post View" component={PostView} />
                <Stack.Screen name="Feed Views" component={FeedViews} />
                <Stack.Screen name="Flag Post" component={FlagPost} />
                <Stack.Screen name="Menu" component={EllipsisMenu} />
                <Stack.Screen name="Map" component={Map} />
                <Stack.Screen name="TagSelection" component={TagSelection} />
                <Stack.Screen name="TagSettings" component={TagSettings} />
                <Stack.Screen name="Chat" component={ChatRoom} />
                <Stack.Screen name="Chat Ellipsis" component={ChatRoomEllipsis} />
                <Stack.Screen name="UserInfo" component={UserInfo} />
                <Stack.Screen name="Activity" component={UserActivity} />

        </Stack.Navigator>
       
    )
}

export default RootStack;
