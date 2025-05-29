import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { styles } from './styles';

export default function Login({ navigation }) {
  const [checked, setChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👈 controle da visibilidade da senha

  return (
    <View style={styles.container}>
      <View style={styles.TopContainer}>
        <Image
          source={require('../../../assets/images/logo_branca.png')}
          style={styles.logo}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Nome Completo</Text>
        <TextInput
            style={styles.input}
            placeholder="Ex: Antonio Nascimento Barros"
            placeholderTextColor={"gray"}
            secureTextEntry={!showPassword} // 👈 alterna visibilidade
          />
        <Text style={styles.label}>Email</Text>
        <View style={[styles.input, { flexDirection: 'row', alignItems: 'center' }]}>
          <TextInput
            style={{ flex: 1 }}
            placeholder="Digite sua senha"
            placeholderTextColor={"gray"}
            secureTextEntry={!showPassword} // 👈 alterna visibilidade
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon
              name={'mail'}
              size={20}
              color="gray"
              style={{ marginRight: 10 }}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Senha</Text>
        <View style={[styles.input, { flexDirection: 'row', alignItems: 'center' }]}>
          <TextInput
            style={{ flex: 1 }}
            placeholder="Digite sua senha"
            placeholderTextColor={"gray"}
            secureTextEntry={!showPassword} // 👈 alterna visibilidade
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon
              name={showPassword ? 'eye' : 'eye-off'}
              size={20}
              color="gray"
              style={{ marginRight: 10 }}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Confirmar senha</Text>
        <View style={[styles.input, { flexDirection: 'row', alignItems: 'center' }]}>
          <TextInput
            style={{ flex: 1 }}
            placeholder="Digite sua senha"
            placeholderTextColor={"gray"}
            secureTextEntry={!showPassword} // 👈 alterna visibilidade
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon
              name={showPassword ? 'eye' : 'eye-off'}
              size={20}
              color="gray"
              style={{ marginRight: 10 }}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.authExtras}>
          <View style={styles.Remenber}>
            <Pressable
              onPress={() => setChecked(!checked)}
              style={{
                height: 24,
                width: 24,
                borderWidth: 2,
                borderColor: '#5f65d9',
                borderRadius: 6,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: checked ? '#5f65d9' : 'transparent',
              }}
            >
              {checked && <Icon name="check" size={16} color="#fff" />}
            </Pressable>
            <Text style={{ marginLeft: 8, fontWeight: "bold"}}>Aceitar termos</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Criar conta</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.subButton} onPress={() => navigation.replace('Login')}>
          <Text style={styles.text}>Já tem uma conta ?</Text>
          <Text style={styles.EsqueciSenha}>Faça o login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}