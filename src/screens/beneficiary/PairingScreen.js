import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  StatusBar,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Gradients } from '../../theme/colors';
import { useApp } from '../../context/AppContext';

const MOCK_USERS = [
  { id: 'v1', name: 'خالد العتيبي', type: 'volunteer', distance: '0.3 كم', rating: 4.9, certs: ['CPR', 'First Aid'], online: true },
  { id: 'v2', name: 'نورة السبيعي', type: 'volunteer', distance: '0.7 كم', rating: 4.8, certs: ['First Aid'], online: true },
  { id: 'v3', name: 'فيصل الدوسري', type: 'volunteer', distance: '1.2 كم', rating: 4.7, certs: ['CPR', 'First Aid', 'AED'], online: false },
  { id: 'v4', name: 'رنا الحربي', type: 'volunteer', distance: '1.5 كم', rating: 4.6, certs: ['First Aid'], online: true },
];

const UserCard = ({ user, isPaired, onToggle, delay }) => {
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 5, delay, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.userCard, { transform: [{ scale }], opacity }]}>
      <View style={styles.userCardLeft}>
        <View style={[styles.userAvatar, { backgroundColor: isPaired ? Colors.primary + '33' : Colors.border + '66' }]}>
          <Ionicons name="person" size={26} color={isPaired ? Colors.primary : Colors.textSecondary} />
          {user.online && <View style={styles.onlineDot} />}
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <View style={styles.certRow}>
            {user.certs.map(c => (
              <View key={c} style={styles.certBadge}>
                <Text style={styles.certText}>{c}</Text>
              </View>
            ))}
          </View>
          <View style={styles.distanceRow}>
            <Ionicons name="location" size={12} color={Colors.textLight} />
            <Text style={styles.distanceText}>{user.distance}</Text>
            <Ionicons name="star" size={12} color={Colors.warning} />
            <Text style={styles.ratingText}>{user.rating}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={() => onToggle(user.id)} activeOpacity={0.85}>
        <LinearGradient
          colors={isPaired ? Gradients.danger : Gradients.primary}
          style={styles.pairBtn}
        >
          <Ionicons
            name={isPaired ? 'unlink' : 'link'}
            size={16}
            color={Colors.textOnPrimary}
          />
          <Text style={styles.pairBtnText}>{isPaired ? 'إلغاء' : 'اقتران'}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function PairingScreen({ navigation }) {
  const { pairedUsers, setPairedUsers } = useApp();
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState(MOCK_USERS);

  const headerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerOpacity, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const togglePair = (userId) => {
    if (pairedUsers.includes(userId)) {
      setPairedUsers(prev => prev.filter(id => id !== userId));
    } else {
      setPairedUsers(prev => [...prev, userId]);
    }
  };

  const filtered = users.filter(u =>
    u.name.includes(searchText) || searchText === ''
  );

  const pairedList = MOCK_USERS.filter(u => pairedUsers.includes(u.id));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={Gradients.dark} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-forward" size={24} color={Colors.textOnPrimary} />
        </TouchableOpacity>
        <Animated.View style={{ opacity: headerOpacity, alignItems: 'center' }}>
          <Ionicons name="people" size={36} color={Colors.accent} style={{ marginBottom: 8 }} />
          <Text style={styles.headerTitle}>نظام الاقتران</Text>
          <Text style={styles.headerSub}>ربط بمتطوعين موثوقين</Text>
        </Animated.View>

        {/* Stats */}
        <Animated.View style={[styles.statsRow, { opacity: headerOpacity }]}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{pairedUsers.length}</Text>
            <Text style={styles.statLabel}>مقترن</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{MOCK_USERS.filter(u => u.online).length}</Text>
            <Text style={styles.statLabel}>متاح الآن</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{MOCK_USERS.length}</Text>
            <Text style={styles.statLabel}>قريب</Text>
          </View>
        </Animated.View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search */}
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={20} color={Colors.primary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="ابحث عن متطوع..."
            placeholderTextColor={Colors.textLight}
            value={searchText}
            onChangeText={setSearchText}
            textAlign="right"
          />
        </View>

        {/* Paired users */}
        {pairedList.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionDot} />
              <Text style={styles.sectionTitle}>المقترنون ({pairedList.length})</Text>
            </View>
            {pairedList.map((u, i) => (
              <UserCard
                key={u.id}
                user={u}
                isPaired={true}
                onToggle={togglePair}
                delay={i * 100}
              />
            ))}
          </>
        )}

        {/* Available users */}
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionDot, { backgroundColor: Colors.success }]} />
          <Text style={styles.sectionTitle}>المتطوعون القريبون</Text>
        </View>
        {filtered.map((u, i) => (
          <UserCard
            key={u.id}
            user={u}
            isPaired={pairedUsers.includes(u.id)}
            onToggle={togglePair}
            delay={i * 100}
          />
        ))}
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
    gap: 4,
  },
  backBtn: { position: 'absolute', top: 52, right: 24, padding: 8 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.textOnPrimary },
  headerSub: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 16 },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 20,
    width: '100%',
    justifyContent: 'center',
  },
  statItem: { alignItems: 'center', flex: 1 },
  statNum: { fontSize: 22, fontWeight: '800', color: Colors.textOnPrimary },
  statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)', height: '100%' },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, gap: 12, paddingBottom: 40 },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    height: 52,
  },
  searchIcon: { marginLeft: 8 },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
    textAlign: 'right',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  sectionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  userCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 3,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  userCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  userInfo: { flex: 1, gap: 4 },
  userName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, textAlign: 'right' },
  certRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' },
  certBadge: {
    backgroundColor: Colors.primary + '18',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  certText: { fontSize: 10, color: Colors.primary, fontWeight: '600' },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    justifyContent: 'flex-end',
  },
  distanceText: { fontSize: 11, color: Colors.textLight },
  ratingText: { fontSize: 11, color: Colors.textLight },
  pairBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  pairBtnText: { fontSize: 13, fontWeight: '700', color: Colors.textOnPrimary },
});
