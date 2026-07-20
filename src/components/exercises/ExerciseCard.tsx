import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Play } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { Exercise } from '../../types/exercise';

interface ExerciseCardProps {
  exercise: Exercise;
  onPress: () => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imagePlaceholder}>
        {exercise.gifUrl ? (
          <Image source={{ uri: exercise.gifUrl }} style={styles.image} />
        ) : (
          <Text style={styles.placeholderText}>{exercise.nombre.charAt(0)}</Text>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{exercise.nombre}</Text>
        <Text style={styles.group}>{exercise.grupoMuscular} • {exercise.dificultad}</Text>
        <View style={styles.badgesRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{exercise.equipo || 'Sin equipo'}</Text>
          </View>
        </View>
        <View style={styles.details}>
          <Text style={styles.detailText}>{exercise.seriesRecomendadas || 3} Series x {exercise.repeticionesRecomendadas || '12'} Reps</Text>
        </View>
      </View>
      <View style={styles.playButton}>
        <Play color={colors.white} size={20} fill={colors.white} />
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
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  imagePlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  placeholderText: { fontSize: 24, fontWeight: '700', color: colors.textMuted },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: colors.secondary, marginBottom: 2 },
  group: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
  badgesRow: { flexDirection: 'row', marginBottom: 6 },
  badge: { backgroundColor: 'rgba(0,0,0,0.05)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  badgeText: { fontSize: 10, color: colors.textSecondary, fontWeight: '600' },
  details: {
    backgroundColor: colors.background,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  detailText: { fontSize: 11, fontWeight: '600', color: colors.secondary },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
});
