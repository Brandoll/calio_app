import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Heart, Flame } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { Food } from '../../types/food';

interface FoodCardProps {
  food: Food;
  onPress: () => void;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
}

export const FoodCard: React.FC<FoodCardProps> = ({ food, onPress, onFavoritePress, isFavorite = false }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        {food.imagen ? (
          <Image source={{ uri: food.imagen }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>{food.nombre.charAt(0)}</Text>
          </View>
        )}
        
        {/* Calorie Badge */}
        <View style={styles.calorieBadge}>
          <Flame color="#FF8A00" size={14} fill="#FF8A00" />
          <Text style={styles.calorieText}>{Math.round(food.calorias)}</Text>
        </View>
        
        {/* Favorite Button */}
        <TouchableOpacity 
          style={styles.favoriteButton} 
          onPress={(e) => {
            e.stopPropagation();
            if (onFavoritePress) onFavoritePress();
          }}
          activeOpacity={0.7}
        >
          <Heart 
            color={isFavorite ? "#FF4B4B" : colors.textMuted} 
            size={18} 
            fill={isFavorite ? "#FF4B4B" : "transparent"} 
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={2}>{food.nombre}</Text>
        
        <View style={styles.macrosContainer}>
          <View style={styles.macroColumn}>
            <Text style={[styles.macroValue, { color: '#FF4B4B' }]}>{Math.round(food.proteinas)}g</Text>
            <Text style={styles.macroLabel}>Prot</Text>
          </View>
          <View style={styles.macroColumn}>
            <Text style={[styles.macroValue, { color: '#FFB800' }]}>{Math.round(food.carbohidratos)}g</Text>
            <Text style={styles.macroLabel}>Carbs</Text>
          </View>
          <View style={styles.macroColumn}>
            <Text style={[styles.macroValue, { color: '#0080FF' }]}>{Math.round(food.grasas)}g</Text>
            <Text style={styles.macroLabel}>Grasa</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 20,
    margin: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 140,
    position: 'relative',
    backgroundColor: '#F0F0F0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EAEAEA',
  },
  placeholderText: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.textMuted,
  },
  calorieBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  calorieText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoContainer: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: 12,
    height: 38, // Para mantener alinedas las tarjetas si el texto tiene 1 o 2 lineas
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  macroColumn: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 2,
  },
  macroLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '500',
  }
});
