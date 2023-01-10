import React, {useState, useEffect} from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import contacts from '../../../assets/data/contacts.json';
import {Voximplant} from 'react-native-voximplant';

const ContactsScreen = () => {
  const [searchTerm, setSearchTerm] = useState(''); // allow to keep track of what the user has written in the search bar
  const [filteredContacts, setFilteredContacts] = useState(contacts);

  const navigation = useNavigation();
  const voximplant = Voximplant.getInstance();

  // call listener
  useEffect(() => {
    voximplant.on(Voximplant.ClientEvents.IncomingCall, incomingCallEvent => {
      navigation.navigate('Incoming Call', {call: incomingCallEvent.call});
    });

    return () => {
      voximplant.off(Voximplant.ClientEvents.IncomingCall);
    };
  }, [navigation, voximplant]);

  useEffect(() => {
    const newContact = contacts.filter(contact =>
      contact.user_display_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    );
    setFilteredContacts(newContact);
  }, [searchTerm]); // the function will be called each time searchTerm is updated

  const callUser = user => {
    navigation.navigate('Calling', {user: user});
  };

  return (
    <View style={styles.page}>
      <TextInput
        value={searchTerm}
        onChangeText={setSearchTerm} // this will be called each time de text is changed
        style={styles.searchInput}
        placeholder="Rechercher.."
      />
      <FlatList
        data={filteredContacts}
        renderItem={({item}) => (
          <Pressable onPress={() => callUser(item)}>
            <Text style={styles.contactName}>{item.user_display_name}</Text>
          </Pressable>
        )} // component qui sera utilise pour afficher chaque valeur de data; item correspond a une case du tableau a chaque fois
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    padding: 15,
    backgroundColor: 'white',
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    marginVertical: 10, // space between items
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
  },
});

export default ContactsScreen;
