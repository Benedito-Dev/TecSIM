import React from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground } from 'react-native';

import { styles } from './styles';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.Imagecontainer}>
        <ImageBackground
          source={require('../../../assets/images/AuthWelcome/Image-Background.png')}
          style={styles.topImage}
          resizeMode="cover"
        />
      </View>

      {/* Conteúdo principal */}
      <View style={styles.content}>
        <Image
          source={require('../../../assets/images/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.subtitle}>assistente de saúde</Text>
        <Text style={styles.subtitleBold}>inteligente</Text>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.buttonText}>Criar conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
