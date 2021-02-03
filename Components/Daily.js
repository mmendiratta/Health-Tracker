import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import { ListItem, Card } from 'react-native-elements';
import { ProgressCircle, LineChart, Grid, StackedBarChart } from 'react-native-svg-charts';

class Daily extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      token: this.props.navigation.state.params.token.token,
      user: this.props.navigation.state.params.user,
      activities:{},
      waiting: true,
      totalDuration:0,
      totalCalories:0,
      goalDailyActivity:0,
      day7: [],
      meals: {}
    }
  }

 _storeData(totalCalories, totalDuration){
    this.setState({totalCalories: totalCalories, totalDuration:totalDuration})
  };
  _retrieveData = async () => {
    try {
      //console.log("in retrieve data")
      const totalCal1 = await AsyncStorage.getItem('totalCalories');
      const tortalDur1 = await AsyncStorage.getItem('totalDuration');
      console.log("inside retrieve cals " + totalCal1 + " dur " + tortalDur1);

      //this.setState({totalCalories: totalCal1, totalDuration: tortalDur1});
      if (totalCal1 !== null && tortalDur1 !== null) {
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
                this.setState({activities:data})
                totals = this.getActivities1();
                this.setState({totalCalories: totals[0], totalDuration: totals[1]})
                day7 = this.get7DayActivities();
                this.setState({day7:day7, waiting: false});
                
            })
            .catch(error => console.error(error));
  }
  componentDidMount() {
    this.updateFromApi(); 
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
        this.updateFromApi();
        });
    }
    
  componentWillUnmount() {
    this.focusListener.remove();
  }

  componentWillMount() {
    var totals = [];
    var day7 = [];

    fetch('https://mysqlcs639.cs.wisc.edu/activities/', { 
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
      "x-access-token":  this.state.token,
      }
    })
    .then(response => { 
        return response.json()
        })
    .then(data => {
        this.setState({activities:data})
        totals = this.getActivities1();
        this.setState({totalCalories: totals[0], totalDuration: totals[1]});
        day7 = this.get7DayActivities();
        this.setState({day7:day7});
        
    })
    .catch(error => console.error(error));
    
    fetch('https://mysqlcs639.cs.wisc.edu/meals/', {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
      "x-access-token":  this.state.token,
      }
    })
    .then(response => { 
        return response.json()
        })
    .then(data => {
        this.setState({meals:data})
        this.getMealTotals();
        
    })
    .catch(error => console.error(error));

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
                this.setState({
                    // firstName: data.firstName,
                    // lastName:data.lastName,
                    goalDailyActivity:data.goalDailyActivity,
                    // goalDailyCalories:data.goalDailyCalories,
                    // goalDailyCarbohydrates:data.goalDailyCarbohydrates,
                    // goalDailyFat:data.goalDailyFat,
                    // goalDailyProtein:data.goalDailyProtein
                    waiting: false
                });
              }) .catch(error => console.error(error));
}

