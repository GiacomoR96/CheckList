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

export default class TodoList extends React.Component {
  state = {
    todolist: todolist || [],
  };

  renderRow = ({ item }) => (
    <Todo data={item} onChangeToggle={() => this._changeToggle(item)} onEditTodo={() => this._editTodo(item)} onDeleteTodo={() => this._delete(item)} />
  );
  //Modifica - Inserimento dinamico dell'id in ogni singolo record di todolist
  _keyExtractor = (item, index) => {
    item.id = index;
    return String(index)
  }; 

  // Funzione attraverso il quale si crea un record dinamico nel caso in cui non sono presenti record nel Database
  _checkLoad = () =>{
    if(this.state.todolist.length === 0){
      let newTodolist = [{ text: 'Elemento di prova..', done: false, dueDate:new Date()}]
      this.setState({todolist:newTodolist});
    }
  }

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
    },this._checkLoad);
  }

  componentDidMount() {
    this._loadData();
    this.props.navigation.setParams({ addNewTodo: this._add });
  }

  _add = newTodo => {
    //Per aggiungere un nuovo oggetto alla todolist, abbiamo 2 metodi
    /* const newTodolist = this.state.todolist.concat([newTodo]);
    this.setState({todolist:newTodolist}); */
    // Ottimizzazione tramite lo spreadOperator
    let newTodoList = [...this.state.todolist, newTodo];
    this._storeData(newTodoList);
  };

  _edit = item => {
    // Qui ci occupiamo della modifica del record corrente
    let newTodolist = this.state.todolist.map( currentTodo => (currentTodo.id == item.id) ? {...item} : currentTodo);
    console.log("RISULTATO-> ",newTodolist);
    this._storeData(newTodolist);
  };


  _delete = item =>{
    let newTodolist = this.state.todolist.filter( current => current.id !== item.id );
    //console.log("<-DOPO-> ",newTodolist);
    this._storeData(newTodolist);    
  }

  _changeToggle = (item) =>{
    let newTodolist = this.state.todolist.map( currentTodo => currentTodo == item ? {...currentTodo, done: !currentTodo.done} : currentTodo);
    this._storeData(newTodolist);
  }

  _editTodo = (item) =>{
    this.props.navigation.navigate('AddTodo', { editTodo: this._edit, currentTodo : item }); 
  }

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
    justifyContent: 'center',
    paddingTop: 15,
    backgroundColor: "'#ecf0f1'",
  },
  button: {
    paddingRight: 10,
  },
  buttonAdd: {
    color: 'white',
  }
});
