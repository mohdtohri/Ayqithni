import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Animated } from 'react-native';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [userType, setUserType] = useState(null); // 'beneficiary' | 'volunteer'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [pairedUsers, setPairedUsers] = useState([]);
  const [nearbyAlerts, setNearbyAlerts] = useState([]);
  const [heartRate, setHeartRate] = useState(72);
  const [acceleration, setAcceleration] = useState({ x: 0, y: 0, z: 0 });
  const [location, setLocation] = useState(null);
  const [courses, setCourses] = useState([
    {
      id: '1',
      title: 'الإسعافات الأولية للإغماء',
      titleEn: 'First Aid for Fainting',
      description: 'تعلم كيفية التعامل مع حالات الإغماء المفاجئ',
      duration: '45 دقيقة',
      lessons: 6,
      completed: false,
      progress: 0,
      icon: 'medkit',
      color: '#1565C0',
    },
    {
      id: '2',
      title: 'التعامل مع نوبات الصرع',
      titleEn: 'Handling Epileptic Seizures',
      description: 'دليل شامل للتعامل مع نوبات الصرع بأمان',
      duration: '60 دقيقة',
      lessons: 8,
      completed: false,
      progress: 0.3,
      icon: 'pulse',
      color: '#0288D1',
    },
    {
      id: '3',
      title: 'الإنعاش القلبي الرئوي CPR',
      titleEn: 'Cardiopulmonary Resuscitation CPR',
      description: 'تقنيات الإنعاش القلبي الرئوي للطوارئ',
      duration: '90 دقيقة',
      lessons: 10,
      completed: true,
      progress: 1,
      icon: 'heart',
      color: '#1E88E5',
    },
    {
      id: '4',
      title: 'قراءة الإشارات الحيوية',
      titleEn: 'Reading Vital Signs',
      description: 'كيفية قراءة وتفسير الإشارات الحيوية',
      duration: '30 دقيقة',
      lessons: 4,
      completed: false,
      progress: 0.6,
      icon: 'analytics',
      color: '#42A5F5',
    },
  ]);

  const emergencyPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (emergencyActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(emergencyPulse, {
            toValue: 1.3,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(emergencyPulse, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      emergencyPulse.setValue(1);
    }
  }, [emergencyActive]);

  const triggerEmergency = () => {
    setEmergencyActive(true);
    // Simulate sending alerts to nearby users
    setNearbyAlerts(prev => [
      {
        id: Date.now().toString(),
        userId: user?.id,
        userName: user?.name,
        location: location || { latitude: 24.7136, longitude: 46.6753 },
        timestamp: new Date(),
        status: 'active',
      },
      ...prev,
    ]);
  };

  const dismissEmergency = () => {
    setEmergencyActive(false);
  };

  const login = (userData, type) => {
    setUser(userData);
    setUserType(type);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    setIsLoggedIn(false);
    setEmergencyActive(false);
  };

  const updateCourseProgress = (courseId, progress) => {
    setCourses(prev =>
      prev.map(c =>
        c.id === courseId
          ? { ...c, progress, completed: progress >= 1 }
          : c
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        userType,
        setUserType,
        isLoggedIn,
        user,
        emergencyActive,
        pairedUsers,
        setPairedUsers,
        nearbyAlerts,
        setNearbyAlerts,
        heartRate,
        setHeartRate,
        acceleration,
        setAcceleration,
        location,
        setLocation,
        courses,
        emergencyPulse,
        triggerEmergency,
        dismissEmergency,
        login,
        logout,
        updateCourseProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
