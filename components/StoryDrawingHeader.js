/**
 * @providesModule StoryDrawingHeader
 */

import React from 'react';

import {
  View,
  StyleSheet
} from 'react-native';

import IconButton from './IconButton';

class StoryDrawingHeader extends React.Component {

  saveAndStop() {
    this.props.onPressSave();
    this.props.onPressStop();
  }

  render() {
    return (
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <IconButton
            onPress={this.props.onPressStop}
            name="cancel"
            />
          </View>
        <View style={styles.headerRight}>
          <IconButton
            onPress={this.props.onPressUndo}
            name="undo"
            />
          <IconButton
            onPress={this.saveAndStop.bind(this)}
            name="done"
          />
        </View>
      </View>
    );
  }
}

let styles = StyleSheet.create({

  header: {
    paddingTop: 16,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    marginRight: 8 + 12,
  },
  headerLeft: {
    flexDirection: 'row',
  }

});

export default StoryDrawingHeader;
