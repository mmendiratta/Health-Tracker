import React, { Component } from "react";
import {ScrollView, StyleSheet, TouchableOpacity, Text, AsyncStorage} from 'react-native';
import { ListItem, Input } from 'react-native-elements';

export default class Activity extends Component {
  constructor(props) {
    super(props);
    this.state = {
     name: "",
     duration: "",
     date: "",
     calories: "",
     token:'',
     activitites:{}
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
    fetch('https://mysqlcs639.cs.wisc.edu/activities/', { 
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
                //console.log(JSON.stringify(data))
                this.setState({activitites: data});
                
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
    fetch('https://mysqlcs639.cs.wisc.edu/activities/', { 
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
                //console.log(JSON.stringify(data))
                this.setState({activitites: data});
                
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
  getActivities() {
    var list = [];
    //console.log("in get activities")
    for(const item of Object.entries(this.state.activitites)) {
      for(const selection of Object.entries(item)) {
        //console.log(selection[1].length)
        for(let i = 0; i < selection[1].length; i++) {
          if(selection[1][i].id === undefined) {
            continue;
          }
          if(selection[1][i].date.toString().substr(0, 10) === this.dateConvert()) {
          list.push(
            <ListItem key={selection[1][i].id} title={selection[1][i].name} 
            subtitle={"Calories: "+selection[1][i].calories}
            onPress= {()=>{this.editActivities(this.state.token,selection[1][i].id, selection[1][i].calories,
              selection[1][i].name, selection[1][i].date, selection[1][i].duration)}}
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
  async editActivities(token, id, calories, name, date, duration) {
    try {
      await AsyncStorage.setItem('token', token.toString());
      await AsyncStorage.setItem('id', id.toString());
      await AsyncStorage.setItem('calories', calories.toString());
      await AsyncStorage.setItem('name', name.toString());
      await AsyncStorage.setItem('date', date.toString());
      await AsyncStorage.setItem('duration', duration.toString());
    } catch (error) { }
    
    this.props.navigation.navigate('EditActivity');
  }
  
  render() {
    return (
     
       <ScrollView style={{ flex: 1}}>
            <TouchableOpacity title="Add Activity >>>"  style={styles.buttonContainer} 
                onPress={() => this.props.navigation.navigate('AddActivity')}>
              <Text style={styles.buttonText}>Add Activity >>></Text>
          </TouchableOpacity>
           {this.getActivities()}
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