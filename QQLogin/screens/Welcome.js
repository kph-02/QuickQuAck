import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Dimensions, StyleSheet, Text, FlatList, TouchableOpacity, Image, Alert} from 'react-native';
//formik
import { Formik, Field, Form } from 'formik';
//search bar
import {SearchBar} from 'react-native-elements';

//icons

import { Octicons, Ionicons, Fontisto } from '@expo/vector-icons';

import {
  StyledContainer,
  StyledFeedContainer,
  InnerContainer,
  PageLogo,
  PageTitle,
  SubTitle,
  StyledFormArea,
  LeftIcon,
  StyledInputLabel,
  StyledTextInput,
  StyledButton,
  RightIcon,
  Colors,
  ButtonText,
  MsgBox,
  Line,
  ExtraView,
  ExtraText,
  TextLink,
  TextLinkContent,
  ExtraViewRight,
} from './../components/styles';

import { Button, View } from 'react-native';
import KeyboardAvoidingWrapper from '../components/KBWrapper';

import CreatePost from '../screens/CreatePost';


//colors
const { primary, yellow, background, lightgray, darkgray, black } = Colors;

const posts = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
    body: 'This is a sample post!',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
    body: 'Who\'s playing at Sun God today at 7pm?',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
    body: 'Which dining hall has the best special today?',
  },
  {
    id: '58894a0f-3da1-471f-bd96-145571e29d82',
    title: 'Fourth Item',
    body: 'Which dining hall has the best special today?',
  },
  {
    id: '38bd68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Fifth Item',
    body: 'What games do you all play?',
  },
  {
    id: '20bd68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Sixth Item',
    body: 'What\'s Poppin? Brand new whip, just hopped in yuh',
  },
];

const Item = ({ item, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
    {/* <Text style={[styles.title, textColor]}>{item.title}</Text> */}
    <Text style={[styles.bodyText, textColor]}>{item.body}</Text>
  </TouchableOpacity>
);

const Welcome = ({navigation}) => {
  const [hidePassword, setHidePassword] = useState(true);

  const [agree, setAgree] = useState(false);

  const checkboxHandler = () => {
    setAgree(!agree);
  };
  const btnHandler = () => {
    alert('pog');
  };

  // const updateSearch = (search) => {
  //   setState({search});
  // };

  const [selectedId, setSelectedId] = useState(null);
  
  //renderItem function
  const renderItem = ({item}) => {
    const backgroundColor = item.id === selectedId ? '#FFCC15' : '#FFFFFF';
    const color = item.id === selectedId ? 'white' : 'black';

    return(
      <Item
        item={item}
        onPress={() => setSelectedId(item.id)}
        backgroundColor={{backgroundColor}}
        textColor={{color}}
      />
    );
  };
  

  return (
    
      <StyledFeedContainer>
        <StatusBar style="black" />
        <InnerContainer >
          {/* <PageLogo resizeMode = 'contain' source={require('./../assets/login.png')} />
           */}
          {/* <PageTitle>Feed</PageTitle> */}
            <Text style={styles.pageTitle}>Feed</Text>
            <SearchBar 
              placeholder="Search Tags"
              // onChangeText={this.updateSearch}
              lightTheme="true"
              containerStyle={{width: '90%', height: height * 0.07, alignItems: 'center', marginTop: height * 0.02, borderRadius: 100, backgroundColor:'#F2F2F2', }}
              inputContainerStyle={{borderRadius: 100, height: '100%', width: '100%', backgroundColor:'#F9F9F9'}}
            />

            <SubTitle style={{fontSize: 14, marginTop: 10}}>Need the various feed tabs here</SubTitle>
          


        </InnerContainer>
        <View style={{flex: 2.5, backgroundColor: '#EFEFEF', paddingTop: 2.5}}>
          <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={posts}
                    keyExtractor={(item) => item.id}
                    extraData={selectedId}
                    renderItem={renderItem}
          />

        </View>
        {/* <TouchableOpacity activeOpacity={0.5} 
          onPress={()=> Alert.alert("Create Post Button Clicked")} 
          style={styles.touchableStyle} 
        > */}
        <TouchableOpacity activeOpacity={0.5} 
          onPress={()=> navigation.navigate('Create Post')} 
          style={styles.touchableStyle} 
        >
          <Image source={require('./../assets/create_post_button.png')} 
          
                 style={styles.floatingButtonStyle} />
       
        </TouchableOpacity>
      </StyledFeedContainer>
    
  );
};

const {width, height} = Dimensions.get('screen');

const styles = StyleSheet.create({
  pageTitle: {
    fontSize: 40,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000',
  },
  item:{
    padding: 30,
    marginVertical: 2.5,
    //marginHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  bodyText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  touchableStyle:{
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
  }
});

export default Welcome;