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
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Gradients } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { simulateSensorData } from '../../utils/detectEmergency';

const { width } = Dimensions.get('window');

const StatCard = ({ icon, value, unit, label, color, delay }) => {
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 5, delay, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.statCard, { transform: [{ scale }], opacity }]}>
      <LinearGradient colors={[color + '22', color + '11']} style={styles.statGradient}>
        <Ionicons name={icon} size={28} color={color} />
        <Text style={[styles.statValue, { color }]}>{value}</Text>
        <Text style={styles.statUnit}>{unit}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </LinearGradient>
    </Animated.View>
  );
};

const HeartRateChart = ({ data }) => {
  const bars = data.slice(-12);
  const max = Math.max(...bars);
  const min = Math.min(...bars);

  return (
    <View style={styles.chartContainer}>
      {bars.map((val, i) => {
        const heightPct = max === min ? 0.5 : (val - min) / (max - min);
        const barHeight = 20 + heightPct * 40;
        return (
          <View key={i} style={styles.chartBarWrapper}>
            <View
              style={[
                styles.chartBar,
                {
                  height: barHeight,
                  backgroundColor:
                    val > 100 ? Colors.danger :
                    val < 50 ? Colors.warning :
                    Colors.primaryLighter,
                  opacity: 0.6 + i / bars.length * 0.4,
                },
              ]}
            />
          </View>
        );
      })}
    </View>
  );
};

