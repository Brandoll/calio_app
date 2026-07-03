import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart, BarChart } from 'react-native-gifted-charts';
import { Flame, Activity, TrendingDown } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';
import { analyticsService } from '../../src/services/analyticsService';
import { useAuthStore } from '../../src/stores/authStore';

export default function StatsScreen() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'calories' | 'weight'>('calories');

  // Mock data para las gráficas
  const caloriesData = [
    { value: 1800, label: 'L' },
    { value: 2100, label: 'M' },
    { value: 1950, label: 'X' },
    { value: 2000, label: 'J' },
    { value: 1850, label: 'V' },
    { value: 2300, label: 'S', frontColor: colors.error },
    { value: 1350, label: 'D' }, // Hoy
  ];

  const weightData = [
    { value: 72.5, label: 'Ene' },
    { value: 71.8, label: 'Feb' },
    { value: 70.2, label: 'Mar' },
    { value: 69.5, label: 'Abr' },
    { value: 68.8, label: 'May' },
    { value: 68.0, label: 'Jun' },
  ];

  useEffect(() => {
    // Aquí cargaríamos datos reales usando analyticsService
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Estadísticas</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* KPI Cards */}
        <View style={styles.kpiContainer}>
          <View style={styles.kpiCard}>
            <View style={[styles.kpiIcon, { backgroundColor: 'rgba(216, 255, 46, 0.2)' }]}>
              <Flame color={colors.primaryDark} size={24} />
            </View>
            <Text style={styles.kpiValue}>12</Text>
            <Text style={styles.kpiLabel}>Días en racha</Text>
          </View>
          <View style={styles.kpiCard}>
            <View style={[styles.kpiIcon, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
              <TrendingDown color={colors.success} size={24} />
            </View>
            <Text style={styles.kpiValue}>-4.5 kg</Text>
            <Text style={styles.kpiLabel}>Perdidos total</Text>
          </View>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabSelector}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'calories' && styles.tabActive]}
            onPress={() => setActiveTab('calories')}
          >
            <Text style={[styles.tabText, activeTab === 'calories' && styles.tabTextActive]}>
              Calorías
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'weight' && styles.tabActive]}
            onPress={() => setActiveTab('weight')}
          >
            <Text style={[styles.tabText, activeTab === 'weight' && styles.tabTextActive]}>
              Peso
            </Text>
          </TouchableOpacity>
        </View>

        {/* Chart Container */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>
            {activeTab === 'calories' ? 'Calorías esta semana' : 'Progreso de peso'}
          </Text>
          
          {activeTab === 'calories' ? (
            <BarChart
              data={caloriesData}
              barWidth={22}
              noOfSections={4}
              barBorderRadius={4}
              frontColor={colors.primary}
              yAxisThickness={0}
              xAxisThickness={1}
              xAxisColor={colors.border}
              hideRules
              yAxisTextStyle={{ color: colors.textMuted, fontSize: 11 }}
              xAxisLabelTextStyle={{ color: colors.textSecondary, fontSize: 12 }}
              height={200}
            />
          ) : (
            <LineChart
              data={weightData}
              color={colors.secondary}
              thickness={3}
              dataPointsColor={colors.primary}
              dataPointsRadius={6}
              yAxisThickness={0}
              xAxisThickness={1}
              xAxisColor={colors.border}
              hideRules
              yAxisTextStyle={{ color: colors.textMuted, fontSize: 11 }}
              xAxisLabelTextStyle={{ color: colors.textSecondary, fontSize: 12 }}
              height={200}
              curved
            />
          )}
        </View>

        {/* Report Button */}
        <TouchableOpacity style={styles.reportButton}>
          <Activity color={colors.white} size={20} style={{ marginRight: 8 }} />
          <Text style={styles.reportButtonText}>Generar Reporte PDF</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  header: { paddingHorizontal: 20, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '800', color: colors.secondary },
  content: { padding: 20 },
  kpiContainer: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  kpiCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  kpiIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  kpiValue: { fontSize: 24, fontWeight: '800', color: colors.secondary, marginBottom: 4 },
  kpiLabel: { fontSize: 13, color: colors.textSecondary },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  tabActive: { backgroundColor: colors.secondary },
  tabText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  tabTextActive: { color: colors.white },
  chartContainer: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center', // Para centrar el gráfico
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  reportButton: {
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  reportButtonText: { fontSize: 16, fontWeight: '700', color: colors.white },
});
