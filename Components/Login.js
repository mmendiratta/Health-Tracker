import React from 'react';
import {View, TextInput, StyleSheet, TouchableOpacity, Text, KeyboardAvoidingView, AsyncStorage} from 'react-native';
import base64 from 'react-native-base64';
import Error from './Error';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            token: '',
            errorCode: ''
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
            if(response.status == 401) {
                this.setState({errorCode:"Verification failed. Username or Password incorrect."})
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
                console.log(data.token)
                
                this.props.navigation.navigate('Today', 
                    {user:this.state.username, token: data})
                    
            }
        }).catch(error => console.error(error));
    }

    render() {
        return (
            <View style={styles.container}>
                <KeyboardAvoidingView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} behavior="padding" enabled>
                    <Text style={styles.titleText}>Login</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='Username'
                        label='Username'
                        onChangeText={(text) => this.handleUsername(text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Password'
                        label='Password'
                        secureTextEntry
                        onChangeText={(text) => this.handlePassword(text)}
                    />
                    <TouchableOpacity style={styles.buttonContainer} onPress={()=>this.handleLogin()}>
                        <Text style={styles.buttonText}>Login </Text>
                    </TouchableOpacity>
                    <Error error={this.state.errorCode}/>
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