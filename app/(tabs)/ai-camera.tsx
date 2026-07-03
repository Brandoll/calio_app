import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, UploadCloud } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';

export default function AiCameraScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Reconocimiento IA</Text>
          <Text style={styles.subtitle}>Toma una foto a tu comida y nuestra IA calculará las calorías y macronutrientes automáticamente.</Text>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.mainAction}>
            <View style={styles.iconCircle}>
              <Camera size={48} color={colors.white} />
            </View>
            <Text style={styles.actionTitle}>Tomar Foto</Text>
            <Text style={styles.actionSubtitle}>Usa la cámara de tu teléfono</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryAction}>
            <UploadCloud size={24} color={colors.secondary} />
            <Text style={styles.secondaryActionText}>Subir desde galería</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.secondary,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  actionsContainer: {
    alignItems: 'center',
    gap: 24,
  },
  mainAction: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: 8,
  },
  actionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  secondaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.secondary,
  },
});
