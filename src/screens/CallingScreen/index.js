/* eslint-disable react-hooks/exhaustive-deps */
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
  const [localVideoStreamId, setLocalVideoStreamId] = useState('');
  const [remoteVideoStreamId, setRemoteVideoStreamId] = useState('');

  const navigation = useNavigation();
  const route = useRoute(); // va permettre de recuperer les donnees du user que l'on appelle
  const {user, call: incomingCall, isIncomingCall} = route?.params; // on utilise ? car il se peut que le user ne soit pas renseigné
  const voximplant = Voximplant.getInstance();

  const call = useRef(incomingCall); // permet de ne pas reset la variable a chaque fois que la page est chargee
  const endpoint = useRef(null);

  let isOnCall = false;

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
      endpoint.current = call.current.getEndpoints()[0];
      subscribeToEndpointEvent();
      call.current.answer(callSettings);
      isOnCall = true;
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
      call.current.on(
        Voximplant.CallEvents.LocalVideoStreamAdded,
        callEvent => {
          setLocalVideoStreamId(callEvent.videoStream.id);
        },
      );
      call.current.on(Voximplant.CallEvents.EndpointAdded, callEvent => {
        endpoint.current = callEvent.endpoint;
        subscribeToEndpointEvent();
      });
    };

    const subscribeToEndpointEvent = async () => {
      endpoint.current.on(
        Voximplant.EndpointEvents.RemoteVideoStreamAdded,
        endpointEvent => {
          setRemoteVideoStreamId(endpointEvent.videoStream.id);
        },
      );
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
    isOnCall = false;
  };

  return (
    <View style={styles.page}>
      <Pressable onPress={goBack} style={styles.backButton}>
        <Ionicons name="chevron-back" color="white" size={25} />
      </Pressable>

      <Voximplant.VideoView
        videoStreamId={remoteVideoStreamId}
        style={styles.remoteVideo}
      />

      <Voximplant.VideoView
        videoStreamId={localVideoStreamId}
        style={styles.localVideo}
      />

      {isOnCall ? (
        <View />
      ) : (
        <View style={styles.cameraPreview}>
          <Text style={styles.name}>{user?.user_display_name}</Text>
          <Text style={styles.phoneNumber}>
            {callStatus} {user?.phone_number}...
          </Text>
        </View>
      )}

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
  localVideo: {
    width: 100,
    height: 150,
    backgroundColor: '#FFFF6E',
    position: 'absolute',
    right: 10,
    top: 100,
    borderRadius: 10,
  },
  remoteVideo: {
    backgroundColor: '#FFFF6E',
    position: 'absolute',
    borderRadius: 10,
    bottom: 100,
    left: 0,
    right: 0,
    top: 0,
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
