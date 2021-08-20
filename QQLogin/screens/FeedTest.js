import React, { useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Dimensions, StyleSheet, Text, Button, View, FlatList, TouchableOpacity, Image, ScrollView, Animated } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

import {
  StyledFeedContainer,
  Colors,
  ButtonText,
  StyledButton3,
  HeaderContainer,
} from './../components/styles';

import FeedViews from './FeedViews';
import PostMenu from '../components/PostMenu.js';
import AnimatedHeader from '../components/AnimatedHeader';


//colors
const { primary, yellow, background, lightgray, darkgray, black } = Colors;

const FeedTest = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);

  const [agree, setAgree] = useState(false);

  const [selectedId, setSelectedId] = useState(null);

  const items = [
    //list of items for the select list
    { id: '{Revelle}', name: 'Revelle' },
    { id: '{Muir}', name: 'Muir' },
    { id: '{Marshall}', name: 'Marshall' },
    { id: '{Warren}', name: 'Warren' },
    { id: '{ERC}', name: 'ERC' },
    { id: '{Sixth}', name: 'Sixth' },
    { id: '{Seventh}', name: 'Seventh' },
    { id: '{Question}', name: 'Question' },
    { id: '{Poll}', name: 'Poll' },
    { id: '{Food}', name: 'Food' },
    { id: '{Social}', name: 'Social' },
  ];

  const [selectedItems, setSelectedItems] = useState([]);
  
  const [modalOpen, setModalOpen] = useState(false);
  const handleModal = () => {
    setModalOpen(!modalOpen);
  };

  const offset = useRef(new Animated.Value(0)).current;

  return (
    <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} forceInset={{ top: 'always' }}>
        {/* <StyledFeedContainer> */}
            <AnimatedHeader animatedValue={offset} navigation={navigation}/>
            
            {/* HEADER STUFF */}
            {/* <HeaderContainer style={{backgroundColor: 'pink'}}>
                <TouchableOpacity onPress={() => navigation.navigate('Map')} style={styles.mapTouchableStyle}>
                    <Image source={require('./../assets/map.png')} style={styles.mapIcon} />
                </TouchableOpacity>
                <Text style={styles.pageTitle}>Feed</Text>
                <StyledButton3 onPress={() => navigation.navigate('TagModal')}>
                    <ButtonText>Filter</ButtonText>
                </StyledButton3>
            </HeaderContainer> */}

            {/* THE LITERAL FEEDS */}
            <FeedViews 
                navigation={navigation} 
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{nativeEvent: {contentOffset: {y: offset}}}],
                    {useNativeDriver: false}
                )}
                offset={offset}
            />

            {/* THE CREATE POST FLOATING BUTTON */}
            <View style={styles.touchableStyle}>
                <PostMenu navigation={navigation} />
            </View>
        {/* </StyledFeedContainer> */}
        </SafeAreaView>
    </SafeAreaProvider>
  );
};

const { width, height } = Dimensions.get('screen');

const styles = StyleSheet.create({
  pageTitle: {
    fontSize: 40,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000',
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
    position: 'absolute',
  },
  mapTouchableStyle: {
    flex: 1,
    position: 'absolute',
    width: 30,
    height: 30,
    right: 40,
    top: 12,
    resizeMode: 'contain',
  },
});

export default FeedTest;
