import React from 'react';
import {
  View,
  StyleSheet,
  TouchableHighlight,
  FlatList,
  StatusBar,
  AsyncStorage,
  Button,
} from 'react-native';

import { Constants } from 'expo';
import { MaterialIcons } from '@expo/vector-icons';

import Todo from './Todo';
const COLOR = 'rgb(4, 159, 239)';
const DIM_ICON = 24;
//Altra possibilità     dark-content
StatusBar.setBarStyle('light-content');

/* MAP; FILTER; REDUCE */

const todolist = [];
/* { text: 'Walk the dog', done: false },
  { text: 'Go shopping on Amazon', done: false },
  { text: 'Wash the dish', done: false },
  { text: 'Call Steve', done: true },
  { text: 'Call Ray', done: false },
  { text: 'Buy a present to Ippo', done: false }, */

export default class TodoList extends React.Component {
  state = {
    todolist: todolist || [],
  };

  renderRow = ({ item }) => (
    <Todo data={item} onChangeToggle={() => this._changeToggle(item)} onEditTodo={() => this._editTodo(item)} />
  );
  _keyExtractor = (item, index) => index;

  async _storeData(newTodolist) {
    this.setState({ todolist: newTodolist });

    try {
      await AsyncStorage.setItem('todolist', JSON.stringify(newTodolist));
    } catch (error) {
      console.log('Errore nello salvataggio dei dati!');
    }
  }

  async _loadData() {
    const response = await AsyncStorage.getItem('todolist');
    this.setState({
      todolist: response ? await JSON.parse(response) : todolist,
    });
  }

  componentDidMount() {
    this._loadData();
    this.props.navigation.setParams({ addNewTodo: this._add });
  }

  _add = newTodo => {
    //Per aggiungere un nuovo oggetto alla todolist, abbiamo 2 metodi
    /* const newTodolist = this.state.todolist.concat([newTodo]);
    this.setState({todolist:newTodolist}); */
    let newTodoList = [...this.state.todolist, newTodo];
    this._storeData(newTodoList);
  };

  _edit = item => {
    // Qui ci occupiamo della modifica del record corrente
    console.log("Padre -EDIT todo -",item);
    let old = {text:item.OLDtext, done:item.OLDdone};
    //Per aggiungere un nuovo oggetto alla todolist, abbiamo 2 metodi
    /* const newTodolist = this.state.todolist.concat([newTodo]);
    this.setState({todolist:newTodolist}); */
    /* let newTodoList = [...this.state.todolist, newTodo];
    this._storeData(newTodoList); */
    let newTodolist = this.state.todolist.map( currentTodo => (currentTodo.text == old.text && currentTodo.done == old.done) ? {text:item.text, done: item.remindMe} : currentTodo);
    //console.log("RISULTATO-> ",newTodolist);
    this._storeData(newTodolist);
  };

  _changeToggle = (item) =>{
    //console.log("CI PASSO;")
    let newTodolist = this.state.todolist.map( currentTodo => currentTodo == item ? {...currentTodo, done: !currentTodo.done} : currentTodo);
    this._storeData(newTodolist);
  }

  _editTodo = (item) =>{
    console.log("EDIT TODO ♥");
    this.props.navigation.navigate('AddTodo', {
            editTodo: this._edit,
            currentTodo : item
          }) 
  }
  /* async _saveEdit(todo) {
    // _keyExtractor = (item, index) => index;

    const 
    this.setState({ todolist: newTodolist });

    try {
      await AsyncStorage.setItem('todolist', JSON.stringify(newTodolist));
    } catch (error) {
      console.log('Errore nello salvataggio dei dati!');
    }
  } */

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.todolist}
          renderItem={this.renderRow}
          keyExtractor={this._keyExtractor}
        />
      </View>
    );
  }
}

/* <Button
          title="Add Todo"
          onPress={() =>
            this.props.navigation.navigate('AddTodo', { addNewTodo: this._add })
          }
        /> */

TodoList.navigationOptions = ({ navigation }) => {
  return {
    title: 'CheckList',
    headerStyle: {
      backgroundColor: COLOR,
    },
    headerTintColor: 'white',
    headerRight: (
      <TouchableHighlight
        style={styles.button}
        onPress={() =>
          navigation.navigate('AddTodo', {
            addNewTodo: navigation.state.params.addNewTodo,
          })
        }>
        <MaterialIcons
          name="add-circle-outline"
          size={30}
          style={styles.buttonAdd}
        />
      </TouchableHighlight>
    ),
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  button: {
    paddingRight: 10,
  },
  buttonAdd: {
    color: 'white',
  },
});
