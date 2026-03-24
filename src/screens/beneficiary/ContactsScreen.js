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

const MOCK_CONTACTS = [
  { id: 'c1', name: 'والدي - عبدالله', phone: '+966 50 111 2222', relation: 'والد', priority: 1 },
  { id: 'c2', name: 'أمي - فاطمة', phone: '+966 50 333 4444', relation: 'والدة', priority: 2 },
  { id: 'c3', name: 'أخي - محمد', phone: '+966 50 555 6666', relation: 'أخ', priority: 3 },
];

const ContactCard = ({ contact, onDelete, delay }) => {
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 5, delay, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  const relationColors = {
    'والد': Colors.primary,
    'والدة': Colors.heartRed,
    'أخ': Colors.success,
    'أخت': Colors.accent,
    'صديق': Colors.warning,
  };
  const color = relationColors[contact.relation] || Colors.primary;

  return (
    <Animated.View style={[styles.contactCard, { transform: [{ scale }], opacity }]}>
      <View style={[styles.priorityBadge, { backgroundColor: color }]}>
        <Text style={styles.priorityNum}>{contact.priority}</Text>
      </View>
      <View style={[styles.contactAvatar, { backgroundColor: color + '22' }]}>
        <Ionicons name="person" size={24} color={color} />
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{contact.name}</Text>
        <Text style={styles.contactPhone}>{contact.phone}</Text>
        <View style={[styles.relationBadge, { backgroundColor: color + '22', borderColor: color }]}>
          <Text style={[styles.relationText, { color }]}>{contact.relation}</Text>
        </View>
      </View>
      <View style={styles.contactActions}>
        <TouchableOpacity style={styles.callBtn}>
          <Ionicons name="call" size={20} color={Colors.success} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(contact.id)}>
          <Ionicons name="trash-outline" size={18} color={Colors.danger} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default function ContactsScreen({ navigation }) {
  const [contacts, setContacts] = useState(MOCK_CONTACTS);
  const headerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerOpacity, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const deleteContact = (id) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={Gradients.dark} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-forward" size={24} color={Colors.textOnPrimary} />
        </TouchableOpacity>
        <Animated.View style={{ opacity: headerOpacity, alignItems: 'center' }}>
          <Ionicons name="call" size={36} color={Colors.accent} style={{ marginBottom: 8 }} />
          <Text style={styles.headerTitle}>جهات اتصال الطوارئ</Text>
          <Text style={styles.headerSub}>يتم إشعارهم تلقائياً عند الطوارئ</Text>
        </Animated.View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Info banner */}
        <View style={styles.infoBanner}>
          <Ionicons name="information-circle" size={20} color={Colors.primary} />
          <Text style={styles.infoBannerText}>
            سيتم إرسال رسالة SMS وإشعار فوري لهذه الجهات عند الكشف عن حالة طارئة
          </Text>
        </View>

        {/* Contacts */}
        {contacts.map((c, i) => (
          <ContactCard key={c.id} contact={c} onDelete={deleteContact} delay={i * 150} />
        ))}

        {/* Add contact */}
        <TouchableOpacity activeOpacity={0.85}>
          <LinearGradient colors={Gradients.primary} style={styles.addBtn}>
            <Ionicons name="person-add" size={22} color={Colors.textOnPrimary} />
            <Text style={styles.addBtnText}>إضافة جهة اتصال</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Emergency numbers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>أرقام الطوارئ</Text>
          {[
            { name: 'هلال أحمر', number: '911', icon: 'medical' },
            { name: 'الدفاع المدني', number: '998', icon: 'flame' },
            { name: 'الشرطة', number: '999', icon: 'shield' },
          ].map((item, i) => (
            <View key={i} style={styles.emergencyNumCard}>
              <TouchableOpacity style={styles.callEmergencyBtn}>
                <LinearGradient colors={Gradients.danger} style={styles.callEmergencyGrad}>
                  <Ionicons name="call" size={16} color={Colors.textOnPrimary} />
                  <Text style={styles.callEmergencyNum}>{item.number}</Text>
                </LinearGradient>
              </TouchableOpacity>
              <View style={styles.emergencyNumInfo}>
                <Text style={styles.emergencyNumName}>{item.name}</Text>
              </View>
              <Ionicons name={item.icon} size={24} color={Colors.danger} />
            </View>
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
    paddingBottom: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 4,
  },
  backBtn: { position: 'absolute', top: 52, right: 24, padding: 8 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.textOnPrimary },
  headerSub: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, gap: 14, paddingBottom: 40 },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Colors.primary + '12',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    textAlign: 'right',
  },
  contactCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 3,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  priorityBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -8,
    right: -8,
  },
  priorityNum: { fontSize: 11, fontWeight: '800', color: Colors.textOnPrimary },
  contactAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: { flex: 1, gap: 4 },
  contactName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, textAlign: 'right' },
  contactPhone: { fontSize: 13, color: Colors.textSecondary, textAlign: 'right' },
  relationBadge: {
    alignSelf: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
  },
  relationText: { fontSize: 11, fontWeight: '600' },
  contactActions: { flexDirection: 'column', gap: 8 },
  callBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.success + '18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.danger + '18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  addBtnText: { fontSize: 16, fontWeight: '700', color: Colors.textOnPrimary },
  section: { gap: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  emergencyNumCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  callEmergencyBtn: { borderRadius: 12, overflow: 'hidden' },
  callEmergencyGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  callEmergencyNum: { fontSize: 15, fontWeight: '800', color: Colors.textOnPrimary },
  emergencyNumInfo: { flex: 1 },
  emergencyNumName: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary, textAlign: 'right' },
});
