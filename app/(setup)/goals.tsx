import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../src/theme/colors';

const goals = [
  {
    id: 'PERDER_PESO',
    title: 'Perder peso',
    subtitle: 'Quiero reducir mi peso y mejorar mi composición corporal.',
    emoji: '🏃',
  },
  {
    id: 'GANAR_MASA',
    title: 'Ganar masa muscular',
    subtitle: 'Quiero aumentar mi masa muscular y fuerza.',
    emoji: '💪',
  },
  {
    id: 'MANTENER_PESO',
    title: 'Mantenerme saludable',
    subtitle: 'Quiero mantenerme en mi peso actual y comer saludable.',
    emoji: '⚖️',
  },
  {
    id: 'MEJORAR_RENDIMIENTO',
    title: 'Mejorar rendimiento',
    subtitle: 'Quiero optimizar mi rendimiento deportivo y resistencia.',
    emoji: '🏆',
  },
];

export default function GoalsScreen() {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const router = useRouter();

  const handleContinue = () => {
    if (selectedGoal) {
      router.push({ pathname: '/(setup)/personal-data', params: { goal: selectedGoal } });
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>¿Cuál es tu objetivo?</Text>
      <Text style={styles.subtitle}>
        Esto nos ayudará a personalizar tu plan para ti.
      </Text>

      <View style={styles.goalsContainer}>
        {goals.map((goal) => (
          <TouchableOpacity
            key={goal.id}
            style={[
              styles.goalCard,
              selectedGoal === goal.id && styles.goalCardSelected,
            ]}
            onPress={() => setSelectedGoal(goal.id)}
          >
            <Text style={styles.goalEmoji}>{goal.emoji}</Text>
            <View style={styles.goalTextContainer}>
              <Text style={[
                styles.goalTitle,
                selectedGoal === goal.id && styles.goalTitleSelected,
              ]}>
                {goal.title}
              </Text>
              <Text style={styles.goalSubtitle}>{goal.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, !selectedGoal && styles.buttonDisabled]}
        onPress={handleContinue}
        disabled={!selectedGoal}
      >
        <Text style={styles.buttonText}>Continuar</Text>
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
  goalsContainer: {
    gap: 12,
    marginBottom: 32,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  goalCardSelected: {
    borderColor: colors.primary,
    backgroundColor: '#F8FFE0',
  },
  goalEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  goalTextContainer: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: 4,
  },
  goalTitleSelected: {
    color: colors.secondary,
  },
  goalSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.secondary,
  },
});
