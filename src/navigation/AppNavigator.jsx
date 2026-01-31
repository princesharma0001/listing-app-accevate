import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../contexts/ThemeContext';
import LoginScreen from '../screens/LoginScreen';
import OTPVerifyScreen from '../screens/OTPVerifyScreen';
('');
import SpalshScreen from '../screens/SpalshScreen';
import HomeScreen from '../screens/HomeScreen';
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function CountriesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tabs"
        component={LoginScreen}
        options={{
          title: 'Login',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="verify"
        component={OTPVerifyScreen}
        options={{
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}



export default function AppNavigator() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="splash"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.text,
      }}
    >
     
      <Stack.Screen
        name="splash"
        component={SpalshScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="verify"
        component={OTPVerifyScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
