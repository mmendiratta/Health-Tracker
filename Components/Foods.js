import React, { Component } from "react";
import {ScrollView, StyleSheet, TouchableOpacity, Text, AsyncStorage} from 'react-native';
import { ListItem, Input } from 'react-native-elements';

export default class Foods extends Component {
  constructor(props) {
    super(props);
    this.state = {
     name: "",
     duration: "",
     date: "",
     calories: "",
     token:'',
     meals:{}
    };
  }
  onValueChange(value) {
    this.setState({
      selected: value
    });
  }

  _retrieveData = async () => {
    try {
      //console.log("in retrieve data")
      const token1 = await AsyncStorage.getItem('token');
      
      this.setState({token: token1})
      if (token1 !== null ) {
        // We have data!!
        console.log(token1 + " " + user1);
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  updateFromApi() {
    fetch('https://mysqlcs639.cs.wisc.edu/meals/', { 
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
                this.setState({meals: data});
                
            })
            .catch(error => console.error(error));
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
    fetch('https://mysqlcs639.cs.wisc.edu/meals/', { 
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
                this.setState({meals: data});
                
            })
            .catch(error => console.error(error));
  }
  dateConvert() {
      
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');

}
  getMeals() {
    var list = [];
    //console.log("in get activities")
    for(const item of Object.entries(this.state.meals)) {
      for(const selection of Object.entries(item)) {
        //console.log(selection[1].length)
        for(let i = 0; i < selection[1].length; i++) {
          if(selection[1][i].id === undefined) {
            continue;
          }
          if(selection[1][i].date.toString().substr(0, 10) === this.dateConvert()) {
          list.push(
            <ListItem key={selection[1][i].id} title={selection[1][i].name} 
            onPress= {()=>{this.editMeals(this.state.token, selection[1][i].id, selection[1][i].name,
              selection[1][i].date)}}
            bottomDivider
            chevron />
          )
          }
        }
       // break;
      }
      // break;
    }
    return list;
  }
  async editMeals(token, id, name, date) {
    try {
      await AsyncStorage.setItem('token', token.toString());
      await AsyncStorage.setItem('id', id.toString());
      await AsyncStorage.setItem('name', name.toString());
      await AsyncStorage.setItem('date', date.toString());
    } catch (error) { }
    
    this.props.navigation.navigate('EditMeals');
  }
  
  render() {
    return (
     
       <ScrollView style={{ flex: 1}}>
            <TouchableOpacity title="Add Meal >>>"  style={styles.buttonContainer} 
                onPress={() => this.props.navigation.navigate('AddMeals')}>
              <Text style={styles.buttonText}>Add Meal >>></Text>
          </TouchableOpacity>
         {this.getMeals()}
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
      width: 450,
      alignSelf: 'center',
      margin: 2,
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