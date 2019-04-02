import React from 'react';
import {
  View,
  StyleSheet,
  TouchableHighlight,
  FlatList,
  StatusBar,
  AsyncStorage,
  Button,
  ActivityIndicator
} from 'react-native';

import { Constants } from 'expo';
import { MaterialIcons } from '@expo/vector-icons';
import Todo from './Todo';
import * as firebase from 'firebase';

const COLOR = 'rgb(4, 159, 239)';
const DIM_ICON = 24;

//Altra possibilità     dark-content
StatusBar.setBarStyle('light-content');

/* MAP; FILTER; REDUCE */
const todolist = [];

//const firebaseDB = firebase.database();

export default class TodoList extends React.Component {
  state = {
    todolist: todolist || [],
    path: "",
    isLoading: false
  };

  renderRow = ({ item }) => (
    <Todo data={item} onChangeToggle={() => this._changeToggle(item)} onEditTodo={() => this._editTodo(item)} onDeleteTodo={() => this._delete(item)} />
  );
  _keyExtractor = (item, index) => {
    return item.id;
  }; 

  // Funzione attraverso il quale si crea un record dinamico nel caso in cui non sono presenti record nel Database
  _checkLoad = (path) =>{
    let newTodo = { text: 'Elemento di prova..', done: false, dueDate:new Date(), remindPhoto : "..." };
    console.log("Inizializzazione DB utente...");
    //console.log("-GENERO PRIMO ELEMENTO- -> ",newTodo)
    firebase.database().ref(path).push(newTodo);
    this._loadData();
  }

  _checkExistData = (path) =>{
    let ris = false;
  /*  firebase.database().ref(path).once("value",snap =>{
      //if(snap.numChildren()===0){
      if(snap.isNewUser()){ 
        ris = true;
      }
    }); */

    /* firebase.auth().signInWithPopup(provider).then((result) => {
      console.log(result.additionalUserInfo.isNewUser);
    }); */

    if(firebase.auth().currentUser.metadata.creationTime === firebase.auth().currentUser.metadata.lastSignInTime){
      ris=true;
    }
    return ris;
  }

  _loadData = () => {
    const currentUID = firebase.auth().currentUser.uid;
    if(currentUID){
      const path = this.state.isLoading ? this.state.path : "/users/" + currentUID + "/todolist";
      console.log("PATH_> ",path)
      this.setState({ path: path }); 

      if(this._checkExistData(path)){
        console.log("ENTRO QUI")
        this._checkLoad(path);
      }
      else{
        /* firebase.database().ref(path).on('value', result => {
          console.log("CURRENT: ",result)
          
          if(result != null){
            let tmp1 = [Object.values(Object.values(result.val()))];
            console.log("result1-1: ",tmp1)
            //tmp1 = tmp1.values(result.val());
            console.log("result1: ",tmp1)
            let tmp = {id:Object.keys(result)};
            console.log("result: ",tmp)
          //this.setState({ todolist: Object.values(result.val()), path: path })
          }
        }); */
        let newTodolist = []
        firebase.database().ref(path).on('value', result =>{
          //console.log("+++",Object.values(result))
          result.forEach( element => {
            //let id = Object.keys(result);
            newTodolist.push({id: element.key,...element.val()});
            //console.log("<-----",newTodolist);
          })
          
          console.log("Elementi caricati: ",newTodolist)
          this.setState({ todolist: newTodolist, path: path, isLoading : true })
        });

        
        //this.setState({ todolist: Object.values(result.val()).reverse(), path: path })   
      }
      
    }
  }
  
  componentWillMount() {
    this.props.navigation.setParams({ addNewTodo: this._add });
    this._loadData();
  }

  _add = newTodo => {
    newTodo.dueDate = newTodo.dueDate.toISOString();
    firebase.database().ref(this.state.path).push(newTodo);
    this._loadData();
  };

  _edit = item => {
    console.log("EDIT-> ",item);
    this.state.todolist.forEach( current => {
      if(current.id === item.id){
        var newElement = {
          text : item.text,
          done : item.done,
          dueDate : item.dueDate,
          remindPhoto : item.remindPhoto
        }
        var elementRef = firebase.database().ref(this.state.path+"/"+item.id);
        elementRef.update(newElement).then(this._loadData);
      }
    });

  };

  _delete = item =>{
    console.log("DELETE-> ",item);    
    var elementRef = firebase.database().ref(this.state.path+"/"+item.id);
    elementRef.remove().then(this._loadData);
  }

  _changeToggle = (item) =>{
    item.done = !item.done;
    this._edit(item);
  }

  _editTodo = (item) =>{
    this.props.navigation.navigate('AddTodo', { editTodo: this._edit, currentTodo : item }); 
  }


  render() {
    return (
      <View style={styles.container}>
      {
        (this.state.isLoading===false) ? 
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={COLOR} />
        </View> :
        <FlatList
          data={this.state.todolist}
          renderItem={this.renderRow}
          keyExtractor={this._keyExtractor}
        />
      }
        
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
    backgroundColor: "#ecf0f1"
  },
  button: {
    paddingRight: 10
  },
  buttonAdd: {
    color: 'white'
  },
  loading: {
    justifyContent: "center",
    flexDirection:"row"
  }
});