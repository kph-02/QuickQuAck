import React from 'react';
import {Colors} from './../components/styles';
const { primary, yellow, background, lightgray, darkgray, black} = Colors;


import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, HeaderTitle } from '@react-navigation/stack';

//screens
import Login from './../screens/Login';
import Signup from './../screens/Signup';
import Welcome from './../screens/Welcome';
import Splash from './../screens/Splash';

const Stack = createStackNavigator();

const RootStack = () => {
    return(
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: ''
                    },
                    headerTransparent: true,
                    headerLeftContainerStyle: {
                        paddingLeft:20
                    },
                    headerShown:false
                }}
                initialRouteName="Splash"
                >
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Signup" component={Signup} />
                <Stack.Screen name="Welcome" component={Welcome} />
                <Stack.Screen name="Splash" component={Splash} />
                

            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default RootStack;