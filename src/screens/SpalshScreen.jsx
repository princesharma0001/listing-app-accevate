import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SpalshScreen({ navigation }) {
  const token = AsyncStorage.getItem('acceToken');

 console.log("AcceTokenAcceToken",token);
 

  const tokenHandler = async () => {
    const token = await AsyncStorage.getItem('acceToken');

    if (!token) {
      navigation.navigate('login');
    } else {
      navigation.navigate('home');
    }
  };

  useEffect(() => {
    tokenHandler();
  }, []);

  return (
    <View style={styles.container}>
      {/* <Text style={{ fontSize: 75, paddingBottom: 8 }}></Text> */}
      <Text style={styles.countries}> Accevate Technologies</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  countries: {
    fontWeight: '600',
    fontSize: 25,
  },
});
