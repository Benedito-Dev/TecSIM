import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Keyboard, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // ou MaterialIcons, FontAwesome etc.

import { styles } from './styles';

export default function Login({ navigation }) {
  const [checked, setChecked] = useState(false);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          
          <View style={styles.TopContainer}>
            <Image
              source={require('../../../assets/images/logo_branca.png')}
              style={styles.logo}
            />
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu email"
              placeholderTextColor="gray"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              placeholderTextColor="gray"
              secureTextEntry
            />
            <View style={styles.authExtras}>
              <Pressable
                  onPress={() => setChecked(!checked)}
                  style={{
                    height: 24,
                    width: 24,
                    borderWidth: 2,
                    borderColor: '#4942ce',
                    borderRadius: 6,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: checked ? '#4942ce' : 'transparent',
                  }}
                >
                  {checked && <Icon name="check" size={16} color="#fff" />}
                </Pressable>
                <Text style={{ marginLeft: 8 }}>Lembrar-me</Text>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
