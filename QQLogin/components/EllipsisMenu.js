import React, { useState, Component } from 'react';
import { Dimensions, Platform, StyleSheet, Text, Alert, TouchableHighlight } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger, renderers } from 'react-native-popup-menu';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { serverIp } from '../screens/Login.js';

const { SlideInMenu } = renderers;

const EllipsisMenu = ({ navigation, post, comment_id, postOwner, commentOwner, commentOwnerID, JWTtoken, name, userId }) => {
  const { anon_name, post_id, post_text, tagarray } = post;
  // console.log("This is comment:");
  // console.log(commentOwnerID);

  //When user clicks on icon to update post
  const updatePost = () => {
    const postType = {
      post_type: 'Update',
      post_text: post_text,
      post_id: post_id,
      tagarray: tagarray,
    };
    navigation.navigate('Create Post', { postType });
  };

  //When user clicks on icon to delete post
  const deletePost = () => {
    Alert.alert('Delete Post?', 'Would you like to delete this post?', [
      //Delete post from DB
      {
        text: 'Yes',
        onPress: () => {
          sendToDB();
          navigation.pop();
          alert('Post Deleted');
        },
      },
      { text: 'No' },
    ]);
  };

  const sendToDB = async () => {
    const body = { postId: post_id };

    try {
      const response = await fetch('http://' + serverIp + '/feed/delete-post', {
        method: 'DELETE',
        headers: { token: JWTtoken, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();

      // console.log('DELETE: ' + JSON.stringify(parseRes));
    } catch (error) {
      console.error(error.message);
    }
  };

  const deleteComment = async () => {
    try {
      const response = await fetch('http://' + serverIp + '/feed/delete-comment', {
        method: 'DELETE',
        headers: { token: JWTtoken, 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment_id: comment_id }),
      });

      const parseRes = await response.json();

      if (parseRes.status) {
        alert('Comment deleted successfully!');
        navigation.pop();
      } else {
        console.log(parseRes);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const blockUser = async () => {
    const body = { userID: post.user_id, commentOwnerID: commentOwnerID };
    console.log(body);
    try {
      // const query = 'user_id=' + post.user_id; //sets up query information
      console.log('this is userId ');
      console.log(body);

      console.log(post.user_id);

      const response = await fetch('http://' + serverIp + '/feed/block-user', {
        method: 'PUT',
        headers: { token: JWTtoken, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      console.log('parseRes');

      const parseRes = await response.json();

      console.log(parseRes);
    } catch (error) {
      console.error(error.message);
    }
  };

  //Sending a message to user
  const sendMessage = async () => {
    
    const names = await getNames();
    
    //Create a new chatroom in the database

    const color = name.split(' ');
    color[0].toLowerCase();

    const body = {
      recipient_id: commentOwnerID ? commentOwnerID : post.user_id,
      recipient_anon_name: name,
      recipient_color: color[0],
      initiator_name: names.initiator_name,
      recipient_name: names.recipient_name,
      message_preview: 'Send a message!',
    };

    try {
      const response = await fetch('http://' + serverIp + '/chat/create-chatroom', {
        method: 'POST',
        headers: { token: JWTtoken, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();
      // console.log(parseRes);
      navigation.navigate('TabNav', { screen: 'Messages' });
    } catch (err) {
      console.log(err.message);
    }
  };

  const getNames = async () => {

    //get user id of the recipient
    let recipient_id = commentOwnerID === undefined ? post.user_id : commentOwnerID;
    let names = {recipient_name : '', initiator_name : ''}

    //Get recipient user information from the database
    try{

      const response = await fetch('http://' + serverIp + '/feed/user-information?user_id=' + recipient_id, {
        method: "GET",
        headers: {token:JWTtoken, 'Content-type' : 'application/json'},
      });

      const parseRes = await response.json();
      names.recipient_name = parseRes.first_name + ' ' + parseRes.last_name;
    }
    catch(err){
     
      console.log(err.message)
    }

        //Get recipient user information from the database
        try{

          const response = await fetch('http://' + serverIp + '/feed/user-information?user_id=' + userId, {
            method: "GET",
            headers: {token:JWTtoken, 'Content-type' : 'application/json'},
          });
    
          const parseRes = await response.json();
          names.initiator_name = parseRes.first_name + ' ' + parseRes.last_name;
        }
        catch(err){
         
          console.log(err.message)
        }

        return names;
  }

  return (
    <Menu renderer={SlideInMenu}>
      {/* Slide-in Menu from the bottom is triggered by the Ellipsis (...) button */}
      <MenuTrigger customStyles={triggerStyles}>
        <MaterialCommunityIcons name="dots-horizontal" color="#BDBDBD" size={height * 0.035} />
      </MenuTrigger>

      {/* Three menu options: Send Message, Flag as inappropriate, Block Posts from User */}
      <MenuOptions style={{ paddingBottom: 25, paddingTop: 8 }}>
        {/* Send Message */}
        {(() => {
          if (!postOwner && !commentOwner) {
            return (
              <MenuOption
                style={{ paddingVertical: 10 }}
                onSelect={() => {
                  Alert.alert('Send Message to User?', 'Would you like to send a message to this user?', [
                    { text: 'Yes', onPress: () => sendMessage() },
                    { text: 'No', onPress: () => console.log('User Pressed No') },
                  ]);
                }}
              >
                <Text style={styles.text}>Send Message</Text>
              </MenuOption>
            );
          }
        })()}
        {/* Flag as Inappropriate */}
        <MenuOption
          onSelect={() =>
            navigation.navigate('Flag Post', {
              post: post_text,
              user: post.user_id,
              postid: post_id,
              comment_owner: commentOwnerID,
            })
          }
          style={{ paddingVertical: 10 }}
        >
          <Text style={styles.text}>Flag as inappropriate</Text>
        </MenuOption>

        {/* Block Posts from User */}
        {(() => {
          if (!postOwner && !commentOwner) {
            return (
              <MenuOption
                style={{ paddingVertical: 10 }}
                onSelect={() => {
                  Alert.alert('Block Posts from User?', 'Would you like to block posts from this user?', [
                    {
                      text: 'Yes',
                      onPress: () => {
                        blockUser();
                        navigation.pop();
                        console.log('User Pressed Yes');
                      },
                    },
                    { text: 'No', onPress: () => console.log('User Pressed No') },
                  ]);
                }}
              >
                <Text style={styles.text}>Block posts from this user</Text>
              </MenuOption>
            );
          }
        })()}
        {/* Show Update Post if user is Original Poster */}
        {(() => {
          if (postOwner && !(post.is_poll)) {
            return (
              <MenuOption onSelect={updatePost} style={{ paddingVertical: 10 }}>
                <Text style={styles.text}>Update Post</Text>
              </MenuOption>
            );
          }
        })()}
        {/* Show Delete Post if user is  Original Poster */}
        {(() => {
          if (postOwner) {
            return (
              <MenuOption onSelect={deletePost} style={{ paddingVertical: 10 }}>
                <Text style={styles.text}>Delete Post</Text>
              </MenuOption>
            );
          }
        })()}
        {/* Show Delete Comment if user is Original Commentor */}
        {(() => {
          if (commentOwner) {
            return (
              <MenuOption onSelect={deleteComment} style={{ paddingVertical: 10 }}>
                <Text style={styles.text}>Delete Comment</Text>
              </MenuOption>
            );
          }
        })()}
      </MenuOptions>
    </Menu>
  );
};

const { width, height } = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor : "#00BCD4",
    backgroundColor: 'yellow',
    height: '20%',
    width: '80%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    marginTop: 80,
    marginLeft: 40,
  },
  text: {
    marginLeft: 30,
    color: 'black',
    fontSize: height * 0.019,
  },
});

const triggerStyles = {
  TriggerTouchableComponent: TouchableHighlight,
  triggerTouchable: {
    activeOpacity: 0.6,
    style: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 100,
    },
  },
};

export default EllipsisMenu;
