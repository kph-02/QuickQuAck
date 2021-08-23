import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

//Screens
import Welcome from '../screens/Welcome';
import Profile from '../screens/Profile';
import Notifications from '../screens/Notifications';
import Settings from '../screens/Settings';
import Signup from '../screens/Signup';
import Login from '../screens/Login';
import FeedViews from '../screens/FeedViews';
import Messages from '../screens/Messages';
import UserActivity from '../screens/UserActivity';

// const FeedStack = createStackNavigator();
// function FeedStackScreen() {
//   return (
//     <FeedStack.Navigator>
//         <FeedStack.Screen name="Welcome" component={Welcome} />
//         <FeedStack.Screen name="Create Post" component={CreatePost} />
//     </FeedStack.Navigator>
//   );
// }

// function ProfileScreen() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Sample Profile Screen!</Text>
//     </View>
//   );
// }

function MessagesScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Sample Messages Screen!</Text>
    </View>
  );
}

// function Notifications() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Sample Notifications Screen!</Text>
//     </View>
//   );
// }

const Tab = createMaterialBottomTabNavigator();

export default function TabNav() {
  return (
    <Tab.Navigator
    initialRouteName="Feed"
    activeColor="#FFCC15"
    inactiveColor="#BDBDBD"
    barStyle={{backgroundColor: '#FFFFFF',  borderTopColor: '#DEE2E6', borderTopWidth: 0.5}} 
    labeled={true}>
        <Tab.Screen name="Feed" component={Welcome} 
             options={{
              tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="home" color={color} size={26} />
              ),
          }}
        />
        <Tab.Screen name="My Activity" component={UserActivity} 
            options={{
                  tabBarIcon: ({ color, size }) => (
                      <MaterialCommunityIcons name="account-circle" color={color} size={26} />
                  ),
              }}
        />
        <Tab.Screen name="Messages" component={Messages} 
            options={{
                  tabBarIcon: ({ color, size }) => (
                      <MaterialCommunityIcons name="forum-outline" color={color} size={26} />
                  ),
              }}
        />
        <Tab.Screen name="Settings" component={Settings} 
            options={{
                  tabBarIcon: ({ color, size }) => (
                      <MaterialCommunityIcons name="cog" color={color} size={26} />
                  ),
              }}
        />
        {/* <Tab.Screen name="Create Post" component={CreatePost} /> */}
    </Tab.Navigator>
  );
}

const EmptyScreen = () => {
    return (null)
}


// export default function TabNav() {
//   return(
//     <Tab.Navigator 
//     initialRouteName="Welcome"
//     activeColor="#FFCC15"
//     labeled={true}>
//       <Tab.Screen name="Welcome" component={Welcome}
        //   options={{
        //       tabBarIcon: ({ color, size }) => (
        //           <MaterialCommunityIcons name="home" color={color} size={26} />
        //       ),
        //   }} />
//       <Tab.Screen name="Profile" component={ProfileScreen} 
//           listeners={({ navigation }) => ({
//               tabPress: event => {
//                   event.preventDefault();
//                   navigation.navigate("Profile")
//               }})}
            //   options={{
            //       tabBarIcon: ({ color, size }) => (
            //           <MaterialCommunityIcons name="account-circle" color={color} size={26} />
            //       ),
            //   }} />
//       <Tab.Screen name="Messages" component={MessagesScreen}  
//           options={{
//               tabBarIcon: ({ color, size }) => (
//                   <MaterialCommunityIcons name="magnify" color={color} size={26} />
//               ),
//           }} />
//       <Tab.Screen name="Notifications" component={NotificationsScreen}
//           listeners={({ navigation }) => ({
//               tabPress: event => {
//                   event.preventDefault();
//                   navigation.navigate("Notifications")
//               }
//           })}
//           options={{
//               tabBarIcon: ({ color, size }) => (
//                   <MaterialCommunityIcons name="plus-box" color={color} size={26} />
//               ),
//           }} />
                
//     </Tab.Navigator>
//   );
// }

const styles = StyleSheet.create({
    tabStyle: {
        flex: 0.09,
        flexDirection: 'row',
        alignContent: 'center',
        backgroundColor: 'dodgerblue',
        borderTopColor: '#BDBDBD',
        borderTopWidth: 1
    }
})

