import React, { useState, Component, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
//Testing purposes, change serverIP in login.js to your local IPV4 address
import { serverIp } from './Login.js';
import Poll from '../components/Poll.js';
//icons

import { Octicons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Menu, MenuOptions, MenuOption, MenuTrigger, renderers } from 'react-native-popup-menu';
import {
  StyledViewPostContainer,
  RightIcon,
  Colors,
  TextLink,
  StyledPostInput,
  TextPostContent,
  PageTitleFlag,
  StyledViewPostScrollView,
  Line,
} from './../components/styles';
import { Button, View, Image, Modal, StyleSheet, TouchableOpacity, Text, TextInput, Dimensions, Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MultiSelect from 'react-native-multiple-select';
import Map from '../screens/Map';
//colors
const { primary, yellow, background, lightgray, darkgray, black } = Colors;

const CreatePoll = ({ route, navigation }) => {
  // Use State hooks
  const [composePost, setComposePost] = useState(false);
  const [agree, setAgree] = useState(false);
  const [selectedValue, setSelectedValue] = useState(true);
  const [modalOpen, setModalOpen] = useState(true);
  const { postType } = route.params;
  //Getting user input
  const [option, setOption] = useState('');
  const [inputs, setInputs] = useState({
    //Values needed to create poll (../server/routes/feed.js)
    pollQuestion: '',
    pollOptions: [],
    pollTag: [],
    num_comments: 0,
    num_upvotes: 0,
  });
 

  var JWTtoken = '';

  //Stores values to update input fields from user
  const { pollQuestion, pollOptions, pollTag } = inputs;

  //Update inputs when user enters new ones, name is identifier, value as a string (name='postText',value='')
  const onChangeInputs = (name, value) => {
    setInputs({ ...inputs, [name]: value });

    // console.log(inputs);
  };

  //Update option when user enters new option, value is text input
  const onChange = (value) => {
    setOption(value);
    // console.log(option);
  };

  //handles the '+' button press, adds option to poll
  const handleAddButtonPress = async (e) => {
    if(option){
      var options = inputs.pollOptions;
    //   console.log("This is options:");
    //   console.log(options);
      options.push(option);
    //   console.log("This is options after push:");
    //   console.log(options);
      setInputs({...inputs, pollOptions: options});
    //   console.log("This is inputs:");
    //   console.log(inputs);
      setOption('');
    }
  };

  const handleMinusButtonPress = async (index) => {
    var options = inputs.pollOptions;
    if (index > -1 && options.length > 0) {
      options.splice(index, 1);
      setInputs({...inputs, pollOptions: options});
    }
    else{
      alert('Nothing to delete!!!');
    }
  }

  //Executes when Post is pressed, sends post information to the database
  const onPressButton = async (e) => {
    e.preventDefault(); //prevent refresh
    //Check if the post has content, if not, prevent submission and notify
    if (inputs.pollQuestion && inputs.pollOptions.length != 0 && inputs.pollTag.length != 0) {
      sendToDB(postType.post_type, inputs);

      if (postType.post_type === 'Update') {
        navigation.navigate('TabNav', { Screen: 'Feed' });
        alert('Post Updated!');
      } else {
        navigation.pop();
        if (postType.post_type === 'Poll') {
          alert('Poll Created');
        } else {
          alert('Poll not created, poll not setup yet');
        }
      }
    } else {
      alert('Can not submit a post without content or tags!');
    }
  };

  //Getting JWT from local storage, must exist otherwise user can't be on this page
  const getJWT = async () => {
    try {
      await AsyncStorage.getItem('token').then((token) => {
        // console.log('Retrieved Token: ' + token);
        JWTtoken = token;
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  //Send post information created by user to the database
  const sendToDB = async (type, body) => {
    await getJWT(); //get Token

    if (type === 'Poll') {
      try {
        // console.log('Sent Token:      ' + JWTtoken);
        // Send post info to DB
        const response = await fetch('http://' + serverIp + '/feed/create-poll', {
          method: 'POST',
          headers: { token: JWTtoken, 'content-type': 'application/json' },
          body: JSON.stringify(body),
        });

        const parseRes = await response.json();
        // console.log(postTag);
        console.log(parseRes);
      } catch (error) {
        console.error(error.message);
      }
    }
  };

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

  const onSelectedItemsChange = (selectedItems) => {
    // Set Selected Items
    if (selectedItems.length > 3) {
      return;
    }
    setSelectedItems(selectedItems);
    setInputs({ ...inputs, pollTag: selectedItems });
  };

  useEffect(() => {
    if (postType.post_type === 'Update') {
      onChangeInputs('pollQuestion', postType.post_text);
    }
  }, []);


  return (
    <Modal
      transparent={true}
      statusBarTranslucent={false}
      visible={modalOpen}
      animationType="slide"
      onRequestClose={() => navigation.pop()}
    >
      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
        accessible={false}
      >
        <StyledViewPostContainer>
          <StatusBar style="black" />

          {/* Back Button */}
          <TextLink
            onPress={() => navigation.pop()}
            style={{marginLeft: 10, width: 55, paddingHorizontal: 5, bottom: 20 }}
          >
            <TextPostContent>Back</TextPostContent>
          </TextLink>

          {/* Page Title with the Post/Update button across from it */}
          <View
            style={{
              flexDirection: 'row',
              marginTop: 35,
              width: '100%',
              justifyContent: 'space-between',
              paddingBottom: 20,
            }}
          >
            <PageTitleFlag style={{ marginLeft: 15, fontSize: 22 }}>
              {postType.post_type === 'Update' ? 'Update Post' : 'New Poll'}
            </PageTitleFlag>
            <TouchableOpacity onPress={onPressButton} style={{ marginRight: 15 }}>
              <TextPostContent>{postType.post_type === 'Update' ? 'Update' : 'Post'}</TextPostContent>
            </TouchableOpacity>
          </View>
         
          {/* Section/Container for Anonymous Username */}
          <View
            style={{
              backgroundColor: 'white',
              paddingVertical: 10,
              // paddingTop: 10,
              borderTopColor: '#DADADA',
              borderTopWidth: 1,
              paddingHorizontal: 15,
            }}
          >
            <MultiSelect
              hideSubmitButton
              items={items}
              uniqueKey="name"
              selectedItems={selectedItems}
              onSelectedItemsChange={onSelectedItemsChange}
              // onToggleList = {console.log(moo)}
              selectedItemIconColor={yellow}
              selectedItemTextColor={black}
              tagBorderColor={yellow}
              tagTextColor={black}
              textInputProps={{ editable: false }}
              searchInputPlaceholderText=""
              searchIcon={false}
              styleListContainer={{height: height * 0.22}}
            />
          </View>
          
          {/* Section/Container for Text input for the Post */}
          <View
            style={{
              // alignItems: 'stretch',
              backgroundColor: 'white',
            //   paddingBottom: height * 0.15,
              borderTopColor: '#DADADA',
              // borderTopWidth: 1,
            }}
          >
            <TextInput
              placeholder={postType.post_type === 'Text' ? 'Post Text' : 'Poll Title'}
              name="pollQuestion"
              style={styles.input}
              placeholderTextColor={darkgray}
              onChangeText={(e) => onChangeInputs('pollQuestion', e)} //update inputs to match user input
              value={pollQuestion}
              selectionColor="#FFCC15" //implement a max length
              maxLength={100}
              multiline
            />
            <Line style={{backgroundColor: '#DADADA',}}/>
            <View style={styles.optionContainer}>
                <TextInput 
                  name="option"
                  style={[styles.input, {width: '85%', borderRightColor: 'white'}]} 
                  placeholder="Enter Poll Option" 
                  placeholderTextColor={darkgray} 
                  value={option}
                  onChangeText={(e) => onChange(e)}
                />
                <TouchableOpacity onPress={handleAddButtonPress} style={styles.addOption}>
                    <MaterialCommunityIcons name="plus-circle" color={yellow} size={30} />
                </TouchableOpacity>
            </View>
          </View>
          <Line style={{backgroundColor: '#DADADA',}}/>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            style={{backgroundColor: '#EFEFEF'}}
          >
            {inputs.pollOptions.map((options, index) => (
                <View style={[styles.pollChoiceContainer]} key={index}>
                  <View style={styles.pollChoice} key={index}>
                    <Text style={{marginLeft: 15}}>{options}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleMinusButtonPress(index)} style={[styles.addOption]}>
                    <MaterialCommunityIcons name="minus-circle" color="red" size={30} />
                  </TouchableOpacity>
                </View>
            ))}
          </ScrollView>
        </StyledViewPostContainer>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, ...props }) => {
  return (
    <View>
      {/* <StyledInputLabel> {label} </StyledInputLabel> */}
      <StyledPostInput
        {...props}
        style={{ maxHeight: 150, padding: 0, marginVertical: 0, borderRadius: 0, marginBottom: 0 }}
      />
      {isPassword && (
        <RightIcon
          onPress={() => {
            setHidePassword(!hidePassword);
          }}
        >
          <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} color={darkgray} />
        </RightIcon>
      )}
    </View>
  );
};

//#BDBDBD
export default CreatePoll;

const { width, height } = Dimensions.get('screen');

const styles = StyleSheet.create({
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  divider: {
    width: '120%',
    borderColor:'#DEE2E6',
    borderTopWidth: 1,
    marginVertical: 1
  },
  other: { 
    paddingVertical: 20, 
    borderWidth: 0, 
    borderColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    // margin: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#DADADA',
  },
  optionContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center'
  },
  addOption: {
      alignItems: 'center',
      width: '15%',
  },
  pollChoiceContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#DADADA',
    backgroundColor: 'white'
  },
  pollChoice: {
    width: '85%', 
    //backgroundColor: 'yellow', 
    justifyContent: 'center', 
    paddingVertical: 15,
    borderRightWidth: 1,
    borderRightColor: '#DADADA',
  }
});