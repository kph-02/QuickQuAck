import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Dimensions, StyleSheet, Text, FlatList, TouchableOpacity, Image, Alert, Touchable } from 'react-native';
//formik
import { Formik, Field, Form } from 'formik';
//search bar
import { SearchBar } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { serverIp } from '../screens/Login';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
//icons
import MultiSelect from 'react-native-multiple-select';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

import {
  StyledViewPostContainer,
  FeedViews,
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
  TextPostContent,
  PageTitleFlag,
} from './../components/styles';

import { Button, View } from 'react-native';
import Modal from 'react-native-modal';
//Store JWT for authentication
//Store JWT for authentication
var JWTtoken = '';

//colors
const { primary, yellow, background, lightgray, darkgray, black } = Colors;

//Limits the number of lines and characters that can be shown on each of the post previews on the feed.
const AdjustTextPreview = ({ style, text }) => {
  return (
    <Text style={style} numberOfLines={2}>
      {text.length <= 88 ? `${text}` : `${text.substring(0, 85)}...`}
    </Text>
  );
};

// Renders all tags associated with the post
const RenderStyledTags = ({ tags }) => {
  return tags.map(function (tag) {
    let tagcolor = '';

    if (tag === 'Muir') {
      tagcolor = '#7FD85F';
    } else if (tag === 'Marshall') {
      tagcolor = '#FA4A4A';
    } else if (tag === 'Seventh') {
      tagcolor = '#FA9E4A';
    } else if (tag === 'Poll') {
      tagcolor = '#AC5CEB';
    } else if (tag === 'Question') {
      tagcolor = '#FF8383';
    } else if (tag === 'Food') {
      tagcolor = '#9EE444';
    } else if (tag === 'Warren') {
      tagcolor = '#AA5F5F';
    } else if (tag === 'Revelle') {
      tagcolor = '#FEDB5F';
    } else if (tag === 'ERC') {
      tagcolor = '#2891F2';
    } else if (tag === 'Social') {
      tagcolor = '#97E1F9';
    } else if (tag === 'Sixth') {
      tagcolor = '#49D3FE';
    } else {
      tagcolor = 'gray';
    }
    return (
      <View
        key={tag}
        style={{
          paddingHorizontal: 15,
          borderRadius: 15,
          marginVertical: 10,
          marginRight: 10,
          paddingVertical: 2,
          backgroundColor: tagcolor,
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'normal' }}>{tag}</Text>
      </View>
    );
  });
};

