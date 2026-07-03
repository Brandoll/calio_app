import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Plus } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { Food } from '../../types/food';

interface FoodCardProps {
  food: Food;
  onPress: () => void;
  onAdd: () => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({ food, onPress, onAdd }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imagePlaceholder}>
        {food.imagen ? (
          <Image source={{ uri: food.imagen }} style={styles.image} />
        ) : (
          <Text style={styles.placeholderText}>{food.nombre.charAt(0)}</Text>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{food.nombre}</Text>
        <Text style={styles.category}>{food.categoria}</Text>
        <View style={styles.macros}>
          <Text style={styles.calories}>{food.calorias} kcal</Text>
          <Text style={styles.macroText}>P:{food.proteinas} C:{food.carbohidratos} G:{food.grasas}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={onAdd}>
        <Plus color={colors.secondary} size={20} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  imagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textMuted,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: 2,
  },
  category: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  macros: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  calories: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  macroText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
});
