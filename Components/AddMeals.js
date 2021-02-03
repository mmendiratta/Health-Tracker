import React, { Component } from "react";
import {View, StyleSheet, TouchableOpacity, Text, AsyncStorage, KeyboardAvoidingView} from 'react-native';
import { ListItem, Input } from 'react-native-elements';
import DatePicker from 'react-native-datepicker'

export default class AddMeals extends Component {
  constructor(props) {
    super(props);
    this.state = {
     name: "",
     date: "",
     token:"",
     clicked: false
    };
  }
  _retrieveData = async () => {
    try {
      console.log("in retrieve data")
      const token1 = await AsyncStorage.getItem('token');
      console.log('retrieved token ' + token1)
      
      this.setState({token: token1})
      if (token1 !== null) {
        // We have data!!
        console.log(token1 + " " + user1);
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  async handleCreation(text, name) {
    //onsole.log("in handle creation");
    this.setState({[ name]:text });
     await this._retrieveData();
  }
  handleClick() {
      console.log(this.state.token);
      fetch('https://mysqlcs639.cs.wisc.edu/meals/', { 
          method: 'POST',
          headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token': this.state.token
          },
          body: JSON.stringify (
            {
              name: this.state.name,
              date: this.state.date
            }    
          )
        })
        .then(response => { 
            console.log(response)
            if (response.status == 500) {
                console.log("error")
            } else if (response.status == 200) {
                this.props.navigation.navigate('MealsList');
                return response.json();
                
            }
        } )
        .catch(error => console.error(error));
  }
    
  render() {
    return (
     
       <View style={styles.container}>
          <KeyboardAvoidingView  enabled>

           <DatePicker
              style={{width: 200}}
              date={this.state.date}
              mode="datetime"
              placeholder="Select Date"
              format="YYYY-MM-DD"
              minDate="2016-05-01"
              maxDate={new Date()}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              onDateChange={(date) => {this.setState({date: date})}}
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0
                },
                dateInput: {
                  marginLeft: 36
                }
              }}
              
            />
            <Input style={styles.titleText} label="Meal Name:"
              onChangeText={(text) => this.handleCreation(text, "name")}>{this.state.name}</Input>

            <TouchableOpacity title="Submit"  style={styles.buttonContainer} 
                onPress={() => this.handleClick(this.state.user)}
                >
              <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
     </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
     paddingTop: 23
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
      margin: 10
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