import React from 'react';
import { View, Text } from 'react-native';
import AuthHeader from '../../../components/AuthHeader';
import ProfessionalHeader from '../../../components/ProfessionalHeader';
import PrimaryButton from '../../../components/PrimaryButton';
import SecondaryButton from '../../../components/SecondaryButton';

import { styles } from './styles';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <AuthHeader />

      <View style={styles.content}>
        <ProfessionalHeader />

        <Text style={styles.title}>Acesso Profissional - TecSIM</Text>
        <Text style={styles.subtitle}>Painel de atendimento médico</Text>

        <PrimaryButton
          title="Login"
          onPress={() => navigation.navigate('Login')}
        />

        <SecondaryButton
          title="Criar conta"
          onPress={() => navigation.navigate('Register')}
        />

        <Text style={{ marginTop: 20, color: '#999', fontSize: 12 }}>
          Acesso exclusivo para profissionais de saúde.
        </Text>
      </View>
    </View>
  );
}
