import React from 'react';
import { Dimensions, StyleSheet, Text, Image, TouchableHighlight, View, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Menu, MenuOptions, MenuOption, MenuTrigger, renderers } from 'react-native-popup-menu';
import RNAnimated from "react-native-animated-component";
import RNPoll, { IChoice } from "react-native-poll";

//colors
const { primary, yellow, background, lightgray, darkgray, black } = Colors;
import { Colors, Line } from './../components/styles';
const { width, height } = Dimensions.get('screen');

// get -> 
// const choices: Array<IChoice> = [
//   { id: 1, choice: "Nike", votes: 12 },
//   { id: 2, choice: "Adidas", votes: 1 },
//   { id: 3, choice: "Puma", votes: 3 },
//   { id: 4, choice: "Reebok", votes: 5 },
//   { id: 5, choice: "Under Armour", votes: 9 },
// ];

// var choices: Array<IChoice> = [];
var JWTtoken = '';

/* For Creating a Poll */
const Poll = ({ Type }) => {

  const [inputs, setInputs] = useState({
    pollOptions: [],
    pollTag: ["Poll"],
    num_comments: 0
  });
  const [option, setOption] = useState('');

  //const [options, setOptions] = useState([]);

  //Update inputs when user enters new ones, name is identifier, value as a string
  const onChange = (value) => {
    setOption(value);
    // console.log(option);
  };

  //handles the '+' button press, adds option to poll
  const handleAddButtonPress = async (e) => {
    if(option){
      //questionable implementation, may not need IChoice for now
      // const newOption: IChoice = {
      //   id: id_num,
      //   choice: inputs.pollOption,
      //   votes: 0
      // }
      // setInputs({...inputs, allPollOptions});
      var options = inputs.pollOptions;
      console.log("This is options:");
      console.log(options);
      options.push(option);
      console.log("This is options after push:");
      console.log(options);
      setInputs({...inputs, pollOption: options})
      console.log("This is inputs:");
      console.log(inputs);
      setOption('');
    }
  };

  //note: may want to create a list of poll options that the user inserted
  // so that they can choose to remove that option

  //Executes when Post is pressed, sends Poll information to the database
  const onPressSubmit = async (e) => {
    e.preventDefault(); //prevent refresh
    //Check if the post has content, if not, prevent submission and notify
    if (inputs.pollOptions.length != 0) {
      sendToDB(Type, inputs);

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
        // console.log(parseRes);
      } catch (error) {
        console.error(error.message);
      }
    }

    if (type === 'Update') {
      const updateBody = {
        postText: body.postText,
        post_id: postType.post_id,
        postTag: body.postTag,
      };

      try {
        // console.log('Sent Token:      ' + JWTtoken);
        // Send post info to DB
        const response = await fetch('http://' + serverIp + '/feed/update-post', {
          method: 'PUT',
          headers: { token: JWTtoken, 'content-type': 'application/json' },
          body: JSON.stringify(updateBody),
        });

        const parseRes = await response.json();

        //console.log('UPDATE: ' + JSON.stringify(parseRes));
      } catch (error) {
        console.error(error.message);
      }
    }
  };

  if (Type === 'Poll') {
    return (
      <View style={styles.optionContainer}>
        <Line />
        <TextInput 
          styles={styles.userInput} 
          placeholder="Enter Poll Option" 
          placeholderTextColor={darkgray} 
          value={option}
          onChangeText={(e) => onChange(e)}
        />
        <Line />
        <TouchableOpacity onPress={handleAddButtonPress} style={styles.addOption}>
          <Image source={require('../assets/add_icon.png')} />
        </TouchableOpacity>
        {/* <RNPoll
          totalVotes={30}
          choices={choices}
          onChoicePress={(selectedChoice: IChoice) =>
            console.log("SelectedChoice: ", selectedChoice)
          }
        /> */}
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  optionContainer: {backgroundColor: 'white'},
  userInput: {backgroundColor: 'dodgerblue'},
  addOption: {},
});

export default Poll;
