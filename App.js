import React from 'react';
import Login from './Components/Login';
import { createAppContainer, createSwitchNavigator} from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Signup from './Components/Signup';
import User from './Components/User';
import Guide from './Components/Guide';
import Daily from './Components/Daily';
import Foods from './Components/Foods';
import Activities from './Components/Activities';
import AddActivity from './Components/AddActivity';
import EditActivity from './Components/EditActivity';
import AddFoods from './Components/AddFoods';
import AddMeals from './Components/AddMeals';
import EditMeals from './Components/EditMeals';
import ViewFoods from './Components/ViewFoods';
import EditFoods from './Components/EditFoods';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: ''
    }
  }

  render() {
    return ( 
      
     <AppNavigator></AppNavigator>
    );
  }
}

const AppNavigator = createSwitchNavigator({
  Auth: createStackNavigator({
    Guide:Guide, 
    Login:Login,
    Signup: Signup,
  }),
  Tab: { screen: createBottomTabNavigator(
    {
      Today: Daily,
      Foods: createStackNavigator({
        MealsList:Foods,
        AddFoods:AddFoods,
        AddMeals:AddMeals,
        EditMeals: EditMeals,
        ViewFoods:ViewFoods,
        EditFoods: EditFoods
      }),
      Activities:createStackNavigator({
        ActivitiesList:Activities,
        AddActivity:AddActivity,
        EditActivity:EditActivity
      }),
      User: User,
    },
    {
      tabBarOptions: {
        labelStyle: {
          fontSize: 20,
          marginBottom: 10
        }
      }
    }
  )},

})

export default createAppContainer(AppNavigator);