import React, { Component } from "react";
import {View, StyleSheet, TouchableOpacity, Text, AsyncStorage} from 'react-native';
import { ListItem, Input } from 'react-native-elements';
import DatePicker from 'react-native-datepicker'
import Activities from './Activities';

export default class EditFoods extends Component {
  constructor(props) {
    super(props);
    this.state = {
     name: "",
     calories: "",
     carbohydrates:"",
     fat:"",
     protein:"",
     foodId:"",
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
      const calories = await AsyncStorage.getItem('calories');
      const name = await AsyncStorage.getItem('name');
      const carbohydrates = await AsyncStorage.getItem('carbohydrates');
      const fat = await AsyncStorage.getItem('fat');
      const protein = await AsyncStorage.getItem('protein');
      const foodId = await AsyncStorage.getItem('foodId');
      this.setState({token:token1, id: id, calories:calories, name: name, carbohydrates:carbohydrates, fat:fat, 
            protein:protein, foodId:foodId});
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
      fetch('https://mysqlcs639.cs.wisc.edu/meals/'+ this.state.id + '/foods/', { 
          method: 'PUT',
          headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token': this.state.token
          },
          body: JSON.stringify (
          {
            name: this.state.name,
            duration: this.state.duration,
            date: this.state.date,
            calories: this.state.calories
          }    
          )
      })
          .then(response => { 
              console.log(response)
              if (response.status == 500) {
                  console.log("error")
              } else if (response.status == 200) {
                this.props.navigation.navigate('ViewFoods');
                return response.json();
                  
              }
          } )
          .catch(error => console.error(error));
      
    } 
    handleDelete() {
      console.log(this.state.date);
      fetch('https://mysqlcs639.cs.wisc.edu/meals/'+ this.state.id + '/foods/' + this.state.foodId, { 
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
                this.props.navigation.navigate('ViewFoods');
                return response.json();
                  
              }
          } )
          .catch(error => console.error(error));
      
    }
    
  render() {
    return (
     
       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          
            <Input style={styles.titleText} label="Food: "
              onChangeText={(text) => this.handleCreation(text, "name")}>{this.state.name}</Input>
            <Input style={styles.titleText} label="Calories: "
                onChangeText={(text) => this.handleCreation(text, "calories")}>{this.state.calories}</Input>
            <Input style={styles.titleText} label="Carbohydrates:"
                onChangeText={(text) => this.handleCreation(text, "carbohydrates")}>{this.state.carbohydrates}</Input>
            <Input style={styles.titleText} label="Protein:"
                onChangeText={(text) => this.handleCreation(text, "protein")}>{this.state.protein}</Input>
            <Input style={styles.titleText} label="Fat:"
                onChangeText={(text) => this.handleCreation(text, "fat")}>{this.state.fat}</Input>
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