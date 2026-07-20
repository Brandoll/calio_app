import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { MealRecord } from '../../types/tracking';
import { API_BASE_URL } from '../../constants/api';

interface RecentMealsProps {
  meals: MealRecord[];
  onDelete?: (id: number) => void;
}

export const RecentMeals = ({ meals = [], onDelete }: RecentMealsProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Comidas de hoy</Text>
        <Text style={styles.seeAll}>Ver todo</Text>
      </View>
      
      {meals.length > 0 ? (
        meals.map((meal, index) => (
          <View key={meal.id ? meal.id.toString() : index.toString()} style={styles.mealCard}>
            {meal.imageUrl ? (
              <Image 
                source={{ uri: meal.imageUrl.startsWith('file://') ? meal.imageUrl : `${API_BASE_URL}${meal.imageUrl}` }} 
                style={styles.mealImage} 
              />
            ) : (
              <View style={styles.mealIconPlaceholder}>
                <Text style={styles.mealIconText}>{meal.nombre ? meal.nombre.charAt(0).toUpperCase() : '?'}</Text>
              </View>
            )}
            
            <View style={styles.mealInfo}>
              <Text style={styles.mealName}>{meal.nombre}</Text>
              <Text style={styles.mealTime}>
                {meal.tipoComida} • {meal.hora ? meal.hora.substring(0,5) : ''}
              </Text>
            </View>
            
            <View style={styles.rightActions}>
              <Text style={styles.mealCalories}>{meal.calorias} kcal</Text>
              {(meal.id && onDelete) ? (
                <TouchableOpacity onPress={() => onDelete(meal.id!)} style={styles.deleteButton}>
                  <Trash2 color={colors.danger || '#FF3B30'} size={20} />
                </TouchableOpacity>
              ) : null}
            </View>
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
  mealImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
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
  rightActions: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 8,
  },
  deleteButton: {
    padding: 4,
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
