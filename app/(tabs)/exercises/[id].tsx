import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Play, Info } from 'lucide-react-native';
import { colors } from '../../../src/theme/colors';
import { Exercise } from '../../../src/types/exercise';
import { exerciseService } from '../../../src/services/exerciseService';

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExercise();
  }, [id]);

  const loadExercise = async () => {
    setIsLoading(true);
    try {
      const data = await exerciseService.getById(parseInt(id));
      setExercise(data);
    } catch (error) {
      // Mock fallback
      setExercise({
        id: parseInt(id),
        nombre: 'Sentadillas',
        grupoMuscular: 'Piernas',
        equipo: 'Sin equipo',
        dificultad: 'Principiante',
        seriesRecomendadas: 4,
        repeticionesRecomendadas: '12',
        caloriasPorMinuto: 8.5,
        instrucciones: 'Párate con los pies separados a la altura de los hombros. Baja las caderas como si te fueras a sentar en una silla, manteniendo la espalda recta.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !exercise) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <ArrowLeft color={colors.secondary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle</Text>
        <View style={{ width: 40 }} /> {/* Spacer */}
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          {exercise.gifUrl ? (
            <Image source={{ uri: exercise.gifUrl }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>{exercise.nombre.charAt(0)}</Text>
            </View>
          )}
          
          <View style={styles.playOverlay}>
            <View style={styles.playIconContainer}>
              <Play color={colors.white} size={32} fill={colors.white} />
            </View>
          </View>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.name}>{exercise.nombre}</Text>
          <View style={styles.badges}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{exercise.grupoMuscular}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{exercise.equipo || 'Sin equipo'}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: 'rgba(0,0,0,0.05)' }]}>
              <Text style={[styles.badgeText, { color: colors.textSecondary }]}>{exercise.dificultad}</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{exercise.seriesRecomendadas || 3}</Text>
            <Text style={styles.statLabel}>Series</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{exercise.repeticionesRecomendadas || '12'}</Text>
            <Text style={styles.statLabel}>Repeticiones</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{exercise.caloriasPorMinuto || 5}</Text>
            <Text style={styles.statLabel}>Kcal / min</Text>
          </View>
        </View>

        <View style={styles.descriptionContainer}>
          <View style={styles.descriptionHeader}>
            <Info color={colors.secondary} size={20} />
            <Text style={styles.descriptionTitle}>Técnica</Text>
          </View>
          <Text style={styles.descriptionText}>
            {exercise.instrucciones || 'Técnica no especificada. Asegúrate de mantener una buena postura durante todo el movimiento.'}
          </Text>
        </View>

        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startButtonText}>Iniciar Ejercicio</Text>
        </TouchableOpacity>
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: colors.white,
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: colors.secondary },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: { padding: 20 },
  imageContainer: {
    width: '100%',
    height: 240,
    borderRadius: 20,
    backgroundColor: colors.white,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  image: { width: '100%', height: '100%' },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.card },
  placeholderText: { fontSize: 80, fontWeight: '800', color: colors.textMuted },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 4, // Visual center tweak
  },
  titleContainer: { marginBottom: 20 },
  name: { fontSize: 24, fontWeight: '800', color: colors.secondary, marginBottom: 12 },
  badges: { flexDirection: 'row', gap: 8 },
  badge: { backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: '700', color: colors.secondary },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 20, fontWeight: '800', color: colors.secondary, marginBottom: 4 },
  statLabel: { fontSize: 12, color: colors.textSecondary },
  descriptionContainer: { marginBottom: 40 },
  descriptionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  descriptionTitle: { fontSize: 18, fontWeight: '700', color: colors.secondary },
  descriptionText: { fontSize: 15, color: colors.textSecondary, lineHeight: 24 },
  startButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: { fontSize: 16, fontWeight: '700', color: colors.white },
});
