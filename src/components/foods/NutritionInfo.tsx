import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface NutritionInfoProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  glycemicIndex?: number;
}

export const NutritionInfo: React.FC<NutritionInfoProps> = ({ 
  calories, protein, carbs, fat, fiber, glycemicIndex 
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Información Nutricional</Text>
      
      <View style={styles.grid}>
        <View style={styles.item}>
          <Text style={styles.value}>{calories}</Text>
          <Text style={styles.label}>Calorías</Text>
        </View>
        <View style={styles.item}>
          <Text style={[styles.value, { color: colors.protein }]}>{protein}g</Text>
          <Text style={styles.label}>Proteínas</Text>
        </View>
        <View style={styles.item}>
          <Text style={[styles.value, { color: colors.carbs }]}>{carbs}g</Text>
          <Text style={styles.label}>Carbs</Text>
        </View>
        <View style={styles.item}>
          <Text style={[styles.value, { color: colors.fat }]}>{fat}g</Text>
          <Text style={styles.label}>Grasas</Text>
        </View>
        
        {fiber !== undefined && (
          <View style={styles.item}>
            <Text style={styles.value}>{fiber}g</Text>
            <Text style={styles.label}>Fibra</Text>
          </View>
        )}
        {glycemicIndex !== undefined && (
          <View style={styles.item}>
            <Text style={styles.value}>{glycemicIndex}</Text>
            <Text style={styles.label}>Índice Glucémico</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  item: {
    width: '30%',
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  value: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.secondary,
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
