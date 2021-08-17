import React, { Component } from 'react';
import { StyleSheet, Switch, Text, View, Image, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const Profile = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', marginRight: 100, justifyContent: 'space-evenly' }}>
          <TouchableOpacity
            style={{ marginRight: 60, width: 50, paddingTop: 70 }}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#FFCC15' }}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headline}>Settings</Text>
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.bodyContent}>
          <TouchableOpacity style={styles.buttonContainer}>
            <Text style={{ marginRight: 235, fontSize: 13 }}>Allow Notifications</Text>
            <Switch trackColor={{ false: '#767577', true: '#FFCC15' }}></Switch>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('TagSelection')} style={styles.buttonContainer}>
            <Text style={{ marginRight: 290, fontSize: 13 }}>Edit Interest Tags</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('UserInfo')} style={styles.buttonContainer}>
            <Text style={{ marginRight: 290, fontSize: 13 }}>Edit Personal Info</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainer}>
            <Text style={{ marginRight: 265, fontSize: 13 }}>Location Permissions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              marginTop: 10,
              height: 60,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: '120%',
              backgroundColor: '#FFFFFF',
              borderTopColor: '#DEE2E6',
              borderTopWidth: 1,
              borderBottomColor: '#DEE2E6',
              borderBottomWidth: 1,
            }}
          >
            <Text style={{ marginRight: 265, fontSize: 13 }}>Terms and Conditions</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFFFFF',
    height: 100,
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
    flex: 1,
    alignItems: 'center',
    padding: 30,
  },
  name: {
    fontSize: 30,
    color: '#000000',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '120%',
    backgroundColor: '#FFFFFF',
    borderTopColor: '#DEE2E6',
    borderTopWidth: 1,
  },
  headline: {
    textAlign: 'center',
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 50,
    marginRight: 20,
  },
});
