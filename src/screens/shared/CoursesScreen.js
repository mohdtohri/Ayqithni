import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Gradients } from '../../theme/colors';
import { useApp } from '../../context/AppContext';

const { width } = Dimensions.get('window');

const ProgressBar = ({ progress, color }) => {
  const animWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animWidth, {
      toValue: progress,
      duration: 1000,
      delay: 300,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  return (
    <View style={styles.progressBg}>
      <Animated.View
        style={[
          styles.progressFill,
          {
            width: animWidth.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
};

const CourseCard = ({ course, onPress, delay }) => {
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 5, delay, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  const pct = Math.round(course.progress * 100);

  return (
    <Animated.View style={[styles.courseCard, { transform: [{ scale }], opacity }]}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <View style={styles.courseCardInner}>
          <View style={[styles.courseIconBox, { backgroundColor: course.color + '22' }]}>
            <Ionicons name={course.icon} size={32} color={course.color} />
            {course.completed && (
              <View style={styles.completedBadge}>
                <Ionicons name="checkmark" size={12} color={Colors.textOnPrimary} />
              </View>
            )}
          </View>
          <View style={styles.courseInfo}>
            <Text style={styles.courseTitle}>{course.title}</Text>
            <Text style={styles.courseDesc} numberOfLines={2}>{course.description}</Text>
            <View style={styles.courseMeta}>
              <View style={styles.metaBadge}>
                <Ionicons name="time" size={12} color={Colors.textLight} />
                <Text style={styles.metaText}>{course.duration}</Text>
              </View>
              <View style={styles.metaBadge}>
                <Ionicons name="book" size={12} color={Colors.textLight} />
                <Text style={styles.metaText}>{course.lessons} دروس</Text>
              </View>
            </View>
            <View style={styles.progressRow}>
              <ProgressBar progress={course.progress} color={course.color} />
              <Text style={[styles.progressPct, { color: course.color }]}>{pct}%</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function CoursesScreen({ navigation }) {
  const { courses, updateCourseProgress, userType } = useApp();
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'
  const headerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerOpacity, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const completedCount = courses.filter(c => c.completed).length;
  const inProgressCount = courses.filter(c => !c.completed && c.progress > 0).length;
  const totalProgress = courses.reduce((sum, c) => sum + c.progress, 0) / courses.length;

  const filteredCourses = courses.filter(c => {
    if (filter === 'completed') return c.completed;
    if (filter === 'active') return !c.completed;
    return true;
  });

  const openCourse = (course) => {
    // Simulate course progression
    const newProgress = Math.min(1, course.progress + 0.25);
    updateCourseProgress(course.id, newProgress);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={Gradients.dark} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-forward" size={24} color={Colors.textOnPrimary} />
        </TouchableOpacity>
        <Animated.View style={{ opacity: headerOpacity, alignItems: 'center', gap: 4 }}>
          <Ionicons name="school" size={36} color={Colors.accent} />
          <Text style={styles.headerTitle}>الدورات التدريبية</Text>
          <Text style={styles.headerSub}>تعلم الإسعافات الأولية</Text>
        </Animated.View>

        {/* Overall progress */}
        <Animated.View style={[styles.overallCard, { opacity: headerOpacity }]}>
          <View style={styles.overallStats}>
            <View style={styles.overallStat}>
              <Text style={styles.overallNum}>{completedCount}</Text>
              <Text style={styles.overallLabel}>مكتمل</Text>
            </View>
            <View style={styles.overallDivider} />
            <View style={styles.overallStat}>
              <Text style={styles.overallNum}>{inProgressCount}</Text>
              <Text style={styles.overallLabel}>قيد التعلم</Text>
            </View>
            <View style={styles.overallDivider} />
            <View style={styles.overallStat}>
              <Text style={styles.overallNum}>{courses.length - completedCount - inProgressCount}</Text>
              <Text style={styles.overallLabel}>لم يبدأ</Text>
            </View>
          </View>
          <View style={styles.overallProgressRow}>
            <Text style={styles.overallProgressLabel}>التقدم الإجمالي</Text>
            <Text style={styles.overallProgressPct}>{Math.round(totalProgress * 100)}%</Text>
          </View>
          <ProgressBar progress={totalProgress} color={Colors.accent} />
        </Animated.View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Filter tabs */}
        <View style={styles.filterRow}>
          {[
            { id: 'all', label: 'الكل' },
            { id: 'active', label: 'جارية' },
            { id: 'completed', label: 'مكتملة' },
          ].map(f => (
            <TouchableOpacity
              key={f.id}
              style={[styles.filterTab, filter === f.id && styles.filterTabActive]}
              onPress={() => setFilter(f.id)}
            >
              <Text style={[styles.filterTabText, filter === f.id && styles.filterTabTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filteredCourses.map((course, i) => (
          <CourseCard
            key={course.id}
            course={course}
            onPress={() => openCourse(course)}
            delay={i * 100}
          />
        ))}

        {/* Certificate banner */}
        {completedCount === courses.length && (
          <LinearGradient colors={Gradients.accent} style={styles.certBanner}>
            <Ionicons name="ribbon" size={32} color={Colors.textOnPrimary} />
            <View style={styles.certBannerText}>
              <Text style={styles.certBannerTitle}>مبروك! أكملت جميع الدورات</Text>
              <Text style={styles.certBannerSub}>يمكنك الآن الحصول على شهادة المتطوع المعتمد</Text>
            </View>
          </LinearGradient>
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
    alignItems: 'center',
    gap: 8,
  },
  backBtn: { position: 'absolute', top: 52, right: 24, padding: 8 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.textOnPrimary },
  headerSub: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  overallCard: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    padding: 14,
    width: '100%',
    gap: 10,
    marginTop: 8,
  },
  overallStats: { flexDirection: 'row', justifyContent: 'space-around' },
  overallStat: { alignItems: 'center' },
  overallNum: { fontSize: 24, fontWeight: '800', color: Colors.textOnPrimary },
  overallLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  overallDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  overallProgressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  overallProgressLabel: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  overallProgressPct: { fontSize: 13, fontWeight: '700', color: Colors.accent },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, gap: 14, paddingBottom: 40 },
  filterRow: { flexDirection: 'row', gap: 10 },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterTabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterTabText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  filterTabTextActive: { color: Colors.textOnPrimary },
  courseCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  courseCardInner: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    gap: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  courseIconBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  completedBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  courseInfo: { flex: 1, gap: 6 },
  courseTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, textAlign: 'right' },
  courseDesc: { fontSize: 12, color: Colors.textSecondary, textAlign: 'right', lineHeight: 18 },
  courseMeta: { flexDirection: 'row', gap: 10, justifyContent: 'flex-end' },
  metaBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 11, color: Colors.textLight },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  progressBg: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.divider,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 3 },
  progressPct: { fontSize: 12, fontWeight: '700', minWidth: 32, textAlign: 'right' },
  certBanner: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  certBannerText: { flex: 1 },
  certBannerTitle: { fontSize: 15, fontWeight: '700', color: Colors.textOnPrimary },
  certBannerSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
});
