import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Gradients } from '../../theme/colors';
import { useApp } from '../../context/AppContext';

const { width } = Dimensions.get('window');

const MOCK_ALERTS = [
  {
    id: 'a1',
    userName: 'محمد العمري',
    condition: 'نوبات صرع',
    distance: '0.3 كم',
    time: 'منذ دقيقتين',
    location: 'حي النزهة، الرياض',
    bloodType: 'O+',
    severity: 'critical',
    active: true,
  },
  {
    id: 'a2',
    userName: 'سعد القحطاني',
    condition: 'إغماء مفاجئ',
    distance: '0.8 كم',
    time: 'منذ 5 دقائق',
    location: 'شارع الملك فهد',
    bloodType: 'A+',
    severity: 'high',
    active: true,
  },
];

const AlertCard = ({ alert, onRespond, delay }) => {
  const scale = useRef(new Animated.Value(0.85)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 5, delay, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
    ]).start();

    if (alert.severity === 'critical') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.02, duration: 800, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    }
  }, []);

  const sevColor = alert.severity === 'critical' ? Colors.danger : Colors.warning;

  return (
    <Animated.View style={[styles.alertCard, { transform: [{ scale: Animated.multiply(scale, pulse) }], opacity }]}>
      <View style={[styles.alertCardInner, { borderLeftColor: sevColor }]}>
        {/* Header */}
        <View style={styles.alertHeader}>
          <View style={[styles.severityBadge, { backgroundColor: sevColor + '22', borderColor: sevColor }]}>
            <View style={[styles.severityDot, { backgroundColor: sevColor }]} />
            <Text style={[styles.severityText, { color: sevColor }]}>
              {alert.severity === 'critical' ? 'حرجة' : 'طارئة'}
            </Text>
          </View>
          <Text style={styles.alertTime}>{alert.time}</Text>
        </View>

        {/* User info */}
        <View style={styles.alertUser}>
          <View style={styles.alertAvatar}>
            <Ionicons name="person" size={22} color={Colors.textOnPrimary} />
          </View>
          <View style={styles.alertUserInfo}>
            <Text style={styles.alertUserName}>{alert.userName}</Text>
            <Text style={styles.alertCondition}>{alert.condition}</Text>
          </View>
          <View style={styles.bloodTypePill}>
            <Ionicons name="water" size={12} color={Colors.heartRed} />
            <Text style={styles.bloodTypeText}>{alert.bloodType}</Text>
          </View>
        </View>

        {/* Location */}
        <View style={styles.locationRow}>
          <Ionicons name="location" size={14} color={Colors.primary} />
          <Text style={styles.locationText}>{alert.location}</Text>
          <View style={styles.distancePill}>
            <Text style={styles.distanceText}>{alert.distance}</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.alertActions}>
          <TouchableOpacity style={styles.declineBtn}>
            <Text style={styles.declineBtnText}>تجاهل</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onRespond(alert)} activeOpacity={0.85} style={{ flex: 1 }}>
            <LinearGradient
              colors={Gradients.primary}
              style={styles.respondBtn}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="navigate" size={18} color={Colors.textOnPrimary} />
              <Text style={styles.respondBtnText}>استجابة فورية</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

