import React from 'react';
import { StackNavigator } from "react-navigation";

import TodoList from "./components/TodoList";
import AddTodo from "./components/AddTodo";
import Login from "./screens/Login"
import * as firebase from 'firebase';

var config = {
  apiKey: "AIzaSyA8buCD_6NwWiKk7hu0vksZ4X2Svt2Xz44",
  authDomain: "project-checklist-5e7f2.firebaseapp.com",
  databaseURL: "https://project-checklist-5e7f2.firebaseio.com",
  projectId: "project-checklist-5e7f2",
  storageBucket: "project-checklist-5e7f2.appspot.com",
  messagingSenderId: "66182901639"
};
!firebase.apps.length ? firebase.initializeApp(config) : null;

const App = StackNavigator(
  {
    //Route utilizzate all'interno dell'app
    TodoList: {
      screen : TodoList
    },
    AddTodo: {
      screen : AddTodo
    },
   Login: {
     screen: Login
   }
  },
  {
    //Comportamento StackNavigator
    initialRouteName: "Login",
    mode: "modal",
  }
);

export default App;