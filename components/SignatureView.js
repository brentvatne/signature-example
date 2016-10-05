import React from 'react';
import {
  View,
  PanResponder,
  StyleSheet,
} from 'react-native';

import Svg, {
  G,
  Surface,
  Path
} from 'react-native-svg';

export default class SignatureView extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      currentMax: 0,
      currentPoints: [],
      donePaths: [],
      newPaths: [],
      reaction: new Reaction(),
    };

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gs) => true,
      onMoveShouldSetPanResponder: (evt, gs) => true,
      onPanResponderGrant: (evt, gs) => this.onResponderGrant(evt, gs),
      onPanResponderMove: (evt, gs) => this.onResponderMove(evt, gs),
      onPanResponderRelease: (evt, gs) => this.onResponderRelease(evt, gs)
    });
  }

  onTouch(evt) {
    let [x, y] = [evt.nativeEvent.pageX, evt.nativeEvent.pageY];
    let newCurrentPoints = this.state.currentPoints;
    newCurrentPoints.push({x, y});

    this.setState({
      donePaths: this.state.donePaths,
      currentPoints: newCurrentPoints,
      currentMax: this.state.currentMax
    });
  }

  onResponderGrant(evt) {
    this.onTouch(evt);
  }

  onResponderMove(evt) {
    this.onTouch(evt);
  }

  onResponderRelease() {
    let newPaths = this.state.donePaths;
    if (this.state.currentPoints.length > 0) {
      // Cache the shape object so that we aren't testing
      // whether or not it changed; too many components?
      newPaths.push(
        <Path
          key={this.state.currentMax}
          d={this.state.reaction.pointsToSvg(this.state.currentPoints)}
          stroke="#000000"
          strokeWidth={4}
          fill="none"
        />
      );
    }

    this.state.reaction.addGesture(this.state.currentPoints);

    this.setState({
      donePaths: newPaths,
      currentPoints: [],
      currentMax: this.state.currentMax + 1,
    });
  }

  _onLayoutContainer = (e) => {
    this.state.reaction.setOffset(e.nativeEvent.layout);
  }

  render() {
    return (
      <View
        onLayout={this._onLayoutContainer}
        style={[
          styles.drawContainer,
          this.props.containerStyle,
          {width: this.props.width, height: this.props.height}
        ]}>
        <View {...this._panResponder.panHandlers}>
          <Svg style={styles.drawSurface} width={this.props.width} height={this.props.height}>
            <G>
              {this.state.donePaths}
              <Path
                key={this.state.currentMax}
                d={this.state.reaction.pointsToSvg(this.state.currentPoints)}
                stroke="#000000"
                strokeWidth={4}
                fill="none"
              />
            </G>
          </Svg>

          {this.props.children}
        </View>
      </View>
    );
  }
}

class Reaction {
  constructor(gestures) {
    this.gestures = gestures || [];
    this.reset();
    this._offsetX = 0;
    this._offsetY = 0;
  }

  addGesture(points) {
    if (points.length > 0) {
      this.gestures.push(points);
    }
  }

  setOffset(options) {
    this._offsetX = options.x;
    this._offsetY = options.y;
  }

  pointsToSvg(points) {
    let offsetX = this._offsetX;
    let offsetY = this._offsetY;

    if (points.length > 0) {
      var path = `M ${points[0].x - offsetX},${points[0].y - offsetY}`;
      points.forEach((point) => {
        path = path + ` L ${point.x - offsetX},${point.y - offsetY}`;
      });
      return path;
    } else {
      return '';
    }
  }

  replayLength() {
    return this.replayedGestures.length;
  }

  reset() {
    this.replayedGestures = [[]];
  }

  empty() {
    return this.gestures.length === 0;
  }

  copy() {
    return new Reaction(this.gestures.slice());
  }

  done() {
    return (
      this.empty() || (
        this.replayedGestures.length === this.gestures.length &&
        this.lastReplayedGesture().length === this.gestures[this.gestures.length-1].length
      ));
  }

  lastReplayedGesture() {
    return this.replayedGestures[this.replayedGestures.length - 1];
  }

  stepGestureLength() {
    let gestureIndex = (this.replayedGestures.length - 1);
    if (!this.gestures[gestureIndex]) {
      return;
    }
    if (this.replayedGestures[gestureIndex].length >= this.gestures[gestureIndex].length) {
      this.replayedGestures.push([]);
    }
  }

  step() {
    if (this.done()) {
      return true;
    }
    this.stepGestureLength();
    let gestureIndex = this.replayedGestures.length - 1;
    let pointIndex = this.replayedGestures[gestureIndex].length;
    let point = this.gestures[gestureIndex][pointIndex];
    this.replayedGestures[gestureIndex].push(point);
    return false;
  }
}

let styles = StyleSheet.create({
  drawContainer: {
  },
  drawSurface: {
    backgroundColor: 'transparent',
  },
});
