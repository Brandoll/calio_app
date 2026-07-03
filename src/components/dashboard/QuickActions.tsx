import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera, Plus, Activity, Droplets } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { useRouter } from 'expo-router';

export const QuickActions = () => {
  const router = useRouter();

  const actions = [
    { id: '1', icon: <Plus color={colors.secondary} size={24} />, label: 'Comida', route: '/(tabs)/foods' },
    { id: '2', icon: <Camera color={colors.secondary} size={24} />, label: 'Analizar', route: '/(tabs)/foods' }, // Mapear a la ruta de IA luego
    { id: '3', icon: <Droplets color={colors.secondary} size={24} />, label: 'Agua', route: '/(tabs)/index' }, // Abrir modal
    { id: '4', icon: <Activity color={colors.secondary} size={24} />, label: 'Actividad', route: '/(tabs)/exercises' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acciones rápidas</Text>
      <View style={styles.actionsGrid}>
        {actions.map((action) => (
          <TouchableOpacity 
            key={action.id} 
            style={styles.actionItem}
            onPress={() => router.push(action.route as any)}
          >
            <View style={styles.iconContainer}>
              {action.icon}
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionItem: {
    alignItems: 'center',
    width: '22%',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
