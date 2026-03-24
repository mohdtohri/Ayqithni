import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  StatusBar,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Gradients } from '../../theme/colors';

export default function AlertScreen({ navigation, route }) {
  const alert = route?.params?.alert || {};
  const [arrived, setArrived] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const ring1 = useRef(new Animated.Value(0)).current;
  const ring2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();

    // Pulsing rings
    const ringAnim = (ring, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(ring, { toValue: 1, duration: 1500, useNativeDriver: true }),
          Animated.timing(ring, { toValue: 0, duration: 0, useNativeDriver: true }),
        ])
      );
    ringAnim(ring1, 0).start();
    ringAnim(ring2, 750).start();

    // SOS pulse
    if (!arrived) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.08, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    }

    // Timer
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [arrived]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const ringStyle = (ring) => ({
    opacity: ring.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0.7, 0.4, 0] }),
    transform: [{ scale: ring.interpolate({ inputRange: [0, 1], outputRange: [1, 2.2] }) }],
  });

  const handleCall = () => {
    Linking.openURL('tel:911');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={arrived ? Gradients.success : Gradients.danger} style={styles.topSection}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-forward" size={24} color={Colors.textOnPrimary} />
        </TouchableOpacity>

        {/* Pulse rings */}
        {!arrived && (
          <>
            <Animated.View style={[styles.ring, ringStyle(ring1)]} />
            <Animated.View style={[styles.ring, ringStyle(ring2)]} />
          </>
        )}

        <Animated.View
          style={[styles.alertIcon, { transform: [{ scale: arrived ? scaleAnim : pulseAnim }], opacity: opacityAnim }]}
        >
          <LinearGradient
            colors={arrived ? ['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.1)'] : ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)']}
            style={styles.alertIconInner}
          >
            <Ionicons
              name={arrived ? 'checkmark-circle' : 'warning'}
              size={60}
              color={Colors.textOnPrimary}
            />
          </LinearGradient>
        </Animated.View>

        <Text style={styles.alertTitle}>{arrived ? 'وصلت للمكان!' : 'حالة طارئة نشطة'}</Text>
        <Text style={styles.alertSubtitle}>
          {arrived ? 'قدم المساعدة الآن' : 'في طريقك لتقديم المساعدة'}
        </Text>
        <View style={styles.timerBadge}>
          <Ionicons name="time" size={14} color={Colors.textOnPrimary} />
          <Text style={styles.timerText}>{formatTime(timeElapsed)}</Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
      >
        {/* Patient info */}
        <View style={styles.patientCard}>
          <Text style={styles.cardTitle}>معلومات المريض</Text>
          <View style={styles.patientRow}>
            <View style={styles.patientAvatar}>
              <Ionicons name="person" size={30} color={Colors.textOnPrimary} />
            </View>
            <View style={styles.patientInfo}>
              <Text style={styles.patientName}>{alert.userName || 'مجهول'}</Text>
              <Text style={styles.patientCondition}>{alert.condition || 'غير محدد'}</Text>
            </View>
            <View style={styles.bloodTypePill}>
              <Ionicons name="water" size={12} color={Colors.heartRed} />
              <Text style={styles.bloodTypeText}>{alert.bloodType || 'غ.م'}</Text>
            </View>
          </View>
        </View>

        {/* Location */}
        <View style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <Ionicons name="location" size={20} color={Colors.primary} />
            <Text style={styles.locationTitle}>الموقع</Text>
            <Text style={styles.distancePill}>{alert.distance || '---'}</Text>
          </View>
          <Text style={styles.locationText}>{alert.location || 'غير محدد'}</Text>
          <TouchableOpacity activeOpacity={0.85}>
            <LinearGradient colors={Gradients.primary} style={styles.mapBtn}>
              <Ionicons name="map" size={18} color={Colors.textOnPrimary} />
              <Text style={styles.mapBtnText}>فتح في الخريطة</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* First Aid Steps */}
        <View style={styles.firstAidCard}>
          <Text style={styles.cardTitle}>خطوات الإسعاف الأولي</Text>
          {[
            { step: '1', text: 'تأكد من سلامة المكان وأمانك الشخصي', icon: 'shield-checkmark' },
            { step: '2', text: 'تحقق من استجابة المريض بالنداء والنقر على كتفيه', icon: 'hand-left' },
            { step: '3', text: 'اتصل بالإسعاف على 911 فوراً', icon: 'call' },
            { step: '4', text: 'ضع المريض على جانبه (وضعية الإنعاش) إذا كان يتنفس', icon: 'body' },
            { step: '5', text: 'لا تضع أي شيء في فم المريض أثناء النوبة', icon: 'close-circle' },
            { step: '6', text: 'ابقَ مع المريض حتى وصول الإسعاف', icon: 'heart' },
          ].map((item, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{item.step}</Text>
              </View>
              <Ionicons name={item.icon} size={18} color={Colors.primary} />
              <Text style={styles.stepText}>{item.text}</Text>
            </View>
          ))}
        </View>

        {/* Action buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
            <LinearGradient colors={Gradients.danger} style={styles.callBtnInner}>
              <Ionicons name="call" size={22} color={Colors.textOnPrimary} />
              <Text style={styles.callBtnText}>اتصل 911</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => setArrived(true)}
            disabled={arrived}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={arrived ? ['#43A047', '#1B5E20'] : Gradients.primary}
              style={styles.arrivedBtn}
            >
              <Ionicons name={arrived ? 'checkmark-circle' : 'walk'} size={22} color={Colors.textOnPrimary} />
              <Text style={styles.arrivedBtnText}>
                {arrived ? 'وصلت ✓' : 'وصلت للمكان'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topSection: {
    paddingTop: 50,
    paddingBottom: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 8,
    overflow: 'hidden',
  },
  backBtn: { position: 'absolute', top: 52, right: 24, padding: 8, zIndex: 10 },
  ring: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  alertIcon: { marginBottom: 8 },
  alertIconInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  alertTitle: { fontSize: 24, fontWeight: '800', color: Colors.textOnPrimary },
  alertSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 4,
  },
  timerText: { color: Colors.textOnPrimary, fontWeight: '700', fontSize: 14 },
  content: { flex: 1 },
  contentInner: { padding: 20, gap: 16, paddingBottom: 40 },
  patientCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 3,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, textAlign: 'right' },
  patientRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  patientAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientInfo: { flex: 1 },
  patientName: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, textAlign: 'right' },
  patientCondition: { fontSize: 13, color: Colors.textSecondary, textAlign: 'right' },
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
  locationCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 2,
  },
  locationHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  locationTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, flex: 1 },
  distancePill: {
    backgroundColor: Colors.primary,
    color: Colors.textOnPrimary,
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    overflow: 'hidden',
  },
  locationText: { fontSize: 14, color: Colors.textSecondary, textAlign: 'right' },
  mapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    marginTop: 4,
  },
  mapBtnText: { fontSize: 15, fontWeight: '700', color: Colors.textOnPrimary },
  firstAidCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 2,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 4,
  },
  stepNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: { fontSize: 12, fontWeight: '800', color: Colors.textOnPrimary },
  stepText: { flex: 1, fontSize: 14, color: Colors.textPrimary, textAlign: 'right', lineHeight: 22 },
  actionRow: { flexDirection: 'row', gap: 12 },
  callBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: Colors.danger,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  callBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    gap: 6,
  },
  callBtnText: { fontSize: 15, fontWeight: '700', color: Colors.textOnPrimary },
  arrivedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  arrivedBtnText: { fontSize: 15, fontWeight: '700', color: Colors.textOnPrimary },
});