export default function BeneficiaryHomeScreen({ navigation }) {
  const { user, heartRate, setHeartRate, emergencyActive, triggerEmergency, dismissEmergency, emergencyPulse, pairedUsers } = useApp();
  const [hrHistory, setHrHistory] = useState([72, 75, 73, 70, 74, 76, 72, 73, 75, 71, 72, 74]);
  const [countdown, setCountdown] = useState(null);
  const countdownRef = useRef(null);

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslate = useRef(new Animated.Value(50)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(cardOpacity, { toValue: 1, duration: 600, delay: 300, useNativeDriver: true }),
      Animated.timing(cardTranslate, { toValue: 0, duration: 500, delay: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  // Simulate real-time sensor updates
  useEffect(() => {
    const interval = setInterval(() => {
      const data = simulateSensorData(heartRate);
      setHeartRate(data.heartRate);
      setHrHistory(prev => [...prev.slice(-11), data.heartRate]);
    }, 2000);
    return () => clearInterval(interval);
  }, [heartRate]);

  const startEmergencyCountdown = () => {
    let count = 5;
    setCountdown(count);
    countdownRef.current = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        clearInterval(countdownRef.current);
        setCountdown(null);
        triggerEmergency();
      } else {
        setCountdown(count);
      }
    }, 1000);
  };

  const cancelCountdown = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    setCountdown(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={Gradients.dark} style={styles.header}>
        <Animated.View style={[styles.headerContent, { opacity: headerOpacity }]}>
          <View>
            <Text style={styles.greeting}>مرحباً،</Text>
            <Text style={styles.userName}>{user?.name}</Text>
          </View>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => navigation.navigate('Profile')}
          >
            <View style={styles.avatar}>
              <Ionicons name="person" size={26} color={Colors.textOnPrimary} />
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Status row */}
        <Animated.View style={[styles.statusRow, { opacity: headerOpacity }]}>
          <View style={[styles.statusBadge, emergencyActive && styles.statusBadgeActive]}>
            <View style={[styles.statusDot, emergencyActive && styles.statusDotActive]} />
            <Text style={styles.statusText}>
              {emergencyActive ? 'حالة طارئة نشطة' : 'مراقبة نشطة'}
            </Text>
          </View>
          <Text style={styles.pairedCount}>{pairedUsers.length} مقترن</Text>
        </Animated.View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Emergency Active Banner */}
        {emergencyActive && (
          <Animated.View style={[styles.emergencyBanner, { transform: [{ scale: emergencyPulse }] }]}>
            <LinearGradient colors={Gradients.danger} style={styles.emergencyBannerInner}>
              <Ionicons name="warning" size={28} color={Colors.textOnPrimary} />
              <View style={styles.emergencyBannerText}>
                <Text style={styles.emergencyBannerTitle}>حالة طارئة نشطة!</Text>
                <Text style={styles.emergencyBannerSub}>تم إرسال تنبيهات للمتطوعين القريبين</Text>
              </View>
              <TouchableOpacity onPress={dismissEmergency} style={styles.emergencyDismiss}>
                <Text style={styles.emergencyDismissText}>إلغاء</Text>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        )}

        {/* Countdown Banner */}
        {countdown !== null && (
          <View style={styles.countdownBanner}>
            <Text style={styles.countdownText}>سيتم إرسال التنبيه خلال {countdown} ثوانٍ</Text>
            <TouchableOpacity onPress={cancelCountdown} style={styles.countdownCancel}>
              <Text style={styles.countdownCancelText}>إلغاء</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Heart rate card */}
        <Animated.View
          style={[styles.hrCard, { opacity: cardOpacity, transform: [{ translateY: cardTranslate }] }]}
        >
          <LinearGradient colors={Gradients.primary} style={styles.hrGradient}>
            <View style={styles.hrHeader}>
              <View>
                <Text style={styles.hrLabel}>معدل ضربات القلب</Text>
                <Text style={styles.hrLabelEn}>Heart Rate</Text>
              </View>
              <Ionicons name="heart" size={28} color={Colors.heartRed} />
            </View>
            <View style={styles.hrValueRow}>
              <Text style={styles.hrValue}>{heartRate}</Text>
              <Text style={styles.hrUnit}>bpm</Text>
              <View style={[styles.hrStatus, heartRate > 100 && styles.hrStatusWarning]}>
                <Text style={styles.hrStatusText}>
                  {heartRate > 100 ? 'غير طبيعي' : heartRate < 50 ? 'منخفض' : 'طبيعي'}
                </Text>
              </View>
            </View>
            <HeartRateChart data={hrHistory} />
          </LinearGradient>
        </Animated.View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <StatCard icon="walk" value="1.2k" unit="خطوة" label="اليوم" color={Colors.success} delay={400} />
          <StatCard icon="location" value="نشط" unit="" label="GPS" color={Colors.accent} delay={500} />
          <StatCard icon="battery-charging" value="86" unit="%" label="الساعة" color={Colors.primaryLighter} delay={600} />
        </View>

        {/* SOS Button */}
        <View style={styles.sosBtnContainer}>
          <Text style={styles.sosLabel}>اضغط في حالة الطوارئ</Text>
          <TouchableOpacity
            onPress={countdown === null && !emergencyActive ? startEmergencyCountdown : cancelCountdown}
            activeOpacity={0.85}
          >
            <Animated.View style={[styles.sosBtn, emergencyActive && { transform: [{ scale: emergencyPulse }] }]}>
              <LinearGradient
                colors={emergencyActive ? Gradients.danger : Gradients.primary}
                style={styles.sosBtnInner}
              >
                <View style={styles.sosBtnRing}>
                  <Ionicons name={emergencyActive ? 'warning' : 'alert'} size={52} color={Colors.textOnPrimary} />
                </View>
                <Text style={styles.sosBtnText}>
                  {emergencyActive ? 'نشط' : countdown !== null ? `${countdown}` : 'SOS'}
                </Text>
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>
          <Text style={styles.sosSub}>
            {emergencyActive
              ? 'اضغط لإلغاء التنبيه'
              : countdown !== null
              ? 'اضغط للإلغاء'
              : 'سيتم إرسال تنبيه للمساعدين القريبين'}
          </Text>
        </View>

        {/* Quick actions */}
        <Text style={styles.sectionTitle}>الإجراءات السريعة</Text>
        <View style={styles.actionsGrid}>
          {[
            { icon: 'people', label: 'المقترنون', screen: 'Pairing', color: Colors.primaryLight },
            { icon: 'document-text', label: 'ملفي الصحي', screen: 'HealthProfile', color: Colors.success },
            { icon: 'school', label: 'الدورات', screen: 'Courses', color: Colors.accent },
            { icon: 'call', label: 'جهات الاتصال', screen: 'Contacts', color: Colors.warning },
          ].map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.actionCard}
              onPress={() => navigation.navigate(item.screen)}
            >
              <LinearGradient colors={[item.color + '22', item.color + '11']} style={styles.actionGradient}>
                <Ionicons name={item.icon} size={30} color={item.color} />
                <Text style={[styles.actionLabel, { color: item.color }]}>{item.label}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
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
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 2 },
  userName: { fontSize: 22, fontWeight: '800', color: Colors.textOnPrimary },
  profileBtn: {},
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusBadgeActive: { backgroundColor: 'rgba(244,67,54,0.3)' },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  statusDotActive: { backgroundColor: Colors.danger },
  statusText: { fontSize: 13, color: Colors.textOnPrimary, fontWeight: '600' },
  pairedCount: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, gap: 20, paddingBottom: 40 },
  emergencyBanner: { borderRadius: 16, overflow: 'hidden' },
  emergencyBannerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  emergencyBannerText: { flex: 1 },
  emergencyBannerTitle: { fontSize: 16, fontWeight: '800', color: Colors.textOnPrimary },
  emergencyBannerSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  emergencyDismiss: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  emergencyDismissText: { color: Colors.textOnPrimary, fontWeight: '600', fontSize: 13 },
  countdownBanner: {
    backgroundColor: Colors.warning + '22',
    borderWidth: 1,
    borderColor: Colors.warning,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  countdownText: { color: Colors.textPrimary, fontSize: 14, fontWeight: '600' },
  countdownCancel: {
    backgroundColor: Colors.warning,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 10,
  },
  countdownCancelText: { color: Colors.textOnPrimary, fontWeight: '700', fontSize: 13 },
  hrCard: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  hrGradient: { padding: 20 },
  hrHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  hrLabel: { fontSize: 18, fontWeight: '700', color: Colors.textOnPrimary },
  hrLabelEn: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  hrValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 16,
  },
  hrValue: { fontSize: 52, fontWeight: '900', color: Colors.textOnPrimary, lineHeight: 60 },
  hrUnit: { fontSize: 18, color: 'rgba(255,255,255,0.7)', marginBottom: 10 },
  hrStatus: {
    backgroundColor: Colors.success + '33',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  hrStatusWarning: {
    backgroundColor: Colors.warning + '33',
    borderColor: Colors.warning,
  },
  hrStatusText: { color: Colors.textOnPrimary, fontSize: 12, fontWeight: '600' },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 60,
    gap: 3,
  },
  chartBarWrapper: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
  chartBar: { width: '100%', borderRadius: 3 },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: { flex: 1, borderRadius: 16, overflow: 'hidden' },
  statGradient: {
    padding: 14,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
  },
  statValue: { fontSize: 22, fontWeight: '800', marginTop: 4 },
  statUnit: { fontSize: 11, color: Colors.textSecondary, marginTop: -4 },
  statLabel: { fontSize: 12, color: Colors.textSecondary },
  sosBtnContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  sosLabel: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },
  sosBtn: {
    borderRadius: 90,
    elevation: 12,
    shadowColor: Colors.danger,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  sosBtnInner: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  sosBtnRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  sosBtnText: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.textOnPrimary,
    letterSpacing: 2,
    marginTop: -4,
  },
  sosSub: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'right',
  },
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
  actionLabel: { fontSize: 14, fontWeight: '700' },
});
