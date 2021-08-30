import React, { Component } from 'react';
import { StyleSheet, Switch, Text, View, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Notifications = ({ navigation }) => {
  return (
    <View style={styles.container}>c

      {/* for display only */}

      <View style={styles.body}>
        <View style={styles.bodyContent}>
          <TouchableOpacity style={styles.buttonContainer}>
            <MaterialCommunityIcons name="bell-ring" size={20} color="#FFCC15" />
            <Text style={{ marginLeft: 10, marginRight: 270, fontSize: 10 }}>From Social · 4hr</Text>
          </TouchableOpacity>
          <Text style={{ marginLeft: 10, paddingBottom: 10, fontSize: 13 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fringilla quam eu faci lisis mollis.
          </Text>
          <TouchableOpacity style={styles.buttonContainer}>
            <MaterialCommunityIcons name="bell-ring" size={20} color="#FFCC15" />
            <Text style={{ marginLeft: 10, marginRight: 280, fontSize: 10 }}>From Poll · 5hr</Text>
          </TouchableOpacity>
          <Text style={{ marginLeft: 10, paddingBottom: 10, fontSize: 13 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fringilla quam eu faci lisis mollis.
          </Text>
          <TouchableOpacity style={styles.buttonContainer}>
            <MaterialCommunityIcons name="bell-ring" size={20} color="#BDBDBD" />
            <Text style={{ marginLeft: 10, marginRight: 280, fontSize: 10 }}>From Poll · 5hr</Text>
          </TouchableOpacity>
          <Text style={{ marginLeft: 10, paddingBottom: 10, fontSize: 13 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fringilla quam eu faci lisis mollis.
          </Text>
          <TouchableOpacity style={styles.buttonContainer}>
            <MaterialCommunityIcons name="bell-ring" size={20} color="#BDBDBD" />
            <Text style={{ marginLeft: 10, marginRight: 280, fontSize: 10 }}>From Poll · 5hr</Text>
          </TouchableOpacity>
          <Text style={{ marginLeft: 10, paddingBottom: 10, fontSize: 13 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fringilla quam eu faci lisis mollis.
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Notifications;

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
    marginRight: 75,
  },
});
