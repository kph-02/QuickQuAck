import React from 'react';
import { Dimensions, StyleSheet, Text, Image, TouchableHighlight } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger, renderers } from 'react-native-popup-menu';

const { SlideInMenu } = renderers;

const PostMenu = ({ navigation }) => {
  return (
    <Menu renderer={SlideInMenu}>
      {/* Slide-in Menu from the bottom is triggered by the Floating button in feed button */}
      <MenuTrigger>
        <Image source={require('./../assets/create_post_button.png')} style={styles.touchableStyle} />
      </MenuTrigger>

      {/* Two menu options: Text post and Poll post */}
      <MenuOptions style={styles.container}>
        {/* Title */}
        <MenuOption style={styles.title}>
          <Text style={styles.text}>Post to QuickQuAck</Text>
        </MenuOption>

        {/* Text post */}
        <MenuOption
          style={{ paddingVertical: 10 }}
          onSelect={() => {
            navigation.navigate('Create Post');
          }}
        >
          <Text style={styles.text}>Text</Text>
        </MenuOption>

        {/* Poll post */}
        <MenuOption style={{ paddingVertical: 10 }} onSelect={() => alert('W.I.P')}>
          <Text style={styles.text}>Poll</Text>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
};

const { width, height } = Dimensions.get('screen');

const styles = StyleSheet.create({
  title: {},
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
  touchableStyle: {
    position: 'absolute',
    width: width * 0.18,
    height: width * 0.18,
    alignItems: 'center',
    justifyContent: 'center',
    right: 15,
    bottom: 15,
  },
});

export default PostMenu;
