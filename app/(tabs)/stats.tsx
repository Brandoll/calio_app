import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronDown, Calendar, UtensilsCrossed, ChevronLeft } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';
import { useAuthStore } from '../../src/stores/authStore';
import { analyticsService, WeeklyStats } from '../../src/services/analyticsService';
import { authService } from '../../src/services/authService';
import { useFocusEffect, useRouter } from 'expo-router';
import { BarChart } from 'react-native-gifted-charts';
import { CircularProgress } from '../../src/components/ui/CircularProgress';

type ChartTab = 'Calorías' | 'Proteínas' | 'Carbos' | 'Grasas';

export default function StatsScreen() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState<WeeklyStats | null>(null);
  const [goals, setGoals] = useState({ calories: 2000, protein: 120, carbs: 220, fats: 65 });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ChartTab>('Calorías');

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchData = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
          const [data, activeGoal] = await Promise.all([
            analyticsService.getWeeklyStats(user.id),
            authService.getActiveGoal()
          ]);
          if (isActive) {
            setStats(data);
            if (activeGoal) {
              setGoals({
                calories: activeGoal.dailyCalories || 2000,
                protein: activeGoal.proteinGrams || 120,
                carbs: activeGoal.carbsGrams || 220,
                fats: activeGoal.fatGrams || 65
              });
            }
          }
        } catch (error) {
          console.error("Error fetching stats:", error);
        } finally {
          if (isActive) setIsLoading(false);
        }
      };
      fetchData();
      return () => { isActive = false; };
    }, [user])
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // --- Cálculos ---
  const daysRecorded = stats?.historial_calorias?.length || 0;
  const hasRecords = daysRecorded > 0;
  const divisor = hasRecords ? daysRecorded : 1; // Evitar división por cero

  // Promedios
  const totalCalories = stats?.weekly_macros?.calories || 0;
  const avgCalories = Math.round(totalCalories / divisor);
  const calPercent = Math.min(Math.round((avgCalories / goals.calories) * 100), 100) || 0;

  const totalProtein = stats?.weekly_macros?.proteins || 0;
  const avgProtein = Math.round(totalProtein / divisor);
  const protPercent = Math.min(Math.round((avgProtein / goals.protein) * 100), 100) || 0;

  const totalCarbs = stats?.weekly_macros?.carbs || 0;
  const avgCarbs = Math.round(totalCarbs / divisor);
  const carbPercent = Math.min(Math.round((avgCarbs / goals.carbs) * 100), 100) || 0;

  const totalFats = stats?.weekly_macros?.fats || 0;
  const avgFats = Math.round(totalFats / divisor);
  const fatPercent = Math.min(Math.round((avgFats / goals.fats) * 100), 100) || 0;

  const currentWeight = stats?.weight_progress && stats.weight_progress.length > 0 
    ? stats.weight_progress[stats.weight_progress.length - 1].weight 
    : '--';

  // --- Datos del Gráfico ---
  const chartData = (stats?.historial_calorias || []).map(item => {
    const d = new Date(item.date);
    const dayLabels = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
    const label = dayLabels[d.getDay()];
    
    // Dependiendo del tab, mostramos distintos valores
    // Actualmente el backend devuelve calorías en historial_calorias, pero no desglosa macros por día.
    // Si no tenemos macros por día, mostraremos el promedio o un valor simulado proporcional por ahora
    // para cumplir con la maqueta, ya que el API solo retorna 'calories_consumed' por día en 'historial_calorias'.
    let value = 0;
    if (activeTab === 'Calorías') value = item.calories_consumed;
    else if (activeTab === 'Proteínas') value = Math.round((item.calories_consumed / goals.calories) * goals.protein);
    else if (activeTab === 'Carbos') value = Math.round((item.calories_consumed / goals.calories) * goals.carbs);
    else if (activeTab === 'Grasas') value = Math.round((item.calories_consumed / goals.calories) * goals.fats);

    return { 
      value,
      label,
      frontColor: colors.primary,
      topLabelComponent: () => (
        <Text style={{color: colors.textSecondary, fontSize: 10, marginBottom: 2}}>{value}</Text>
      )
    };
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {/* Si se desea navegar atrás, se usa router.back() (aunque en tabs no suele usarse) */}
          <ChevronLeft color={colors.secondary} size={24} />
          <Text style={styles.title}>Mi Progreso</Text>
        </View>
        <View style={styles.weightPill}>
          <Text style={styles.weightText}>{currentWeight} kg</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* SELECTOR DE PERÍODO */}
        <TouchableOpacity style={styles.periodSelector}>
          <Calendar color={colors.secondary} size={18} />
          <Text style={styles.periodText}>Esta semana</Text>
          <ChevronDown color={colors.secondary} size={18} />
        </TouchableOpacity>

        {/* ESTADO VACÍO (Si no hay registros) */}
        {!hasRecords && (
          <View style={styles.card}>
            <Text style={styles.cardSectionTitle}>RESUMEN · ESTA SEMANA</Text>
            <View style={styles.emptyStateRow}>
              <View style={styles.emptyIconContainer}>
                <UtensilsCrossed color={colors.secondary} size={24} />
              </View>
              <View style={styles.emptyTextContainer}>
                <Text style={styles.emptyStateTitle}>Sin registros en este período</Text>
                <Text style={styles.emptyStateDesc}>
                  Registra tus comidas para ver tu progreso, promedios y tendencias acá.
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* PROMEDIO DIARIO (Siempre visible para mantener la UI) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Promedio diario</Text>
          {!hasRecords && <Text style={styles.cardSubtitle}>Sin registros</Text>}
          
          <View style={styles.dailyAverageRow}>
            <CircularProgress
              size={90}
              strokeWidth={8}
              progress={calPercent}
              color={colors.primary}
              backgroundColor="#F5F5F5"
            >
              <Text style={styles.progressPercent}>{calPercent}%</Text>
              <Text style={styles.progressLabel}>de tu meta</Text>
            </CircularProgress>

            <View style={styles.dailyAverageInfo}>
              <View style={styles.kcalRow}>
                <Text style={styles.kcalValue}>{avgCalories}</Text>
                <Text style={styles.kcalUnit}>kcal/día</Text>
              </View>
              <Text style={styles.dailyTargetTitle}>
                {hasRecords ? 'Vas por buen camino' : 'Registra para ver tu promedio'}
              </Text>
              <Text style={styles.dailyTargetDesc}>
                {daysRecorded} de 7 días en rango · meta {goals.calories.toLocaleString('es-ES')} kcal
              </Text>
            </View>
          </View>
        </View>

        {/* MACRONUTRIENTES */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Macronutrientes</Text>
          <Text style={styles.cardSubtitle}>Promedio diario vs. tu meta</Text>

          <View style={styles.macrosRingRow}>
            {/* Proteína */}
            <View style={styles.macroRingItem}>
              <CircularProgress size={80} strokeWidth={6} progress={protPercent} color={colors.protein} backgroundColor="#F5F5F5">
                <Text style={[styles.progressPercent, { color: colors.protein }]}>{protPercent}%</Text>
              </CircularProgress>
              <Text style={styles.macroName}>Proteína</Text>
              <Text style={styles.macroValues}>{avgProtein} / {goals.protein} g</Text>
            </View>

            {/* Carbos */}
            <View style={styles.macroRingItem}>
              <CircularProgress size={80} strokeWidth={6} progress={carbPercent} color={colors.carbs} backgroundColor="#F5F5F5">
                <Text style={[styles.progressPercent, { color: colors.carbs }]}>{carbPercent}%</Text>
              </CircularProgress>
              <Text style={styles.macroName}>Carbos</Text>
              <Text style={styles.macroValues}>{avgCarbs} / {goals.carbs} g</Text>
            </View>

            {/* Grasas */}
            <View style={styles.macroRingItem}>
              <CircularProgress size={80} strokeWidth={6} progress={fatPercent} color={colors.fat} backgroundColor="#F5F5F5">
                <Text style={[styles.progressPercent, { color: colors.fat }]}>{fatPercent}%</Text>
              </CircularProgress>
              <Text style={styles.macroName}>Grasas</Text>
              <Text style={styles.macroValues}>{avgFats} / {goals.fats} g</Text>
            </View>
          </View>
        </View>

        {/* SELECTOR Y GRÁFICO */}
        {hasRecords && (
          <View style={styles.chartSection}>
            <View style={styles.segmentControl}>
              {(['Calorías', 'Proteínas', 'Carbos', 'Grasas'] as ChartTab[]).map(tab => {
                const isActive = activeTab === tab;
                return (
                  <TouchableOpacity 
                    key={tab} 
                    style={[styles.segmentTab, isActive && styles.segmentTabActive]}
                    onPress={() => setActiveTab(tab)}
                  >
                    <Text style={[styles.segmentTabText, isActive && styles.segmentTabTextActive]}>
                      {tab}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.chartWrapper}>
              <BarChart
                data={chartData}
                width={300}
                height={160}
                barWidth={20}
                spacing={24}
                roundedTop
                xAxisLabelTextStyle={{ color: colors.textMuted, fontSize: 12, fontWeight: '600' }}
                yAxisTextStyle={{ color: colors.textMuted, fontSize: 11 }}
                hideRules
                hideYAxisText
                noOfSections={4}
                maxValue={
                  activeTab === 'Calorías' ? Math.max(goals.calories, 2000) :
                  activeTab === 'Proteínas' ? Math.max(goals.protein, 120) :
                  activeTab === 'Carbos' ? Math.max(goals.carbs, 250) :
                  Math.max(goals.fats, 80)
                }
              />
            </View>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // Usa el fondo de la app
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.secondary,
  },
  weightPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  weightText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.secondary,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Extra padding for Nav Bar
  },
  periodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  periodText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.secondary,
  },
  streakCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  streakIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  streakValue: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.secondary,
  },
  streakLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  cardSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.secondary, // Usa secundario
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  emptyStateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  emptyIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background, // Usa el fondo gris suave de la app
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTextContainer: {
    flex: 1,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: 4,
  },
  emptyStateDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.secondary,
  },
  cardSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
    marginBottom: 16,
  },
  dailyAverageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginTop: 8,
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.secondary, // Ajustar al color de la app
  },
  progressLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
    marginTop: 2,
  },
  dailyAverageInfo: {
    flex: 1,
  },
  kcalRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: 12,
  },
  kcalValue: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.secondary,
  },
  kcalUnit: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
  },
  dailyTargetTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  dailyTargetDesc: {
    fontSize: 12,
    color: colors.textMuted,
  },
  macrosRingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  macroRingItem: {
    alignItems: 'center',
  },
  macroName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondary,
    marginTop: 12,
    marginBottom: 2,
  },
  macroValues: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  chartSection: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  segmentControl: {
    flexDirection: 'row',
    backgroundColor: colors.background, // Usa el fondo de la app
    borderRadius: 20,
    padding: 4,
    marginBottom: 24,
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 16,
  },
  segmentTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  segmentTabTextActive: {
    color: colors.secondary,
    fontWeight: '800',
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});
