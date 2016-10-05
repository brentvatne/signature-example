import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  takeSnapshotAsync,
} from 'exponent';

import SignatureView from '../components/SignatureView';
import IconButton from '../components/IconButton';

export default class SignatureScreen extends React.Component {
  static route = {
    navigationBar: {
      visible: false,
    },
  }

  state = {
    result: null,
  }

  _cancel = () => {

  }

  _undo = () => {

  }

  _save = async () => {
    let result = await takeSnapshotAsync(this._signatureView, {format: 'png', result: 'base64', quality: 1.0});
    this.setState({result});
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <SignatureView
          ref={view => { this._signatureView = view; }}
          containerStyle={{backgroundColor: 'rgba(0,0,0,0.01)', marginTop: 60}}
          width={Dimensions.get('window').width}
          height={200}
        />

        {this.state.result && (
          <Image
            source={{uri: `data:image/png;base64,${this.state.result}`}}
            style={{width: Dimensions.get('window').width / 2, height: 100}}
          />
        )}

        {this._renderHeader()}
      </View>
    );
  }

  _renderHeader() {
    return (
      <View style={{position: 'absolute', top: 0, left: 0, right:0, height: 50}}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <IconButton
              onPress={this._cancel}
              name="cancel"
              />
            </View>
          <View style={styles.headerRight}>
            <IconButton
              onPress={this._undo}
              name="undo"
              />
            <IconButton
              onPress={this._save}
              name="done"
            />
          </View>
        </View>
      </View>
    )
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
