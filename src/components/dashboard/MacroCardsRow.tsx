import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Wheat, Droplet, Drumstick } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { CircularProgress } from '../ui/CircularProgress';

interface MacroCardsRowProps {
  protein: { current: number; total: number };
  carbs: { current: number; total: number };
  fat: { current: number; total: number };
}

export const MacroCardsRow: React.FC<MacroCardsRowProps> = ({ protein, carbs, fat }) => {
  const getProgress = (current: number, total: number) => {
    if (total === 0) return 0;
    return (current / total) * 100;
  };

  const renderCard = (
    label: string, 
    data: { current: number; total: number }, 
    color: string, 
    Icon: any
  ) => (
    <View style={styles.card}>
      <View style={styles.circleContainer}>
        <CircularProgress
          size={50}
          strokeWidth={4}
          progress={getProgress(data.current, data.total)}
          color={color}
          backgroundColor={colors.background}
        >
          <Icon color={color} size={20} />
        </CircularProgress>
      </View>
      <View style={styles.valuesContainer}>
        <Text style={styles.currentValue}>{Math.round(data.current)}</Text>
        <Text style={styles.totalValue}> /{Math.round(data.total)}g</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderCard('Proteínas', protein, '#FF4B4B', Drumstick)}
      {renderCard('Carbos', carbs, '#FFB020', Wheat)}
      {renderCard('Grasas', fat, '#0080FF', Droplet)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12, // Espacio entre tarjetas
  },
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  circleContainer: {
    marginBottom: 12,
    backgroundColor: 'rgba(240, 240, 240, 0.4)',
    borderRadius: 25,
  },
  valuesContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  currentValue: {
    fontSize: 18,
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
  }
});
