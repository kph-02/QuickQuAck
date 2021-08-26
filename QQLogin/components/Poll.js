// import React, { Component } from 'react';
// import RNPoll, { IChoice } from "react-native-poll";
// import { Dimensions, StyleSheet, Text, Image, TouchableHighlight, View, TouchableOpacity } from 'react-native';
// import { TextInput } from 'react-native-gesture-handler';
// import { Menu, MenuOptions, MenuOption, MenuTrigger, renderers } from 'react-native-popup-menu';
// const { width, height } = Dimensions.get('screen');

// const Poll = ({ Type }) => {
//   if (Type === 'Poll') {
//     return (
//       <View style={styles.optionContainer}>
//         <Line />
//         <TextInput styles={styles.userInput} placeholder="Enter Poll Option" placeholderTextColor={darkgray} />
//         <Line />
//         <TouchableOpacity style={styles.addOption}>
//           <Image source={require('../assets/add_icon.png')} />
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return null;
// };

// const styles = StyleSheet.create({
//   optionContainer: {},
//   userInput: {},
//   addOption: {},
// });

// import React, { Component } from 'react';
// import { TextInput } from 'react-native-gesture-handler';
// import { Menu, MenuOptions, MenuOption, MenuTrigger, renderers } from 'react-native-popup-menu';
// import RNAnimated from "react-native-animated-component";
// import RNPoll, { IChoice } from "react-native-poll";
// import { Colors, Line } from './../components/styles';
// import { AppRegistry, TouchableOpacity, Image, Animated, ScrollView, StyleSheet, View, Text } from 'react-native';

// const { primary, yellow, background, lightgray, darkgray, black } = Colors;

// export default class App extends Component {

//   constructor() {
//     super();

//     this.state = { valueArray: [], disabled: false }
//     this.index = 0;
//     this.animatedValue = new Animated.Value(0);
//   }

//   addMore = () => {
//     this.animatedValue.setValue(0);
//     let newlyAddedValue = { index: this.index }
//     this.setState({ disabled: true, valueArray: [...this.state.valueArray, newlyAddedValue] }, () => {
//       Animated.timing(
//         this.animatedValue,
//         {
//           toValue: 1,
//           duration: 500,
//           useNativeDriver: true
//         }
//       ).start(() => {
//         this.index = this.index + 1;
//         this.setState({ disabled: false });
//       });
//     });
//   }


//   render() {
    
//     let newArray = this.state.valueArray.map((item, key) => {
//         return (
//           <View key={key} style={styles.viewHolder}>
//             <TextInput styles={styles.userInput} placeholder="Enter Poll Option" placeholderTextColor={darkgray} />
//           </View>
//         );
//     });

//     return (
//       <View style={styles.container} >
//         <ScrollView>
//           <View style={{ flex: 1, padding: 4 }}>
//             {
//               newArray
//             }
//           </View>
//         </ScrollView>

//         <TouchableOpacity activeOpacity={0.8} style={styles.buttonDesign} disabled={this.state.disabled} onPress={this.addMore}>
//           <Image source={require('../assets/add_icon.png')} style={styles.buttonImage} />
//         </TouchableOpacity>
//         {/* <RNPoll
//           totalVotes={30}
//           choices={choices}
//           onChoicePress={(selectedChoice: IChoice) =>
//             console.log("SelectedChoice: ", selectedChoice)
//           }
//         /> */}
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create(
//   {
//     container: {
//       flex: 1,
//     },
//     viewHolder: {
//       height: 45,
//       backgroundColor: '#FFFFFF',
//       justifyContent: 'center',
//       margin: 4
//     },
//     headerText: {
//       color: 'black',
//       fontSize: 25
//     },
//     buttonDesign: {
//       position: 'absolute',
//       right: 25,
//       bottom: 10,
//       borderRadius: 30,
//       width: 60,
//       height: 60,
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     buttonImage: {
//       resizeMode: 'contain',
//       width: '100%',
//     }
//   });

// import RNPoll, { IChoice } from "react-native-poll";

// <RNPoll
//   totalVotes={30}
//   choices={choices}
//   onChoicePress={(selectedChoice: IChoice) =>
//     console.log("SelectedChoice: ", selectedChoice)
//   }
// />

// const choices: Array<IChoice> = [
//   { id: 1, choice: "Nike", votes: 12 },
//   { id: 2, choice: "Adidas", votes: 1 },
//   { id: 3, choice: "Puma", votes: 3 },
//   { id: 4, choice: "Reebok", votes: 5 },
//   { id: 5, choice: "Under Armour", votes: 9 },
// ];
