import {View, Text, StyleSheet, Pressable, Alert} from 'react-native';
import React, {useState, useEffect} from 'react';
import {TextInput} from 'react-native-gesture-handler';
import {Voximplant} from 'react-native-voximplant';
import {APP_NAME, ACC_NAME} from '../../Constants';
import {useNavigation} from '@react-navigation/core';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const voximplant = Voximplant.getInstance();

  const navigation = useNavigation();

  // ce bout de code permet de se connecter a voximplant afin de pouvoir utiliser le sdk
  useEffect(() => {
    const connect = async () => {
      const status = await voximplant.getClientState();
      console.log(status);
      if (status === Voximplant.ClientState.DISCONNECTED) {
        await voximplant.connect();
      } else if (status === Voximplant.ClientState.LOGGED_IN) {
        redirectHome(); // cas ou l'utilisateur est deja connecté est ferme puis reouvre l'app
      }
    };
    connect();
  }, []);

  const signIn = async () => {
    try {
      const fqUsername = `${username}@${APP_NAME}.${ACC_NAME}.voximplant.com`;
      await voximplant.login(fqUsername, password);

      // si le login s'est bien passe, on redirige vers un autre ecran
      redirectHome();
    } catch (e) {
      console.log(e);
      if (e.code === 401) {
        Alert.alert(e.name, 'Your Password is Incorrect.');
      } else {
        Alert.alert(
          e.name,
          `Login Error ${e.code}, have you put the right email or password ?`,
        );
      }
    }
  };

  const redirectHome = () => {
    // navigation.reset va nous permettre d'empecher l'utilisateur de revenir sur le login screen apres s'etre connecté
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Contacts',
        },
      ],
    });
  };

  return (
    <View style={styles.page}>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
        style={styles.input}
        secureTextEntry
      />

      <Pressable style={styles.button} onPress={signIn}>
        <Text>Sign In</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    padding: 10,
    alignItems: 'stretch',
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: 'dodgerblue',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default LoginScreen;
