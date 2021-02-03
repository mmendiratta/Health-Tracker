import React from 'react';
import {Text} from 'react-native';


export default class Error extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        return(
            <Text>{this.props.error}</Text>
        )
    }
}