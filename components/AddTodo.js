import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Switch,
  TextInput,
  Platform,
  Button,
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

const TINT_COLOR = 'rgb(4, 159, 239)';

export default class AddTodo extends React.Component {
  state = {
    text: '',
    remindMe: false,
  };
  _save = () => {
    //console.log("PASSO 1")
    const newTodo = {
      text: this.state.text,
      done: this.state.remindMe,
    };
    this.props.navigation.state.params.addNewTodo
      ? this.props.navigation.state.params.addNewTodo(newTodo)
      : null;
    this.props.navigation.goBack();
  };

  _edit = () => {
    //console.log("PASSO 1 - ",this.props.navigation.state.params.currentTodo);
    let obj = {...this.state,OLDtext:this.props.navigation.state.params.currentTodo.text,OLDdone:this.props.navigation.state.params.currentTodo.done,};

    this.props.navigation.state.params.editTodo
      ? this.props.navigation.state.params.editTodo(obj)
      : null;
    this.props.navigation.goBack();
  };

  _editCurrentTodo = item => {
    this.setState({text:item.text,remindMe:item.remindMe})
  };

  componentDidMount() {
    if (this.props.navigation.state.params.currentTodo) {
      // Qui siamo in modalita' editing
      this._editCurrentTodo(this.props.navigation.state.params.currentTodo);
      this.props.navigation.setParams({ saveFunc: this._edit });
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
            placeholder="Name of the item"
            autoFocus
            underlineColorAndroid={TINT_COLOR}
            onChangeText={value => this.setState({ text: value })}
            //onSubmitEnding  ---> PULSANTE SALVATAGGIO
            onSubmitEditing={this._save}
          />
        </View>
        <View style={styles.todowrapper}>
          <View style={styles.remindRow}>
            <Text style={styles.label}>Remind me</Text>
            <Switch
              value={this.state.remindMe}
              onValueChange={value => this.setState({ remindMe: value })}
              onTintColor={TINT_COLOR}
            />
          </View>
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
