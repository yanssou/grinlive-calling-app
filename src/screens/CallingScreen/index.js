import {
  View,
  Text,
  StyleSheet,
  Pressable,
  PermissionsAndroid,
  Alert,
  Platform,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import CallActionBox from '../../components/CallActionBox';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Voximplant} from 'react-native-voximplant';

const permissions = [
  PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  PermissionsAndroid.PERMISSIONS.CAMERA,
];

const CallingScreen = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [callStatus, setCallStatus] = useState('Initializing');

  const navigation = useNavigation();
  const route = useRoute(); // va permettre de recuperer les donnees du user que l'on appelle
  const {user, call: incomingCall, isIncomingCall} = route?.params; // on utilise ? car il se peut que le user ne soit pas renseigné
  const voximplant = Voximplant.getInstance();

  const call = useRef(incomingCall); // permet de ne pas reset la variable a chaque fois que la page est chargee

  const goBack = () => {
    navigation.pop();
  };

  useEffect(() => {
    // obtention des permission audio et video sur android
    const getPermissions = async () => {
      const granted = await PermissionsAndroid.requestMultiple(permissions);
      const recordAudioGranted =
        granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === 'granted';
      const cameraGranted =
        granted[PermissionsAndroid.PERMISSIONS.CAMERA] === 'granted';
      if (!cameraGranted || !recordAudioGranted) {
        Alert.alert('Permissions are not granted');
      } else {
        setPermissionGranted(true);
      }
    };

    if (Platform.OS === 'android') {
      getPermissions();
    } else {
      setPermissionGranted(true);
    }
  }, []);

  useEffect(() => {
    if (!permissionGranted) {
      return;
    }

    const callSettings = {
      video: {
        sendVideo: true,
        receiveVideo: true,
      },
    };

    const makeCall = async () => {
      call.current = await voximplant.call(user.user_name, callSettings);
      subscribeToCallEvents();
    };

    const answerCall = async () => {
      subscribeToCallEvents();
      call.current.answer(callSettings);
    };

    const subscribeToCallEvents = () => {
      call.current.on(Voximplant.CallEvents.Failed, callEvent => {
        showCallError(callEvent.reason);
      });
      call.current.on(Voximplant.CallEvents.ProgressToneStart, callEvent => {
        setCallStatus('Ringing');
      });
      call.current.on(Voximplant.CallEvents.Connected, callEvent => {
        setCallStatus('Connected');
      });
      call.current.on(Voximplant.CallEvents.Disconnected, callEvent => {
        navigation.navigate('Contacts');
      });
    };

    const showCallError = reason => {
      Alert.alert('Call Failed', `Reason : ${reason}`, [
        {
          text: 'Ok',
          onPress: navigation.navigate('Contacts'),
        },
      ]);
    };

    if (isIncomingCall) {
      answerCall();
    } else {
      makeCall();
    }

    return () => {
      call.current.off(Voximplant.CallEvents.Failed); // unsubscribing
      call.current.off(Voximplant.CallEvents.ProgressToneStart); // unsubscribing
      call.current.off(Voximplant.CallEvents.Connected); // unsubscribing
      call.current.off(Voximplant.CallEvents.Disconnected); // unsubscribing
    };
  }, [permissionGranted]);

  const onHangupPress = () => {
    call.current.hangup();
  };

  return (
    <View style={styles.page}>
      <Pressable onPress={goBack} style={styles.backButton}>
        <Ionicons name="chevron-back" color="white" size={25} />
      </Pressable>

      <View style={styles.cameraPreview}>
        <Text style={styles.name}>{user?.user_display_name}</Text>
        <Text style={styles.phoneNumber}>
          {callStatus} {user?.phone_number}...
        </Text>
      </View>

      <CallActionBox onHangupPress={onHangupPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    height: '100%',
    backgroundColor: '#7b4e80',
  },
  cameraPreview: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 50,
    marginBottom: 15,
  },
  phoneNumber: {
    fontSize: 20,
    color: 'white',
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 10,
  },
});

export default CallingScreen;
