/* eslint-disable react-native/no-inline-styles */
import {View, Text, StyleSheet, ImageBackground, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import bg from '../../../assets/images/ios_bg.png';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import {useRoute} from '@react-navigation/native';
import {Voximplant} from 'react-native-voximplant';
import {useNavigation} from '@react-navigation/native';

const IncomingCallScreen = () => {
  const [caller, setCaller] = useState('');
  const route = useRoute();
  const {call} = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    setCaller(call.getEndpoints()[0].displayName); // recuperation de l'utilisateur qui nous appelle

    call.on(Voximplant.CallEvents.Disconnected, callEvent => {
      navigation.navigate('Contacts');
    });

    return () => {
      call.off(Voximplant.CallEvents.Disconnected);
    };
  }, [call, navigation]);

  const onDecline = () => {
    call.decline();
  };

  const onAccept = () => {
    navigation.navigate('Calling', {call, isIncomingCall: true});
  };

  return (
    <ImageBackground source={bg} style={styles.bg} resizeMode="cover">
      <Text style={styles.name}>{caller}</Text>
      <Text style={styles.phoneNumber}>GrinLive Video...</Text>

      <View style={[styles.row, {marginTop: 'auto'}]}>
        <View style={styles.iconContainer}>
          <Ionicons name="alarm" color="white" size={30} />
          <Text style={styles.iconText}>Remind Me</Text>
        </View>
        <View style={styles.iconContainer}>
          <Entypo name="message" color="white" size={30} />
          <Text style={styles.iconText}>Message</Text>
        </View>
      </View>

      <View style={styles.row}>
        {/* Decline Button */}
        <Pressable onPress={onDecline} style={styles.iconContainer}>
          <View style={styles.iconButtonContainer}>
            <Feather name="x" color="white" size={40} />
          </View>
          <Text style={styles.iconText}>Decline</Text>
        </Pressable>

        {/* Accept Button */}
        <Pressable onPress={onAccept} style={styles.iconContainer}>
          <View
            style={[styles.iconButtonContainer, {backgroundColor: '#2E7BFF'}]}>
            <Feather name="check" color="white" size={40} />
          </View>

          <Text style={styles.iconText}>Accept</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
};
// imagebackground a les memes attributs que image mais permet aussi de mettre des composants a l'interieur qui s'afficheront donc par dessus notre image
const styles = StyleSheet.create({
  name: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 100,
    marginBottom: 15,
  },
  phoneNumber: {
    fontSize: 20,
    color: 'white',
  },
  bg: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    paddingBottom: 50,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  iconText: {
    color: 'white',
    marginTop: 10,
  },
  iconButtonContainer: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 50,
    margin: 10,
  },
});

export default IncomingCallScreen;
