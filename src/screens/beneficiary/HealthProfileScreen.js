import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Gradients } from '../../theme/colors';
import { useApp } from '../../context/AppContext';

const InfoRow = ({ icon, label, value, color }) => (
  <View style={styles.infoRow}>
    <View style={[styles.infoIcon, { backgroundColor: (color || Colors.primary) + '22' }]}>
      <Ionicons name={icon} size={20} color={color || Colors.primary} />
    </View>
    <View style={styles.infoText}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const CONDITIONS = ['نوبات صرع', 'الإغماء الوعائي المبهمي', 'انخفاض ضغط الدم', 'أمراض القلب', 'مرض السكري', 'أخرى'];
const MEDICATIONS = ['لا يوجد', 'ليفيتيراسيتام', 'فينيتوين', 'كاربامازيبين', 'أخرى'];

export default function HealthProfileScreen({ navigation }) {
  const { user } = useApp();
  const [bloodType, setBloodType] = useState('A+');
  const [condition, setCondition] = useState('نوبات صرع');
  const [medication, setMedication] = useState('لا يوجد');
  const [allergies, setAllergies] = useState('لا يوجد');
  const [emergencyNote, setEmergencyNote] = useState('يرجى الاتصال بالإسعاف فوراً ووضع المريض على جانبه');
  const [editing, setEditing] = useState(false);

  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(40)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(contentOpacity, { toValue: 1, duration: 600, delay: 300, useNativeDriver: true }),
      Animated.timing(contentAnim, { toValue: 0, duration: 500, delay: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={Gradients.dark} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-forward" size={24} color={Colors.textOnPrimary} />
        </TouchableOpacity>
        <Animated.View style={{ opacity: headerAnim, alignItems: 'center' }}>
          <View style={styles.avatarBig}>
            <Ionicons name="person" size={44} color={Colors.textOnPrimary} />
          </View>
          <Text style={styles.headerName}>{user?.name}</Text>
          <View style={styles.bloodTypeBadge}>
            <Ionicons name="water" size={14} color={Colors.heartRed} />
            <Text style={styles.bloodTypeText}>{bloodType}</Text>
          </View>
        </Animated.View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{ opacity: contentOpacity, transform: [{ translateY: contentAnim }] }}
        >
          {/* Medical Info Card */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>المعلومات الطبية</Text>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => setEditing(!editing)}
              >
                <Ionicons name={editing ? 'checkmark' : 'create-outline'} size={18} color={Colors.primary} />
                <Text style={styles.editBtnText}>{editing ? 'حفظ' : 'تعديل'}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              {/* Blood Type */}
              <Text style={styles.fieldLabel}>فصيلة الدم</Text>
              <View style={styles.chipsRow}>
                {BLOOD_TYPES.map(bt => (
                  <TouchableOpacity
                    key={bt}
                    style={[styles.chip, bloodType === bt && styles.chipActive]}
                    onPress={() => editing && setBloodType(bt)}
                  >
                    <Text style={[styles.chipText, bloodType === bt && styles.chipTextActive]}>
                      {bt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Condition */}
              <Text style={styles.fieldLabel}>الحالة الطبية</Text>
              <View style={styles.chipsRow}>
                {CONDITIONS.map(c => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.chip, condition === c && styles.chipActive]}
                    onPress={() => editing && setCondition(c)}
                  >
                    <Text style={[styles.chipText, condition === c && styles.chipTextActive]}>
                      {c}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Medication */}
              <Text style={styles.fieldLabel}>الدواء الحالي</Text>
              <View style={styles.chipsRow}>
                {MEDICATIONS.map(m => (
                  <TouchableOpacity
                    key={m}
                    style={[styles.chip, medication === m && styles.chipActive]}
                    onPress={() => editing && setMedication(m)}
                  >
                    <Text style={[styles.chipText, medication === m && styles.chipTextActive]}>
                      {m}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Emergency Instructions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>تعليمات الطوارئ</Text>
            <View style={[styles.card, styles.emergencyCard]}>
              <Ionicons name="warning" size={24} color={Colors.warning} />
              <Text style={styles.emergencyNote}>{emergencyNote}</Text>
            </View>
          </View>

          {/* Quick Medical Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ملخص سريع</Text>
            <View style={styles.card}>
              <InfoRow icon="water" label="فصيلة الدم" value={bloodType} color={Colors.heartRed} />
              <View style={styles.divider} />
              <InfoRow icon="pulse" label="الحالة" value={condition} color={Colors.primary} />
              <View style={styles.divider} />
              <InfoRow icon="medical" label="الدواء" value={medication} color={Colors.success} />
              <View style={styles.divider} />
              <InfoRow icon="shield" label="الحساسيات" value={allergies} color={Colors.warning} />
            </View>
          </View>

          {/* QR Code placeholder */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>رمز الطوارئ QR</Text>
            <TouchableOpacity>
              <LinearGradient colors={Gradients.primary} style={styles.qrCard}>
                <Ionicons name="qr-code" size={60} color={Colors.textOnPrimary} />
                <View>
                  <Text style={styles.qrTitle}>مشاركة ملفي الطبي</Text>
                  <Text style={styles.qrSub}>اضغط لإنشاء رمز QR للطوارئ</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingTop: 50,
    paddingBottom: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  backBtn: { position: 'absolute', top: 52, right: 24, padding: 8 },
  avatarBig: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
    marginBottom: 12,
  },
  headerName: { fontSize: 22, fontWeight: '800', color: Colors.textOnPrimary, marginBottom: 8 },
  bloodTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  bloodTypeText: { color: Colors.textOnPrimary, fontWeight: '700', fontSize: 14 },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, gap: 8, paddingBottom: 40 },
  section: { gap: 10, marginBottom: 4 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary + '18',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  editBtnText: { color: Colors.primary, fontWeight: '600', fontSize: 13 },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 2,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  fieldLabel: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600', textAlign: 'right' },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.cardBg,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  chipTextActive: { color: Colors.textOnPrimary, fontWeight: '700' },
  emergencyCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: Colors.warning + '11',
    borderColor: Colors.warning,
  },
  emergencyNote: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 22,
    textAlign: 'right',
  },
  divider: { height: 1, backgroundColor: Colors.divider },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  infoIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: { flex: 1 },
  infoLabel: { fontSize: 12, color: Colors.textSecondary },
  infoValue: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary, textAlign: 'right' },
  qrCard: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  qrTitle: { fontSize: 16, fontWeight: '700', color: Colors.textOnPrimary },
  qrSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
});
