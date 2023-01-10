/* eslint-disable react-native/no-inline-styles */
import {View, StyleSheet, Pressable} from 'react-native';
import React, {useState} from 'react';
import Ionicon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CallActionBox = ({onHangupPress}) => {
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  const onReverseCamera = () => {};

  const onToggleCamera = () => {
    setIsCameraOn(currentValue => !currentValue); // permet d'afficher une icone differente selon le mode
  };

  const onToggleMicrophone = () => {
    setIsMicOn(currentValue => !currentValue);
  };

  return (
    <View style={styles.buttonsContainer}>
      <Pressable onPress={onReverseCamera} style={styles.iconButton}>
        <Ionicon name="ios-camera-reverse" size={30} color={'white'} />
      </Pressable>

      <Pressable onPress={onToggleCamera} style={styles.iconButton}>
        <MaterialCommunityIcons
          name={isCameraOn ? 'camera-off' : 'camera'}
          size={30}
          color={'white'}
        />
      </Pressable>

      <Pressable onPress={onToggleMicrophone} style={styles.iconButton}>
        <MaterialIcons
          name={isMicOn ? 'microphone-off' : 'microphone'}
          size={30}
          color={'white'}
        />
      </Pressable>

      <Pressable
        onPress={onHangupPress}
        style={[styles.iconButton, {backgroundColor: 'red'}]}>
        <MaterialIcons name="phone-hangup" size={30} color={'white'} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    backgroundColor: '#333333',
    padding: 20,
    paddingBottom: 40,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  iconButton: {
    backgroundColor: '#4a4a4a',
    padding: 15,
    borderRadius: 50,
  },
});

export default CallActionBox;
