import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import ContactsScreen from '../screens/ContactsScreen/index';
import CallingScreen from '../screens/CallingScreen/index';
import IncomingCallScreen from '../screens/IncomingCallScreen/index';
import CallScreen from '../screens/CallScreen/index';
import LoginScreen from '../screens/LoginScreen';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={'Login'}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Contacts" component={ContactsScreen} />
        <Stack.Group screenOptions={{headerShown: false}}>
          <Stack.Screen name="Call" component={CallScreen} />
          <Stack.Screen name="Calling" component={CallingScreen} />
          <Stack.Screen name="Incoming Call" component={IncomingCallScreen} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
