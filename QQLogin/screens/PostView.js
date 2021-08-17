import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import {
  Dimensions,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  Touchable,
  KeyboardAvoidingView,
} from 'react-native';
import { MaterialCommunityIcons, EvilIcons } from '@expo/vector-icons';

//Testing purposes, change serverIP in login.js to your local IPV4 address
import { serverIp } from './Login.js';

//Store Authentication Token
var JWTtoken = '';
var userId = '';
//formik
import { Formik, Field, Form } from 'formik';

//icons

import { Octicons, Ionicons, Fontisto } from '@expo/vector-icons';

import {
  StyledViewPostContainer,
  StyledPostContainer,
  PostSectionContainer,
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

import { Button, View, TextInput } from 'react-native';
import KeyboardAvoidingWrapper from '../components/KBWrapper';
import ListItemSwipeable from 'react-native-elements/dist/list/ListItemSwipeable';

import EllipsisMenu from '../components/EllipsisMenu.js';

//colors
const { primary, yellow, background, lightgray, darkgray, black } = Colors;

/* Hardcoded comments */
const commentExamples = [
  {
    comment_id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    user_id: 'Green Turtle',
    text: 'David Guetta is playing songs from his new album!',
    likes: '10',
    time: '1hr',
  },
  {
    comment_id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    user_id: 'Purple Armadillo',
    text: 'I heard Mr. Worldwide is after this act...',
    likes: '7',
    time: '30m',
  },
  {
    comment_id: '20bd68afc-c605-48d3-a4f8-fbd91aa97f63',
    user_id: 'Yellow Orangutan',
    text: 'This song is pretty good, what is it?',
    likes: '2',
    time: '22m',
  },
  {
    comment_id: '58694a0f-3da1-471f-bd96-145571e29d72',
    user_id: 'Blue Donkey',
    text: "I think this is 'Low' by Flo Rida",
    likes: '0',
    time: '15m',
  },
  {
    comment_id: '38bd68afc-c605-48d3-a4f8-fbd91aa97f63',
    user_id: 'Red Zebra',
    text: "Blue Donkey must be trolling, this is 'Party Rock Anthem' by LMFAO",
    likes: '5',
    time: '13m',
  },
];

//passing through route allows us to take in input from feedviews.js
const PostView = ({ route, navigation }) => {
  //Get input from feedViews.js into post by calling on route.params
  const { post } = route.params; //post data
  const [comments, SetComments] = useState([]); //stores all comments for the post
  const [newComments, refreshNewComments] = useState(false); //determines when to get new comments from db

  //handling post upvotes
  const [upvoted, setUpvoted] = useState();
  const [upvotes, setUpvotes] = useState(post.num_upvotes);

  //handle comment upvotes
  const [commentsUpvoted, setCommentsUpvoted] = useState([]);
  const [refreshComments, setRefreshComments] = useState(false);

  //Mapping array , takes comment_id and returns the index its stored in for commentsUpvoted and commentUpvotes
  //This is done so when passed to db, can just iterate array w/o empty values, makes 100000x easier
  const [mapComments, setMapComments] = useState([]);
  const [currIndex, setCurrIndex] = useState(0); //current index to map to

  /* Definition of Item object, controls what text goes in the comments, and all the content for each comment "box" */
  const Item = ({ item, onPress, backgroundColor, textColor }) => {
    const navigation = useNavigation();
    return (
      <View style={[styles.item, backgroundColor]}>
        <View
          style={{
            marginLeft: 20,
            marginBottom: 8,
            flexDirection: 'row',
            width: '94%',
            justifyContent: 'space-between',
          }}
        >
          {/* (Anonymous) name of the commenter */}
          <Text style={[styles.name]}>{item.user_id}</Text>

          {/* The ... button for each comment */}
          <View>
            <EllipsisMenu navigation={navigation} />
          </View>
        </View>

        {/* The text for the comment */}
        <Text style={[styles.commentText, textColor]}>{item.text}</Text>

        {/* The row of when the comment was posted, along with the number of upvotes */}
        <View
          style={{
            flexDirection: 'row',
            marginTop: 10,
            alignItems: 'center',
            marginLeft: 20,
            alignContent: 'space-around',
          }}
        >
          {/* Time posted */}
          <Text style={[styles.name]}>{item.time_posted} ago</Text>

          {/* Upvotes */}
          <TouchableOpacity
            title="Upvote"
            onPress={() => handleCommentUpvote(item.comment_id)}
            style={{ marginLeft: 10, flexDirection: 'row', alignItems: 'center' }}
          >
            <MaterialCommunityIcons
              name="chevron-up"
              color="#BDBDBD"
              size={35}
              style={{
                width: 29,
                // Very messy -> first check if comment was mapped, if was then check if comment was upvoted
                color: commentsUpvoted[mapComments[item.comment_id]]
                  ? commentsUpvoted[mapComments[item.comment_id]].vote_value
                    ? '#FFCC15'
                    : '#BDBDBD'
                  : '#BDBDBD',
              }}
            />
            <Text style={[styles.name, { marginHorizontal: 0 }]}>
              {commentsUpvoted[mapComments[item.comment_id]].votes
                ? commentsUpvoted[mapComments[item.comment_id]].votes
                : 0}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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

  const getJWT = async () => {
    try {
      await AsyncStorage.getItem('token').then((token) => {
        //console.log('Retrieved Token: ' + token);
        JWTtoken = token;
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  const getUserID = async () => {
    try {
      await AsyncStorage.getItem('user_id').then((user_id) => {
        //console.log('Retrieved Token: ' + token);
        userId = user_id;
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  /*Send information to the DB
    operation: What operation is being done: 
      comment: creating a comment
      update: updating the post
      delete: deleting the post
    body: information to send to the DB
  */
  const sendToDB = async (operation, body) => {
    //Create a comment on the post
    if (operation === 'comment') {
      try {
        const response = await fetch('http://' + serverIp + ':5000/feed/create-comment', {
          method: 'POST',
          headers: { token: JWTtoken, 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        const parseRes = await response.json();

        // console.log('COMMENT: ' + JSON.stringify(parseRes));

        let index = currIndex;
        let map = mapComments;
        let upvote = commentsUpvoted;

        //comment was added successfully, add to map array
        if (!(parseRes.comment_id === undefined)) {
          map[parseRes.comment_id] = index;
          upvote[map[parseRes.comment_id]] = { comment_id: parseRes.comment_id, vote_value: 1, votes: 1 };
          index++;
        }

        setCurrIndex(index);
        setMapComments(map);
        setCommentsUpvoted(upvote);

        refreshNewComments(!newComments); //update the page with the new comment
      } catch (error) {
        console.error(error.message);
      }
    }

    //Update the current post
    if (operation === 'update') {
      try {
        const response = await fetch('http://' + serverIp + ':5000/feed/update-post', {
          method: 'PUT',
          headers: { token: JWTtoken, 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        const parseRes = await response.json();

        // console.log('UPDATE: ' + JSON.stringify(parseRes));

        //NEED TO UPDATE CURRENT VIEW
      } catch (error) {
        console.error(error.message);
      }
    }

    //Delete the current post
    if (operation === 'delete') {
      try {
        const response = await fetch('http://' + serverIp + ':5000/feed/delete-post', {
          method: 'DELETE',
          headers: { token: JWTtoken, 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        const parseRes = await response.json();

        // console.log('DELETE: ' + JSON.stringify(parseRes));

        navigation.navigate('Feed');
      } catch (error) {
        console.error(error.message);
      }
    }
  };

  /* Controls the size of the font in the original post, so that it fits in the View */
  const AdjustLabel = ({ fontSize, text, style, numberOfLines }) => {
    const [currentFont, setCurrentFont] = useState(fontSize);

    return (
      <Text
        numberOfLines={numberOfLines}
        adjustsFontSizeToFit
        style={[style, { fontSize: currentFont }]}
        onTextLayout={(e) => {
          const { lines } = e.nativeEvent;
          if (lines.length > numberOfLines) {
            setCurrentFont(currentFont - 1);
          }
        }}
      >
        {text}
      </Text>
    );
  };

  /* Controls what color each tag is */
  const StyledTag = ({ style, tag }) => {
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
      tagcolor = '#FFCC15';
    }
    return (
      <View style={[style, { backgroundColor: tagcolor }]}>
        <Text style={{ color: 'white', fontWeight: 'normal' }}>{tag}</Text>
      </View>
    );
  };

  //Getting comments from the database to show for post
  const getFromDB = async () => {
    const query = 'post_id=' + post.post_id; //sets up query information
    try {
      // Update server with user's registration information
      const response = await fetch('http://' + serverIp + ':5000/feed/post-comments?' + query, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', token: JWTtoken },
      });

      //The response includes post information, need in json format
      const parseRes = await response.json();

      //Copy useState parameters b/c shouldn't call useState in if statements
      let map = mapComments;
      let index = currIndex;
      let upvote = commentsUpvoted;
      let comments = [];

      //Updates postData to have post information using useState
      if (parseRes.data) {
        comments = parseRes.data.comment;
        //iterate through the comments to update upvotes array
        for (const comment of comments) {
          console.log(comment);
          //comments hasn't been mapped yet, so map it.
          if (map[comment.comment_id] === undefined) {
            map[comment.comment_id] = index;
            index++;
          }
          //update upvoted table
          upvote[map[comment.comment_id]] = {
            comment_id: comment.comment_id,
            vote_value: comment.vote_value, //this is wrong, need way to get all comments from this user on this post
            votes: comment.num_upvotes,
          };
        }
      }

      SetComments(comments);
      setCommentsUpvoted(upvote);
      setCurrIndex(index);
      setMapComments(map);
    } catch (error) {
      console.error(error.message);
    }
  };

  //Get from database whether user has upvoted this post/comments before or not
  const getUpvoted = async () => {
    //posts
    let initialVote = false;

    try {
      const query = 'post_id=' + post.post_id + '&user_id=' + userId;

      // Update server with user's registration information
      const response = await fetch('http://' + serverIp + ':5000/feed/post-votes?' + query, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', token: JWTtoken },
      });

      //The response includes post information, need in json format
      const parseRes = await response.json();

      //Vote values will be returned in an array, but we just want the first object here
      if (parseRes[0]) {
        if (parseRes[0].vote_value == 1) {
          initialVote = true;
        }
      }

      // console.log(userId);
      // console.log(post.post_id);
      // console.log(parseRes);
      // console.log(initialVote);

      setUpvoted(initialVote);
    } catch (error) {
      console.error(error.message);
    }

    //Comments
    try {
      const query = 'post_id=' + post.post_id + '&user_id=' + userId;

      // Update server with user's registration information
      const response = await fetch('http://' + serverIp + ':5000/feed/comment-votes?' + query, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', token: JWTtoken },
      });

      //The response includes post information, need in json format
      const parseRes = await response.json();

      // console.log('Initial Comments: ' + JSON.stringify(parseRes));

      // store initial values to update useState
      let upvote = commentsUpvoted;
      let index = currIndex;
      let mapIndex = mapComments;

      if (parseRes === []) {
        console.log('No Comments!');
      } else {
        //Populate upvoted table with initial values from database
        for (const comment of parseRes) {
          //check if commment index is not mapped and map it
          if (mapIndex[comment.comment_id] === undefined) {
            mapIndex[comment.comment_id] = index; //Add comment_id to mapping array

            index++;
          }
        }
      }

      //Update hooks
      setCommentsUpvoted(upvote);
      setCurrIndex(index);
      setMapComments(mapIndex);
    } catch (error) {
      console.error(error.message);
    }
  };

  //Triggered everytime a new comment is submitted, gets comment from DB to display it
  useEffect(() => {
    getFromDB();
    console.log('Comments Refreshed');
    setRefreshComments(!refreshComments); //refresh flatlist
  }, [newComments]);

  //triggers on first load
  useEffect(() => {
    async function fetchAuthorizations() {
      getUserID();
      await getJWT();
      await getUpvoted(); //get upvoted values for posts/comments
    }

    fetchAuthorizations();
  }, []);

  /* Controls the look of each "item", or comment in this context */
  const renderItem = ({ item }) => {
    const backgroundColor = '#FFFFFF';
    const color = 'black';
    return <Item item={item} backgroundColor={{ backgroundColor }} textColor={{ color }} />;
  };

  //Updates database with whether this user upvoted post or not
  const updatePostValue = async (body) => {
    try {
      const response = await fetch('http://' + serverIp + ':5000/feed/post-vote', {
        method: 'POST',
        headers: { token: JWTtoken, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();

      // console.log('Update Upvotes: ' + JSON.stringify(parseRes));
    } catch (error) {
      console.error(error.message);
    }
  };

  //Update the attributes of the post such as the number of comments and upvotes
  const updatePostAttributes = () => {
    const body = {
      post_id: post.post_id,
      num_comments: comments.length,
      num_upvotes: upvotes,
    };

    sendToDB('update', body);

    //Update whether the use upvoted in the database
    const bodyUpvotes = {
      user_id: userId,
      post_id: post.post_id,
      vote_value: upvoted ? 1 : 0,
    };
    updatePostValue(bodyUpvotes);

    //Comments that were changed by the user, to change in the database
    const bodyCommentUpvotes = {
      user_id: userId,
      post_id: post.post_id,
      comments: commentsUpvoted,
    };
    updateCommentValues(bodyCommentUpvotes);
  };

  //updating the database with whether the user upvoted the comment or not
  const updateCommentValues = async (body) => {
    try {
      const response = await fetch('http://' + serverIp + ':5000/feed/comment-vote', {
        method: 'POST',
        headers: { token: JWTtoken, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();

      // console.log('Update Comment Upvotes: ' + JSON.stringify(parseRes));
    } catch (error) {
      console.error(error.message);
    }
  };

  //When user clicks on icon to update post
  const updatePost = () => {
    const postType = {
      post_type: 'Update',
      post_text: post.post_text,
      post_id: post.post_id,
    };
    navigation.navigate('Create Post', { postType });
    updatePostAttributes();
  };

  //When user clicks on icon to delete post
  const deletePost = () => {
    Alert.alert('Delete Post?', 'Would you like to delete this post?', [
      //Delete post from DB
      {
        text: 'Yes',
        onPress: () => {
          sendToDB('delete', { postId: post.post_id });
          navigation.pop();
          alert('Post Deleted');
        },
      },
      { text: 'No' },
    ]);
  };

  //handles functionality for when user upvotes a post
  const handleUpvote = () => {
    let upvote = !upvoted;
    let incrementUpvotes = 0;

    // If true, then upvote was added, else upvote was removed
    if (upvote) {
      incrementUpvotes = 1;
    } else {
      incrementUpvotes = -1;
    }

    //toggle upvote button
    setUpvoted(upvote);
    setUpvotes(upvotes + incrementUpvotes);
  };

  const handleCommentUpvote = (comment_id) => {
    //Copy useState parameters b/c shouldn't call useState in if statements
    let map = mapComments;
    let moveIndex = 0;
    let upvoted = commentsUpvoted;

    //Comment index in upvoted/upvotes array
    let commentIndex = 0;

    //Set up comment in mapping
    //comments hasn't been mapped yet, so map it.
    if (map[comment_id] === undefined) {
      map[comment_id] = currIndex;
      commentIndex = currIndex;
      moveIndex = 1;
    }
    //comment already mapped, get mapped value
    else {
      commentIndex = map[comment_id];
    }

    //If comment was upvoted before, just toggle it. If not, set to 1.
    if (upvoted[commentIndex] === undefined) {
      upvoted[commentIndex] = { comment_id: comment_id, vote_value: 1, votes: 1 };
    } else {
      //Flipping vote value to match user input
      if (upvoted[commentIndex].vote_value === 0) {
        upvoted[commentIndex].vote_value = 1;
        upvoted[commentIndex].votes++;
      } else {
        upvoted[commentIndex].vote_value = 0;
        upvoted[commentIndex].votes--;
      }
    }

    let index = currIndex + moveIndex;

    //Update useState hooks
    setMapComments(map);
    setCurrIndex(index);
    setCommentsUpvoted(upvoted);

    setRefreshComments(!refreshComments); //re-renders the components in the flatlist
  };

  return (
    /* Style for the entire screen, controls how children are aligned */
    <StyledViewPostContainer>
      {/* Back Button */}
      <TouchableOpacity
        style={{ marginLeft: 10, width: 50, paddingLeft: 5 }}
        onPress={() => {
          navigation.navigate('Feed');
          updatePostAttributes();
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#FFCC15' }}>Back</Text>
      </TouchableOpacity>
      <StatusBar style="black" />

      {/* The ... button above the original post's text */}
      <View style={{ alignSelf: 'flex-end', marginRight: 20, flexDirection: 'row' }}>
        {/* If user is original poster, options to edit and delete will appear */}
        {(() => {
          if (userId === post.user_id) {
            return (
              <TouchableOpacity onPress={updatePost}>
                <Image source={require('./../assets/edit_post_icon.png')} style={styles.editPost} />
              </TouchableOpacity>
            );
          }
        })()}
        {(() => {
          if (userId === post.user_id) {
            return (
              <TouchableOpacity onPress={deletePost}>
                <Image source={require('./../assets/trash_icon.png')} style={styles.trashPost} />
              </TouchableOpacity>
            );
          }
        })()}
        <EllipsisMenu navigation={navigation} />
      </View>

      {/* The Original Post's Text */}
      <View style={styles.postBox}>
        <AdjustLabel fontSize={50} text={post.post_text} style={styles.ogPostText} numberOfLines={8} />
      </View>

      {/* Container/View for the Tags associated with this post */}
      <View
        style={[
          styles.postTouchables,
          {
            justifyContent: 'flex-start',
            backgroundColor: 'white',
            borderTopWidth: 0,
            borderTopColor: 'white',
            marginBottom: 10,
            marginTop: 5,
          },
        ]}
      >
        <StyledTag
          style={{ paddingHorizontal: 15, borderRadius: 15, marginVertical: 10, paddingVertical: 2 }}
          tag={post.tag_id}
        />
        {/* <View style={{backgroundColor: '#FF8383', paddingHorizontal: 15, borderRadius: 15, marginVertical: 10, marginLeft: 10, paddingVertical: 2}}>
          <Text style={{color: 'white', fontWeight: "normal"}}>{post.tag_id}</Text>
        </View>
        <View style={{backgroundColor: '#97E1F9', paddingHorizontal: 15, borderRadius: 15, marginVertical: 10, marginLeft: 10, paddingVertical: 2}}>
          <Text style={{color: 'white', fontWeight: "normal"}}>{post.tag_id}</Text>
        </View> */}
      </View>
      {/* Container/View for the number of views, upvotes, comments, who posted it, and how long ago it was posted */}

      {/* </View> */}
      <View style={styles.postTouchables}>
        <View style={[styles.infoRow, { marginRight: 5 }]}>
          <MaterialCommunityIcons name="eye-outline" color="#BDBDBD" size={20} />
          <Text style={[styles.commentText, { color: '#BDBDBD', marginHorizontal: 0 }]}>12</Text>
        </View>
        {/* Upvote button */}
        <TouchableOpacity
          title="Upvote"
          onPress={handleUpvote}
          style={{ marginRight: 15, flexDirection: 'row', alignItems: 'center' }}
        >
          <MaterialCommunityIcons
            name="chevron-up"
            color={upvoted ? '#FFCC15' : '#BDBDBD'}
            size={35}
            style={{ width: 29 }}
          />
          <Text style={[styles.commentText, { color: '#BDBDBD', marginHorizontal: 0 }]}>{upvotes}</Text>
        </TouchableOpacity>
        {/* Number of comments */}
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="chat-outline" color="#BDBDBD" size={20} />
          <Text style={[styles.commentText, { color: '#BDBDBD', marginHorizontal: 0 }]}>{comments.length}</Text>
        </View>
        {/* Name of poster */}
        <View style={[styles.infoRow, { marginLeft: 10 }]}>
          <Text style={[styles.name, { color: '#BDBDBD', marginHorizontal: 0 }]}>{post.anon_name}</Text>
        </View>
        {/* time posted */}
        <View style={{ marginLeft: 10 }}>
          <Text style={[styles.name, { color: '#BDBDBD', marginHorizontal: 0 }]}>{formatTime(post.post_age)}</Text>
        </View>
      </View>

      {/* Comment Section (Scrollable) */}
      <View style={{ flex: 2.5, backgroundColor: '#EFEFEF', paddingTop: 2.5 }}>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={comments}
          keyExtractor={(item) => item.comment_id}
          extraData={refreshComments}
          renderItem={renderItem}
        />
      </View>

      {/* Comment Section (TextInput) */}
      <Formik
        initialValues={{
          commentText: '',
          post_id: '',
        }}
        onSubmit={(values) => {
          //Setting up information to send to database
          body = {
            commentText: values.commentText,
            post_id: post.post_id,
            num_upvotes: 0,
          };

          sendToDB('comment', body);
          values.commentText = '';
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.commentInputContainer}
          >
            <TextInput
              label=""
              icon=""
              placeholder="Add a comment"
              placeholderTextColor={darkgray}
              onChangeText={handleChange('commentText')}
              onBlur={handleBlur('commentText')}
              //onSubmitEditing={}
              value={values.commentText}
              selectionColor="#FFCC15"
              multiline
              style={styles.commentInputField}
              //keyboardType='default'
            />
            <EvilIcons
              name="arrow-up"
              size={35}
              color={yellow}
              justifyContent="center"
              onPress={handleSubmit}
              style={styles.commentInputSubmit}
            />
          </KeyboardAvoidingView>
        )}
      </Formik>
      <Line />
    </StyledViewPostContainer>
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
  postBox: {
    flex: 1,
    // flexGrow: 1,
    // flexBasis: height * 0.04,
    alignItems: 'center',
    //justifyContent: 'center',
    marginLeft: 35,
    marginRight: 20,
  },
  postTouchables: {
    // flex: 0.4,
    alignItems: 'center',
    //justifyContent: 'center',
    flexDirection: 'row',
    marginLeft: 35,
    marginRight: 20,
  },
  ogPostText: {
    // fontSize: height * 0.025,
    fontSize: 24,
    //position: 'absolute',
    //textAlign: 'auto',
    fontWeight: 'bold',
    color: '#000',
  },
  commentText: {
    fontSize: height * 0.02,
    fontWeight: '600',
    color: '#000',
    marginHorizontal: 20,
  },
  commentBox: {
    flex: 1,
    alignContent: 'center',
    backgroundColor: 'dodgerblue',
  },
  item: {
    padding: 15,
    marginVertical: 2.5,
    //marginHorizontal: 10,
  },
  name: {
    fontSize: height * 0.02,
    fontWeight: '600',
    color: '#BDBDBD',
    // marginLeft: 20,
    // marginBottom: 15
  },
  bodyText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    //alignContent: 'space-around',
    alignItems: 'center',
    marginRight: 10,
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
  commentInputContainer: {
    flex: 0.3,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  commentInputField: {
    flex: 0.98,
    color: 'black',
    backgroundColor: 'white',
    borderTopWidth: 10,
    borderColor: 'white',
  },
  commentInputSubmit: {
    borderTopWidth: 10,
    borderColor: 'white',
  },
  editPost: {
    width: width * 0.07,
    height: width * 0.07,
    paddingHorizontal: 15,
  },
  trashPost: {
    width: width * 0.07,
    height: width * 0.07,
    paddingHorizontal: 15,
  },
});

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, ...props }) => {
  return (
    <View>
      <StyledInputLabel> {label} </StyledInputLabel>
      <StyledTextInput {...props} />
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

export default PostView;
