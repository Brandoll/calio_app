import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Flame } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { CircularProgress } from '../ui/CircularProgress';
import { formatCalories } from '../../utils/formatters';

interface CaloriesCardProps {
  consumed: number;
  goal: number;
  onPress?: () => void;
}

export const CaloriesCard: React.FC<CaloriesCardProps> = ({ consumed, goal, onPress }) => {
  const progress = goal > 0 ? (consumed / goal) * 100 : 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.leftContent}>
        <View style={styles.valuesContainer}>
          <Text style={styles.consumedText}>{Math.round(consumed)}</Text>
          <Text style={styles.goalText}> /{Math.round(goal)}</Text>
        </View>
        <Text style={styles.labelText}>Calorías</Text>
      </View>

      <View style={styles.rightContent}>
        <CircularProgress
          size={55}
          strokeWidth={6}
          progress={progress}
          color="#FF8A00" // Naranja/Fuego para calorías
          backgroundColor={colors.background}
        >
          <Flame color="#FF8A00" size={24} />
        </CircularProgress>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  leftContent: {
    flex: 1,
  },
  valuesContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  consumedText: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.secondary, // Gris oscuro / Negro
  },
  goalText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textMuted, // Gris más claro
  },
  labelText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  rightContent: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(240, 240, 240, 0.4)',
    borderRadius: 27.5,
  }
});
