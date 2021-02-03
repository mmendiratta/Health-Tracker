import React, { Component } from "react";
import {View, StyleSheet, TouchableOpacity, Text, AsyncStorage, KeyboardAvoidingView} from 'react-native';
import { ListItem, Input } from 'react-native-elements';
import DatePicker from 'react-native-datepicker'
import Activities from './Activities';

export default class EditMeals extends Component {
  constructor(props) {
    super(props);
    this.state = {
     name: "",
     date: "",
     token:"",
     user:"",
     clicked: false,
     id:""
    };
  }
  
  async componentWillMount() {
    try {
      const token1 = await AsyncStorage.getItem('token');
      const id = await AsyncStorage.getItem('id');
      const name = await AsyncStorage.getItem('name');
      const date = await AsyncStorage.getItem('date');

      this.setState({token:token1, id: id, name: name, date:date})
      if (token1 !== null) {
        // We have data!!
        console.log(token1 + " " + user1);
      }
    } catch (error) {
      // Error retrieving data
    }

}

  handleCreation(text, name) {
    //onsole.log("in handle creation");
    this.setState({[ name]:text });
    }
  handleClick() {
      console.log(this.state.date);
      fetch('https://mysqlcs639.cs.wisc.edu/meals/'+ this.state.id, { 
          method: 'PUT',
          headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token': this.state.token
          },
          body: JSON.stringify (
          {
            name: this.state.name,
            date: this.state.date,
          }    
          )
      })
          .then(response => { 
              console.log(response)
              if (response.status == 500) {
                  console.log("error")
              } else if (response.status == 200) {
                this.props.navigation.navigate('ActivitiesList');
                return response.json();
                  
              }
          } )
          .catch(error => console.error(error));
      
    } 
    handleDelete() {
      console.log(this.state.date);
      fetch('https://mysqlcs639.cs.wisc.edu/meals/'+ this.state.id, { 
          method: 'DELETE',
          headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token': this.state.token
          },
      })
          .then(response => { 
              console.log(response)
              if (response.status == 500) {
                  console.log("error")
              } else if (response.status == 200) {
                this.props.navigation.navigate('Foods');
                return response.json();
                  
              }
          } )
          .catch(error => console.error(error));
      
    }
    
  render() {
    return (
      <>
       <TouchableOpacity title="Add Foods >>>"  style={styles.buttonContainer} 
          onPress={() => this.props.navigation.navigate('AddFoods')}
          >
          <Text style={styles.buttonText}>Add Food >>></Text>
        </TouchableOpacity>
        <TouchableOpacity title="View Foods >>>"  style={styles.buttonContainer} 
          onPress={() => this.props.navigation.navigate('ViewFoods')}
          >
          <Text style={styles.buttonText}>View Food >>></Text>
        </TouchableOpacity>
       <View style={styles.container}>
           
           <DatePicker
              style={{width: 200}}
              date={this.state.date}
              mode="date"
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
            <KeyboardAvoidingView>
            <Input label="Date:" disabled>{this.state.date.toString().substr(0, 10)} </Input>
            <Input style={styles.titleText} label="Activity:"
              onChangeText={(text) => this.handleCreation(text, "name")}>{this.state.name}</Input>
              </KeyboardAvoidingView>
            <TouchableOpacity title="Submit"  style={styles.buttonContainer} 
                onPress={() => this.handleClick(this.state.user)}
                >
              <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity title="Delete"  style={styles.buttonContainer} 
                onPress={() => this.handleDelete(this.state.user)}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>

     </View>
     </>
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
      margin: 15
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