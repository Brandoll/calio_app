import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Dumbbell, ChevronRight } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { Exercise } from '../../types/exercise';

interface ExerciseCardProps {
  exercise: Exercise;
  onPress: () => void;
}

// Colores por grupo muscular
const groupColors: Record<string, string> = {
  pecho: '#FF6B6B',
  espalda: '#4ECDC4',
  piernas: '#45B7D1',
  hombros: '#F7DC6F',
  brazos: '#BB8FCE',
  core: '#F0B27A',
};

// Colores por dificultad
const difficultyConfig: Record<string, { color: string; label: string }> = {
  principiante: { color: '#4CAF50', label: 'Principiante' },
  intermedio: { color: '#FFC107', label: 'Intermedio' },
  avanzado: { color: '#FF5252', label: 'Avanzado' },
};

const getGroupColor = (grupo: string): string => groupColors[grupo?.toLowerCase()] || colors.primary;
const getDiffConfig = (dif: string) => difficultyConfig[dif?.toLowerCase()] || { color: colors.textMuted, label: dif || '—' };
const capitalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onPress }) => {
  const groupColor = getGroupColor(exercise.grupoMuscular);
  const diff = getDiffConfig(exercise.dificultad);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconContainer, { backgroundColor: `${groupColor}18` }]}>
        <Dumbbell color={groupColor} size={26} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{exercise.nombre}</Text>
        <Text style={styles.group}>{capitalize(exercise.grupoMuscular)}</Text>
        <View style={styles.badgesRow}>
          <View style={[styles.diffBadge, { backgroundColor: `${diff.color}18` }]}>
            <View style={[styles.diffDot, { backgroundColor: diff.color }]} />
            <Text style={[styles.diffText, { color: diff.color }]}>{diff.label}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {capitalize(exercise.equipo === 'ninguno' ? 'Sin equipo' : exercise.equipo || 'Sin equipo')}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.arrowContainer}>
        <ChevronRight color={colors.textMuted} size={20} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: colors.secondary, marginBottom: 2 },
  group: { fontSize: 12, color: colors.textSecondary, marginBottom: 6 },
  badgesRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  diffBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  diffDot: { width: 6, height: 6, borderRadius: 3 },
  diffText: { fontSize: 11, fontWeight: '700' },
  badge: {
    backgroundColor: 'rgba(0,0,0,0.04)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: { fontSize: 11, color: colors.textSecondary, fontWeight: '600' },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});
