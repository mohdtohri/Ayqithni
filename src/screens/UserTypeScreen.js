import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Gradients } from '../theme/colors';
import { useApp } from '../context/AppContext';

const { width, height } = Dimensions.get('window');

const UserTypeCard = ({ icon, title, subtitle, description, gradient, delay, onPress }) => {
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 600, delay, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 5, delay, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 500, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={[styles.cardWrapper, { opacity, transform: [{ scale }, { translateY }] }]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <LinearGradient colors={gradient} style={styles.card} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          {/* Decorative circles */}
          <View style={[styles.decorCircle, styles.decorCircle1]} />
          <View style={[styles.decorCircle, styles.decorCircle2]} />

          <View style={styles.cardIcon}>
            <Ionicons name={icon} size={48} color={Colors.textOnPrimary} />
          </View>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSubtitle}>{subtitle}</Text>
          <Text style={styles.cardDesc}>{description}</Text>

          <View style={styles.cardArrow}>
            <Ionicons name="arrow-back-circle" size={32} color="rgba(255,255,255,0.7)" />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function UserTypeScreen({ navigation }) {
  const { setUserType } = useApp();
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslate = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(headerTranslate, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  const selectType = (type) => {
    setUserType(type);
    navigation.navigate('Auth', { screen: 'Login', params: { userType: type } });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <LinearGradient colors={[Colors.primaryDeep, Colors.primary]} style={styles.header}>
        <Animated.View style={{ opacity: headerOpacity, transform: [{ translateY: headerTranslate }] }}>
          <Text style={styles.headerTitle}>مرحباً بك في أيقظني</Text>
          <Text style={styles.headerSubtitle}>اختر نوع حسابك للبدء</Text>
        </Animated.View>
      </LinearGradient>

      <View style={styles.content}>
        <UserTypeCard
          icon="person-circle"
          title="مستفيد"
          subtitle="Beneficiary"
          description="أنا شخص معرض للإغماء أو النوبات وأحتاج لمراقبة صحية ذكية وتنبيه سريع للمساعدين عند الطوارئ."
          gradient={['#0D47A1', '#1565C0', '#1E88E5']}
          delay={200}
          onPress={() => selectType('beneficiary')}
        />

        <UserTypeCard
          icon="shield-checkmark"
          title="متطوع / مساعد"
          subtitle="Volunteer / Helper"
          description="أنا شخص مدرب على الإسعافات الأولية وأرغب في مساعدة المحتاجين عند حدوث الطوارئ بالقرب مني."
          gradient={['#01579B', '#0288D1', '#039BE5']}
          delay={400}
          onPress={() => selectType('volunteer')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 28,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textOnPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 24,
    gap: 20,
    justifyContent: 'center',
  },
  cardWrapper: {
    borderRadius: 24,
    elevation: 10,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  card: {
    borderRadius: 24,
    padding: 28,
    overflow: 'hidden',
    minHeight: 200,
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  decorCircle1: {
    width: 140,
    height: 140,
    top: -50,
    right: -40,
  },
  decorCircle2: {
    width: 90,
    height: 90,
    bottom: -30,
    left: 20,
  },
  cardIcon: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textOnPrimary,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1,
    marginBottom: 12,
  },
  cardDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 22,
    maxWidth: '85%',
  },
  cardArrow: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
});
