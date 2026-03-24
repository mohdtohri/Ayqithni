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

export default function RegisterScreen({ navigation, route }) {
  const { login } = useApp();
  const userType = route?.params?.userType || 'beneficiary';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslate = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(formOpacity, { toValue: 1, duration: 600, delay: 200, useNativeDriver: true }),
      Animated.timing(formTranslate, { toValue: 0, duration: 500, delay: 200, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleRegister = () => {
    if (!name || !email || !password) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      login(
        {
          id: 'u_' + Date.now(),
          name,
          email,
          phone,
          userType,
          bloodType: 'A+',
          condition: '',
          certifications: [],
          avatar: null,
        },
        userType
      );
    }, 1500);
  };

  const fields = [
    { label: 'الاسم الكامل', icon: 'person-outline', value: name, set: setName, type: 'default' },
    { label: 'البريد الإلكتروني', icon: 'mail-outline', value: email, set: setEmail, type: 'email-address' },
    { label: 'رقم الهاتف', icon: 'call-outline', value: phone, set: setPhone, type: 'phone-pad' },
    { label: 'كلمة المرور', icon: 'lock-closed-outline', value: password, set: setPassword, type: 'default', secure: true },
  ];

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
        <View style={styles.logoCircle}>
          <Ionicons name={userType === 'beneficiary' ? 'person' : 'shield-checkmark'} size={36} color={Colors.textOnPrimary} />
        </View>
        <Text style={styles.title}>
          {userType === 'beneficiary' ? 'تسجيل مستفيد جديد' : 'تسجيل متطوع جديد'}
        </Text>
        <Text style={styles.subtitle}>أنشئ حسابك للبدء</Text>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={[styles.form, { opacity: formOpacity, transform: [{ translateY: formTranslate }] }]}>
          {fields.map((f, i) => (
            <View key={i} style={styles.inputWrapper}>
              <Ionicons name={f.icon} size={20} color={Colors.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={f.label}
                placeholderTextColor={Colors.textLight}
                value={f.value}
                onChangeText={f.set}
                keyboardType={f.type}
                secureTextEntry={f.secure}
                textAlign="right"
              />
            </View>
          ))}

          {/* Agreement */}
          <View style={styles.agreementRow}>
            <View style={styles.agreementCheck}>
              <Ionicons name="checkmark" size={14} color={Colors.textOnPrimary} />
            </View>
            <Text style={styles.agreementText}>
              أوافق على{' '}
              <Text style={styles.agreementLink}>شروط الاستخدام</Text>
              {' '}و{' '}
              <Text style={styles.agreementLink}>سياسة الخصوصية</Text>
            </Text>
          </View>

          <TouchableOpacity onPress={handleRegister} disabled={loading} activeOpacity={0.85}>
            <LinearGradient
              colors={Gradients.primary}
              style={styles.registerBtn}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="person-add-outline" size={22} color={Colors.textOnPrimary} />
              <Text style={styles.registerBtnText}>
                {loading ? 'جارٍ التسجيل...' : 'إنشاء حساب'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginRow}
            onPress={() => navigation.navigate('Login', { userType })}
          >
            <Text style={styles.loginText}>
              لديك حساب بالفعل؟{' '}
              <Text style={styles.loginLink}>سجل دخولك</Text>
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
    paddingBottom: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  backBtn: {
    position: 'absolute',
    top: 52,
    right: 24,
    padding: 8,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textOnPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 24, paddingTop: 32 },
  form: { gap: 16 },
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
  inputIcon: { marginLeft: 8 },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
    textAlign: 'right',
  },
  agreementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  agreementCheck: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agreementText: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
    textAlign: 'right',
  },
  agreementLink: {
    color: Colors.primary,
    fontWeight: '600',
  },
  registerBtn: {
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
  registerBtnText: {
    color: Colors.textOnPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  loginRow: { alignItems: 'center', paddingVertical: 12 },
  loginText: { fontSize: 15, color: Colors.textSecondary },
  loginLink: { color: Colors.primary, fontWeight: '700' },
});
