import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Trash2, Flame, UserCircle } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { MealRecord } from '../../types/tracking';
import { API_BASE_URL } from '../../constants/api';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48 - 16) / 2; // 48 = padding horizontal (24*2), 16 = gap

interface RecentMealsProps {
  meals: MealRecord[];
  onDelete?: (id: number) => void;
}

export const RecentMeals = ({ meals = [], onDelete }: RecentMealsProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Comidas del día</Text>
        <Text style={styles.seeAll}>Ver todo</Text>
      </View>
      
      {meals.length > 0 ? (
        <View style={styles.gridContainer}>
          {meals.map((meal, index) => (
            <View key={meal.id ? meal.id.toString() : index.toString()} style={styles.card}>
              
              {/* Imagen y Badges superpuestos */}
              <View style={styles.imageContainer}>
                {meal.imageUrl ? (
                  <Image 
                    source={{ uri: meal.imageUrl.startsWith('file://') ? meal.imageUrl : `${API_BASE_URL}${meal.imageUrl}` }} 
                    style={styles.image} 
                  />
                ) : (
                  <View style={[styles.image, styles.placeholderImage]}>
                    <Text style={styles.placeholderText}>{meal.nombre ? meal.nombre.charAt(0).toUpperCase() : '?'}</Text>
                  </View>
                )}
                
                <View style={styles.overlayTop}>
                  <View style={styles.badgeCal}>
                    <Flame color="#FF8A00" size={14} fill="#FF8A00" />
                    <Text style={styles.badgeCalText}>{Math.round(meal.calorias)}</Text>
                  </View>
                  
                  {(meal.id && onDelete) ? (
                    <TouchableOpacity onPress={() => onDelete(meal.id!)} style={styles.badgeDelete}>
                      <Trash2 color={colors.white} size={16} />
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>

              {/* Información de la comida */}
              <View style={styles.infoContainer}>
                <Text style={styles.title} numberOfLines={2}>
                  {meal.nombre}
                </Text>
                
                {/* Macros */}
                <View style={styles.macrosRow}>
                  <View style={styles.macroCol}>
                    <Text style={[styles.macroVal, { color: '#FF4B4B' }]}>{Math.round(meal.proteinas)}g</Text>
                    <Text style={styles.macroLabel}>Prot</Text>
                  </View>
                  <View style={styles.macroCol}>
                    <Text style={[styles.macroVal, { color: '#85C872' }]}>{Math.round(meal.carbohidratos)}g</Text>
                    <Text style={styles.macroLabel}>Carbs</Text>
                  </View>
                  <View style={styles.macroCol}>
                    <Text style={[styles.macroVal, { color: '#0080FF' }]}>{Math.round(meal.grasas)}g</Text>
                    <Text style={styles.macroLabel}>Grasa</Text>
                  </View>
                </View>

                {/* Footer del perfil */}
                <View style={styles.footerRow}>
                  <UserCircle size={16} color={colors.textSecondary} />
                  <Text style={styles.footerText}>Calio AI</Text>
                </View>
              </View>

            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No hay comidas registradas</Text>
          <Text style={styles.emptyText}>Comienza a registrar tus comidas tomando una foto.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.secondary,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.card,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 40,
    fontWeight: '800',
    color: colors.textMuted,
  },
  overlayTop: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badgeCal: {
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeCalText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  badgeDelete: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondary,
    height: 40, // Espacio fijo para 2 líneas
    marginBottom: 10,
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  macroCol: {
    alignItems: 'center',
  },
  macroVal: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 2,
  },
  macroLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '500',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  emptyState: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.secondary,
    marginBottom: 8,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
});
