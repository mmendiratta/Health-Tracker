import React from 'react';
import {View, TextInput, StyleSheet, TouchableOpacity, Text, AsyncStorage, KeyboardAvoidingView} from 'react-native';
import { ListItem, Input } from 'react-native-elements';


export default class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName:" ",
            goalDailyActivity:0,
            goalDailyCalories:0,
            goalDailyCarbohydrates:0,
            goalDailyFat:0,
            goalDailyProtein:0,
            lastName:" ",
            username:" ",
            user: '',
            token:''
        };
      }

      _retrieveData = async () => {
        try {
          const token1 = await AsyncStorage.getItem('token');
          console.log('retrieved token ' + token1)
          
          const user1 = await AsyncStorage.getItem('user');
          console.log('retrieved user ' + user1)
          
          this.setState({token: token1, user: user1})
          if (token1 !== null || user1 !== null) {
            // We have data!!
            console.log(token1 + " " + user1);
          }
        } catch (error) {
          // Error retrieving data
        }
      };


    handleUsername(text) {
        console.log(text); 
        this.setState(
            {username: text}
        );
        //console.log(this.state.username); 
    }

    handlePassword(text) {
        console.log(text); 
        this.setState(
            {password: text}
        );
        //console.log(this.state.password); 
    }

    handleInfoChange(text, name) {
       console.log(text + " " + name)
        this.setState({ name: text });
        fetch('https://mysqlcs639.cs.wisc.edu/users/'+ this.state.user, { 
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            "x-access-token": this.state.token,
           },
           body: JSON.stringify (
            {
              [name]: text
            }    
        )
        }) .then(response => { 
            console.log(response)
            return response.json()
            })
        
    }

    handleDeleteUser() {
        fetch('https://mysqlcs639.cs.wisc.edu/users/'+ this.state.user, { 
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json',
            "x-access-token":  this.state.token,
           }
        }) .then(response => { 
            console.log(response)
            return response.json()
            })
        
    
        this.props.navigation.navigate('Guide');
    }
    async componentWillMount() {
        await this._retrieveData();
        //console.log(this.props.navigation.state.params.token.token);
        console.log('https://mysqlcs639.cs.wisc.edu/users/'+ this.state.user)
        fetch('https://mysqlcs639.cs.wisc.edu/users/'+ this.state.user, { 
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            "x-access-token":  this.state.token,
           }
        })
            .then(response => { 
                console.log("response: " + response.status)
                return response.json()
                })
            .then(data => {
                console.log(JSON.stringify(data))
                this.setState({
                    firstName: data.firstName,
                    lastName:data.lastName,
                    goalDailyActivity:data.goalDailyActivity,
                    goalDailyCalories:data.goalDailyCalories,
                    goalDailyCarbohydrates:data.goalDailyCarbohydrates,
                    goalDailyFat:data.goalDailyFat,
                    goalDailyProtein:data.goalDailyProtein
                });
            })
      
            .catch(error => console.error(error));
            
       
    }

    render() {
        return (
            <View style={styles.container}>
              <KeyboardAvoidingView enabled behavior="padding"> 
              <Input style={styles.titleText} label="First Name:"
                onChangeText={(text) => this.handleInfoChange(text, "firstName")}>{this.state.firstName}</Input>
              <Input style={styles.titleText} label="Last Name: "
                 onChangeText={(text) => this.handleInfoChange(text, "lastName")}>{this.state.lastName}</Input>
              <Input style={styles.titleText} label="Activity Goal:"
                onChangeText={(text) => this.handleInfoChange(text, "goalDailyActivity")}>{this.state.goalDailyActivity}</Input>
              <Input style={styles.titleText} label="Calorie Goal:"
                 onChangeText={(text) => this.handleInfoChange(text, "goalDailyCalories")}>{this.state.goalDailyCalories}</Input>
              <Input style={styles.titleText} label="Fat Goal:"
               onChangeText={(text) => this.handleInfoChange(text, "goalDailyFat")}>{this.state.goalDailyFat}</Input>
              <Input style={styles.titleText} label="Protein Goal:"
                 onChangeText={(text) => this.handleInfoChange(text, "goalDailyProtein")}>{this.state.goalDailyProtein}</Input>
              <Input style={styles.titleText} label="Carbohydrate Goal:"
                 onChangeText={(text) => this.handleInfoChange(text, "goalDailyCarbohydrates")}>{this.state.goalDailyCarbohydrates}</Input>

              <TouchableOpacity title="Logout" style={styles.buttonContainer} 
                onPress={() => this.props.navigation.navigate('Guide')}>
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
              <TouchableOpacity title="Delete" style={styles.buttonContainer} 
                onPress={() => this.handleDeleteUser()}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
              </KeyboardAvoidingView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
       paddingTop: 90
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
        alignSelf: 'center',
        margin: 2
    },
    buttonText: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontWeight: '700'
    },
    titleText: {
        textAlign: 'center',
        color: '#2980b9',
        fontSize: 25
      }
})