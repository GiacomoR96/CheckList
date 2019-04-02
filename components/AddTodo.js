import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Switch,
  TextInput,
  Platform,
  Button
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import DueDate from "./DueDate"

const TINT_COLOR = 'rgb(4, 159, 239)';

export default class AddTodo extends React.Component {
  state = {
    id: -1,
    text: '',
    done: false,
    dueDate:new Date(),
    remindPhoto : "..."
  };
  _save = () => {
    const newTodo = {
      text: this.state.text,
      done: this.state.done,
      dueDate: this.state.dueDate,
      remindPhoto: this.state.remindPhoto
    };
    this.props.navigation.state.params.addNewTodo
      ? this.props.navigation.state.params.addNewTodo(newTodo)
      : null;
    this.props.navigation.goBack();
  };

  _edit = () => {
    this.props.navigation.state.params.editTodo
      ? this.props.navigation.state.params.editTodo(this.state)
      : null;
    this.props.navigation.goBack();
  };

  _editCurrentTodo = item => {
    this.setState({text:item.text,done:item.done})
  };

  _dateChange = value => {
    //console.log("ADD_TODO - Valore ricevuto: ",value);
    this.setState({ dueDate: value });
  }

  /* Non utilizzato perche' non permette l'assegnazione dentro lo state, poiche' ovviamente viene eseguito prima della render
  componentDidMount() { 
  } */

  componentWillMount(){
    if (this.props.navigation.state.params.currentTodo) {
      // Qui siamo in modalita' editing
      this._editCurrentTodo(this.props.navigation.state.params.currentTodo);
      this.props.navigation.setParams({ saveFunc: this._edit });
      this.setState({...this.props.navigation.state.params.currentTodo})
    }
    else{
      // Qui siamo in modalita' salvataggio
      this.props.navigation.setParams({ saveFunc: this._save });
    }
   
  }

  render() {

    return (
      <View style={styles.wrapper}>
        <View style={[styles.todowrapper, { padding: 15 }]}>
          <TextInput
            value={this.state.text}
            style={[styles.textInputStyleOnAndroid, styles.label]}
            placeholder="Inserisci il nome dell'oggetto"
            underlineColorAndroid={TINT_COLOR}
            onChangeText={value => this.setState({ text: value })}
            onSubmitEditing={this._save}
          />
        </View>
        <View style={styles.todowrapper}>
          <View style={styles.remindRow}>
            <Text style={styles.label}>Ricordami</Text>
            <Switch
              value={this.state.done}
              onValueChange={value => this.setState({ done: value })}
              onTintColor={TINT_COLOR}
            />
          </View>
          <DueDate dueDate={this.state.dueDate} onDateChange={(item) => this._dateChange(item)} />
        </View>
      </View>
    );
  }
}

AddTodo.navigationOptions = ({ navigation }) => ({
  title: 'Add Todo',
  headerLeft: (
    <Button
      style={styles.buttonBack}
      title="Go back"
      onPress={() => navigation.goBack()}
    />
  ),
  headerRight: (
    <Button
      style={styles.button}
      title="Save"
      onPress={() => navigation.state.params.saveFunc()}
    />
  ),
});

const styles = StyleSheet.create({
  wrapper: { backgroundColor: '#E9E9EF', flex: 1 },
  todowrapper: {
    marginTop: 30,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  textInputStyleOnAndroid:
    Platform.OS === 'android' ? { paddingBottom: 7, paddingLeft: 7 } : {},
  remindRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
  },
  button: {
    color: 'white',
  },
  buttonBack: {
    color: 'white',
  },
});
