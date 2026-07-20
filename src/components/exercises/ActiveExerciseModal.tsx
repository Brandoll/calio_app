import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, Animated } from 'react-native';
import { X, Play, Pause, SkipForward, CheckCircle, Timer, RotateCcw } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { Exercise } from '../../types/exercise';
import { API_BASE_URL } from '../../constants/api';

interface ActiveExerciseModalProps {
  visible: boolean;
  exercise: Exercise;
  onClose: () => void;
  onComplete: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

const REST_OPTIONS = [30, 60, 90, 120];

const buildGifUrl = (gifUrl?: string): string | null => {
  if (!gifUrl) return null;
  if (gifUrl.startsWith('http')) return gifUrl;
  return `${API_BASE_URL}/api/exercises${gifUrl}`;
};

export const ActiveExerciseModal: React.FC<ActiveExerciseModalProps> = ({
  visible,
  exercise,
  onClose,
  onComplete,
  onNext,
  hasNext = false,
}) => {
  const totalSeries = exercise.seriesRecomendadas || 3;
  const [completedSeries, setCompletedSeries] = useState<boolean[]>(
    Array(totalSeries).fill(false)
  );
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(60);
  const [restRemaining, setRestRemaining] = useState(0);
  const [imgError, setImgError] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const gifUrl = buildGifUrl(exercise.gifUrl);
  const completedCount = completedSeries.filter(Boolean).length;
  const allDone = completedCount === totalSeries;

  // Reset on exercise change
  useEffect(() => {
    setCompletedSeries(Array(totalSeries).fill(false));
    setIsResting(false);
    setRestRemaining(0);
    setImgError(false);
  }, [exercise.id]);

  // Rest timer
  useEffect(() => {
    if (isResting && restRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setRestRemaining((prev) => {
          if (prev <= 1) {
            setIsResting(false);
            clearInterval(intervalRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isResting, restRemaining]);

  // Progress animation
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: completedCount / totalSeries,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [completedCount]);

  const handleCompleteSerie = (index: number) => {
    const updated = [...completedSeries];
    updated[index] = !updated[index];
    setCompletedSeries(updated);

    // Start rest timer if marking as complete and not the last one
    if (updated[index] && index < totalSeries - 1) {
      setRestRemaining(restTime);
      setIsResting(true);
    }
  };

  const skipRest = () => {
    setIsResting(false);
    setRestRemaining(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleFinish = () => {
    onComplete();
    if (hasNext && onNext) {
      onNext();
    } else {
      onClose();
    }
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X color={colors.secondary} size={22} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>{exercise.nombre}</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* GIF */}
        <View style={styles.gifContainer}>
          {gifUrl && !imgError ? (
            <Image
              source={{ uri: gifUrl }}
              style={styles.gif}
              resizeMode="contain"
              onError={() => setImgError(true)}
            />
          ) : (
            <View style={styles.gifPlaceholder}>
              <Text style={styles.gifPlaceholderText}>{exercise.nombre?.charAt(0) || '?'}</Text>
            </View>
          )}
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressBarBg}>
            <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
          </View>
          <Text style={styles.progressText}>
            {completedCount} de {totalSeries} series
          </Text>
        </View>

        {/* Rest Timer */}
        {isResting && (
          <View style={styles.restContainer}>
            <Timer color={colors.primary} size={24} />
            <Text style={styles.restTitle}>Descanso</Text>
            <Text style={styles.restTimer}>{formatTime(restRemaining)}</Text>
            <TouchableOpacity style={styles.skipRestBtn} onPress={skipRest}>
              <SkipForward color={colors.secondary} size={16} />
              <Text style={styles.skipRestText}>Saltar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Series Tracker */}
        <View style={styles.seriesContainer}>
          <Text style={styles.seriesTitle}>Series</Text>
          <View style={styles.seriesGrid}>
            {completedSeries.map((done, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.serieChip, done && styles.serieChipDone]}
                onPress={() => handleCompleteSerie(idx)}
              >
                {done ? (
                  <CheckCircle color={colors.white} size={18} />
                ) : (
                  <Text style={styles.serieNumber}>{idx + 1}</Text>
                )}
                <Text style={[styles.serieLabel, done && styles.serieLabelDone]}>
                  {exercise.repeticionesRecomendadas || '12'} reps
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Rest Duration Selector */}
        <View style={styles.restSelector}>
          <Text style={styles.restSelectorLabel}>Descanso entre series:</Text>
          <View style={styles.restOptions}>
            {REST_OPTIONS.map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.restOption, restTime === t && styles.restOptionActive]}
                onPress={() => setRestTime(t)}
              >
                <Text style={[styles.restOptionText, restTime === t && styles.restOptionTextActive]}>
                  {t}s
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          {allDone ? (
            <TouchableOpacity style={styles.finishBtn} onPress={handleFinish}>
              <CheckCircle color={colors.white} size={20} />
              <Text style={styles.finishBtnText}>
                {hasNext ? 'Siguiente Ejercicio' : 'Completar Ejercicio'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={() => setCompletedSeries(Array(totalSeries).fill(false))}
            >
              <RotateCcw color={colors.textSecondary} size={16} />
              <Text style={styles.resetBtnText}>Reiniciar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: colors.secondary, textAlign: 'center', marginHorizontal: 8 },

  gifContainer: {
    height: 220,
    backgroundColor: '#1C1C1C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gif: { width: '100%', height: '100%' },
  gifPlaceholder: { justifyContent: 'center', alignItems: 'center' },
  gifPlaceholderText: { fontSize: 60, fontWeight: '800', color: '#333' },

  progressSection: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
  progressBarBg: { height: 8, borderRadius: 4, backgroundColor: colors.border, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4, backgroundColor: colors.primaryDark },
  progressText: { fontSize: 13, color: colors.textSecondary, marginTop: 6, textAlign: 'right', fontWeight: '600' },

  restContainer: {
    alignItems: 'center',
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginTop: 12,
    paddingVertical: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  restTitle: { fontSize: 14, fontWeight: '600', color: colors.textSecondary, marginTop: 4 },
  restTimer: { fontSize: 48, fontWeight: '800', color: colors.secondary, marginVertical: 4 },
  skipRestBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.background },
  skipRestText: { fontSize: 13, fontWeight: '600', color: colors.secondary },

  seriesContainer: { paddingHorizontal: 20, marginTop: 16 },
  seriesTitle: { fontSize: 16, fontWeight: '700', color: colors.secondary, marginBottom: 12 },
  seriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  serieChip: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.card, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
    borderWidth: 1, borderColor: colors.border, minWidth: '45%', flex: 1,
  },
  serieChipDone: { backgroundColor: colors.success, borderColor: colors.success },
  serieNumber: { fontSize: 16, fontWeight: '800', color: colors.secondary },
  serieLabel: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  serieLabelDone: { color: colors.white },

  restSelector: { paddingHorizontal: 20, marginTop: 20 },
  restSelectorLabel: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 8 },
  restOptions: { flexDirection: 'row', gap: 8 },
  restOption: { flex: 1, paddingVertical: 10, borderRadius: 12, backgroundColor: colors.card, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  restOptionActive: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  restOptionText: { fontSize: 14, fontWeight: '700', color: colors.textSecondary },
  restOptionTextActive: { color: colors.primary },

  bottomActions: { paddingHorizontal: 20, marginTop: 'auto', paddingBottom: 40, paddingTop: 16 },
  finishBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: colors.success, height: 56, borderRadius: 16,
    shadowColor: colors.success, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  finishBtnText: { fontSize: 16, fontWeight: '700', color: colors.white },
  resetBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    height: 48, borderRadius: 12, backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.border,
  },
  resetBtnText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
});
