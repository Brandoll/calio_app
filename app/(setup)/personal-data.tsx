import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { authService } from '../../src/services/authService';
import { useAuthStore } from '../../src/stores/authStore';
import { colors } from '../../src/theme/colors';

const genders = ['Masculino', 'Femenino'];
const activityLevels = ['Sedentario', 'Ligero', 'Moderado', 'Activo', 'Muy activo'];

export default function PersonalDataScreen() {
  const router = useRouter();
  const { goal } = useLocalSearchParams<{ goal: string }>();
  const { setSetupCompleted } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [edad, setEdad] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [genero, setGenero] = useState('');
  const [nivelActividad, setNivelActividad] = useState('');

  const handleSave = async () => {
    if (!edad || !peso || !altura || !genero || !nivelActividad) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    setIsLoading(true);
    try {
      // Guardar biométricos
      await authService.saveBiometrics({
        edad: parseInt(edad),
        peso: parseFloat(peso),
        altura: parseFloat(altura),
        genero,
        nivelActividad,
      });

      // Guardar objetivo
      await authService.saveGoal({
        tipo: goal as any,
      });

      await setSetupCompleted();
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'No se pudieron guardar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Cuéntanos sobre ti</Text>
      <Text style={styles.subtitle}>
        Necesitamos algunos datos para personalizar tu experiencia.
      </Text>

      {/* Fecha de nacimiento / Edad */}
      <Text style={styles.label}>Edad</Text>
      <TextInput
        style={styles.input}
        placeholder="25"
        placeholderTextColor={colors.textMuted}
        keyboardType="numeric"
        value={edad}
        onChangeText={setEdad}
      />

      {/* Género */}
      <Text style={styles.label}>Género</Text>
      <View style={styles.chipRow}>
        {genders.map((g) => (
          <TouchableOpacity
            key={g}
            style={[styles.chip, genero === g && styles.chipSelected]}
            onPress={() => setGenero(g)}
          >
            <Text style={[styles.chipText, genero === g && styles.chipTextSelected]}>
              {g}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Peso y Altura */}
      <View style={styles.row}>
        <View style={styles.halfField}>
          <Text style={styles.label}>Peso actual</Text>
          <TextInput
            style={styles.input}
            placeholder="65"
            placeholderTextColor={colors.textMuted}
            keyboardType="decimal-pad"
            value={peso}
            onChangeText={setPeso}
          />
          <Text style={styles.unit}>kg</Text>
        </View>
        <View style={styles.halfField}>
          <Text style={styles.label}>Altura</Text>
          <TextInput
            style={styles.input}
            placeholder="165"
            placeholderTextColor={colors.textMuted}
            keyboardType="decimal-pad"
            value={altura}
            onChangeText={setAltura}
          />
          <Text style={styles.unit}>cm</Text>
        </View>
      </View>

      {/* Nivel de actividad */}
      <Text style={styles.label}>Nivel de actividad</Text>
      <View style={styles.chipRow}>
        {activityLevels.map((level) => (
          <TouchableOpacity
            key={level}
            style={[styles.chip, nivelActividad === level && styles.chipSelected]}
            onPress={() => setNivelActividad(level)}
          >
            <Text style={[styles.chipText, nivelActividad === level && styles.chipTextSelected]}>
              {level}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={colors.secondary} />
        ) : (
          <Text style={styles.buttonText}>Guardar y continuar</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.secondary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondary,
    marginBottom: 8,
    marginTop: 20,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.secondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfField: {
    flex: 1,
  },
  unit: {
    position: 'absolute',
    right: 16,
    bottom: 14,
    fontSize: 14,
    color: colors.textMuted,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  chipTextSelected: {
    color: colors.secondary,
    fontWeight: '600',
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 40,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.secondary,
  },
});
