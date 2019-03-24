import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

const TINT_COLOR = "rgb(4, 159, 239)";
const DIM_ICON = 24;

export default class Todo extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onChangeToggle}
      >
        <View style={styles.row}>
          {this.props.data.done ? (
            <MaterialIcons name="check-box" style={styles.iconBox} size={DIM_ICON}  />
          ) : (
            <MaterialIcons name="check-box-outline-blank" size={DIM_ICON} />
          )}
          
          <Text style={styles.text}>{this.props.data.text}</Text>
          <TouchableOpacity onPress={this.props.onDeleteTodo}>
            <MaterialIcons name="delete" style={styles.iconDelete} size={DIM_ICON} />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.props.onEditTodo}>
            <MaterialIcons name="chevron-right" style={styles.iconChevron} size={DIM_ICON} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginLeft: 8,
    marginRight: 8,
    //borderWidth: 1,
    //marginHorizontal: 10,
    padding: 10,
    backgroundColor: "white",
    alignItems: "center"
  },
  text: {
    flex: 1,
    fontSize: 18,
    marginLeft: 10
  },
  iconBox: {
    color: TINT_COLOR
  },
  iconChevron: {
    color: "black",
    paddingLeft:5
  },
  iconDelete: {
    color: "red",
    paddingRight:5
  }
});
