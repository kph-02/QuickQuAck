import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Dimensions, StyleSheet, Text, FlatList, TouchableOpacity, Image, Alert, View } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyledFeedContainer, InnerContainer, Colors } from './../components/styles';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

//Used for local storage to store JWTtoken
import AsyncStorage from '@react-native-async-storage/async-storage';

//Used to communicate with server
import { serverIp } from './Login.js';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import PostMenu from '../components/PostMenu';

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

const UserActivity = ({ navigation }) => {
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

  const onSelectedItemsChange = (selectedItems) => {
    // Set Selected Items
    // if (selectedItems.length > 3) {return}
    setSelectedItems(selectedItems);
    setInputs({ ...inputs, postTag: selectedItems });
  };

  const [selectedItems, setSelectedItems] = useState([]);
  const [postData, setPostData] = useState([]); //Store post data from the Database
  const [selectedId, setSelectedId] = useState(null); //Currently selected post (will highlight yellow)
  const [refresh, setRefresh] = useState(false); //Handle refreshing logic
  const [update, setUpdate] = useState(false); //Changing will feed to update

  //   const navigation = useNavigation();

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

  //Communicating with the database to get all the posts
  const getFromDB = async () => {
    await getJWT(); //gets JWTtoken from local storage and stores in JWTtoken

    try {
      // Gets all of the post information from the database for the feed
      const response = await fetch('http://' + serverIp + '/feed/user-posts', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', token: JWTtoken },
      });

      //The response includes post information, need in json format
      const parseRes = await response.json();
      // console.log("This is in USERACTIVITY");
      // console.log(parseRes);
      /*
       *"post":[
       * {"post_id":,
       * "user_id":,
       * "post_text":,
       * "num_comments":,
       * "num_upvotes"
       * "time_posted":
       *
       * "anon_name:""
       *
       * "post_age":[
       * hours:
       * minutes:
       * seconds:
       * milliseconds
       * ]
       * */
      
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
      getFromDB();
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
    // Note: marginBottom for StyledFeedContainer is to offset createMaterialBottomTabNavigator,
    // need to obtain height of this.
    <StyledFeedContainer>
      <StatusBar style="black" />
      {/* Header Content */}
      <View style={styles.headerContainer}>
          <Text style={styles.headline}>My Activity</Text>
      </View>
      <View style={{flex: 4, backgroundColor: '#EFEFEF',  paddingTop: 2.5}}>
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
    </StyledFeedContainer>
    
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
    bottom: 8,
  },
  headerContainer:{
    justifyContent: 'center', 
    paddingBottom: 20, 
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
});

export default UserActivity;
