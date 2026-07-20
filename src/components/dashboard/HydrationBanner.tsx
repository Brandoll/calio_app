import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GlassWater } from 'lucide-react-native';
import { colors } from '../../theme/colors';

interface HydrationBannerProps {
  currentGlasses: number;
  goalGlasses: number;
  onAddGlass: () => void; // Función para añadir directamente (opcional)
  onPress: () => void;    // Función para abrir el modal
}

export const HydrationBanner: React.FC<HydrationBannerProps> = ({ currentGlasses, goalGlasses, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <GlassWater color="#3498db" size={32} style={styles.icon} />
      <View style={styles.valuesContainer}>
        <Text style={styles.currentValue}>{currentGlasses * 250}</Text>
        <Text style={styles.totalValue}> /{goalGlasses * 250} ml</Text>
      </View>
      <Text style={styles.label}>Hidratación</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 16,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  icon: {
    marginBottom: 16,
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
  }
});
