import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { formatCalories } from '../../utils/formatters';

interface CaloriesCardProps {
  consumed: number;
  goal: number;
}

export const CaloriesCard: React.FC<CaloriesCardProps> = ({ consumed, goal }) => {
  const remaining = Math.max(0, goal - consumed);
  const progress = Math.min(100, (consumed / goal) * 100);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Resumen diario</Text>
        <Text style={styles.subtitle}>Calorías</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.mainInfo}>
          <Text style={styles.consumed}>{formatCalories(consumed)}</Text>
          <Text style={styles.goal}>/ {formatCalories(goal)} kcal</Text>
        </View>
        <View style={styles.remainingInfo}>
          <Text style={styles.remainingText}>Faltan {formatCalories(remaining)} kcal</Text>
        </View>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.secondary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  mainInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  consumed: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.secondary,
  },
  goal: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textMuted,
    marginLeft: 4,
  },
  remainingInfo: {
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  remainingText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: colors.background,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
});
