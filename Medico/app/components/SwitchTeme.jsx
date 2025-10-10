// SwitchTheme.js
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Circle, Path, G } from 'react-native-svg';

const SwitchTheme = ({ onToggle }) => {
  const [isDark, setIsDark] = useState(false);
  const translateX = new Animated.Value(isDark ? 30 : 0);

  const toggleSwitch = () => {
    const newValue = !isDark;
    setIsDark(newValue);

    Animated.timing(translateX, {
      toValue: newValue ? 30 : 0,
      duration: 1000,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: false
    }).start();

    if (onToggle) onToggle(newValue);
  };

  return (
    <TouchableOpacity style={[styles.switch, isDark && styles.switchDark]} onPress={toggleSwitch}>
      <Animated.View style={[styles.slider, { transform: [{ translateX }] }]} />
      
      {/* Sol */}
      {!isDark && (
        <Svg style={styles.iconSun} viewBox="0 0 24 24" width={24} height={24}>
          <G fill="#ffd43b">
            <Circle r="5" cy="12" cx="12" />
            <Path d="m21 13h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm-17 0h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm13.66-5.66a1 1 0 0 1 -.66-.29 1 1 0 0 1 0-1.41l.71-.71a1 1 0 1 1 1.41 1.41l-.71.71a1 1 0 0 1 -.75.29zm-12.02 12.02a1 1 0 0 1 -.71-.29 1 1 0 0 1 0-1.41l.71-.66a1 1 0 0 1 1.41 1.41l-.71.71a1 1 0 0 1 -.7.24zm6.36-14.36a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm0 17a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm-5.66-14.66a1 1 0 0 1 -.7-.29l-.71-.71a1 1 0 0 1 1.41-1.41l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.29zm12.02 12.02a1 1 0 0 1 -.7-.29l-.66-.71a1 1 0 0 1 1.36-1.36l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.24z" />
          </G>
        </Svg>
      )}

      {/* Lua */}
      {isDark && (
        <Svg style={styles.iconMoon} viewBox="0 0 384 512" width={24} height={24}>
          <Path
            fill="#73C0FC"
            d="m223.5 32c-123.5 0-223.5 100.3-223.5 224s100 224 223.5 224c60.6 0 115.5-24.2 155.8-63.4 5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6-96.9 0-175.5-78.8-175.5-176 0-65.8 36-123.1 89.3-153.3 6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"
          />
        </Svg>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  switch: {
    width: 64,
    height: 34,
    backgroundColor: '#73C0FC',
    borderRadius: 30,
    justifyContent: 'center',
    position: 'relative'
  },
  switchDark: {
    backgroundColor: '#183153'
  },
  slider: {
    position: 'absolute',
    width: 30,
    height: 30,
    backgroundColor: '#e8e8e8',
    borderRadius: 20,
    left: 2,
    top: 2
  },
  iconSun: {
    position: 'absolute',
    top: 6,
    left: 36
  },
  iconMoon: {
    position: 'absolute',
    top: 5,
    left: 5
  }
});

export default SwitchTheme;