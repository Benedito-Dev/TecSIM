import React from 'react';
import { View, ImageBackground, StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export default function AuthHeader() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/AuthWelcome/Image-Background.png')}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#1c4aacff',
  },
  image: {
    height: height * 0.45,
    width: '100%',
    opacity: 0.5,
  },
});
