import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, UserCircle } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';
import { useAuthStore } from '../../src/stores/authStore';

// Componentes
import { CaloriesCard } from '../../src/components/dashboard/CaloriesCard';
import { MacronutrientsBar } from '../../src/components/dashboard/MacronutrientsBar';
import { QuickActions } from '../../src/components/dashboard/QuickActions';
import { RecentMeals } from '../../src/components/dashboard/RecentMeals';
import { HydrationBanner } from '../../src/components/dashboard/HydrationBanner';
import { DailyGoalCard } from '../../src/components/dashboard/DailyGoalCard';

export default function HomeScreen() {
  const { user } = useAuthStore();

  // Datos mockeados por ahora, en la siguiente fase se conectarán con trackingService
  const dailyData = {
    calories: { consumed: 1350, goal: 2000 },
    macros: {
      protein: { current: 65, total: 120 },
      carbs: { current: 150, total: 220 },
      fat: { current: 40, total: 65 },
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Text style={styles.greeting}>¡Hola, {user?.nombre?.split(' ')[0] || 'Usuario'}! 👋</Text>
            <Text style={styles.subtitle}>Listo para lograr tus metas</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton}>
              <Bell color={colors.secondary} size={24} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileButton}>
              <UserCircle color={colors.secondary} size={32} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Resumen de Calorías */}
        <CaloriesCard consumed={dailyData.calories.consumed} goal={dailyData.calories.goal} />

        {/* Macronutrientes */}
        <MacronutrientsBar 
          protein={dailyData.macros.protein}
          carbs={dailyData.macros.carbs}
          fat={dailyData.macros.fat}
        />

        {/* Meta Diaria */}
        <DailyGoalCard 
          title="Meta Diaria" 
          subtitle="Completada" 
          progress={65} 
        />

        {/* Acciones Rápidas */}
        <QuickActions />

        {/* Banner de Hidratación */}
        <HydrationBanner 
          currentGlasses={4} 
          goalGlasses={8} 
          onAddGlass={() => console.log('Añadir vaso')} 
        />

        {/* Comidas Recientes */}
        <RecentMeals />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.secondary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
