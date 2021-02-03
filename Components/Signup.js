import React from 'react';
import {View, TextInput, StyleSheet, TouchableOpacity, Text, KeyboardAvoidingView} from 'react-native';
import Error from './Error';
import base64 from 'react-native-base64';

export default class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            errorCode:'', 
            token: '',
            firstName:'',
            lastName:''
        };
      }
      async _storeData(username, token){
        try {
          await AsyncStorage.setItem('token', token);
          await AsyncStorage.setItem('user', username);
        } catch (error) {
          // Error saving data
        }
      };
      handleFirstname(text) {
          this.setState({firstName:text});
      }
      handleLastname(text) {
        this.setState({lastName:text});
    }
      handleUsername(text) { 
        this.setState( {username: text} ); // console.log(text);
    }

    handlePassword(text) { 
        this.setState( {password: text} ); // console.log(text);
    }

    handleLogin() {
        fetch('https://mysqlcs639.cs.wisc.edu/login/', { 
            method: 'GET',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "Authorization": `Basic ${base64.encode(`${this.state.username}:${this.state.password}`)}`
           }
        })
        .then(response => {
            console.log(response.status)
            if(response.status == 401) {
                console.log("Verification failed")
                return 
            } else if (response.status == 200) {
                return response.json()
            }
        })
        .then(data => {
            if (data === undefined) {
                console.log("undefined caught")
            } else {
                this._storeData(this.state.username, data.token);
                this.setState({token: data.token});
                this.props.navigation.navigate('Today', 
                    {user:this.state.username, token: data})
            }
        })
    }

    handleCreation() {
        fetch('https://mysqlcs639.cs.wisc.edu/users/', { 
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
           
           },
           body: JSON.stringify (
               {
                username: this.state.username ,
                password:this.state.password,
                firstName: this.state.firstName,
                lastName:this.state.lastName
               }    
           )
        })
            .then(response => { 
                console.log(response)
                if (response.status == 409) {
                    this.setState({errorCode:"Username already taken!"})
                } else if (response.status == 400) {
                    this.setState({errorCode: "Field password must be 5 characters or longer."})
                } else if (response.status == 200) {
                    response.json();
                    this.handleLogin(this.state.username, this.state.password)
                }
            } )
            .catch(error => console.error(error));
    }
    
    render() {
        return (
            <View style={styles.container}>
            <KeyboardAvoidingView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} behavior="padding" enabled>
                <Text style={styles.titleText} >Sign Up</Text>
                <TextInput
                    style={styles.input}
                    placeholder='First Name'
                    label='First Name'
                    errorStyle={{ color: 'red' }}
                    errorMessage='ENTER A VALID ERROR HERE'
                    onChangeText={(text) => this.handleFirstname(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Last Name'
                    label='Last Name'
                    errorStyle={{ color: 'red' }}
                    errorMessage='ENTER A VALID ERROR HERE'
                    onChangeText={(text) => this.handleLastname(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Username'
                    label='Username'
                    errorStyle={{ color: 'red' }}
                    errorMessage='ENTER A VALID ERROR HERE'
                    onChangeText={(text) => this.handleUsername(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Password'
                    label='Password'
                    errorStyle={{ color: 'red' }}
                    errorMessage='ENTER A VALID ERROR HERE'
                    secureTextEntry
                    onChangeText={(text) => this.handlePassword(text)}
                />
                <TouchableOpacity style={styles.buttonContainer} onPress={()=>this.handleCreation()}>
                    <Text style={styles.buttonText}>Create Account</Text>
                </TouchableOpacity>
                <Error error={this.state.errorCode} />
            </KeyboardAvoidingView>
        </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 23,
        flex: 1, 
         alignItems: 'center', 
         justifyContent: 'center' 
     },
    input: {
       margin: 10,
       height: 30,
       width: 250,
       borderWidth: .2
    },
    buttonContainer: {
        backgroundColor: '#2980b9',
        paddingVertical: 15,
        width: 250,
        alignSelf: 'center'
    },
    buttonText: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontWeight: '700'
    },
    titleText: {
        textAlign: 'center',
        color: '#2980b9',
        fontSize: 30
      }
})