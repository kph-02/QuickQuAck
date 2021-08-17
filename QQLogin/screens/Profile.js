import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const Profile = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', marginLeft: 0, justifyContent: 'space-evenly' }}>
          <TouchableOpacity
            style={{ marginRight: 70, width: 50, paddingTop: 70 }}
            onPress={() => navigation.navigate('Feed')}
          >
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#FFFFFF' }}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headline}>Profile</Text>
          <TouchableOpacity
            style={{ marginLeft: 60, width: 60, paddingTop: 70 }}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#FFFFFF' }}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Image
        style={styles.avatar}
        source={require('./../assets/AnonDuck.jpg')}
      />
      <View style={styles.body}>
        <View style={styles.bodyContent}>
          <Text style={styles.name}>Timmy Turner</Text>
          <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('Settings')}>
            <Text style={{ marginRight: 300, fontSize: 13 }}>Settings</Text>
            <AntDesign name="right" size={20} color="#BDBDBD" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.buttonContainer}
            onPress={() => navigation.navigate('Activity')}>
            <Text style={{ marginRight: 300, fontSize: 13 }}>Activity</Text>
            <AntDesign name="right" size={20} color="#BDBDBD" />
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
            <Text style={{ marginRight: 285, fontSize: 13 }}>Feedback</Text>
            <AntDesign name="right" size={20} color="#BDBDBD" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Profile;

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
    color: '#FFFFFF',
    marginTop: 50,
  },
});
