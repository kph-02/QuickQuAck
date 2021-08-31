import React from 'react';
import { Dimensions, StyleSheet, Text, Image, TouchableHighlight, View } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger, renderers } from 'react-native-popup-menu';

//colors
const { primary, yellow, background, lightgray, darkgray, black } = Colors;
import { Colors } from './../components/styles';

const { SlideInMenu } = renderers;

const PostMenu = ({ navigation }) => {
  return (
    <Menu renderer={SlideInMenu}>
      {/* Two menu options: Text post and Poll post */}

      {/* Slide-in Menu from the bottom is triggered by the Floating button in feed button */}
      <MenuTrigger  customStyles={triggerStyles}>
        <Image source={require('./../assets/create_post_button.png')} style={styles.floatingButtonStyle} />
      </MenuTrigger>

      <MenuOptions>
        {/* Title */}
        <MenuOption
        disableTouchable = {true}
         style={styles.titleContainer}>
          <Text style={styles.text}>Post to QuickQuAck</Text>
        </MenuOption>

        <View style={styles.container}>
          {/* Text post */}
          <MenuOption
            style={styles.menuOptions}
            onSelect={() => {
              const postType = {
                post_type: 'Text',
              };
              navigation.navigate('Create Post', { postType });
            }}
          >
            <View style={styles.options}>
              <Image source={require('./../assets/text_icon.png')}></Image>
              <Text style={styles.text}>Text</Text>
            </View>
          </MenuOption>
          {/* Poll post */}
          <MenuOption
            style={styles.menuOptions}
            onSelect={() => {
              const postType = { post_type: 'Poll' };
              navigation.navigate('Create Poll', { postType });
            }}
          >
            <View style={styles.options}>
              <Image source={require('./../assets/poll_icon.png')}></Image>
              <Text style={styles.text}>Poll</Text>
            </View>
          </MenuOption>
        </View>
      </MenuOptions>
    </Menu>
  );
};

const { width, height } = Dimensions.get('screen');

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
    padding: 15,
    borderColor: darkgray,
    borderWidth: 0.5,
  },
  menuOptions: {
    borderColor: darkgray,
    borderWidth: 0.5,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  options: {
    flexDirection: 'row',
    padding: width / 6,
  },
  text: {
    color: 'black',
    fontSize: height * 0.025,
    paddingHorizontal: 5,
    fontWeight: 'bold',
  },
  touchableStyle: {
    width: width * 0.18,
    height: width * 0.18,
    alignItems: 'center',
    justifyContent: 'center',
    right: 15,
    top: 1,
  },
  floatingButtonStyle: {
    resizeMode: 'contain',
    width: width * 0.18,
    height: width * 0.18,
  },
});

const triggerStyles = {
  TriggerTouchableComponent: TouchableHighlight,
  triggerTouchable: {
    activeOpacity: 0.6,
    style: {
      justifyContent: 'center',
      alignItems: 'center',
      width: width * 0.16,
      height: width * 0.16,
      borderRadius: 100,
    },
  },
};

export default PostMenu;
