import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { MealRecord } from '../../types/tracking';

interface RecentMealsProps {
  meals: MealRecord[];
}

export const RecentMeals = ({ meals = [] }: RecentMealsProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Comidas de hoy</Text>
        <Text style={styles.seeAll}>Ver todo</Text>
      </View>
      
      {meals.length > 0 ? (
        meals.map((meal, index) => (
          <View key={index.toString()} style={styles.mealCard}>
            <View style={styles.mealIconPlaceholder}>
              <Text style={styles.mealIconText}>{meal.nombre ? meal.nombre.charAt(0).toUpperCase() : '?'}</Text>
            </View>
            <View style={styles.mealInfo}>
              <Text style={styles.mealName}>{meal.nombre}</Text>
              <Text style={styles.mealTime}>
                {meal.tipoComida} • {meal.hora ? meal.hora.substring(0,5) : ''}
              </Text>
            </View>
            <Text style={styles.mealCalories}>{meal.calorias} kcal</Text>
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
    textTransform: 'capitalize',
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
