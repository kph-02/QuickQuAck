import React, { useState, Component } from 'react';
import { Dimensions, Platform, StyleSheet, Text, Alert } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger, renderers } from 'react-native-popup-menu';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { SlideInMenu } = renderers;

const EllipsisMenu = ({ navigation }) => {
  return (
    <Menu renderer={SlideInMenu}>
      {/* Slide-in Menu from the bottom is triggered by the Ellipsis (...) button */}
      <MenuTrigger>
        <MaterialCommunityIcons name="dots-horizontal" color="#BDBDBD" size={height * 0.035} />
      </MenuTrigger>

      {/* Three menu options: Send Message, Flag as inappropriate, Block Posts from User */}
      <MenuOptions style={{ paddingBottom: 25, paddingTop: 8 }}>
        {/* Send Message */}
        <MenuOption
          style={{ paddingVertical: 10 }}
          onSelect={() => {
            Alert.alert('Send Message to User?', 'Would you like to send a message to this user?', [
              { text: 'Yes', onPress: () => console.log('User Pressed Yes') },
              { text: 'No', onPress: () => console.log('User Pressed No') },
            ]);
          }}
        >
          <Text style={styles.text}>Send Message</Text>
        </MenuOption>

        {/* Flag as Inappropriate */}
        <MenuOption onSelect={() => navigation.navigate('Flag Post')} style={{ paddingVertical: 10 }}>
          <Text style={styles.text}>Flag as inappropriate</Text>
        </MenuOption>

        {/* Block Posts from User */}
        <MenuOption
          style={{ paddingVertical: 10 }}
          onSelect={() => {
            Alert.alert('Block Posts from User?', 'Would you like to block posts from this user?', [
              { text: 'Yes', onPress: () => console.log('User Pressed Yes') },
              { text: 'No', onPress: () => console.log('User Pressed No') },
            ]);
          }}
        >
          <Text style={styles.text}>Block posts from this user</Text>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
};

const { width, height } = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor : "#00BCD4",
    backgroundColor: 'yellow',
    height: '20%',
    width: '80%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    marginTop: 80,
    marginLeft: 40,
  },
  text: {
    marginLeft: 30,
    color: 'black',
    fontSize: height * 0.019,
  },
});

export default EllipsisMenu;
