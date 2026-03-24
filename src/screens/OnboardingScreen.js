import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  FlatList,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Gradients } from '../theme/colors';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    icon: 'heart-circle',
    color: Colors.accent,
    title: 'مراقبة صحتك بذكاء',
    subtitle: 'Smart Health Monitoring',
    description:
      'يراقب التطبيق نبضات قلبك وحركتك بشكل مستمر باستخدام حساسات الجهاز الذكي لاكتشاف أي حالة طارئة.',
  },
  {
    id: '2',
    icon: 'alert-circle',
    color: Colors.warning,
    title: 'تنبيه فوري للمجاورين',
    subtitle: 'Instant Nearby Alerts',
    description:
      'عند اكتشاف حالة طارئة، يرسل التطبيق تنبيهاً فورياً للمتطوعين القريبين منك جغرافياً.',
  },
  {
    id: '3',
    icon: 'people',
    color: Colors.success,
    title: 'نظام الاقتران الذكي',
    subtitle: 'Smart Pairing System',
    description:
      'اربط نفسك بأشخاص موثوقين أو متطوعين مدربين لضمان سرعة الاستجابة عند حدوث أي طارئ.',
  },
  {
    id: '4',
    icon: 'school',
    color: Colors.primaryLighter,
    title: 'تدريب ودورات متخصصة',
    subtitle: 'Specialized Training',
    description:
      'استفد من دورات الإسعافات الأولية المدمجة لتعلم كيفية التعامل مع حالات الطوارئ بكفاءة.',
  },
];

export default function OnboardingScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(0)).current;
  const iconRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    animateIn();
  }, [currentIndex]);

  const animateIn = () => {
    iconScale.setValue(0);
    iconRotate.setValue(-0.1);
    Animated.parallel([
      Animated.spring(iconScale, {
        toValue: 1,
        friction: 4,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.timing(iconRotate, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const goToNext = () => {
    if (currentIndex < slides.length - 1) {
      const next = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
      setCurrentIndex(next);
    } else {
      navigation.replace('UserType');
    }
  };

  const goToSlide = (index) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setCurrentIndex(index);
  };

  const renderSlide = ({ item, index }) => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    });
    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [50, 0, -50],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.slide}>
        <Animated.View style={[styles.iconArea, { opacity, transform: [{ translateY }] }]}>
          <Animated.View
            style={[
              styles.iconCircle,
              {
                transform: [
                  { scale: iconScale },
                  {
                    rotate: iconRotate.interpolate({
                      inputRange: [-0.1, 0],
                      outputRange: ['-15deg', '0deg'],
                    }),
                  },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={[item.color + '33', item.color + '11']}
              style={styles.iconGradient}
            >
              <View style={[styles.iconInner, { borderColor: item.color + '44' }]}>
                <Ionicons name={item.icon} size={80} color={item.color} />
              </View>
            </LinearGradient>
          </Animated.View>

          <Animated.Text style={[styles.slideTitle, { opacity }]}>
            {item.title}
          </Animated.Text>
          <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
          <Animated.Text style={[styles.slideDescription, { opacity }]}>
            {item.description}
          </Animated.Text>
        </Animated.View>
      </View>
    );
  };

  return (
    <LinearGradient colors={[Colors.surface, Colors.background, Colors.cardBg]} style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      {/* Skip button */}
      <TouchableOpacity style={styles.skipBtn} onPress={() => navigation.replace('UserType')}>
        <Text style={styles.skipText}>تخطى</Text>
      </TouchableOpacity>

      {/* Slides */}
      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={e => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(idx);
        }}
        scrollEventThrottle={16}
      />

      {/* Bottom controls */}
      <View style={styles.bottomControls}>
        {/* Dots */}
        <View style={styles.dotsRow}>
          {slides.map((_, i) => {
            const dotWidth = scrollX.interpolate({
              inputRange: [(i - 1) * width, i * width, (i + 1) * width],
              outputRange: [8, 28, 8],
              extrapolate: 'clamp',
            });
            const dotColor = scrollX.interpolate({
              inputRange: [(i - 1) * width, i * width, (i + 1) * width],
              outputRange: [Colors.border, Colors.primary, Colors.border],
              extrapolate: 'clamp',
            });
            return (
              <TouchableOpacity key={i} onPress={() => goToSlide(i)}>
                <Animated.View
                  style={[styles.dot, { width: dotWidth, backgroundColor: dotColor }]}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Next button */}
        <TouchableOpacity onPress={goToNext} activeOpacity={0.85}>
          <LinearGradient
            colors={Gradients.primary}
            style={styles.nextBtn}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.nextBtnText}>
              {currentIndex === slides.length - 1 ? 'ابدأ الآن' : 'التالي'}
            </Text>
            <Ionicons
              name={currentIndex === slides.length - 1 ? 'checkmark' : 'arrow-back'}
              size={20}
              color={Colors.textOnPrimary}
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  skipBtn: {
    position: 'absolute',
    top: 50,
    left: 24,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  skipText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  iconArea: {
    alignItems: 'center',
    gap: 20,
  },
  iconCircle: {
    marginBottom: 10,
  },
  iconGradient: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconInner: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  slideSubtitle: {
    fontSize: 14,
    color: Colors.primary,
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 1,
    marginTop: -12,
  },
  slideDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
  },
  bottomControls: {
    paddingHorizontal: 32,
    paddingBottom: 48,
    alignItems: 'center',
    gap: 24,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 30,
    gap: 10,
    minWidth: 200,
    elevation: 6,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  nextBtnText: {
    color: Colors.textOnPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
});