getMealTotals() {
  var list = [];
  //console.log("in get activities")
  var totalCal = 0;
  var totalCarb = 0;
  var totalFat = 0;
  var totalProtein = 0;

  for(const item of Object.entries(this.state.meals)) {
  //     // console.log("in getFoods")
     //console.log(item)
    for(const selection of Object.entries(item)) {
  //     // console.log("in getFoods")
       //console.log(selection)

       for(let i = 0; i < selection[1].length; i++) {
         if(selection[1][i].id === undefined) {
           continue;
        }
       
        if(selection[1][i].date.toString().substr(0, 10) === this.dateConvert()) {
          //console.log(selection[1][i])
          fetch('https://mysqlcs639.cs.wisc.edu/meals/' + selection[1][i].id + '/foods', {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            "x-access-token":  this.state.token,
            }
          })
          .then(response => { 
              return response.json()
              })
          .then(data => {
            for(const index of Object.entries(data)) {
             
                for(const food of Object.entries(index)) {
                
                   for(let i = 0; i < food[1].length; i++) {
                     console.log(food[1][i])
                     if(selection[1][i].id === undefined) {
                       continue;
                    }
                    totalCal = totalCal + food[1][i].calories;
                    totalCarb = totalCarb + food[1][i].carbohydrates;
                    totalFat = totalFat + food[1][i].fat;
                    totalProtein = totalProtein + food[1][i].protein;
                  }
                }
              }
          })
          .catch(error => console.error(error));
        }
       }
      }
   }
  console.log(totalCal, totalCarb, totalFat, totalProtein)
  // list.push(totalCal, totalCarb, totalFat, totalProtein);
  return list;
}          
  
  dateConvert2() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
      /*if(day - 7 < 0) {
        month-1;
        day
      }*/
        //console.log([year, month, day - 7].join('-'));
    return [year, month, day - 7].join('-');
  }
  get7DayActivities() {
    var list = [];
    var cals = 0; 
    var current;
    var temp;

    for(const item of Object.entries(this.state.activities)) {
      
      for(const selection of Object.entries(item)) {
        //console.log(selection[1].length)
        for(let i = 0; i < selection[1].length; i++) {
          if(selection[1][i].id === undefined) {
            continue;
          } 
            if(selection[1][i].date.toString().substr(0, 10) >= this.dateConvert2()) {
              current = selection[1][i].date.toString().substr(0, 10);
              if (temp === undefined || current === temp) {
                cals = cals + selection[1][i].calories;
            } else {
                list.push(cals);
                cals = selection[1][i].calories;
            }
            temp = selection[1][i].date.toString().substr(0, 10);
          }
        }
      }
    }
    return list;
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
  getActivities1() {
    var list = [];
    var cals = 0;
    var dur = 0;
    //keysSorted = Object.keys(this.state.activities).sort(function(a,b){return list[a]-list[b]})

    for(const item of Object.entries(this.state.activities)) {
      for(const selection of Object.entries(item)) {
        for(let i = 0; i < selection[1].length; i++) {
          if(selection[1][i].id === undefined) {
            continue;
          }
          if(selection[1][i].date.toString().substr(0, 10) === this.dateConvert()) {
            cals = cals + selection[1][i].calories;
            dur = dur + selection[1][i].duration;
          }
        }
      }
    }
    list.push(cals, dur);
    return list;
  }
  getTotalCalories() {
    return this.state.totalCalories
  }
  getTotalDuration() {
    return this.state.totalDuration
  }
  render() {
    /*const data = [
      {
          month: new Date(2015, 0, 1),
          apples: 3840,
          bananas: 1920,
          cherries: 960,
          dates: 400,
          oranges: 400,
      },
      {
          month: new Date(2015, 1, 1),
          apples: 1600,
          bananas: 1440,
          cherries: 960,
          dates: 400,
      },
      {
          month: new Date(2015, 2, 1),
          apples: 640,
          bananas: 960,
          cherries: 3640,
          dates: 400,
      },
      {
          month: new Date(2015, 3, 1),
          apples: 3320,
          bananas: 480,
          cherries: 640,
          dates: 400,
      },
  ]

  const colors = ['#7b4173', '#a55194', '#ce6dbd', '#de9ed6']
  const keys = ['apples', 'bananas', 'cherries', 'dates']
  */
    if (this.state.waiting) {
      return <>
      <Text>Loading...</Text></>
    } else if(!this.state.waiting) {
      return (
        <ScrollView style={{ flex: 1}}>
            <TouchableOpacity title="Today's Activities"  style={styles.buttonContainer1} 
              disabled>
            <Text style={styles.buttonText}>Today's Activities</Text>
            </TouchableOpacity>
           
            { <Card>
              <View>
                <Text>Total Calories Today: {this.getTotalCalories()} calories</Text>
                <Text>Total Duration Today: {this.getTotalDuration()} minutes</Text>
              </View>
            </Card> }
            <ProgressCircle style={{ height: 200 }} progress={this.state.totalCalories / this.state.goalDailyActivity} progressColor={'#2980b9'} />
            <TouchableOpacity title="7 Day Activity Overlook" style={styles.buttonContainer2} 
              disabled>
            <Text style={styles.buttonText}>7 Day Activity Overlook</Text>
            </TouchableOpacity>
            <LineChart
                style={{ height: 200 }}
                data={this.state.day7}
                svg={{ stroke: '#2980b9' }}
                contentInset={{ top: 10, bottom: 10 }}
                yMin = {0}
                yMax = {this.state.goalDailyActivity}
                xMax = {7}
            >
                <Grid />
            </LineChart>
             {/*<TouchableOpacity title="Today's Food" style={styles.buttonContainer2} 
              disabled>
            <Text style={styles.buttonText}>Today's Food</Text>
            </TouchableOpacity>
           <StackedBarChart
                style={{ height: 200 }}
                keys={keys}
                colors={colors}
                data={data}
                showGrid={false}
                horizontal={true}
                contentInset={{ top: 30, bottom: 30 }}
            />*/}
            </ScrollView>
      );
    }
  }
}
export default Daily
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
  buttonContainer1: {
      backgroundColor: '#2980b9',
      paddingVertical: 15,
      width: 450,
      alignSelf: 'center',
      marginTop: 90,
  },
  buttonContainer2: {
    backgroundColor: '#2980b9',
    paddingVertical: 15,
    width: 450,
    alignSelf: 'center',
    marginTop: 20,
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