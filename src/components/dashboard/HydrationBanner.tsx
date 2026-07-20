import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Droplet } from 'lucide-react-native';
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
      <View style={styles.leftSection}>
        <Droplet color="#3498db" size={32} style={styles.icon} fill="#3498db" fillOpacity={0.2} />
        <View style={styles.textContainer}>
          <View style={styles.valuesContainer}>
            <Text style={styles.currentValue}>{currentGlasses * 250}</Text>
            <Text style={styles.totalValue}> /{goalGlasses * 250} ml</Text>
          </View>
          <Text style={styles.label}>Hidratación</Text>
        </View>
      </View>

      <View style={styles.button}>
        <Text style={styles.buttonText}>Registrar agua</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 16,
  },
  textContainer: {
    justifyContent: 'center',
  },
  valuesContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currentValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.secondary,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textMuted,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 2,
  },
  button: {
    backgroundColor: 'rgba(240, 240, 240, 0.8)', // Fondo gris claro sutil
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  buttonText: {
    color: '#8D6E63', // Un tono tierra claro como en el diseño (marrón suave)
    fontWeight: '700',
    fontSize: 14,
  }
});
