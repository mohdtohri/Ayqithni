import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Gradients } from '../theme/colors';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslate = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const ring1 = useRef(new Animated.Value(0)).current;
  const ring2 = useRef(new Animated.Value(0)).current;
  const ring3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse rings animation
    const ringAnimation = (ring, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(ring, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(ring, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );

    ringAnimation(ring1, 0).start();
    ringAnimation(ring2, 600).start();
    ringAnimation(ring3, 1200).start();

    // Logo entrance
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 4,
        tension: 40,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Text entrance
    Animated.parallel([
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 700,
        delay: 900,
        useNativeDriver: true,
      }),
      Animated.timing(textTranslate, {
        toValue: 0,
        duration: 700,
        delay: 900,
        useNativeDriver: true,
      }),
    ]).start();

    // Heartbeat pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 400, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 300, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();

    // Navigate after splash
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const ringInterpolate = (anim) => ({
    opacity: anim.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0.8, 0.5, 0] }),
    transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 2.5] }) }],
  });

  return (
    <LinearGradient colors={Gradients.dark} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDeep} />

      {/* Animated rings */}
      {[ring1, ring2, ring3].map((ring, i) => (
        <Animated.View key={i} style={[styles.ring, ringInterpolate(ring)]} />
      ))}

      {/* Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <Animated.View style={[styles.iconWrapper, { transform: [{ scale: pulseAnim }] }]}>
          <Ionicons name="heart" size={60} color={Colors.textOnPrimary} />
        </Animated.View>
      </Animated.View>

      {/* App name */}
      <Animated.View
        style={{
          opacity: textOpacity,
          transform: [{ translateY: textTranslate }],
          alignItems: 'center',
        }}
      >
        <Text style={styles.appName}>أيقظني</Text>
        <Text style={styles.appNameEn}>Ayqithni</Text>
        <View style={styles.taglineContainer}>
          <Text style={styles.tagline}>نظام الاستجابة الطارئة الذكي</Text>
        </View>
      </Animated.View>

      {/* Bottom dots */}
      <View style={styles.dotsContainer}>
        {[0, 1, 2].map(i => (
          <View key={i} style={[styles.dot, i === 0 && styles.dotActive]} />
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  logoContainer: {
    marginBottom: 30,
  },
  iconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  appName: {
    fontSize: 42,
    fontWeight: '900',
    color: Colors.textOnPrimary,
    letterSpacing: 2,
    marginBottom: 4,
  },
  appNameEn: {
    fontSize: 18,
    fontWeight: '300',
    color: Colors.accentLight,
    letterSpacing: 6,
    marginBottom: 16,
  },
  taglineContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 60,
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.accent,
  },
});
