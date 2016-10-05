/**
 * @providesModule IconButton
 */

'use strict';

import React from 'react';

import {
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';

import { MaterialIcons } from '@exponent/vector-icons';

class IconButton extends React.Component {

  render() {
    return (
      <TouchableOpacity style={styles.iconButton} onPress={this.props.onPress}>
        <MaterialIcons name={this.props.name} size={32} style={styles.icon} />
      </TouchableOpacity>
    )
  }
}

let iconSize = 48;

let styles = StyleSheet.create({
  icon: {
    marginLeft: 24
  },
});

module.exports = IconButton;
