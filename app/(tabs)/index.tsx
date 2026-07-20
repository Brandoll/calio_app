import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, UserCircle, Flame } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';
import { useAuthStore } from '../../src/stores/authStore';
import { authService } from '../../src/services/authService';
import { BlurView } from 'expo-blur';
import { trackingService } from '../../src/services/trackingService';

// Componentes
import { CaloriesCard } from '../../src/components/dashboard/CaloriesCard';
import { MacroCardsRow } from '../../src/components/dashboard/MacroCardsRow';
import { MacroInfoModal, MacroInfoData } from '../../src/components/dashboard/MacroInfoModal';
import { QuickActions } from '../../src/components/dashboard/QuickActions';
import { RecentMeals } from '../../src/components/dashboard/RecentMeals';
import { HydrationBanner } from '../../src/components/dashboard/HydrationBanner';
import { DailyGoalCard } from '../../src/components/dashboard/DailyGoalCard';
import { WaterModal } from '../../src/components/dashboard/WaterModal';

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
  const [isWaterModalVisible, setIsWaterModalVisible] = useState(false);
  const [isAddingWater, setIsAddingWater] = useState(false);
  
  // Estado para el modal de información de macros
  const [macroInfoData, setMacroInfoData] = useState<MacroInfoData | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchData = async () => {
        try {
          if (!user) return;
          
          // 1. Obtener la meta activa del usuario para sacar los totales (calorias y macros)
          const activeGoal = await authService.getActiveGoal();
          
          // 2. Obtener el tracking de hoy (calorias y macros consumidos)
          // Usamos la fecha local en lugar de UTC para evitar el desfase de zona horaria
          const d = new Date();
          d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
          const today = d.toISOString().split('T')[0];

          const summary = await trackingService.getDailySummary(user.id, today);

          if (isActive) {
            setDailyData({
              calories: { 
                consumed: summary.totalCalorias || 0, 
                goal: activeGoal?.dailyCalories || 2000 
              },
              macros: {
                protein: { current: summary.totalProteinas || 0, total: activeGoal?.proteinGrams || 120 },
                carbs: { current: summary.totalCarbohidratos || 0, total: activeGoal?.carbsGrams || 220 },
                fat: { current: summary.totalGrasas || 0, total: activeGoal?.fatGrams || 65 },
              },
              water: summary.aguaVasos || 0,
              comidas: summary.comidas || [] // Guardamos las comidas reales de la DB
            });
          }
        } catch (error) {
          console.error('Error cargando datos del dashboard:', error);
        } finally {
          if (isActive) setIsLoading(false);
        }
      };

      fetchData();
      return () => { isActive = false; };
    }, [user])
  );

  const handleDeleteMeal = async (mealId: number) => {
    try {
      await trackingService.deleteMeal(mealId);
      // Actualizar el estado local para reflejar el cambio inmediatamente
      setDailyData(prev => {
        const deletedMeal = prev.comidas.find((m: any) => m.id === mealId) as any;
        if (!deletedMeal) return prev;

        const newComidas = prev.comidas.filter((m: any) => m.id !== mealId);
        
        return {
          ...prev,
          calories: {
            ...prev.calories,
            consumed: Math.max(0, prev.calories.consumed - deletedMeal.calorias)
          },
          macros: {
            protein: { ...prev.macros.protein, current: Math.max(0, prev.macros.protein.current - deletedMeal.proteinas) },
            carbs: { ...prev.macros.carbs, current: Math.max(0, prev.macros.carbs.current - deletedMeal.carbohidratos) },
            fat: { ...prev.macros.fat, current: Math.max(0, prev.macros.fat.current - deletedMeal.grasas) }
          },
          comidas: newComidas
        };
      });
    } catch (error) {
      console.error('Error eliminando comida:', error);
    }
  };

  const handleChangeWater = async (amount: number) => {
    if (!user || isAddingWater || (amount < 0 && dailyData.water + amount < 0)) return;
    
    try {
      setIsAddingWater(true);
      
      const d = new Date();
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      const today = d.toISOString().split('T')[0];

      await trackingService.registerWater({
        userId: user.id,
        vasos: amount,
        fecha: today
      });

      setDailyData(prev => ({
        ...prev,
        water: Math.max(0, prev.water + amount)
      }));
    } catch (error) {
      console.error('Error modificando agua:', error);
    } finally {
      setIsAddingWater(false);
    }
  };

  const openMacroInfo = (title: string, data: { current: number; total: number }, color: string, Icon: any, description: string) => {
    setMacroInfoData({
      title,
      current: data.current,
      total: data.total,
      color,
      Icon,
      description
    });
  };

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
        <CaloriesCard 
          consumed={dailyData.calories.consumed} 
          goal={dailyData.calories.goal} 
          onPress={() => openMacroInfo(
            'Calorías', 
            { current: dailyData.calories.consumed, total: dailyData.calories.goal }, 
            '#FF8A00', 
            Flame, 
            'Las calorías son la energía que obtienes de los alimentos. Piensa en ellas como el combustible para tu cuerpo. Necesitas un equilibrio: consumir suficientes para tus actividades, pero no tantas como para que tu cuerpo las almacene.'
          )}
        />

        {/* Macronutrientes (Tarjetas) */}
        <MacroCardsRow 
          protein={dailyData.macros.protein}
          carbs={dailyData.macros.carbs}
          fat={dailyData.macros.fat}
          onCardPress={openMacroInfo}
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
          goalGlasses={10} 
          onAddGlass={() => handleChangeWater(1)} 
          onPress={() => setIsWaterModalVisible(true)}
        />

        {/* Comidas Recientes */}
        <RecentMeals meals={dailyData.comidas as any[]} onDelete={handleDeleteMeal} />

      </ScrollView>

      {/* Modal Interactivo de Agua */}
      <WaterModal 
        visible={isWaterModalVisible}
        onClose={() => setIsWaterModalVisible(false)}
        currentGlasses={dailyData.water}
        goalGlasses={10}
        onChangeWater={handleChangeWater}
        isAdding={isAddingWater}
      />

      {/* Modal de Información de Macros/Calorías */}
      <MacroInfoModal 
        visible={!!macroInfoData} 
        onClose={() => setMacroInfoData(null)} 
        data={macroInfoData} 
      />

      {/* Efecto borroso inferior (bajo la barra de navegación) */}
      <BlurView 
        intensity={100} 
        tint="light" 
        style={styles.bottomBlur} 
        pointerEvents="none"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bottomBlur: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 105 : 95,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Añade más opacidad al blur
  },
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