export default function VolunteerHomeScreen({ navigation }) {
  const { user, nearbyAlerts, setNearbyAlerts, courses } = useApp();
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [responding, setResponding] = useState(null);

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const statusPulse = useRef(new Animated.Value(1)).current;
  const completedCourses = courses.filter(c => c.completed).length;

  useEffect(() => {
    Animated.timing(headerOpacity, { toValue: 1, duration: 700, useNativeDriver: true }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(statusPulse, { toValue: 1.1, duration: 1000, useNativeDriver: true }),
        Animated.timing(statusPulse, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleRespond = (alert) => {
    setResponding(alert);
    setAlerts(prev => prev.filter(a => a.id !== alert.id));
    navigation.navigate('Alert', { alert });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={Gradients.dark} style={styles.header}>
        <Animated.View style={[styles.headerContent, { opacity: headerOpacity }]}>
          <View>
            <Text style={styles.greeting}>أهلاً،</Text>
            <Text style={styles.userName}>{user?.name}</Text>
          </View>
          <View style={styles.headerRight}>
            <Animated.View style={[styles.activeBadge, { transform: [{ scale: statusPulse }] }]}>
              <View style={styles.activeDot} />
              <Text style={styles.activeText}>نشط</Text>
            </Animated.View>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <View style={styles.avatar}>
                <Ionicons name="shield-checkmark" size={22} color={Colors.textOnPrimary} />
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Stats */}
        <Animated.View style={[styles.statsRow, { opacity: headerOpacity }]}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{alerts.length}</Text>
            <Text style={styles.statLabel}>تنبيه نشط</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{completedCourses}</Text>
            <Text style={styles.statLabel}>دورة مكتملة</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>12</Text>
            <Text style={styles.statLabel}>استجابة</Text>
          </View>
        </Animated.View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Active alerts */}
        <View style={styles.sectionHeader}>
          <View style={[styles.dot, { backgroundColor: Colors.danger }]} />
          <Text style={styles.sectionTitle}>التنبيهات النشطة</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{alerts.length}</Text>
          </View>
        </View>

        {alerts.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="checkmark-circle" size={48} color={Colors.success} />
            <Text style={styles.emptyTitle}>لا توجد تنبيهات</Text>
            <Text style={styles.emptyText}>ستظهر التنبيهات هنا عند وجود حالة طارئة قريبة منك</Text>
          </View>
        ) : (
          alerts.map((alert, i) => (
            <AlertCard key={alert.id} alert={alert} onRespond={handleRespond} delay={i * 150} />
          ))
        )}

        {/* Quick actions */}
        <Text style={styles.sectionTitle}>الإجراءات السريعة</Text>
        <View style={styles.actionsGrid}>
          {[
            { icon: 'school', label: 'الدورات', screen: 'Courses', color: Colors.primaryLight, badge: `${completedCourses}/${courses.length}` },
            { icon: 'people', label: 'الاقتران', screen: 'Pairing', color: Colors.success, badge: null },
            { icon: 'map', label: 'الخريطة', screen: 'Map', color: Colors.accent, badge: null },
            { icon: 'ribbon', label: 'شهاداتي', screen: 'Certifications', color: Colors.warning, badge: `${user?.certifications?.length || 0}` },
          ].map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.actionCard}
              onPress={() => navigation.navigate(item.screen)}
            >
              <LinearGradient colors={[item.color + '22', item.color + '11']} style={styles.actionGradient}>
                <View style={{ position: 'relative' }}>
                  <Ionicons name={item.icon} size={30} color={item.color} />
                  {item.badge && (
                    <View style={[styles.actionBadge, { backgroundColor: item.color }]}>
                      <Text style={styles.actionBadgeText}>{item.badge}</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.actionLabel, { color: item.color }]}>{item.label}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Certifications banner */}
        {completedCourses < courses.length && (
          <TouchableOpacity onPress={() => navigation.navigate('Courses')} activeOpacity={0.85}>
            <LinearGradient colors={Gradients.accent} style={styles.certBanner}>
              <Ionicons name="school" size={28} color={Colors.textOnPrimary} />
              <View style={styles.certBannerText}>
                <Text style={styles.certBannerTitle}>أكمل دوراتك التدريبية</Text>
                <Text style={styles.certBannerSub}>
                  {courses.length - completedCourses} دورة متبقية للحصول على شهادة المتطوع المعتمد
                </Text>
              </View>
              <Ionicons name="arrow-back" size={20} color={Colors.textOnPrimary} />
            </LinearGradient>
          </TouchableOpacity>
        )}
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
    gap: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 2 },
  userName: { fontSize: 22, fontWeight: '800', color: Colors.textOnPrimary },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.success + '33',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  activeText: { color: Colors.success, fontWeight: '700', fontSize: 12 },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    justifyContent: 'space-around',
  },
  statItem: { alignItems: 'center', flex: 1 },
  statNum: { fontSize: 22, fontWeight: '800', color: Colors.textOnPrimary },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, gap: 16, paddingBottom: 40 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary, flex: 1 },
  countBadge: {
    backgroundColor: Colors.danger,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countBadgeText: { color: Colors.textOnPrimary, fontSize: 12, fontWeight: '700' },
  emptyCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  emptyText: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  alertCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: Colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  alertCardInner: {
    backgroundColor: Colors.surface,
    padding: 16,
    gap: 12,
    borderLeftWidth: 4,
    borderRadius: 16,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  severityDot: { width: 6, height: 6, borderRadius: 3 },
  severityText: { fontSize: 12, fontWeight: '700' },
  alertTime: { fontSize: 12, color: Colors.textLight },
  alertUser: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  alertAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertUserInfo: { flex: 1 },
  alertUserName: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, textAlign: 'right' },
  alertCondition: { fontSize: 13, color: Colors.textSecondary, textAlign: 'right' },
  bloodTypePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.heartRed + '18',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  bloodTypeText: { fontSize: 13, fontWeight: '700', color: Colors.heartRed },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary + '0D',
    padding: 10,
    borderRadius: 10,
  },
  locationText: { flex: 1, fontSize: 13, color: Colors.textSecondary, textAlign: 'right' },
  distancePill: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  distanceText: { fontSize: 12, fontWeight: '700', color: Colors.textOnPrimary },
  alertActions: { flexDirection: 'row', gap: 10 },
  declineBtn: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineBtnText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  respondBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  respondBtnText: { fontSize: 14, fontWeight: '700', color: Colors.textOnPrimary },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: (width - 52) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  actionGradient: {
    padding: 18,
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    backgroundColor: Colors.surface,
  },
  actionBadge: {
    position: 'absolute',
    top: -6,
    right: -8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  actionBadgeText: { fontSize: 9, fontWeight: '800', color: Colors.textOnPrimary },
  actionLabel: { fontSize: 14, fontWeight: '700' },
  certBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 12,
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  certBannerText: { flex: 1 },
  certBannerTitle: { fontSize: 15, fontWeight: '700', color: Colors.textOnPrimary },
  certBannerSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
});
