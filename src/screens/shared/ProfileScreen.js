import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  StatusBar,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Gradients } from '../../theme/colors';
import { useApp } from '../../context/AppContext';

export default function ProfileScreen({ navigation }) {
  const { user, userType, logout, courses } = useApp();
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(40)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  const completedCourses = courses.filter(c => c.completed).length;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(contentOpacity, { toValue: 1, duration: 600, delay: 300, useNativeDriver: true }),
      Animated.timing(contentAnim, { toValue: 0, duration: 500, delay: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  const settingsItems = [
    { icon: 'notifications', label: 'الإشعارات', color: Colors.primary, toggle: true },
    { icon: 'location', label: 'تحديد الموقع', color: Colors.success, toggle: true },
    { icon: 'bluetooth', label: 'الساعة الذكية', color: Colors.accent, toggle: true },
    { icon: 'globe', label: 'اللغة', color: Colors.warning, value: 'العربية', toggle: false },
    { icon: 'shield', label: 'الخصوصية والأمان', color: Colors.danger, toggle: false },
    { icon: 'information-circle', label: 'عن التطبيق', color: Colors.primaryLight, toggle: false },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={Gradients.dark} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-forward" size={24} color={Colors.textOnPrimary} />
        </TouchableOpacity>

        <Animated.View style={[styles.profileArea, { opacity: headerOpacity }]}>
          <View style={styles.avatarRing}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={44} color={Colors.textOnPrimary} />
            </View>
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Ionicons name="camera" size={14} color={Colors.textOnPrimary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{user?.name}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
          <View style={[styles.typeBadge, { backgroundColor: userType === 'volunteer' ? Colors.success + '33' : Colors.primary + '33' }]}>
            <Ionicons
              name={userType === 'volunteer' ? 'shield-checkmark' : 'person'}
              size={14}
              color={userType === 'volunteer' ? Colors.success : Colors.primaryLighter}
            />
            <Text style={[styles.typeText, { color: userType === 'volunteer' ? Colors.success : Colors.primaryLighter }]}>
              {userType === 'volunteer' ? 'متطوع' : 'مستفيد'}
            </Text>
          </View>
        </Animated.View>

        {/* Stats */}
        <Animated.View style={[styles.statsRow, { opacity: headerOpacity }]}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{completedCourses}</Text>
            <Text style={styles.statLabel}>دورة</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{userType === 'volunteer' ? '12' : '3'}</Text>
            <Text style={styles.statLabel}>{userType === 'volunteer' ? 'استجابة' : 'تنبيه'}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>4.9</Text>
            <Text style={styles.statLabel}>تقييم</Text>
          </View>
        </Animated.View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{ opacity: contentOpacity, transform: [{ translateY: contentAnim }], gap: 16 }}
        >
          {/* Quick settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>الإعدادات</Text>
            <View style={styles.settingsCard}>
              {settingsItems.map((item, i) => (
                <View key={i}>
                  <View style={styles.settingRow}>
                    <View style={[styles.settingIcon, { backgroundColor: item.color + '22' }]}>
                      <Ionicons name={item.icon} size={20} color={item.color} />
                    </View>
                    <Text style={styles.settingLabel}>{item.label}</Text>
                    {item.toggle ? (
                      <Switch
                        value={true}
                        onValueChange={() => {}}
                        trackColor={{ false: Colors.border, true: Colors.primaryLighter }}
                        thumbColor={Colors.primary}
                      />
                    ) : item.value ? (
                      <View style={styles.settingValue}>
                        <Text style={styles.settingValueText}>{item.value}</Text>
                        <Ionicons name="chevron-back" size={16} color={Colors.textLight} />
                      </View>
                    ) : (
                      <Ionicons name="chevron-back" size={16} color={Colors.textLight} />
                    )}
                  </View>
                  {i < settingsItems.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          </View>

          {/* Certifications for volunteers */}
          {userType === 'volunteer' && completedCourses > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>شهاداتي</Text>
              <View style={styles.certGrid}>
                {courses.filter(c => c.completed).map(c => (
                  <LinearGradient key={c.id} colors={[c.color + '33', c.color + '11']} style={styles.certCard}>
                    <Ionicons name="ribbon" size={24} color={c.color} />
                    <Text style={[styles.certTitle, { color: c.color }]}>{c.title}</Text>
                    <Text style={styles.certDate}>مارس 2025</Text>
                  </LinearGradient>
                ))}
              </View>
            </View>
          )}

          {/* Logout */}
          <TouchableOpacity onPress={logout} activeOpacity={0.85}>
            <View style={styles.logoutBtn}>
              <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
              <Text style={styles.logoutText}>تسجيل الخروج</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 12,
  },
  backBtn: { position: 'absolute', top: 52, right: 24, padding: 8 },
  profileArea: { alignItems: 'center', gap: 8 },
  avatarRing: { position: 'relative', marginBottom: 4 },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primaryDeep,
  },
  profileName: { fontSize: 22, fontWeight: '800', color: Colors.textOnPrimary },
  profileEmail: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  typeText: { fontSize: 13, fontWeight: '700' },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: { alignItems: 'center', flex: 1 },
  statNum: { fontSize: 22, fontWeight: '800', color: Colors.textOnPrimary },
  statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  section: { gap: 10, marginBottom: 4 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  settingsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  settingIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: { flex: 1, fontSize: 15, color: Colors.textPrimary, fontWeight: '500', textAlign: 'right' },
  settingValue: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  settingValueText: { fontSize: 13, color: Colors.textSecondary },
  divider: { height: 1, backgroundColor: Colors.divider, marginHorizontal: 16 },
  certGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  certCard: {
    width: '47%',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  certTitle: { fontSize: 12, fontWeight: '600', textAlign: 'center' },
  certDate: { fontSize: 11, color: Colors.textLight },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.danger + '44',
    backgroundColor: Colors.danger + '0D',
    marginTop: 8,
  },
  logoutText: { fontSize: 16, fontWeight: '700', color: Colors.danger },
});
