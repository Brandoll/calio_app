import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Info, Play, Plus, Check, Flame, Repeat, Layers } from 'lucide-react-native';
import { colors } from '../../../src/theme/colors';
import { Exercise } from '../../../src/types/exercise';
import { exerciseService } from '../../../src/services/exerciseService';
import { useExerciseListStore } from '../../../src/stores/exerciseStore';
import { ActiveExerciseModal } from '../../../src/components/exercises/ActiveExerciseModal';
import { API_BASE_URL } from '../../../src/constants/api';

const buildFullGifUrl = (gifUrl?: string): string | null => {
  if (!gifUrl) return null;
  if (gifUrl.startsWith('http')) return gifUrl;
  return `${API_BASE_URL}/api/exercises${gifUrl}`;
};

const difficultyConfig: Record<string, { color: string; label: string }> = {
  principiante: { color: '#4CAF50', label: 'Principiante' },
  intermedio: { color: '#FFC107', label: 'Intermedio' },
  avanzado: { color: '#FF5252', label: 'Avanzado' },
};

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addExercise, removeExercise, isInList } = useExerciseListStore();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [showActiveModal, setShowActiveModal] = useState(false);

  const inList = exercise ? isInList(exercise.id) : false;

  useEffect(() => {
    loadExercise();
  }, [id]);

  const loadExercise = async () => {
    setIsLoading(true);
    try {
      const data = await exerciseService.getById(parseInt(id));
      setExercise(data);
    } catch (error) {
      setExercise({
        id: parseInt(id),
        nombre: 'Ejercicio',
        grupoMuscular: 'General',
        equipo: 'Sin equipo',
        dificultad: 'intermedio',
        seriesRecomendadas: 3,
        repeticionesRecomendadas: '12',
        caloriasPorMinuto: 6,
        instrucciones: 'Mantén buena postura durante todo el movimiento.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleList = () => {
    if (!exercise) return;
    if (inList) {
      removeExercise(exercise.id);
    } else {
      addExercise(exercise);
    }
  };

  if (isLoading || !exercise) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const gifUrl = buildFullGifUrl(exercise.gifUrl);
  const diff = difficultyConfig[exercise.dificultad?.toLowerCase()] || { color: colors.textMuted, label: exercise.dificultad || '—' };
  const capitalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

  // Parse instrucciones into numbered steps
  const steps = exercise.instrucciones
    ? exercise.instrucciones.split('.').map(s => s.trim()).filter(s => s.length > 3)
    : [];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <ArrowLeft color={colors.secondary} size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{exercise.nombre}</Text>
        <TouchableOpacity
          style={[styles.iconButton, inList && styles.iconButtonActive]}
          onPress={toggleList}
        >
          {inList ? <Check color={colors.secondary} size={20} /> : <Plus color={colors.secondary} size={20} />}
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* GIF Container */}
        <View style={styles.imageContainer}>
          {gifUrl && !imgError ? (
            <Image
              source={{ uri: gifUrl }}
              style={styles.image}
              resizeMode="contain"
              onError={() => setImgError(true)}
            />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>{exercise.nombre?.charAt(0) || '?'}</Text>
            </View>
          )}
        </View>

        {/* Title + Badges */}
        <Text style={styles.name}>{exercise.nombre}</Text>
        <View style={styles.badges}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{capitalize(exercise.grupoMuscular)}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {capitalize(exercise.equipo === 'ninguno' ? 'Sin equipo' : exercise.equipo || 'Sin equipo')}
            </Text>
          </View>
          <View style={[styles.diffBadge, { backgroundColor: `${diff.color}18` }]}>
            <View style={[styles.diffDot, { backgroundColor: diff.color }]} />
            <Text style={[styles.diffBadgeText, { color: diff.color }]}>{diff.label}</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Layers color={colors.secondary} size={18} />
            </View>
            <Text style={styles.statValue}>{exercise.seriesRecomendadas || 3}</Text>
            <Text style={styles.statLabel}>Series</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Repeat color={colors.secondary} size={18} />
            </View>
            <Text style={styles.statValue}>{exercise.repeticionesRecomendadas || '12'}</Text>
            <Text style={styles.statLabel}>Reps</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Flame color={colors.error} size={18} />
            </View>
            <Text style={styles.statValue}>{exercise.caloriasPorMinuto || 5}</Text>
            <Text style={styles.statLabel}>Kcal/min</Text>
          </View>
        </View>

        {/* Instructions */}
        {steps.length > 0 && (
          <View style={styles.instructionsContainer}>
            <View style={styles.instructionsHeader}>
              <Info color={colors.secondary} size={20} />
              <Text style={styles.instructionsTitle}>Técnica paso a paso</Text>
            </View>
            {steps.map((step, idx) => (
              <View key={idx} style={styles.stepRow}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{idx + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}.</Text>
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => setShowActiveModal(true)}
          >
            <Play color={colors.white} size={20} fill={colors.white} />
            <Text style={styles.startButtonText}>Iniciar Ejercicio</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.addListButton, inList && styles.addListButtonActive]}
            onPress={toggleList}
          >
            {inList ? (
              <>
                <Check color={colors.secondary} size={18} />
                <Text style={styles.addListButtonTextActive}>En Mi Lista</Text>
              </>
            ) : (
              <>
                <Plus color={colors.secondary} size={18} />
                <Text style={styles.addListButtonText}>Agregar a Mi Lista</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Active Exercise Modal */}
      <ActiveExerciseModal
        visible={showActiveModal}
        exercise={exercise}
        onClose={() => setShowActiveModal(false)}
        onComplete={() => setShowActiveModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: colors.secondary, textAlign: 'center', marginHorizontal: 8 },
  iconButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center', alignItems: 'center',
  },
  iconButtonActive: { backgroundColor: colors.primary },
  content: { padding: 20, paddingBottom: 40 },
  imageContainer: {
    width: '100%',
    height: 300,
    borderRadius: 20,
    backgroundColor: '#1C1C1C',
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  image: { width: '100%', height: '100%' },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 80, fontWeight: '800', color: '#333' },
  name: { fontSize: 22, fontWeight: '800', color: colors.secondary, marginBottom: 12 },
  badges: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 20 },
  badge: { backgroundColor: colors.card, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  badgeText: { fontSize: 12, fontWeight: '700', color: colors.textSecondary },
  diffBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, gap: 5 },
  diffDot: { width: 7, height: 7, borderRadius: 4 },
  diffBadgeText: { fontSize: 12, fontWeight: '700' },
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  statItem: { alignItems: 'center', flex: 1 },
  statIconContainer: { marginBottom: 6 },
  statValue: { fontSize: 22, fontWeight: '800', color: colors.secondary, marginBottom: 2 },
  statLabel: { fontSize: 12, color: colors.textSecondary },
  statDivider: { width: 1, height: 40, backgroundColor: colors.border },
  instructionsContainer: { marginBottom: 28 },
  instructionsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 8 },
  instructionsTitle: { fontSize: 18, fontWeight: '700', color: colors.secondary },
  stepRow: { flexDirection: 'row', marginBottom: 12, gap: 12 },
  stepNumber: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  stepNumberText: { fontSize: 13, fontWeight: '800', color: colors.secondary },
  stepText: { flex: 1, fontSize: 14, color: colors.textSecondary, lineHeight: 22, paddingTop: 3 },
  actionsContainer: { gap: 12 },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.secondary,
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: { fontSize: 16, fontWeight: '700', color: colors.white },
  addListButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.card,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addListButtonActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  addListButtonText: { fontSize: 15, fontWeight: '600', color: colors.secondary },
  addListButtonTextActive: { fontSize: 15, fontWeight: '700', color: colors.secondary },
});
