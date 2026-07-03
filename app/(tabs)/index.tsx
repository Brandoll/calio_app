import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, UserCircle } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';
import { useAuthStore } from '../../src/stores/authStore';
import { authService } from '../../src/services/authService';
import { trackingService } from '../../src/services/trackingService';

// Componentes
import { CaloriesCard } from '../../src/components/dashboard/CaloriesCard';
import { MacronutrientsBar } from '../../src/components/dashboard/MacronutrientsBar';
import { QuickActions } from '../../src/components/dashboard/QuickActions';
import { RecentMeals } from '../../src/components/dashboard/RecentMeals';
import { HydrationBanner } from '../../src/components/dashboard/HydrationBanner';
import { DailyGoalCard } from '../../src/components/dashboard/DailyGoalCard';

export default function HomeScreen() {
  const { user } = useAuthStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [dailyData, setDailyData] = useState({
    calories: { consumed: 0, goal: 2000 },
    macros: {
      protein: { current: 0, total: 120 },
      carbs: { current: 0, total: 220 },
      fat: { current: 0, total: 65 },
    },
    water: 0,
    comidas: [] // Agregado para almacenar las comidas
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) return;
        
        // 1. Obtener la meta activa del usuario para sacar los totales (calorias y macros)
        const activeGoal = await authService.getActiveGoal();
        
        // 2. Obtener el tracking de hoy (calorias y macros consumidos)
        const today = new Date().toISOString().split('T')[0];
        const summary = await trackingService.getDailySummary(user.id, today);

        setDailyData({
          calories: { 
            consumed: summary.caloriasConsumidas || 0, 
            goal: activeGoal?.dailyCalories || 2000 
          },
          macros: {
            protein: { current: summary.proteinas || 0, total: activeGoal?.proteinGrams || 120 },
            carbs: { current: summary.carbohidratos || 0, total: activeGoal?.carbsGrams || 220 },
            fat: { current: summary.grasas || 0, total: activeGoal?.fatGrams || 65 },
          },
          water: summary.vasosAgua || 0,
          comidas: summary.comidas || [] // Guardamos las comidas reales de la DB
        });
      } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }


  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Text style={styles.greeting}>¡Hola, {user?.firstName?.split(' ')[0] || 'Usuario'}! 👋</Text>
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
          progress={dailyData.calories.goal > 0 ? Math.round((dailyData.calories.consumed / dailyData.calories.goal) * 100) : 0} 
        />

        {/* Acciones Rápidas */}
        <QuickActions />

        {/* Banner de Hidratación */}
        <HydrationBanner 
          currentGlasses={dailyData.water} 
          goalGlasses={8} 
          onAddGlass={() => console.log('Añadir vaso')} 
        />

        {/* Comidas Recientes */}
        <RecentMeals meals={dailyData.comidas as any[]} />

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
