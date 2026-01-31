import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Keyboard,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OTPVerifyScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const email = route?.params?.email;

  // const email = (route?.params as { email?: string })?.email || "";
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  // const inputRefs = useRef<(TextInput | null)[]>([]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const insets = useSafeAreaInsets();
  const [error, setError] = useState(null);
  console.log("asfasdgs",error);
  

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      return;
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    // if (value && index < 5) {
    //   inputRefs.current[index + 1]?.focus();
    // }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      // inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');

    // }

    Keyboard.dismiss();
    setIsLoading(true);

    try {
      // Create FormData for multipart/form-data request

      // Make API call
      const response = await axios.post(
        'https://aapsuj.accevate.co/flutter-api/verify_otp.php',
        {
          userid: email, // Direct body as per Postman
          otp: otpString,
        },
        {
          headers: {
            Accept: 'application/json',
            // "Content-Type": "multipart/form-data",
          },
        },
      );

      // Check if verification was successful
      console.log('afsafasdsad', response?.data);

      if (response.data) {
        await AsyncStorage.setItem('acceToken', response?.data?.token);
        navigation.navigate('home');
      } else {
        Alert(
          'Verification Failed',
          response.data?.msg || 'Invalid OTP entered',
        );

        setError(response.data?.msg ?? 'Invalid OTP entered');
        // console.log(response.data?.msg ?? 'Invalid OTP entered');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>

          <View style={styles.header}>
            <Image
              source={require('./Logo.png')}
              style={{ width: 160, height: 100, resizeMode: 'contain' }}
            />

            <Text style={styles.title}>OTP Verify</Text>
            <Text style={styles.subtitle}>
              Please enter otp and verify
              {/* <Text style={styles.emailText}>{email}</Text> */}
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.otpContainer}>
              {otp?.map((digit, index) => (
                <TextInput
                  key={index}
                  // ref={(ref) => (inputRefs.current[index] = ref)}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={value => handleOtpChange(value, index)}
                  onKeyPress={({ nativeEvent }) =>
                    handleKeyPress(nativeEvent.key, index)
                  }
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                />
              ))}
            </View>

            <TouchableOpacity
              style={[
                styles.verifyButton,
                { backgroundColor: 'blue' },
                isLoading && styles.verifyButtonDisabled,
              ]}
              onPress={handleVerify}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.verifyButtonText}>Submit</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 20,
    zIndex: 1,
    padding: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    // marginTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  emailText: {
    fontWeight: '600',
    color: '#000',
  },
  form: {
    width: '100%',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  otpInput: {
    width: 50,
    height: 56,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    backgroundColor: '#FFF',
  },
  verifyButton: {
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  verifyButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  verifyButtonDisabled: {
    opacity: 0.6,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  resendLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  timerText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  resendLinkDisabled: {
    opacity: 0.6,
  },
});

export default OTPVerifyScreen;
