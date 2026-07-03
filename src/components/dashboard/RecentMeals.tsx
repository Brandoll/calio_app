import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '../../theme/colors';

export const RecentMeals = () => {
  // Datos de prueba, luego vendrán del TrackingService
  const meals = [
    { id: '1', name: 'Avena con frutas', calories: 320, time: '08:30', type: 'Desayuno' },
    { id: '2', name: 'Ensalada de pollo', calories: 450, time: '13:45', type: 'Almuerzo' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Comidas de hoy</Text>
        <Text style={styles.seeAll}>Ver todo</Text>
      </View>
      
      {meals.length > 0 ? (
        meals.map((meal) => (
          <View key={meal.id} style={styles.mealCard}>
            <View style={styles.mealIconPlaceholder}>
              <Text style={styles.mealIconText}>{meal.name.charAt(0)}</Text>
            </View>
            <View style={styles.mealInfo}>
              <Text style={styles.mealName}>{meal.name}</Text>
              <Text style={styles.mealTime}>{meal.type} • {meal.time}</Text>
            </View>
            <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Aún no has registrado comidas hoy</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.secondary,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  mealCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  mealIconPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  mealIconText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.secondary,
    marginBottom: 4,
  },
  mealTime: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  mealCalories: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.secondary,
  },
  emptyState: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});
