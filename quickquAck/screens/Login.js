import React from 'react';
import { StyleSheet, Text, TextInput, View, SafeAreaView, Dimensions, TouchableOpacity, Keyboard, Platform } from 'react-native';

function Login(props) {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Log In</Text>
            <View style={styles.loginForm}>
                <TextInput 
                placeholder="Institution Email"
                placeholderTextColor="#BDBDBD"
                clearButtonMode="always"
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                selectionColor='#FFCC15'
                />
            </View>
            <View style={styles.loginForm}>
                <TextInput 
                placeholder="Password"
                placeholderTextColor="#BDBDBD"
                clearButtonMode="always"
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
                selectionColor='#FFCC15'
                />
                {/* <TouchableOpacity style={styles.forgotPassword}>
                    <Text
                    style={styles.password}
                    onPress={() => {
                        //navigation.navigate('ResetPassword');
                        Keyboard.dismiss();
                    }}>
                        Show
                    </Text>
                </TouchableOpacity> */}
            </View>
            <View style={styles.loginButton}>
                <TouchableOpacity
                onPress={() => {
                    //should have some handleSubmit() function here
                    Keyboard.dismiss();
                }}/>
                <Text style={styles.buttonText}>Log In</Text>
            </View>
            <TouchableOpacity style={styles.forgotPassword}>
                <Text
                style={styles.password}
                onPress={() => {
                    //should have some kind of navigation thing here
                }}>
                Forgot your password?
                </Text>
        </TouchableOpacity>
        </SafeAreaView>
    );
}

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? (height * 0.08): 0
    },
    header:{
        fontWeight: 'bold', 
        fontSize: height * 0.05, 
        marginBottom: height * 0.06
    },
    loginButton: {
        width: '90%',
        height: height * 0.08,
        backgroundColor: '#FFCC15',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: height * 0.1
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: height * 0.03
    },
    loginForm:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F6F6F6', 
        borderColor: '#E8E8E8',
        borderWidth: 1,
        borderRadius: 8,
        alignSelf: 'center',
        marginBottom: height * 0.02,
        height: height * 0.08,
        width: '88%',
    },
    input: {
        width: '100%',
        height: '100%',
        paddingLeft: width * 0.03,
        fontSize: height * 0.025,
      },
      forgotPassword: {
        paddingTop: height * 0.02,
      },
      password: {
        fontSize: height * 0.03,
        color: '#FFCC15',
        fontWeight: 'bold',
      },
});

export default Login;