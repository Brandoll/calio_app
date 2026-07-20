import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Flame } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { CircularProgress } from '../ui/CircularProgress';
import { formatCalories } from '../../utils/formatters';

interface CaloriesCardProps {
  consumed: number;
  goal: number;
}

export const CaloriesCard: React.FC<CaloriesCardProps> = ({ consumed, goal }) => {
  const progress = goal > 0 ? (consumed / goal) * 100 : 0;

  return (
    <View style={styles.card}>
      <View style={styles.leftContent}>
        <View style={styles.valuesContainer}>
          <Text style={styles.consumedText}>{Math.round(consumed)}</Text>
          <Text style={styles.goalText}> /{Math.round(goal)}</Text>
        </View>
        <Text style={styles.labelText}>Calorías</Text>
      </View>

      <View style={styles.rightContent}>
        <CircularProgress
          size={70}
          strokeWidth={8}
          progress={progress}
          color="#FF8A00" // Naranja/Fuego para calorías
          backgroundColor={colors.background}
        >
          <Flame color="#FF8A00" size={28} />
        </CircularProgress>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
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
    fontSize: 40,
    fontWeight: '800',
    color: colors.secondary, // Gris oscuro / Negro
  },
  goalText: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.textMuted, // Gris más claro
  },
  labelText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  rightContent: {
    justifyContent: 'center',
    alignItems: 'center',
    // Fondo sutil circular detrás del icono (como en el diseño, donde el circulo tiene un fondo ligeramente gris)
    backgroundColor: 'rgba(240, 240, 240, 0.4)',
    borderRadius: 35, // Mitad de size (70)
  }
});
