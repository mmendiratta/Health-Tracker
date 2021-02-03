import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

class Guide extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        showModal: false,
        token: ''
      }
    }
  
    render() {
      return ( 
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={styles.titleText} >Trackr</Text>
      <TouchableOpacity title="Login"  style={styles.buttonContainer} 
        onPress={() => this.props.navigation.navigate('Login')}>
              <Text style={styles.buttonText}>Login </Text>
          </TouchableOpacity>

      <TouchableOpacity title="Signup" style={styles.buttonContainer} 
        onPress={() => this.props.navigation.navigate('Signup')}>
              <Text style={styles.buttonText}>Signup </Text>
          </TouchableOpacity>
    </View>
      
      );
    }
  }

  export default Guide
  const styles = StyleSheet.create({
    container: {
       padding: 23,
    },
    buttonContainer: {
      backgroundColor: '#2980b9',
      paddingVertical: 15,
      width: 250,
      alignSelf: 'center',
      margin: 3
    },
    buttonText: {
      textAlign: 'center',
      color: '#FFFFFF',
      fontWeight: '700'
    },
    titleText: {
      textAlign: 'center',
      color: '#2980b9',
      fontSize: 50
    }
  })

     