import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Target } from 'lucide-react-native';
import { colors } from '../../theme/colors';

interface DailyGoalCardProps {
  title: string;
  progress: number; // 0 a 100
  subtitle: string;
}

export const DailyGoalCard: React.FC<DailyGoalCardProps> = ({ title, progress, subtitle }) => {
  const current = subtitle.split(' / ')[0] || '0';
  const total = subtitle.split(' / ')[1] || '0 kcal';

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>{progress}%</Text>
      </View>
      
      <View style={styles.valuesContainer}>
        <Text style={styles.currentValue}>{current}</Text>
        <Text style={styles.totalValue}> /{total}</Text>
      </View>
      <Text style={styles.label}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  progressContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 4,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.secondary,
  },
  valuesContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currentValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.secondary,
  },
  totalValue: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textMuted,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 4,
  },
});
