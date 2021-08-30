import React from 'react';
import { SafeAreaView, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard, Dimensions } from 'react-native';
import {
    StyledContainer,
    InnerContainer,
    PageLogo,
    PageTitle,
    SubTitle,
    StyledFormArea,
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

const KeyboardAvoidingWrapper = ({children}) => {
    return (
        <KeyboardAvoidingView style = {{flex: 1, backgroundColor: 'background'}}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    {children}
                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

// const KeyboardAvoidingWrapper = props => {
//     const { children } = props;
//     return (
//       <SafeAreaView style={ { flex: 1} }>
//         <KeyboardAvoidingView
//         style={{ flex: 1 , alignItems: 'center'}}
//         behavior={ Platform.OS === 'ios' ? 'padding' : 'height' }>
//         {/* //keyboardVerticalOffset={0}> */}
//           <ScrollView
//             contentInsetAdjustmentBehavior="automatic"
//             keyboardShouldPersistTaps="handled"
//             contentContainerStyle={{flex: 1, backgroundColor: 'pink', alignItems: 'stretch', 
//             width: Dimensions.get('screen').width}}>
//             {/* <InnerContainer> */}
//             { children }
//             {/* </InnerContainer> */}
//           </ScrollView>
//         </KeyboardAvoidingView>
//       </SafeAreaView>
//     );
//   };

export default KeyboardAvoidingWrapper;