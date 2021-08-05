import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
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

/* Definition of Item object, controls what text goes in the comments, and all the content for each comment "box" */
const Item = ({ item, onPress, backgroundColor, textColor }) => {
  const navigation = useNavigation();
  return(
    <View style={[styles.item, backgroundColor]}>
    <View style={{marginLeft: 20, marginBottom: 8, flexDirection: 'row', width: '94%', justifyContent:'space-between'}}>

      {/* (Anonymous) name of the commenter */}
      <Text style={[styles.name]}>{item.user_id}</Text>

      {/* The ... button for each comment */}
      <View>
        <EllipsisMenu navigation={navigation}/>
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
      <Text style={[styles.name]}>{item.time_posted} ago</Text>
      <TouchableOpacity
        title="Upvote"
        onPress={() => console.log('Upvoted!')}
        style={{ marginLeft: 10, flexDirection: 'row', alignItems: 'center' }}
      >
        <MaterialCommunityIcons name="chevron-up" color="#BDBDBD" size={35} style={{ width: 29 }} />
        <Text style={[styles.name, { color: '#BDBDBD', marginHorizontal: 0 }]}>{item.likes}</Text>
      </TouchableOpacity>
    </View>
  </View>
  );
};

//passing through route allows us to take in input from feedviews.js
const PostView = ({ route, navigation }) => {
  //Get input from feedViews.js into post by calling on route.params
  const { post } = route.params;
  const [comments, SetComments] = useState([]);
  const [newComments, refreshNewComments] = useState(false);

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
  //communicate registration information with the database

  const sendToDB = async (operation, body) => {
    await getJWT();

    console.log(JSON.stringify(body));

    //Create a comment on the post
    if (operation === 'comment') {
      try {
        const response = await fetch('http://' + serverIp + ':5000/feed/create-comment', {
          method: 'POST',
          headers: { token: JWTtoken, 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        const parseRes = await response.json();

        console.log('COMMENT: ' + JSON.stringify(parseRes));
        refreshNewComments(!newComments);
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

        console.log('UPDATE: ' + parseRes.status);
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

        console.log('DELETE' + parseRes);
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

  //Getting comments from the database to show for post
  const getFromDB = async () => {
    await getJWT(); //gets JWTtoken from local storage and stores in JWTtoken
    const query = 'post_id=' + post.post_id;
    try {
      // Update server with user's registration information
      const response = await fetch('http://' + serverIp + ':5000/feed/post-comments?' + query, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', token: JWTtoken },
      });

      //The response includes post information, need in json format
      const parseRes = await response.json();

      //Updates postData to have post information using useState
      if (parseRes.data) {
        SetComments(parseRes.data.comment);
      } else {
        SetComments(commentExamples);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  //useEffect triggers when objects are rendered, so this only occurs once instead of looping infinitely
  useEffect(() => {
    getFromDB();
    console.log('Comments Refreshed');
  }, [newComments]);

  /* Controls the look of each "item", or comment in this context */
  const renderItem = ({ item }) => {
    const backgroundColor = '#FFFFFF';
    const color = 'black';
    return <Item item={item} backgroundColor={{ backgroundColor }} textColor={{ color }} />;
  };

  const updateNumComments = () => {
    const body = {
      postId: post.post_id,
      num_comments: comments.length,
    };

    sendToDB('update', body);
  };

  return (
    /* Style for the entire screen, controls how children are aligned */
    <StyledViewPostContainer>
      {/* Back Button */}
      <TouchableOpacity
        style={{ marginLeft: 10, width: 50, paddingLeft: 5 }}
        onPress={() => {
          navigation.navigate('Feed'), updateNumComments();
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#FFCC15' }}>Back</Text>
      </TouchableOpacity>
      <StatusBar style="black" />

      {/* The ... button above the original post's text */}
        <View style={{alignSelf: 'flex-end', marginRight: 20}}>
            <EllipsisMenu navigation={navigation}/>
        </View>

      {/* The Original Post's Text */}
      <View style={styles.postBox}>
        <AdjustLabel fontSize={50} text={post.post_text} style={styles.ogPostText} numberOfLines={8} />
      </View>

      {/* Container/View for the number of views, upvotes, comments, who posted it, and how long ago it was posted */}
      {/* <View style={{backgroundColor: 'pink', flexDirection: 'row', marginTop: 10, alignItems: 'center', marginLeft: 20, alignContent: 'space-around'}}> */}

      {/* </View> */}
      <View style={styles.postTouchables}>
        <View style={[styles.infoRow, { marginRight: 5 }]}>
          <MaterialCommunityIcons name="eye-outline" color="#BDBDBD" size={20} />
          <Text style={[styles.commentText, { color: '#BDBDBD', marginHorizontal: 0 }]}>12</Text>
        </View>
        <TouchableOpacity
          title="Upvote"
          onPress={() => console.log('Upvoted!')}
          style={{ marginRight: 15, flexDirection: 'row', alignItems: 'center' }}
        >
          <MaterialCommunityIcons name="chevron-up" color="#BDBDBD" size={35} style={{ width: 29 }} />
          <Text style={[styles.commentText, { color: '#BDBDBD', marginHorizontal: 0 }]}>21</Text>
        </TouchableOpacity>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="chat-outline" color="#BDBDBD" size={20} />
          <Text style={[styles.commentText, { color: '#BDBDBD', marginHorizontal: 0 }]}>{comments.length}</Text>
        </View>
        <View style={[styles.infoRow, { marginLeft: 10 }]}>
          <Text style={[styles.name, { color: '#BDBDBD', marginHorizontal: 0 }]}>Blue Raccoon</Text>
        </View>
        <View style={{ marginLeft: 10 }}>
          <Text style={[styles.name, { color: '#BDBDBD', marginHorizontal: 0 }]}>8m ago</Text>
        </View>
      </View>

      {/* Comment Section (Scrollable) */}
      <View style={{ flex: 2.5, backgroundColor: '#EFEFEF', paddingTop: 2.5 }}>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={comments}
          keyExtractor={(item) => item.comment_id}
          // extraData={id}
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

      {/* What Ajay originally had in PostView: */}
      {/* <View style={{flex: 0.2, backgroundColor: 'lightcyan', justifyContent: 'center'}}>
          <Text style={styles.commentText}>Slight margin bottom adder thing</Text>
        </View> */}
      {/* <SubTitle></SubTitle>
          <Formik
            initialValues={{
              postText: '',
              postId: '',
            }}
            onSubmit={(values) => {
              //Setting up information to send to database
              body = {
                postText: values.postText,
                postId: values.postId,
              };

              sendToDB(body);
              navigation.navigate('CreatePost');
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <StyledFormArea>
                <MyTextInput
                  label=""
                  icon=""
                  placeholder="Post Text"
                  style={{}}
                  placeholderTextColor={darkgray}
                  onChangeText={handleChange('postText')}
                  onBlur={handleBlur('postText')}
                  value={values.postText}
                  selectionColor="#FFCC15"
                />

                <MyTextInput
                  label=""
                  icon=""
                  placeholder="Post Id"
                  style={{}}
                  placeholderTextColor={darkgray}
                  onChangeText={handleChange('postId')}
                  onBlur={handleBlur('postId')}
                  value={values.postId}
                  selectionColor="#FFCC15"
                />

                <StyledButton onPress={((event) => setOpt(event, UPDATE), handleSubmit)}>
                  <ButtonText>Update Post</ButtonText>
                </StyledButton>
                <StyledButton onPress={() => navigation.navigate('Feed')}>
                  <ButtonText>Back</ButtonText>
                </StyledButton>
                <StyledButton onPress={((event) => setOpt(event, DELETE), handleSubmit)}>
                  <ButtonText>Delete Post</ButtonText>
                </StyledButton>
                <Line />
              </StyledFormArea>
            )}
          </Formik> */}
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
