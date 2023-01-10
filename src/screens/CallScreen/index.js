import {View, StyleSheet} from 'react-native';
import React from 'react';
import CallActionBox from '../../components/CallActionBox';

const CallScreen = () => {
  return (
    <View style={styles.page}>
      <View style={styles.cameraPreview} />
      <CallActionBox />
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#7B4E80',
  },
  cameraPreview: {
    width: 100,
    height: 150,
    backgroundColor: '#FFFF6E',
    position: 'absolute',
    right: 10,
    top: 100,
    borderRadius: 10,
  },
});

export default CallScreen;
