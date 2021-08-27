import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, useFocusEffect, useNavigation } from '@react-navigation/native';
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
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons, EvilIcons } from '@expo/vector-icons';
import RNAnimated from "react-native-animated-component";
import RNPoll, { IChoice } from "react-native-poll";

//Testing purposes, change serverIP in login.js to your local IPV4 address
import { serverIp } from './Login.js';

//Store Authentication Token
var JWTtoken = '';
var userId = '';

//Set to true to see debug messages
var debugComments = false;
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
  TextLink,
  TextLinkContent,
  ExtraViewRight,
  TextPostContent,
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

//passing through route allows us to take in input from feedviews.js
const PollView = ({ route, navigation }) => {
  //Get input from feedViews.js into post by calling on route.params
  const { poll } = route.params; //post data
  const [comments, SetComments] = useState([]); //stores all comments for the post
  const [newComments, refreshNewComments] = useState(false); //determines when to get new comments from db

  //handling post upvotes
  const [upvoted, setUpvoted] = useState();
//   const [upvotes, setUpvotes] = useState(post.num_upvotes);

  //handle comment upvotes
  const [commentsUpvoted, setCommentsUpvoted] = useState([]);
  const [refreshComments, setRefreshComments] = useState(false);

  //Mapping array , takes comment_id and returns the index its stored in for commentsUpvoted and commentUpvotes
  //This is done so when passed to db, can just iterate array w/o empty values, makes 100000x easier
  const [mapComments, setMapComments] = useState([]);
  // const [currIndex, setCurrIndex] = useState(0); //current index to map to
  const [refresh, setRefresh] = useState(false); //Handle refreshing logic

  const handleRefresh = async () => {
    setRefresh(true); //update animation

    //Comments that were changed by the user, to change in the database
    // const bodyCommentUpvotes = {
    //   user_id: userId,
    //   post_id: post.post_id,
    //   comments: commentsUpvoted,
    // };

    // await updateCommentValues(bodyCommentUpvotes);

    // refreshNewComments(!newComments); //Change variable to trigger useEffect to pull posts from database
  };

  /* Definition of Item object, controls what text goes in the comments, and all the content for each comment "box" */
//   const Item = ({ item, onPress, backgroundColor, textColor }) => {
//     const navigation = useNavigation();
//     return (
//       <View style={[styles.item, backgroundColor]}>
//         <View
//           style={{
//             marginLeft: 20,
//             marginBottom: 8,
//             flexDirection: 'row',
//             width: '94%',
//             justifyContent: 'space-between',
//           }}
//         >
//           {/* (Anonymous) name of the commenter */}
//           <Text style={[styles.name]}>{item.anon_name_id}</Text>

//           {/* The ... button for each comment */}
//           <View>
//             <EllipsisMenu
//               navigation={navigation}
//               post={post}
//               commentOwner={userId === item.user_id ? true : false}
//               commentOwnerID={item.user_id}
//               comment_id={item.comment_id}
//               // comment_text={item.comment_text}

//               JWTtoken={JWTtoken}
//             />
//           </View>
//         </View>

//         {/* The text for the comment */}
//         <Text style={[styles.commentText, textColor]}>{item.text}</Text>

//         {/* The row of when the comment was posted, along with the number of upvotes */}
//         <View
//           style={{
//             flexDirection: 'row',
//             marginTop: 10,
//             alignItems: 'center',
//             marginLeft: 20,
//             alignContent: 'space-around',
//           }}
//         >
//           {/* Time posted */}
//           <Text style={[styles.dataRow]}>{formatTime(item.comment_age)}</Text>

//           {/* Upvotes */}
//           <TouchableOpacity
//             title="Upvote"
//             onPress={() => handleCommentUpvote(item.comment_id)}
//             style={{ marginLeft: 10, flexDirection: 'row', alignItems: 'center' }}
//           >
//             <MaterialCommunityIcons
//               name="chevron-up"
//               color="#BDBDBD"
//               size={35}
//               style={{
//                 width: 29,
//                 // Very messy -> first check if comment was mapped, if was then check if comment was upvoted
//                 color: commentsUpvoted[mapComments[item.comment_id]]
//                   ? commentsUpvoted[mapComments[item.comment_id]].vote_value
//                     ? '#FFCC15'
//                     : '#BDBDBD'
//                   : '#BDBDBD',
//               }}
//             />
//             <Text style={[styles.dataRow]}>
//               {commentsUpvoted[mapComments[item.comment_id]].votes
//                 ? commentsUpvoted[mapComments[item.comment_id]].votes
//                 : 0}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

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
    //   console.log(userId);
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
//   const sendToDB = async (operation, body) => {
//     //Create a comment on the post
//     if (operation === 'comment') {
//       try {
//         const response = await fetch('http://' + serverIp + '/feed/create-comment', {
//           method: 'POST',
//           headers: { token: JWTtoken, 'Content-Type': 'application/json' },
//           body: JSON.stringify(body),
//         });

//         const parseRes = await response.json();

//         // console.log('COMMENT: ' + JSON.stringify(parseRes));

//         let map = mapComments;
//         let upvote = commentsUpvoted;

//         //comment was added successfully, add to map array
//         if (!(parseRes.comment_id === undefined)) {
//           map[parseRes.comment_id] = upvote.length;
//           upvote[map[parseRes.comment_id]] = { comment_id: parseRes.comment_id, vote_value: 1, votes: 1 };
//         }

//         setMapComments(map);
//         setCommentsUpvoted(upvote);

//         if (debugComments === true) {
//           console.log('New Comment Creation -----------------------------------------------------------');
//           console.log(upvote);
//           console.log('New Comment Creation -----------------------------------------------------------');
//         }
//         refreshNewComments(!newComments); //update the page with the new comment
//       } catch (error) {
//         console.error(error.message);
//       }
//     }

//     //Update the current post
//     if (operation === 'update') {
//       try {
//         const response = await fetch('http://' + serverIp + '/feed/update-post', {
//           method: 'PUT',
//           headers: { token: JWTtoken, 'Content-Type': 'application/json' },
//           body: JSON.stringify(body),
//         });

//         const parseRes = await response.json();

//         // console.log('UPDATE: ' + JSON.stringify(parseRes));
//       } catch (error) {
//         console.error(error.message);
//       }
//     }

//     //Delete the current post
//     if (operation === 'delete') {
//       try {
//         const response = await fetch('http://' + serverIp + '/feed/delete-post', {
//           method: 'DELETE',
//           headers: { token: JWTtoken, 'Content-Type': 'application/json' },
//           body: JSON.stringify(body),
//         });

//         const parseRes = await response.json();

//         console.log('DELETE: ' + JSON.stringify(parseRes));

//         navigation.navigate('Feed');
//       } catch (error) {
//         console.error(error.message);
//       }
//     }
//   };

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

  //Renders all tags associated with the original post
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

  //Getting comments from the database to show for post
  const [options, setOptions] = useState([]);
  const pollData = () => {
      if (poll.pollchoices.length > 0){
          let count = 1;
          var newOptions = [];
          for (const i of poll.pollchoices) {
              const newOption: IChoice = {
                  id: count,
                  choice: i,
                  votes: 0
              }
              newOptions.push(newOption);
              ++count;
          }
          setOptions(newOptions);
      }
      return null;
    };
  //triggers on first load
  useEffect(() => {
    async function fetchAuthorizations() {
      await getUserID();
      await getJWT();
    //   await getUpvoted();
    }

    fetchAuthorizations();
    pollData();
  }, []);

  //update values when screens change
  useFocusEffect(
    React.useCallback(() => {
    //   updatePostAttributes();
    }, [navigation]),
  );

const choices: Array<IChoice> = [
  { id: 1, choice: "Nike", votes: 12 },
  { id: 2, choice: "Adidas", votes: 1 },
  { id: 3, choice: "Puma", votes: 3 },
  { id: 4, choice: "Reebok", votes: 5 },
  { id: 5, choice: "Under Armour", votes: 9 },
];

  

  return (
    /* Style for the entire screen, controls how children are aligned */
    <StyledViewPostContainer>
      <StatusBar style="black" />
      <View style={{paddingTop: 5, marginHorizontal: 15, flexDirection: 'row', justifyContent: 'space-between'}}>
        {/* Back Button */}
        <TouchableOpacity
          style={{width: 55, paddingHorizontal: 5}}
          onPress={() => {
            navigation.pop();
            //updatePostAttributes();
          }}
        >
          <TextPostContent>Back</TextPostContent>
          {/* <Text style={{ fontSize: 18, fontWeight: '600', color: '#FFCC15' }}>Back</Text> */}
        </TouchableOpacity>
        {/* The ... button above the original post's text */}
        {/* <View style={{ alignSelf: 'flex-end', marginRight: 5}}>
          <EllipsisMenu
            navigation={navigation}
            post={poll}
            postOwner={userId === poll.user_id ? true : false}
            JWTtoken={JWTtoken}
          />
        </View> */}
      </View>
      <StatusBar style="black" />

      {/* The Original Post's Text */}
      <View style={[styles.postBox, {marginTop: 10}]}>
        <AdjustLabel fontSize={30} text={poll.poll_question} style={styles.ogPostText} numberOfLines={8} />
      </View>
      <RNPoll
          totalVotes={30}
          choices={options}
        //   choices={choices}
          onChoicePress={(selectedChoice: IChoice) =>
            console.log("SelectedChoice: ", selectedChoice)
          }
          PollContainer={RNAnimated}
          PollItemContainer={RNAnimated}
          appearFrom="left"
          style={[{marginHorizontal: 35}]}
          borderColor={yellow}
          fillBackgroundColor={yellow}
          choiceTextStyle={{fontWeight: 'bold'}}
        />

      {/* Container/View for the Tags associated with this post */}
      <View
        style={[
          styles.postTouchables,
          { justifyContent: 'flex-start', borderTopWidth: 0, borderTopColor: 'white', marginBottom: 10, marginTop: 5},
        ]}
      >
        <RenderStyledTags tags={poll.tagarray} />
      </View>

      {/* Container/View for the number of views, upvotes, comments, who posted it, and how long ago it was posted */}
      <View style={[styles.postTouchables, {justifyContent: 'space-between'}]}>
        {/* <View style={[styles.infoRow, { marginRight: 5 }]}>
          <MaterialCommunityIcons name="eye-outline" color="#BDBDBD" size={20} />
          <Text style={[styles.dataRow, { color: '#BDBDBD', marginHorizontal: 0 }]}>12</Text>
        </View> */}
        {/* Upvote button */}
        <TouchableOpacity
          title="Upvote"
        //   onPress={handleUpvote}
          style={{ marginRight: 5, flexDirection: 'row', alignItems: 'center' }}
        >
          <MaterialCommunityIcons
            name="chevron-up"
            color={upvoted ? '#FFCC15' : '#BDBDBD'}
            size={35}
            style={{ width: 29 }}
          />
          <Text style={[styles.dataRow, { }]}>1</Text>
        </TouchableOpacity>
        {/* Number of comments */}
        {/* <View style={styles.infoRow}>
          <MaterialCommunityIcons name="chat-outline" color="#BDBDBD" size={20} />
          <Text style={[styles.dataRow, { }]}>{comments.length}</Text>
        </View> */}
        {/* Name of poster */}
        <View style={[styles.infoRow, ]}>
          <Text style={[styles.dataRow, { }]}>{poll.user_id}</Text>
        </View>
        {/* time posted */}
        {/* <View style={{}}>
          <Text style={[styles.dataRow, { }]}>{formatTime(post.post_age)}</Text>
        </View> */}
      </View>

      {/* Comment Section (Scrollable) */}
      {/* <View style={{ flex: 4, backgroundColor: '#EFEFEF', paddingTop: 2.5 }}> */}
        {/* <FlatList
          numColumns={1}
          horizontal={false}
          data={comments}
          keyExtractor={(item) => item.comment_id}
          extraData={refreshComments}
          renderItem={renderItem}
          refreshing={refresh} //true: shows spinning animation to show loading
          onRefresh={handleRefresh} //When user refreshes by pulling down, what to do
        /> */}
      {/* </View> */}

      {/* Comment Section (TextInput) */}
      {/* <Formik
        initialValues={{
          commentText: '',
          post_id: '',
        }}
        onSubmit={(values) => {
          //Setting up information to send to database
          body = {
            commentText: values.commentText,
            post_id: poll.poll_id,
            num_upvotes: 1,
          };

          if (body.commentText === '') {
            alert("Can't submit empty comment!");
          } else {
            // sendToDB('comment', body);
            values.commentText = '';

            //Comments that were changed by the user, to change in the database
            // const bodyCommentUpvotes = {
            //   user_id: userId,
            //   post_id: post.post_id,
            //   comments: commentsUpvoted,
            // };

            // updateCommentValues(bodyCommentUpvotes);
          }
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.commentInputContainer}
          > */}
            {/* <ScrollView */}
            {/* keyboardShouldPersistTaps="handled"> */}
            {/* <TextInput
              // label=""
              // icon=""
              placeholder="Add a comment"
              placeholderTextColor={darkgray}
              onChangeText={handleChange('commentText')}
              onBlur={handleBlur('commentText')}
              //onSubmitEditing={}
              value={values.commentText}
              selectionColor="#FFCC15"
              maxLength={250}
              multiline
              // numberOfLines={}
              style={styles.commentInputField}
              //keyboardType='default'
            />
             {/* </ScrollView> */}
            {/* <EvilIcons
              name="arrow-up"
              size={40}
              color={yellow}
              justifyContent="center"
              onPress={handleSubmit}
              style={styles.commentInputSubmit}
            />
           
          </KeyboardAvoidingView>
        )}
      </Formik> */}
      <Line />
    </StyledViewPostContainer>
  );
};

export default PollView;

const { width, height } = Dimensions.get('screen');

const styles = StyleSheet.create({
  pageTitle: {
    fontSize: 40,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000',
  },
  postBox: {
    // flex: 1,
    // flexGrow: 1,
    // flexBasis: height * 0.04,
    alignItems: 'center',
    //justifyContent: 'center',
    marginLeft: 35,
    marginRight: 35,
    // marginRight: 20,
  },
  postTouchables: {
    // flex: 0.4,
    alignItems: 'center',
    //justifyContent: 'center',
    flexDirection: 'row',
    marginLeft: 35,
    marginRight: 35,
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
  dataRow: {
    fontSize: height * 0.02,
    fontWeight: '600',
    color: '#BDBDBD',
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
    // flex: 0.3,
    // display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#DADADA',
  },
  commentInputField: {
    // flex: 0.98,
    // flex: 4,
    padding: 15,
    height: '100%',
    width: '90%',
    color: 'black',
    // borderTopWidth: 1,
    // borderTopWidth: 10,
    // borderColor: '#DADADA',
  },
  commentInputSubmit: {
    // borderTopWidth: 1,
    // borderColor: 'white',
    // flex: 1,
    width: '10%',
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


