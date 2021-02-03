import React, { Component } from "react";
import {View, StyleSheet, TouchableOpacity, Text, AsyncStorage, ScrollView} from 'react-native';
import { ListItem, Input } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import { Container, Header, Content, Form, Item, Picker, Icon } from 'native-base';

export default class AddFoods extends Component {
  constructor(props) {
    super(props);
    this.state = {
     
     date: "",
     name: "",
     calories: "",
     carbohydrates:"",
     fat:"",
     protein:"",
     measure:"",
     token:"",
     user:"",
     id:"",
     clicked: false, 
     selected:"", 

    };
  }
  
  _retrieveData = async () => {
    try {
      console.log("in retrieve data")
      const token1 = await AsyncStorage.getItem('token');
      console.log('retrieved token ' + token1)
      
      const id = await AsyncStorage.getItem('id');
      console.log('retrieved user ' + id)
      
      this.setState({token: token1, id: id})
      if (token1 !== null || user1 !== null) {
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
      console.log(this.state.date);
      fetch('https://mysqlcs639.cs.wisc.edu/meals/' + this.state.id + '/foods', { 
          method: 'POST',
          headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token': this.state.token
          },
          body: JSON.stringify (
          {
            name: this.state.name,
            calories: this.state.calories,
            carbohydrates: this.state.carbohydrates,
            fat: this.state.fat,
            protein: this.state.protein,
            measure:this.state.measure
          }    
          )
        })
        .then(response => { 
            console.log(response)
            if (response.status == 500) {
                console.log("error")
            } else if (response.status == 200) {
                this.props.navigation.navigate('EditMeals');
                return response.json();
                
            }
        } )
        .catch(error => console.error(error));
  }
  changeValue(value) {
    this._retrieveData();
    this.setState({selected:value});

    fetch('https://mysqlcs639.cs.wisc.edu/foods/' + value, { 
          method: 'GET',
          headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token': this.state.token
          }
        }) .then(response => { 
          return response.json()
            })
        .then(data => {
          console.log(data)
         this.setState({
          name: data.name,
          calories: data.calories,
          carbohydrates: data.carbohydrates,
          fat: data.fat,
          protein: data.protein,
          measure:data.measure,
         })
      })
      .catch(error => console.error(error));
  }
    
  render() {
    return (
      <ScrollView style={{ flex: 1}}>
          <Form>
            <Item picker>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={{ flex: 1 }}
                placeholder="Select a food item"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.selected}
                onValueChange={(value)=>this.changeValue(value)}
              >
                <Picker.Item label="Egg" value="1" />
                <Picker.Item label="Whole Wheat Bread" value="2" />
                <Picker.Item label="Skim Milk" value="3" />
                <Picker.Item label="Bacon" value="4" />
                <Picker.Item label="Chocolate Milk" value="5" />
                <Picker.Item label="Chicken Breast" value="6" />
                <Picker.Item label="Bagel" value="7" />
                <Picker.Item label="White Rice" value="8" />
              </Picker>
            </Item>
          </Form>
    
            <Input disabled style={styles.titleText} label="Food:"
              onChangeText={(text) => this.handleCreation(text, "name")}>{this.state.name}</Input>
            <Input disabled style={styles.titleText} label="Calories: "
                onChangeText={(text) => this.handleCreation(text, "calories")}>{this.state.calories}</Input>
            <Input disabled style={styles.titleText} label="Carbohydrates: "
                onChangeText={(text) => this.handleCreation(text, "carbohydrates")}>{this.state.carbohydrates}</Input>
             <Input disabled style={styles.titleText} label="Fat: "
                onChangeText={(text) => this.handleCreation(text, "fat")}>{this.state.fat}</Input>
             <Input disabled style={styles.titleText} label="Protein: "
                onChangeText={(text) => this.handleCreation(text, "protein")}>{this.state.protein}</Input>
             <Input disabled style={styles.titleText} label="Measure: "
                onChangeText={(text) => this.handleCreation(text, "measure")}>{this.state.measure}</Input>
            <TouchableOpacity title="Submit"  style={styles.buttonContainer} 
                onPress={() => this.handleClick(this.state.user)}
                >
                    
                
              <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
     </ScrollView>
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