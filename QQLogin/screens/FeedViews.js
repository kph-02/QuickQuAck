import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, StatusBar, Text, TouchableOpacity, FlatList, ScrollView, Animated } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

//Used for local storage to store JWTtoken
import AsyncStorage from '@react-native-async-storage/async-storage';

//Used to communicate with server
import { serverIp } from './Login.js';
import PollFeed from './PollFeed.js';

var JWTtoken = ''; //Store JWT for authentication

var onScr = null;

var scrET = null;

var animatedOffset = null;

const allposts = [
  {
    post_id: '38bd68afc-c605-48d3-a4f8-fbd91aa97f63',
    user_id: 'Pink Seahorse',
    likes: '16',
    post_text: 'What games do you all play?',
  },
  {
    post_id: '20bd68afc-c605-48d3-a4f8-fbd91aa97f63',
    user_id: 'Yellow Squirrel',
    likes: '25',
    post_text: 'Test post lol',
  },
];

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
          marginLeft: 10,
          paddingVertical: 2,
          backgroundColor: tagcolor,
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'normal' }}>{tag}</Text>
      </View>
    );
  });
};

// Generates each of the Post previews on the Feed views
const Item = ({ item, onPress, backgroundColor, textColor }) => {
  return(
  <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
    {/* View for the text preview of each post as shown on the feed */}
    <View style={{ justifyContent: 'center', marginLeft: 25, marginRight: 25 }}>
      <AdjustTextPreview style={[styles.bodyText, textColor]} text={item.post_text} />
    </View>
    {/* Tags Info Row */}
    <View
      style={[
        styles.postTouchables,
        {
          justifyContent: 'flex-start',
          borderTopWidth: 0,
          borderTopColor: 'white',
          marginBottom: 10,
          marginTop: 5,
          marginLeft: 15,
        },
      ]}
    >
      <RenderStyledTags tags={item.tagarray} />
    </View>

    {/* The Data of each Post */}
    <View style={[styles.postTouchables, {justifyContent:'space-between', marginLeft: 20, marginRight: 25, marginTop: 0,}]}>
      
      {/*Number of Upvotes*/}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <MaterialCommunityIcons name="chevron-up" color="#BDBDBD" size={35} style={{ width: 29, }} />
        <Text style={[styles.commentText, { color: '#BDBDBD', marginHorizontal: 5 }]}>{item.num_upvotes}</Text>
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
      <View>
        <Text style={[styles.name, { color: '#BDBDBD', marginHorizontal: 0 }]}>{formatTime(item.post_age)}</Text>
      </View>
    </View>
  </TouchableOpacity>
  );
};

//format the time of the post from the database to display it to the screen
const formatTime = (post_age) => {
  let postAgeDisplay = '';

  //check if it exists b/c sometimes called before objects rendered so is undefined
  if (post_age) {
    if (post_age.hours) {
      postAgeDisplay += post_age.hours + 'h ';
    } else if (post_age.minutes) {
      postAgeDisplay += post_age.minutes + 'm ';
    } else {
      postAgeDisplay += '1m ';
    }

    postAgeDisplay += 'ago';
  }

  return postAgeDisplay;
};

// HOME feed (home posts)
const FirstRoute = ({scrollEventThrottle, onScroll}) => {
  //useStates can only be defined within functions
  const [postData, setPostData] = useState([]); //Store post data from the Database
  const [selectedId, setSelectedId] = useState(null); //Currently selected post (will highlight yellow)
  const [refresh, setRefresh] = useState(false); //Handle refreshing logic
  const [update, setUpdate] = useState(false); //Changing will feed to update

  const navigation = useNavigation();

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
      const response = await fetch('http://' + serverIp + '/feed/home-feed', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', token: JWTtoken },
      });

      //The response includes post information, need in json format
      const parseRes = await response.json();
      // console.log(parseRes);
      // console.log(parseRes.data.post[0].tagarray);
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
      console.log('All Feed Refreshed');
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
    // <StyledFeedContainer>
    //     <StatusBar style="black" />
    //     <InnerContainer/>
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
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
      />
    </View>
    // </StyledFeedContainer>
  );
};

