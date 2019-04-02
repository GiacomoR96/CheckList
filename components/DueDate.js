import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  DatePickerIOS,
  DatePickerAndroid,
  TimePickerAndroid,
  StyleSheet
} from 'react-native';

import moment from "moment";
const TINT_COLOR = 'rgb(4, 159, 239)';

export default class DueDate extends React.Component {
  state = {
    isIOSPickerVisible: false,
  };

  _showPicker = () => {
    if (Platform.OS == 'ios') {
      this.setState({ isIOSPickerVisible: !this.state.isIOSPickerVisible });
    } else {
      this._showAndroidDatePicker();
    }
  };

  _showAndroidDatePicker = async () => {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: this.props.dueDate,
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        const newValue = moment(this.props.dueDate)
          .year(year)
          .month(month)
          .date(day)
          .toDate();

        this._showAndroidTimePicker(newValue);
      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  };

  _showAndroidTimePicker = async (value) => {
    try {
      const { action, hour, minute } = await TimePickerAndroid.open({
        hour: moment(value).hour(),
        minute: moment(value).minute(),
        is24Hour: true, // Will display ’2 PM’
      });
      if (action !== TimePickerAndroid.dismissedAction) {
        // Selected hour (0-23), minute (0-59)
        const newValue = moment(value)
          .hour(hour)
          .minute(minute)
          .toDate();

        // Grazie a questa callback che utilizziamo, andiamo a settare il nuovo valore di DueDate nel padre AddTodo,
        // attraverso ciò il padre grazie al this.setState andra' ad aggiornare il suo stato e mandera' il nuovo stato
        // a DueDate visualizzando cosi la modifica

        this.props.onDateChange(newValue);
      }
    } catch ({ code, message }) {
      console.warn('Cannot open time picker', message);
    }
  };

  renderIOSPicker = () => (
    <DatePickerIOS
      date={new Date(this.props.dueDate)}
      onDateChange={newValue => this.props.onDateChange(newValue)}
    />
  );

  render() {
    return (
      <View>
        <TouchableOpacity activeOpacity={0.6} onPress={this._showPicker}>
          <View style={styles.pickerRow}>
            <Text style={styles.label}>Due Date</Text>
            <Text
              style={[
                styles.label,
                this.state.isIOSPickerVisible ? { color: TINT_COLOR } : {},
              ]}>
              { moment(this.props.dueDate).format('lll') }
            </Text>
          </View>
        </TouchableOpacity>
        {Platform.OS === 'ios' && this.state.isIOSPickerVisible
          ? this.renderIOSPicker()
          : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  label: {
    fontSize: 18,
  },
});
