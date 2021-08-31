import React from 'react';
import {
  Animated, TouchableOpacity, Text, Image, StyleSheet, Dimensions, View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ButtonText, HeaderContainer, StyledButton3 } from './styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const HEADER_HEIGHT = 110;

const AnimatedHeader = ({ animatedValue, navigation }) => {
  const insets = useSafeAreaInsets();

  const headerHeight = animatedValue.interpolate({
    inputRange: [0, HEADER_HEIGHT + insets.top],
    outputRange: [HEADER_HEIGHT + insets.top, insets.top + 45],
    extrapolate: 'clamp'
  });

  return (
    <Animated.View
      style={{
        zIndex: 2,
        height: headerHeight,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row',
      }}>
        <TouchableOpacity onPress={() => navigation.navigate('TagModal')} style={styles.mapTouchableStyle}>
            <MaterialCommunityIcons name="filter-outline" color={'#BDBDBD'} size={35} style={{alignItems: 'center', right: 3, bottom: 2}}/>
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Feed</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Map')} style={styles.mapTouchableStyle}>
            {/* <Image source={require('./../assets/map.png')} style={styles.mapIcon} /> */}
            <MaterialCommunityIcons name="map-outline" color={'#BDBDBD'} size={35} style={{alignItems: 'center', right: 3, bottom: 2}}/>
        </TouchableOpacity>
      </Animated.View>
  );
};

const { width, height } = Dimensions.get('screen');

const styles = StyleSheet.create({
  pageTitle: {
    fontSize: 40,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000',
    // paddingBottom: 30,
    // // backgroundColor: 'dodgerblue',
  },
  item: {
    // padding: 30,
    paddingHorizontal: 30,
    marginVertical: 2.5,
    //marginHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bodyText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  touchableStyle: {
    position: 'absolute',
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },
  floatingButtonStyle: {
    resizeMode: 'contain',
    width: width * 0.18,
    height: width * 0.18,
  },
  mapIcon: {
    resizeMode: 'contain',
    width: 30,
    height: 30,
    //position: 'absolute',
  },
  mapTouchableStyle: {
    //flex: 1,
    //position: 'absolute',
    width: 30,
    height: 30,
    // margin
    // right: 40,
    // top: 12,
    // backgroundColor: 'pink',
    resizeMode: 'contain',
    zIndex: 2,
  },
});

export default AnimatedHeader;