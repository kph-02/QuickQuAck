import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Switch, Text, View, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { serverIp } from './Login';
import * as Location from 'expo-location';

const Settings = ({ navigation }) => {
  var JWTtoken = '';
  var userId = '';
  var userInformation;

  const [userName, setUserName] = useState();

  //Used w/ Switch for Notifications
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {
      setIsEnabled(previousState => !previousState);
  };

  const getUserID = async () => {
    await AsyncStorage.getItem('user_id').then((user_id) => {
      userId = user_id;
    });
  };

  const getJWTtoken = async () => {
    await AsyncStorage.getItem('token').then((token) => {
      JWTtoken = token;
    });
  };

  //Runs once upon rendering components
  useEffect(() => {
    const getUserInformation = async () => {
      await getUserID();
      await getJWTtoken();
      await getFromDB();
      setUserName(userInformation.first_name + ' ' + userInformation.last_name);
    };

    getUserInformation();
  }, []);

  //Get user information from the database
  const getFromDB = async () => {
    const query = 'user_id=' + userId;
    try {
      const response = await fetch('http://' + serverIp + '/feed/user-information?' + query, {
        method: 'GET',
        headers: { token: JWTtoken, 'Content-Type': 'application/json' },
      });

      userInformation = await response.json();
    } catch (err) {
      console.log(err.message);
    }
  };

  //Below functions/consts are from Settings.js, above are from Profile.js
  const initialLocationState = {
    location: {
      latitude: 32.880213553722704,
      longitude: -117.23399204377725,
    },
    // geocode: null,
    errorMessage: '',
  };

  const [locationPermission, setLocationPermission] = useState(initialLocationState);
  // const [status, setStatus] = useState(status);

  getLocationAsync = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLocationPermission({
        errorMessage: 'Permission to access location was denied',
      });
      return;
    }
    let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
    const { latitude, longitude } = location.coords;
    // this.getGeocodeAsync({ latitude, longitude });
    setLocationPermission({ location: { latitude, longitude } });
    // console.log(errorMessage);
    console.log(location.coords);

  };

  return (
    <View style={styles.container}>
      {/* Settings Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Text style={styles.headline}>Settings</Text>
        </View>
      </View>
      <Image style={styles.avatar} source={require('./../assets/Logo.png')} />

      {/* User's Name */}
      <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 45, marginBottom: height * 0.02}}>
           <Text style={styles.name}>{userName}</Text>
      </View>

      {/* Settings Options/Selections */}
      <ScrollView contentContainerStyle={styles.bodyContent}>
         <View style={styles.divider}/>
          <TouchableOpacity style={[styles.buttonContainer]}>
            <Text style={{fontSize: 15}}>Allow Notifications</Text>
            <Switch 
                trackColor={{ false: '#767577', true: '#FFCC15' }}
                thumbColor={isEnabled ? "#ffdd62" : "#f4f3f4"}
                style={{transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]}}
                onValueChange={toggleSwitch}
                value={isEnabled}
            />
          </TouchableOpacity>
          <View style={styles.divider}/>
          <TouchableOpacity onPress={() => navigation.navigate('TagSettings')} style={styles.buttonContainer}>
            <Text style={{fontSize: 15}}>Edit Interest Tags</Text>
            <AntDesign name="right" size={20} color="#BDBDBD" style={{paddingHorizontal: 10}}/>
          </TouchableOpacity>
          <View style={styles.divider}/>
          <TouchableOpacity onPress={() => navigation.navigate('UserInfo')} style={styles.buttonContainer}>
            <Text style={{fontSize: 15}}>Edit Personal Info</Text>
            <AntDesign name="right" size={20} color="#BDBDBD" style={{paddingHorizontal: 10}}/>
          </TouchableOpacity>
          <View style={styles.divider}/>
          <TouchableOpacity onPress={() => console.log(getLocationAsync())} style={styles.buttonContainer}>
            <Text style={{fontSize: 15}}>Location Permissions</Text>
            <AntDesign name="right" size={20} color="#BDBDBD" style={{paddingHorizontal: 10}}/>
          </TouchableOpacity>
          <View style={styles.divider}/>
           <TouchableOpacity style={[styles.buttonContainer]}>
            <Text style={{fontSize: 15}}>Feedback</Text>
            <AntDesign name="right" size={20} color="#BDBDBD" style={{paddingHorizontal: 10}}/>
          </TouchableOpacity>
          <View style={styles.divider}/>
           <TouchableOpacity style={[styles.buttonContainer]}>
            <Text style={{fontSize: 15 }}>Terms and Conditions</Text>
          </TouchableOpacity>
        <View style={styles.divider}/>
         
        {/* Logout Button */}
        <View style={{alignItems: 'center', justifyContent: 'center', marginVertical: height * 0.05}}>
         <TouchableOpacity 
              onPress={() => navigation.navigate('Login')}
              style={styles.logoutButton}>
              <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
       </View>
      </ScrollView>
        
      </View>
  );
};

export default Settings;

const { width, height } = Dimensions.get('screen');

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFCC15',
    height: 220,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 10,
    alignSelf: 'center',
    position: 'absolute',
    marginTop: 130,
  },
  body: {
    marginTop: 40,
  },
  bodyContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  name: {
    fontSize: 30,
    color: '#000000',
    fontWeight: 'bold',
  },
  buttonContainer: {
    // marginTop: 10,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  headline: {
    textAlign: 'center',
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 50,
  },
  divider: {
    width: '120%',
    borderColor:'#DEE2E6',
    borderTopWidth: 1,
    marginVertical: 1
  },
  buttonText: {
      color: 'black',
      fontWeight: 'bold',
      fontSize: 20,
      textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#FFCC15', 
    width: width * 0.8, 
    height: 50, 
    justifyContent: 'center', 
    alignItems: 'center', 
    //marginTop: height * 0.05, 
    borderRadius: 100
  }
});
