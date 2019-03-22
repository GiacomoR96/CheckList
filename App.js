import React from 'react';

import { StackNavigator } from "react-navigation";

import TodoList from "./components/TodoList";
import AddTodo from "./components/AddTodo";

const App = StackNavigator(
  {
    //Route utilizzate all'interno dell'app
    TodoList: {
      screen : TodoList
    },
    AddTodo: {
      screen : AddTodo
    }
  },
  {
    //Comportamento StackNavigator
    initialRouteName: "TodoList",
    mode: "modal",
  }
);

export default App;