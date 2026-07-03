import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/stores/authStore';
import { colors } from '../src/theme/colors';

export default function Index() {
  const { isLoading, isAuthenticated, hasCompletedOnboarding, hasCompletedSetup } = useAuthStore();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Flujo de navegación
  if (!hasCompletedOnboarding) {
    return <Redirect href="/(onboarding)" />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!hasCompletedSetup) {
    return <Redirect href="/(setup)/goals" />;
  }

  return <Redirect href="/(tabs)" />;
}
