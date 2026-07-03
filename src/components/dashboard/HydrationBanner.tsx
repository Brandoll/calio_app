import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Droplets, Plus } from 'lucide-react-native';
import { colors } from '../../theme/colors';

interface HydrationBannerProps {
  currentGlasses: number;
  goalGlasses: number;
  onAddGlass: () => void;
}

export const HydrationBanner: React.FC<HydrationBannerProps> = ({ currentGlasses, goalGlasses, onAddGlass }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Droplets color={colors.primary} size={28} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>¡Hidrátate!</Text>
        <Text style={styles.subtitle}>
          Llevas {currentGlasses} de {goalGlasses} vasos de agua hoy
        </Text>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={onAddGlass}>
        <Plus color={colors.secondary} size={24} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(216, 255, 46, 0.1)', // primary con opacidad
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