//Generates each Post item for the Flatlist
const Item = ({ item, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
    {/* View for the text preview of each post as shown on the feed */}
    <View style={{ justifyContent: 'center', marginHorizontal: 30, paddingTop: 20 }}>
      <AdjustTextPreview style={[styles.bodyText, textColor]} text={item.post_text} />
    </View>
    {/* Tags Info Row */}
    <View style={[styles.tagsRow]}>
      <RenderStyledTags tags={item.tagarray} />
    </View>
    <View style={{ borderColor: '#F4F4F4', borderWidth: 1 }} />

    {/* The Data of each Post */}
    <View style={[styles.postTouchables]}>
      {/*Number of Upvotes*/}
      <View style={[styles.infoRow, { justifyContent: 'flex-start', marginRight: 5 }]}>
        <MaterialCommunityIcons
          name="chevron-up"
          color="#BDBDBD"
          size={34}
          style={{ alignItems: 'center', width: 29 }}
        />
        <Text style={[styles.commentText, { color: '#BDBDBD', marginHorizontal: 0 }]}>{item.num_upvotes}</Text>
      </View>
      {/*Number of Comments*/}
      <View style={[styles.infoRow]}>
        <MaterialCommunityIcons name="chat-outline" color="#BDBDBD" size={20} />
        <Text style={[styles.commentText, { color: '#BDBDBD', marginHorizontal: 5 }]}>{item.num_comments}</Text>
      </View>
      {/*Anonymous name of user*/}
      <View style={[styles.infoRow]}>
        <Text style={[styles.name, { color: '#BDBDBD', marginHorizontal: 0 }]}>{item.anon_name}</Text>
      </View>
      {/* Age of Post */}
      <View style={[styles.infoRow]}>
        <Text style={[styles.name, { color: '#BDBDBD', marginHorizontal: 0 }]}>{formatTime(item.post_age)}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

//format the time of the post from the database to display it to the screen
const formatTime = (post_age) => {
  let postAgeDisplay = '';

  //check if it exists b/c sometimes called before objects rendered so is undefined
  if (post_age) {
    if (post_age.hours) {
      postAgeDisplay += post_age.hours + 'h ';
    }
    if (post_age.minutes) {
      postAgeDisplay += post_age.minutes + 'm ';
    } else {
      postAgeDisplay += '1m ';
    }

    postAgeDisplay += 'ago';
  }

  return postAgeDisplay;
};

const TagModal = ({ navigation }) => {
  const [agree, setAgree] = useState(false);

  const checkboxHandler = () => {
    setAgree(!agree);
  };
  const btnHandler = () => {
    alert('pog');
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

  const [postData, setPostData] = useState([]); //Store post data from the Database
  const [selectedId, setSelectedId] = useState(null); //Currently selected post (will highlight yellow)
  const [refresh, setRefresh] = useState(false); //Handle refreshing logic
  const [update, setUpdate] = useState(false); //Changing will feed to update
  const [modalOpen, setModalOpen] = useState(true);
  const handleModal = () => {
    setModalOpen(!modalOpen);
  };
  const [inputs, setInputs] = useState({
    //Values needed to create post (../server/routes/feed.js)
    postTag: [] /*Initialize as first value in tags drop-down*/,
  });
  const { postTag } = inputs;

  useEffect(() => {
    setInputs({ ...inputs, postTag: selectedItems });
  }, [selectedItems]);

  useEffect(() => {
    sendToDB(inputs);
  }, [inputs]);

  var JWTtoken = '';

  //Stores values to update input fields from user

  //Update inputs when user enters new ones, name is identifier, value as a string (name='postText',value='')
  const onChange = (name, value) => {
    setInputs({ ...inputs, [name]: value });
    // console.log(inputs);
  };

  const onSelectedItemsChange = (selectedItems) => {
    setSelectedItems(selectedItems);
  };

  //renderItem function for each item passed through
  const renderItem = ({ item }) => {
    const backgroundColor = item.post_id === selectedId ? '#FFCC15' : '#FFFFFF';
    const color = item.post_id === selectedId ? 'white' : 'black';

    return (
      <Item
        //destructure the item
        item={item}
        //Functionality for when a post is pressed
        onPress={() => {
          setSelectedId(item.post_id);

          //navigate to post view page, sends through post information as parameter
          navigation.navigate('Post View', { post: item, votedBool: item.has_voted ? true : false });
        }}
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
      />
    );
  };

  //Extracting the posts from the Database

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

  const sendToDB = async (body) => {
    await getJWT(); //get Token
    console.log(body);

    try {
      // console.log('Sent Token:      ' + JWTtoken);
      // Send post info to DB
      const response = await fetch('http://' + serverIp + '/feed/tag-filter', {
        method: 'POST',
        headers: { token: JWTtoken, 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();
      setPostData(parseRes.data.post);
    } catch (error) {
      console.error(error.message);
    }
  };

  //useFocusEffect triggers works like useEffect, but only when this screen is focused
  // this lets us use navigation as the variable to track changes with, so feed updates
  // whenever the page is loaded
  useFocusEffect(
    React.useCallback(() => {
      console.log("User's Activity Feed Refreshed");
      setRefresh(false); //End refresh animation
      setSelectedId(null); //reset Selected Id
    }, [navigation, update]),
  );

  //Handle the logic for what to do when flatlist is refreshed
  const handleRefresh = () => {
    setRefresh(true); //update animation
    setUpdate(!update); //Change variable to trigger useEffect to pull posts from database
  };

  return (
    <GestureRecognizer
      style={{ flex: 1 }}
      // onSwipeUp={() => this.setModalVisible(true)}
      onSwipeDown={() => navigation.pop()}
    >
      <StyledViewPostContainer>
        <TouchableOpacity onPress={() => navigation.pop()} style={styles.touchableStyle}>
          <MaterialCommunityIcons
            name="close-thick"
            color={'#BDBDBD'}
            size={25}
            style={{ alignItems: 'center', right: 3, bottom: 2 }}
          />
        </TouchableOpacity>
        {/* <Image source={require('./../assets/map.png')} style={styles.mapIcon} /> */}
        <StatusBar style="black" />
        {/* Header Content */}
        <View style={styles.headerContainer}>
          <Text style={styles.headline}>Filter Tags</Text>
        </View>
        <View style={styles.headerContainer}>
          <MultiSelect
            styleTextDropdown={{ textAlign: 'left', marginLeft: width * 0.05 }}
            styleTextDropdownSelected={{ textAlign: 'left', marginLeft: width * 0.05 }}
            single
            hideTags={true}
            items={items}
            uniqueKey="name"
            // onSelectedItemsChange={(selectedItems) => onChange('postTag', selectedItems)} //update inputs to match user input
            // onSelectedItemsChange={console.log(postTag)}
            selectedItems={selectedItems}
            onSelectedItemsChange={onSelectedItemsChange}
            //   onAddItem={onSelectedItemsChange}
            selectedItemIconColor={yellow}
            selectedItemTextColor={black}
            tagBorderColor={yellow}
            tagTextColor={black}
            textInputProps={{ editable: false }}
            searchInputPlaceholderText="Select a Tag"
            searchIcon={false}
            fixedHeight={false}
            selectText="Select a Tag"
            //   onSubmit={onSelectedItemsChange}
          ></MultiSelect>
        </View>

        {/* <TouchableOpacity
          style={{ marginLeft: 25, paddingHorizontal: 5, marginTop: 80, position: 'absolute' }}
          onPress={() => navigation.pop()}
        >
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#FFCC15' }}>Back</Text>
        </TouchableOpacity> */}
        {/* FlatList of User's Posts */}
        <View style={{ backgroundColor: '#EFEFEF', paddingTop: 2.5 }}>
          <FlatList
            numColumns={1}
            horizontal={false}
            data={postData} /*postData to display*/
            keyExtractor={(item) => item.post_id}
            extraData={selectedId}
            renderItem={renderItem}
            refreshing={refresh} //true: shows spinning animation to show loading
            onRefresh={handleRefresh} //When user refreshes by pulling down, what to do
          />
        </View>
      </StyledViewPostContainer>
    </GestureRecognizer>
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
    paddingHorizontal: 0,
    marginVertical: 2.5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bodyText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  name: {
    fontSize: height * 0.02,
    fontWeight: '600',
    color: '#BDBDBD',
  },
  commentText: {
    fontSize: height * 0.02,
    fontWeight: '600',
    color: '#000',
    marginHorizontal: 20,
  },
  postTouchables: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderTopColor: '#EFEFEF',
    marginTop: 0,
    marginHorizontal: 30,
  },
  tagsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
    marginTop: 5,
    marginHorizontal: 30,
  },
  infoRow: {
    flexDirection: 'row',
    //alignContent: 'space-around',
    alignItems: 'center',
    justifyContent: 'center',
    // marginRight: 15,
  },
  headline: {
    textAlign: 'center',
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 0,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    justifyContent: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },

  touchableStyle: {
    position: 'absolute',
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    left: 20,
    top: 40,
    zIndex: 2,
  },
  floatingButtonStyle: {
    resizeMode: 'contain',
    width: width * 0.18,
    height: width * 0.18,
  },
});

export default TagModal;
