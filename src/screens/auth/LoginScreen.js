import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  TextInput,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Gradients } from '../../theme/colors';
import { useApp } from '../../context/AppContext';

export default function LoginScreen({ navigation, route }) {
  const { login } = useApp();
  const userType = route?.params?.userType || 'beneficiary';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslate = useRef(new Animated.Value(40)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(logoScale, { toValue: 1, friction: 4, useNativeDriver: true }),
      Animated.timing(formOpacity, { toValue: 1, duration: 600, delay: 300, useNativeDriver: true }),
      Animated.timing(formTranslate, { toValue: 0, duration: 500, delay: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  const handleLogin = () => {
    if (!email || !password) {
      shake();
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      login(
        {
          id: 'u_' + Date.now(),
          name: userType === 'beneficiary' ? 'أحمد محمد' : 'سارة الحربي',
          email,
          userType,
          phone: '+966 50 000 0000',
          bloodType: 'A+',
          condition: userType === 'beneficiary' ? 'نوبات صرع' : '',
          certifications: userType === 'volunteer' ? ['CPR', 'First Aid'] : [],
          avatar: null,
        },
        userType
      );
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={Gradients.dark} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-forward" size={24} color={Colors.textOnPrimary} />
        </TouchableOpacity>

        <Animated.View style={[styles.logoArea, { transform: [{ scale: logoScale }] }]}>
          <View style={styles.logoCircle}>
            <Ionicons name="heart" size={40} color={Colors.textOnPrimary} />
          </View>
          <Text style={styles.appName}>أيقظني</Text>
        </Animated.View>

        <Text style={styles.welcomeText}>
          {userType === 'beneficiary' ? 'مرحباً بك، مستفيد' : 'مرحباً بك، متطوع'}
        </Text>
        <Text style={styles.welcomeSub}>سجل دخولك للمتابعة</Text>
      </LinearGradient>

      <ScrollView
        style={styles.formContainer}
        contentContainerStyle={styles.formContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View
          style={[
            styles.form,
            {
              opacity: formOpacity,
              transform: [{ translateY: formTranslate }, { translateX: shakeAnim }],
            },
          ]}
        >
          {/* Email */}
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color={Colors.primary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="البريد الإلكتروني"
              placeholderTextColor={Colors.textLight}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              textAlign="right"
            />
          </View>

          {/* Password */}
          <View style={styles.inputWrapper}>
            <TouchableOpacity
              style={styles.inputIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={Colors.primary}
              />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="كلمة المرور"
              placeholderTextColor={Colors.textLight}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              textAlign="right"
            />
          </View>

          {/* Forgot password */}
          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>نسيت كلمة المرور؟</Text>
          </TouchableOpacity>

          {/* Login button */}
          <TouchableOpacity onPress={handleLogin} disabled={loading} activeOpacity={0.85}>
            <LinearGradient
              colors={Gradients.primary}
              style={styles.loginBtn}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {loading ? (
                <Text style={styles.loginBtnText}>جارٍ تسجيل الدخول...</Text>
              ) : (
                <>
                  <Ionicons name="log-in-outline" size={22} color={Colors.textOnPrimary} />
                  <Text style={styles.loginBtnText}>تسجيل الدخول</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>أو</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Register */}
          <TouchableOpacity
            style={styles.registerBtn}
            onPress={() => navigation.navigate('Register', { userType })}
          >
            <Text style={styles.registerText}>
              ليس لديك حساب؟{' '}
              <Text style={styles.registerLink}>سجل الآن</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingBottom: 36,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  backBtn: {
    position: 'absolute',
    top: 52,
    right: 24,
    padding: 8,
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    marginBottom: 8,
  },
  appName: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textOnPrimary,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textOnPrimary,
    marginBottom: 4,
  },
  welcomeSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  formContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  formContent: {
    padding: 24,
    paddingTop: 32,
  },
  form: {
    gap: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    height: 56,
    elevation: 2,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  inputIcon: {
    marginLeft: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
    textAlign: 'right',
  },
  forgotBtn: {
    alignSelf: 'flex-start',
  },
  forgotText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 10,
    elevation: 6,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    marginTop: 8,
  },
  loginBtnText: {
    color: Colors.textOnPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.divider,
  },
  dividerText: {
    color: Colors.textLight,
    fontSize: 14,
  },
  registerBtn: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  registerText: {
    fontSize: 15,
    color: Colors.textSecondary,
  },
  registerLink: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
