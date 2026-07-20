import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Heart, Apple, Carrot, Beef, Milk, Fish, Wheat, Salad, Flame } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { Food } from '../../types/food';

interface FoodCardProps {
  food: Food;
  onPress: () => void;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
}

const getCategoryIcon = (category: string) => {
  const cat = category?.toLowerCase() || '';
  if (cat.includes('fruta')) return <Apple color="#FF4B4B" size={28} />;
  if (cat.includes('verdura') || cat.includes('vegetal')) return <Carrot color="#FF8A00" size={28} />;
  if (cat.includes('carne') || cat.includes('ave') || cat.includes('pollo')) return <Beef color="#795548" size={28} />;
  if (cat.includes('lácteo') || cat.includes('leche') || cat.includes('queso')) return <Milk color="#0080FF" size={28} />;
  if (cat.includes('pescado') || cat.includes('marisco')) return <Fish color="#00BCD4" size={28} />;
  if (cat.includes('cereal') || cat.includes('grano') || cat.includes('arroz')) return <Wheat color="#FFB800" size={28} />;
  return <Salad color={colors.primaryDark} size={28} />;
};

export const FoodCard: React.FC<FoodCardProps> = ({ food, onPress, onFavoritePress, isFavorite = false }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.iconContainer}>
        {getCategoryIcon(food.categoria)}
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name} numberOfLines={1}>{food.nombre}</Text>
            <Text style={styles.category}>{food.categoria} • {food.porcionRef || '100g'}</Text>
          </View>
          <TouchableOpacity 
            style={styles.favoriteButton} 
            onPress={(e) => {
              e.stopPropagation();
              if (onFavoritePress) onFavoritePress();
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Heart 
              color={isFavorite ? "#FF4B4B" : colors.border} 
              size={22} 
              fill={isFavorite ? "#FF4B4B" : "transparent"} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.macrosContainer}>
          <View style={styles.caloriePill}>
            <Flame color="#FF8A00" size={12} fill="#FF8A00" />
            <Text style={styles.calorieText}>{Math.round(food.energiaKcal || 0)} kcal</Text>
          </View>
          
          <View style={styles.macroItem}>
            <Text style={[styles.macroValue, { color: '#FF4B4B' }]}>{Math.round(food.proteinasG || 0)}g</Text>
            <Text style={styles.macroLabel}> P</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={[styles.macroValue, { color: '#FFB800' }]}>{Math.round(food.carbohidratosTotalesG || 0)}g</Text>
            <Text style={styles.macroLabel}> C</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={[styles.macroValue, { color: '#0080FF' }]}>{Math.round(food.grasaTotalG || 0)}g</Text>
            <Text style={styles.macroLabel}> G</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 16,
    marginBottom: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  infoContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: 2,
  },
  category: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  favoriteButton: {
    paddingLeft: 8,
  },
  macrosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  caloriePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 12,
    gap: 4,
  },
  calorieText: {
    color: '#FF8A00',
    fontSize: 12,
    fontWeight: '700',
  },
  macroItem: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginRight: 10,
  },
  macroValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  macroLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  }
});
