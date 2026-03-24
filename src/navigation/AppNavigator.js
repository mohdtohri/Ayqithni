import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useApp } from '../context/AppContext';

// Screens
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import UserTypeScreen from '../screens/UserTypeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Beneficiary
import BeneficiaryHomeScreen from '../screens/beneficiary/HomeScreen';
import HealthProfileScreen from '../screens/beneficiary/HealthProfileScreen';
import PairingScreen from '../screens/beneficiary/PairingScreen';
import ContactsScreen from '../screens/beneficiary/ContactsScreen';

// Volunteer
import VolunteerHomeScreen from '../screens/volunteer/HomeScreen';
import AlertScreen from '../screens/volunteer/AlertScreen';

// Shared
import CoursesScreen from '../screens/shared/CoursesScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';

const Stack = createStackNavigator();

const screenOptions = {
  headerShown: false,
  cardStyleInterpolator: ({ current, layouts }) => ({
    cardStyle: {
      opacity: current.progress,
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.width * 0.08, 0],
          }),
        },
      ],
    },
  }),
  transitionSpec: {
    open: {
      animation: 'timing',
      config: { duration: 300 },
    },
    close: {
      animation: 'timing',
      config: { duration: 250 },
    },
  },
};

const AuthStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const BeneficiaryStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="BeneficiaryHome" component={BeneficiaryHomeScreen} />
    <Stack.Screen name="HealthProfile" component={HealthProfileScreen} />
    <Stack.Screen name="Pairing" component={PairingScreen} />
    <Stack.Screen name="Contacts" component={ContactsScreen} />
    <Stack.Screen name="Courses" component={CoursesScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </Stack.Navigator>
);

const VolunteerStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="VolunteerHome" component={VolunteerHomeScreen} />
    <Stack.Screen name="Alert" component={AlertScreen} />
    <Stack.Screen name="Courses" component={CoursesScreen} />
    <Stack.Screen name="Pairing" component={PairingScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { isLoggedIn, userType } = useApp();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        {!isLoggedIn ? (
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="UserType" component={UserTypeScreen} />
            <Stack.Screen name="Auth" component={AuthStack} />
          </>
        ) : userType === 'volunteer' ? (
          <Stack.Screen name="VolunteerMain" component={VolunteerStack} />
        ) : (
          <Stack.Screen name="BeneficiaryMain" component={BeneficiaryStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
