import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface MacronutrientsBarProps {
  protein: { current: number; total: number };
  carbs: { current: number; total: number };
  fat: { current: number; total: number };
}

export const MacronutrientsBar: React.FC<MacronutrientsBarProps> = ({ protein, carbs, fat }) => {
  const calculateProgress = (current: number, total: number) => {
    if (total === 0) return 0;
    return Math.min(100, (current / total) * 100);
  };

  const renderMacro = (label: string, data: { current: number; total: number }, color: string) => (
    <View style={styles.macroContainer}>
      <View style={styles.macroHeader}>
        <Text style={styles.macroLabel}>{label}</Text>
        <Text style={styles.macroValues}>
          {data.current} <Text style={styles.macroTotal}>/ {data.total}g</Text>
        </Text>
      </View>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { backgroundColor: color, width: `${calculateProgress(data.current, data.total)}%` }]} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderMacro('Proteínas', protein, colors.protein)}
      {renderMacro('Carbohidratos', carbs, colors.carbs)}
      {renderMacro('Grasas', fat, colors.fat)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  macroContainer: {
    marginBottom: 12,
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  macroLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondary,
  },
  macroValues: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondary,
  },
  macroTotal: {
    color: colors.textMuted,
  },
  barBackground: {
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
});
