import React, { Component } from "react";
import {View, StyleSheet, TouchableOpacity, Text, AsyncStorage, ScrollView} from 'react-native';
import { Card, Input, ListItem} from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import { Container, Header, Content, Form, Item, Picker, Icon } from 'native-base';

export default class ViewFoods extends Component {
  constructor(props) {
    super(props);
    this.state = {
     date: "",
     name: "",
     calories: "",
     carbohydrates:"",
     fat:"",
     protein:"",
     totalCal:"",
     totalCarb:"",
     totalFat:"",
     totalProtein:"",
     measure:"",
     token:"",
     user:"",
     id:"",
     clicked: false, 
     selected:"", 
     foods: ""
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

  updateFromApi() {
    fetch('https://mysqlcs639.cs.wisc.edu/meals/' + this.state.id + '/foods', { 
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
              console.log(data)
                this.setState({foods: data});
                list = this.getFoods1();
                this.setState({totalCal:list[0], totalCarb:list[1], totalFat:list[2], totalProtein:list[3]});
            })
  }
  componentDidMount() {
    // On mount, do the first update
    this.updateFromApi(); // Function that updates component from fetch
    // Subscribe that same function to focus events on the component in the future
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
       this.updateFromApi();
       });
   }
   
   componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
    }


  async componentWillMount() {
    await this._retrieveData();
    var list = [];
    fetch('https://mysqlcs639.cs.wisc.edu/meals/' + this.state.id + '/foods', { 
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
              console.log(data)
                this.setState({foods: data});
                list = this.getFoods1();
                this.setState({totalCal:list[0], totalCarb:list[1], totalFat:list[2], totalProtein:list[3]});
                
            })
            .catch(error => console.error(error));
  }
  async editFoods(token, id, calories, name, carbohydrates, fat, protein, foodId) {
    try {
      await AsyncStorage.setItem('token', token.toString());
      await AsyncStorage.setItem('id', id.toString());
      await AsyncStorage.setItem('calories', calories.toString());
      await AsyncStorage.setItem('name', name.toString());
      await AsyncStorage.setItem('carbohydrates', carbohydrates.toString());
      await AsyncStorage.setItem('fat', fat.toString());
      await AsyncStorage.setItem('protein', protein.toString());
      await AsyncStorage.setItem('foodId', foodId.toString());
    } catch (error) { }
    
    this.props.navigation.navigate('EditFoods');
  }
  getFoods1() {
    var list = [];
    //console.log("in get activities")
    var totalCal = 0;
    var totalCarb = 0;
    var totalFat = 0;
    var totalProtein = 0;

    for(const item of Object.entries(this.state.foods)) {
        // console.log("in getFoods")
        // console.log(item)
      for(const selection of Object.entries(item)) {
        // console.log("in getFoods")
        // console.log(selection)
        // console.log(selection[1].length)
         for(let i = 0; i < selection[1].length; i++) {
           if(selection[1][i].id === undefined) {
             continue;
          }
            totalCal = totalCal + selection[1][i].calories;
            totalCarb = totalCarb + selection[1][i].carbohydrates;
            totalFat = totalFat + selection[1][i].fat;
            totalProtein = totalProtein + selection[1][i].protein;
         }
        }
    }
    console.log(totalCarb, totalCarb, totalFat, totalProtein)
    list.push(totalCal, totalCarb, totalFat, totalProtein);
    return list;
  }
  getFoods() {
    var list = [];
    //console.log("in get activities")
    for(const item of Object.entries(this.state.foods)) {
        console.log("in getFoods")
        console.log(item)
      for(const selection of Object.entries(item)) {
        console.log("in getFoods")
        console.log(selection)
        console.log(selection[1].length)
         for(let i = 0; i < selection[1].length; i++) {
           if(selection[1][i].id === undefined) {
             continue;
          }
            //if(selection[1][i].date.toString().substr(0, 10) === this.dateConvert()) {
            list.push(
                <ListItem key={selection[1][i].id} title={selection[1][i].name} 
                onPress= {()=>{this.editFoods(this.state.token, this.state.id, selection[1][i].calories,
                selection[1][i].name, selection[1][i].carbohydrates, selection[1][i].fat, selection[1][i].protein, selection[1][i].id)}}
                bottomDivider
                chevron >
                    <Text>Calories: {selection[1][i].calories}</Text>
                    <Text>Carbohydrates: {selection[1][i].carbohydrates}</Text>
                    <Text>Fat: {selection[1][i].fat}</Text>
                    <Text>Protein: {selection[1][i].protein}</Text>
                </ListItem>
            )
           //}
         }
       // break;
      }
      // break;
    }
    return list;
  }
  render() {
    return (
      <ScrollView style={{ flex: 1}}>
           { <Card title={"Meal Totals"}>
              <View>
                <Text>Calories: {this.state.totalCal} calories</Text>
                <Text>Carbohydrates: {this.state.totalCarb} grams</Text>
                <Text>Fat: {this.state.totalFat} grams</Text>
                <Text>Protein: {this.state.totalProtein} grams</Text>
              </View>
            </Card> }
          {this.getFoods()}
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