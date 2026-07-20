import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChefHat, Flame } from 'lucide-react-native';
import { colors } from '../../theme/colors';

interface RecipeCardProps {
  recipeJson: string;
  date: string;
  onPress: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipeJson, date, onPress }) => {
  let recipe: any = null;
  try {
    recipe = JSON.parse(recipeJson);
    if (typeof recipe === 'string') {
        recipe = JSON.parse(recipe.replace(/```json/g, '').replace(/```/g, ''));
    }
  } catch (e) {
    return null; // Si no es un JSON válido, no renderizamos nada (o podríamos renderizar un fallback)
  }

  // Si no tiene título (quizás es un plan semanal y no una receta individual)
  const isWeeklyPlan = !recipe.titulo && !recipe.title;
  const title = recipe.titulo || recipe.title || 'Plan Semanal';
  const description = recipe.descripcion || recipe.description || 'Plan de alimentación generado por IA';
  
  const calorias = recipe.macros?.calorias || 0;
  const proteinas = recipe.macros?.proteinas || 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.iconContainer}>
        <ChefHat color={colors.primaryDark} size={28} />
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
           <Text style={styles.title} numberOfLines={1}>{title}</Text>
           <Text style={styles.date}>{new Date(date).toLocaleDateString()}</Text>
        </View>
        
        <Text style={styles.description} numberOfLines={2}>{description}</Text>
        
        {!isWeeklyPlan && (
          <View style={styles.macrosContainer}>
            <View style={styles.caloriePill}>
              <Flame color="#FF8A00" size={12} fill="#FF8A00" />
              <Text style={styles.calorieText}>{calorias} kcal</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={[styles.macroValue, { color: '#FF4B4B' }]}>{proteinas}g</Text>
              <Text style={styles.macroLabel}> P</Text>
            </View>
          </View>
        )}
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
    padding: 16,
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
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.secondary,
    marginRight: 8,
  },
  date: {
    fontSize: 12,
    color: colors.textMuted,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
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
