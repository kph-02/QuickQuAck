import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  Touchable,
  KeyboardAvoidingView,
} from 'react-native';
import { MaterialCommunityIcons, EvilIcons } from '@expo/vector-icons';

//Testing purposes, change serverIP in login.js to your local IPV4 address
import { serverIp } from './Login.js';

//Store Authentication Token
var JWTtoken = '';

//formik
import { Formik, Field, Form } from 'formik';

//icons
import { Octicons, Ionicons, Fontisto } from '@expo/vector-icons';

const ChatRoom = () => {
    const navigation = useNavigation();
    return(
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'lightskyblue'}}>
            <Text>This is a temporary ChatRoom Screen!</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Messages')}>
                <Text style={{color:'#FFCC15', fontWeight: 'bold'}}>Go Back...</Text>
            </TouchableOpacity>
        </View>
    );
    
    
};

export default ChatRoom;