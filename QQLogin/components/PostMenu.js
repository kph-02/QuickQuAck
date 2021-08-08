import React from 'react';
import { Dimensions, StyleSheet, Text, Image, TouchableHighlight, View } from 'react-native';
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
      <MenuOptions>
        {/* Title */}
        <MenuOption style={styles.title}>
          <Text>Post to QuickQuAck</Text>
        </MenuOption>

        <View style={styles.container}>
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
        </View>
      </MenuOptions>
    </Menu>
  );
};

const { width, height } = Dimensions.get('screen');

const styles = StyleSheet.create({
  title: {
    alignItems: 'center',
    padding: 10,
    borderBottomColor: 'black',
    borderWidth: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  text: {
    padding: width / 5,
    color: 'black',
    fontSize: height * 0.019,
    borderWidth: 1,
    borderColor: 'black',
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
