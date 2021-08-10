import React from 'react';
import { Dimensions, StyleSheet, Text, Image, TouchableHighlight, View, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Menu, MenuOptions, MenuOption, MenuTrigger, renderers } from 'react-native-popup-menu';

//colors
const { primary, yellow, background, lightgray, darkgray, black } = Colors;
import { Colors, Line } from './../components/styles';
const { width, height } = Dimensions.get('screen');

const Poll = ({ Type }) => {
  if (Type === 'Poll') {
    return (
      <View style={styles.optionContainer}>
        <Line />
        <TextInput styles={styles.userInput} placeholder="Enter Poll Option" placeholderTextColor={darkgray} />
        <Line />
        <TouchableOpacity style={styles.addOption}>
          <Image source={require('../assets/add_icon.png')} />
        </TouchableOpacity>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  optionContainer: {},
  userInput: {},
  addOption: {},
});

export default Poll;
