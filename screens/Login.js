import React, { Component } from "react";
import { View, Text } from "react-native";
import { Card, Button, FormLabel, FormInput } from "react-native-elements";

import * as firebase from "firebase";

const COLOR = 'rgb(4, 159, 239)';

class LoginForm extends Component {
  static navigationOptions = {
    title: "Login"
  };
  state = {
    isLoading: false,
    /* email: "prova@gmail.com",
    password: "prova123", */
    email: "X6@gmail.com",
    password: "Xxxxxx",
    /* email: "abcdef@gmail.com",
    password: "abcdef", */
    error: ""
  };

  _login = () => {
    this.setState({ isLoading: true }, () =>{
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(user => {
          this.setState({ isLoading: false });
          console.log("LOGIN: ",user);
          this.props.navigation.navigate("TodoList");
        })
        .catch(error => {
          this.setState({ isLoading: false, error: error.message });
          //alert(error.message);
        });
    });
  };

  _signUp = () => {
    this.setState({ isLoading: true }, () =>{
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(user => {
          this.setState({ isLoading: false });
          console.log("SIGN UP: ",user);
          this.props.navigation.navigate("TodoList");
        })
        .catch(error => {
          this.setState({ isLoading: false, error: error.message });
          //alert(error.message);
        });
    });
  };

  renderLoginOrSpinner() {
    return (
      <View style={{ justifyContent: "space-between", height: "40%", paddingTop:"3%" }}>
        <Button
          loading={this.state.isLoading}
          raised
          backgroundColor={COLOR}
          title="Login"
          onPress={this._login}
        />
        <Button
          raised
          loading={this.state.isLoading}
          backgroundColor={COLOR}
          title="Register"
          onPress={this._signUp}
        />
      </View>
    );
  }

  render() {
    return (
      <View>
        <Card>
          <FormLabel labelStyle={{textAlign: "center"}}>Email</FormLabel>
          <FormInput
            inputStyle={{textAlign: "center",width: "100%"}}
            label="E-mail"
            placeholder="Inserisci la tua email"
            onChangeText={text => this.setState({ email: text })}
            //value={this.state.email}          inputStyle
          />

          <FormLabel labelStyle={{textAlign: "center"}}>Password</FormLabel>
          <FormInput
            inputStyle={{textAlign: "center",width: "100%"}}
            secureTextEntry
            label="Password"
            placeholder="Inserisci la tua password"
            onChangeText={text => this.setState({ password: text })}
            //value={this.state.password}
          />

          {this.renderLoginOrSpinner()}
          <Text>{this.state.error}</Text>
        </Card>
      </View>
    );
  }
}

LoginForm.navigationOptions = ({ navigation }) => {
  return {
    title: 'Login',
    headerStyle: {
      backgroundColor: COLOR,
    },
    headerTintColor: 'white',
  };
};

export default LoginForm;