// ALL feed (all posts)
const SecondRoute = ({scrollEventThrottle, onScroll}) => {
  const [allData, setAllData] = useState([]); //Store post data from the Database
  const [selectedId, setSelectedId] = useState(null); //Currently selected post (will highlight yellow)
  const [refresh, setRefresh] = useState(false); //Handle refreshing logic
  const [update, setUpdate] = useState(false); //Changing will feed to update
  const navigation = useNavigation();

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
          navigation.navigate('Post View', { post: item, votedBool: item.has_voted ? true : false});
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
    let post;
    await getJWT(); //gets JWTtoken from local storage and stores in JWTtoken

    try {
      // Gets all of the post information from the database for the feed
      const response = await fetch('http://' + serverIp + '/feed/all-posts', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', token: JWTtoken },
      });

      //The response includes post information, need in json format
      const parseRes = await response.json();

      /*
       *"post":[
       * {"post_id":,
       * "user_id":,
       * "post_text":,
       * "num_comments":,
       * "num_upvotes":,
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
      post = parseRes.data.post;
      // console.log(post);
    } catch (error) {
      console.error(error.message);
    }
    setAllData(post);
  };

  //useFocusEffect triggers works like useEffect, but only when this screen is focused
  // this lets us use navigation as the variable to track changes with, so feed updates
  // whenever the page is loaded
  useFocusEffect(
    React.useCallback(() => {
      console.log('Home Feed Refreshed');
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
    // <StyledFeedContainer style={{backgroundColor: 'pink'}}>
    //     <StatusBar style="black" />
    //     <InnerContainer/>
    <View style={{ backgroundColor: '#EFEFEF', paddingTop: 2.5 }}>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={allData}
        keyExtractor={(item) => item.post_id}
        extraData={selectedId}
        renderItem={renderItem}
        refreshing={refresh} //true: shows spinning animation to show loading
        onRefresh={handleRefresh} //When user refreshes by pulling down, what to do
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
      />
    </View>
    // </StyledFeedContainer>
  );
};

const initialLayout = { width: Dimensions.get('window').width };

// const renderScene = SceneMap({
//   home: FirstRoute,
//   all: SecondRoute,
// });

const renderScene = ({ route }) => {
  switch(route.key) {
    case 'home':
      return <FirstRoute scrollEventThrottle={scrET} onScroll={onScr}/>;
    case 'all':
      return <SecondRoute scrollEventThrottle={scrET} onScroll={onScr}/>;
    // case 'poll':
    //   return <PollFeed scrollEventThrottle={scrET} onScroll={onScr}/>;  
    default:
      return null;
  }
}

const renderTabBar = (props) => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: '#FFCC15' }}
    activeColor={'#FFCC15'}
    inactiveColor={'#BDBDBD'}
    style={{ backgroundColor: 'white' }}
  />
);

export default function FeedViews({ navigation, scrollEventThrottle, onScroll, offset }) {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'home', title: 'Home' },
    { key: 'all', title: 'All' },
    // { key: 'poll', title: 'Polls'}
  ]);
  onScr = onScroll;
  scrET = scrollEventThrottle;
  animatedOffset = offset;

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      style={styles.container}
    />
  );
}

const { width, height } = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    flex: 4,
    justifyContent: 'flex-start',
  },
  pageTitle: {
    fontSize: 40,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000',
  },
  item: {
    // padding: 30,
    paddingTop: 30,
    // paddingHorizontal: 30,
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
    // flex: 0.4,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 10,
    borderTopColor: '#EFEFEF',
  },
  infoRow: {
    flexDirection: 'row',
    //alignContent: 'space-around',
    alignItems: 'center',
    // marginRight: 10,
  },
});
