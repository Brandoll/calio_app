import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Flame } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { MealRecord } from '../../types/tracking';
import { API_BASE_URL } from '../../constants/api';
import { MealDetailsModal } from './MealDetailsModal';

interface RecentMealsProps {
  meals: MealRecord[];
  onDelete?: (id: number) => void;
}

export const RecentMeals = ({ meals = [], onDelete }: RecentMealsProps) => {
  const [selectedMeal, setSelectedMeal] = useState<MealRecord | null>(null);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingHorizontal: 24 }]}>
        <Text style={styles.headerTitle}>Comidas del día</Text>
        <Text style={styles.seeAll}>Ver todo</Text>
      </View>
      
      {meals.length > 0 ? (
        <View style={styles.listContainer}>
          {meals.map((meal, index) => (
            <TouchableOpacity 
              key={meal.id ? meal.id.toString() : index.toString()} 
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => setSelectedMeal(meal)}
            >
              {/* Imagen a la Izquierda */}
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
              </View>

              {/* Información a la Derecha */}
              <View style={styles.infoContainer}>
                <View style={styles.infoHeader}>
                  <Text style={styles.title} numberOfLines={2}>
                    {meal.nombre}
                  </Text>
                  
                  <View style={styles.calBadge}>
                    <Flame color="#FF8A00" size={12} fill="#FF8A00" />
                    <Text style={styles.calBadgeText}>{Math.round(meal.calorias)}</Text>
                  </View>
                </View>
                
                <Text style={styles.timeText}>
                  {meal.tipoComida} • {meal.hora ? meal.hora.substring(0, 5) : ''}
                </Text>

                {/* Macros */}
                <View style={styles.macrosRow}>
                  <View style={styles.macroItem}>
                    <Text style={[styles.macroVal, { color: '#FF4B4B' }]}>{Math.round(meal.proteinas)}g</Text>
                    <Text style={styles.macroLabel}>Prot</Text>
                  </View>
                  <View style={styles.macroItem}>
                    <Text style={[styles.macroVal, { color: '#85C872' }]}>{Math.round(meal.carbohidratos)}g</Text>
                    <Text style={styles.macroLabel}>Carbs</Text>
                  </View>
                  <View style={styles.macroItem}>
                    <Text style={[styles.macroVal, { color: '#0080FF' }]}>{Math.round(meal.grasas)}g</Text>
                    <Text style={styles.macroLabel}>Grasas</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={[styles.emptyState, { marginHorizontal: 24 }]}>
          <Text style={styles.emptyTitle}>No hay comidas registradas</Text>
          <Text style={styles.emptyText}>Comienza a registrar tus comidas tomando una foto.</Text>
        </View>
      )}

      {/* Modal de Detalles de la Comida */}
      <MealDetailsModal 
        visible={!!selectedMeal} 
        onClose={() => setSelectedMeal(null)} 
        meal={selectedMeal} 
        onDelete={onDelete}
      />
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
  listContainer: {
    gap: 16,
    paddingHorizontal: 24,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    padding: 12,
    alignItems: 'center',
    width: '100%',
  },
  imageContainer: {
    width: 90,
    height: 90,
    borderRadius: 16,
    overflow: 'hidden',
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
    fontSize: 32,
    fontWeight: '800',
    color: colors.textMuted,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.secondary,
    flex: 1,
    marginRight: 8,
  },
  calBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 138, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  calBadgeText: {
    color: '#FF8A00',
    fontSize: 12,
    fontWeight: '700',
  },
  timeText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 10,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  macrosRow: {
    flexDirection: 'row',
    gap: 16,
  },
  macroItem: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  macroVal: {
    fontSize: 14,
    fontWeight: '800',
  },
  macroLabel: {
    fontSize: 11,
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
