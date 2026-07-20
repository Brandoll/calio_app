import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import { CheckCircle, Dumbbell, Trash2, Play, Target, ChevronRight, Zap, ListChecks, Edit3, Check } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { exerciseService } from '../../services/exerciseService';
import { useAuthStore } from '../../stores/authStore';
import { useExerciseListStore } from '../../stores/exerciseStore';
import { ActiveExerciseModal } from './ActiveExerciseModal';
import { CustomAlert } from '../ui/CustomAlert';
import { useRouter } from 'expo-router';
import { Rutina, Exercise } from '../../types/exercise';

const parseAndSortRoutine = (jsonStr: string) => {
  try {
    const parsed = JSON.parse(jsonStr);
    if (parsed && Array.isArray(parsed.dias)) {
      parsed.dias.sort((a: any, b: any) => {
        const numA = parseInt(String(a.dia).replace(/\D/g, ''), 10) || 0;
        const numB = parseInt(String(b.dia).replace(/\D/g, ''), 10) || 0;
        return numA - numB;
      });
      parsed.dias.forEach((d: any, index: number) => {
        const num = parseInt(String(d.dia).replace(/\D/g, ''), 10) || (index + 1);
        d.dia = `Día ${num}`;
      });
    }
    return parsed;
  } catch (e) {
    return null;
  }
};

const DAYS_OPTIONS = [3, 4, 5, 6];
const EQUIPMENT_OPTIONS = ['Mancuernas', 'Barra', 'Máquina', 'Sin equipo'];
const GOAL_OPTIONS = [
  { key: 'fuerza', label: 'Fuerza', emoji: '💪', color: '#FF6B6B' },
  { key: 'hipertrofia', label: 'Hipertrofia', emoji: '🏋️', color: '#45B7D1' },
  { key: 'resistencia', label: 'Resistencia', emoji: '🏃', color: '#4ECDC4' },
  { key: 'perdida_peso', label: 'Perder peso', emoji: '🔥', color: '#F0B27A' },
];

const groupColors: Record<string, string> = {
  pecho: '#FF6B6B', espalda: '#4ECDC4', piernas: '#45B7D1',
  hombros: '#F7DC6F', brazos: '#BB8FCE', core: '#F0B27A',
};

export const MyWorkoutView = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { exercises: myList, removeExercise, clearList } = useExerciseListStore();

  const [subTab, setSubTab] = useState<'ia' | 'mi_lista'>('ia');
  const [isLoading, setIsLoading] = useState(true);
  const [rutina, setRutina] = useState<Rutina | null>(null);

  // Form state
  const [dias, setDias] = useState<number>(4);
  const [equipo, setEquipo] = useState<string[]>(['Sin equipo']);
  const [objetivo, setObjetivo] = useState('hipertrofia');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // View state
  const [parsedRoutine, setParsedRoutine] = useState<any>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());

  // Alerts
  const [showCompleteAlert, setShowCompleteAlert] = useState(false);
  const [showClearListAlert, setShowClearListAlert] = useState(false);
  const [showNewRoutineAlert, setShowNewRoutineAlert] = useState(false);

  // Active exercise modal
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);

  useEffect(() => {
    loadCurrentWorkout();
  }, []);

  const loadCurrentWorkout = async () => {
    if (!user) { setIsLoading(false); return; }
    setIsLoading(true);
    try {
      const current = await exerciseService.getCurrentWorkout(user.id);
      setRutina(current);
      if (current.rutinaJson) {
        setParsedRoutine(parseAndSortRoutine(current.rutinaJson));
      }
    } catch (error: any) {
      if (error?.response?.status === 404) setRutina(null);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEquipment = (eq: string) => {
    if (equipo.includes(eq)) {
      setEquipo(equipo.filter(e => e !== eq));
    } else {
      setEquipo([...equipo, eq]);
    }
  };

  const handleGenerate = async () => {
    if (!user) return;
    setIsGenerating(true);
    try {
      const data = {
        userId: user.id,
        diasPorSemana: dias,
        equipoDisponible: equipo.length > 0 ? equipo : ['Sin equipo'],
        objetivo,
      };
      const nueva = await exerciseService.generateWorkout(data);
      setRutina(nueva);
      if (nueva.rutinaJson) {
        setParsedRoutine(parseAndSortRoutine(nueva.rutinaJson));
      }
      setSelectedDayIndex(0);
      setCompletedDays(new Set());
      setIsEditing(false);
    } catch (error) {
      // show error alert
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCompleteDay = async () => {
    if (!rutina || !parsedRoutine) return;
    const currentDay = parsedRoutine.dias[selectedDayIndex];
    setIsCompleting(true);
    try {
      const data = {
        diaEntrenamiento: currentDay.dia,
        fecha: new Date().toISOString().split('T')[0],
      };
      await exerciseService.completeWorkout(rutina.id, data);
      setCompletedDays(prev => new Set(prev).add(selectedDayIndex));
      setShowCompleteAlert(true);
    } catch (error) {
      // silently fail
    } finally {
      setIsCompleting(false);
    }
  };

  const handleNewRoutine = () => {
    setShowNewRoutineAlert(false);
    setRutina(null);
    setParsedRoutine(null);
    setCompletedDays(new Set());
    setIsEditing(true);
  };

  const startMyListWorkout = (index: number) => {
    if (myList.length === 0) return;
    setActiveExerciseIndex(index);
    setActiveExercise(myList[index]);
  };

  const handleNextInList = () => {
    const nextIdx = activeExerciseIndex + 1;
    if (nextIdx < myList.length) {
      setActiveExerciseIndex(nextIdx);
      setActiveExercise(myList[nextIdx]);
    } else {
      setActiveExercise(null);
    }
  };

  // --- SUB TAB: MI LISTA ---
  const renderMyList = () => (
    <View style={styles.myListContainer}>
      {myList.length === 0 ? (
        <View style={styles.emptyList}>
          <ListChecks color={colors.textMuted} size={48} />
          <Text style={styles.emptyListTitle}>Tu lista está vacía</Text>
          <Text style={styles.emptyListSub}>Ve a Explorar y agrega ejercicios con el botón +</Text>
        </View>
      ) : (
        <>
          <View style={styles.myListHeader}>
            <Text style={styles.myListCount}>{myList.length} ejercicio{myList.length !== 1 ? 's' : ''}</Text>
            <TouchableOpacity style={styles.clearListBtn} onPress={() => setShowClearListAlert(true)}>
              <Trash2 color={colors.error} size={14} />
              <Text style={styles.clearListText}>Limpiar</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={myList}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.myListContent}
            renderItem={({ item, index }) => {
              const gc = groupColors[item.grupoMuscular?.toLowerCase()] || colors.primary;
              return (
                <View style={styles.myListCard}>
                  <View style={styles.myListIndex}>
                    <Text style={styles.myListIndexText}>{index + 1}</Text>
                  </View>
                  <TouchableOpacity style={styles.myListInfo} onPress={() => router.push(`/(tabs)/exercises/${item.id}`)}>
                    <Text style={styles.myListName} numberOfLines={1}>{item.nombre}</Text>
                    <View style={styles.myListBadges}>
                      <View style={[styles.myListBadge, { backgroundColor: `${gc}18` }]}>
                        <Text style={[styles.myListBadgeText, { color: gc }]}>{item.grupoMuscular}</Text>
                      </View>
                      <Text style={styles.myListReps}>{item.seriesRecomendadas || 3}x{item.repeticionesRecomendadas || '12'}</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.myListPlayBtn} onPress={() => startMyListWorkout(index)}>
                    <Play color={colors.white} size={14} fill={colors.white} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.myListDeleteBtn} onPress={() => removeExercise(item.id)}>
                    <Trash2 color={colors.error} size={16} />
                  </TouchableOpacity>
                </View>
              );
            }}
          />

          <TouchableOpacity style={styles.startAllBtn} onPress={() => startMyListWorkout(0)}>
            <Play color={colors.white} size={18} fill={colors.white} />
            <Text style={styles.startAllText}>Iniciar Lista Completa</Text>
          </TouchableOpacity>
        </>
      )}

      {activeExercise && (
        <ActiveExerciseModal
          visible={!!activeExercise}
          exercise={activeExercise}
          onClose={() => setActiveExercise(null)}
          onComplete={() => {}}
          onNext={handleNextInList}
          hasNext={activeExerciseIndex < myList.length - 1}
        />
      )}

      <CustomAlert
        visible={showClearListAlert}
        title="Limpiar lista"
        message="¿Estás seguro de que quieres eliminar todos los ejercicios de tu lista?"
        type="delete"
        onConfirm={() => { clearList(); setShowClearListAlert(false); }}
        onCancel={() => setShowClearListAlert(false)}
        confirmText="Eliminar todo"
      />
    </View>
  );

  // --- SUB TAB: RUTINA IA ---
  const renderIAContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    // FORMULARIO (sin rutina o editando)
    if (!rutina || isEditing) {
      return (
        <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.formIcon}>
            <Dumbbell size={44} color={colors.primaryDark} />
          </View>
          <Text style={styles.formTitle}>{isEditing ? 'Editar tu rutina' : 'Crea tu plan ideal'}</Text>
          <Text style={styles.formSubtitle}>
            {isEditing ? 'Ajusta los parámetros y genera una nueva' : 'Nuestra IA diseñará una rutina a tu medida'}
          </Text>

          <Text style={styles.label}>🎯 Objetivo</Text>
          <View style={styles.goalGrid}>
            {GOAL_OPTIONS.map(g => (
              <TouchableOpacity
                key={g.key}
                style={[styles.goalChip, objetivo === g.key && { backgroundColor: g.color, borderColor: g.color }]}
                onPress={() => setObjetivo(g.key)}
              >
                <Text style={styles.goalEmoji}>{g.emoji}</Text>
                <Text style={[styles.goalText, objetivo === g.key && { color: '#fff' }]}>{g.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>📅 Días por semana</Text>
          <View style={styles.daysRow}>
            {DAYS_OPTIONS.map(d => (
              <TouchableOpacity
                key={d}
                style={[styles.dayChip, dias === d && styles.dayChipActive]}
                onPress={() => setDias(d)}
              >
                <Text style={[styles.dayChipText, dias === d && styles.dayChipTextActive]}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>🏋️ Equipo disponible</Text>
          <View style={styles.eqRow}>
            {EQUIPMENT_OPTIONS.map(eq => {
              const isSelected = equipo.includes(eq);
              return (
                <TouchableOpacity
                  key={eq}
                  style={[styles.eqChip, isSelected && styles.eqChipActive]}
                  onPress={() => toggleEquipment(eq)}
                >
                  <Text style={[styles.eqChipText, isSelected && styles.eqChipTextActive]}>{eq}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={[styles.generateButton, isGenerating && { opacity: 0.7 }]}
            onPress={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <>
                <Zap color={colors.primary} size={20} />
                <Text style={styles.generateButtonText}>
                  {isEditing ? 'Regenerar Rutina' : 'Generar mi Rutina'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {isEditing && (
            <TouchableOpacity style={styles.cancelEditBtn} onPress={() => setIsEditing(false)}>
              <Text style={styles.cancelEditText}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      );
    }

    if (!parsedRoutine) return null;
    const currentDay = parsedRoutine.dias[selectedDayIndex];
    const isDayCompleted = completedDays.has(selectedDayIndex);

    return (
      <View style={styles.activeContainer}>
        {/* Day selector with completed indicators */}
        <View style={styles.daysSelector}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
            {parsedRoutine.dias.map((d: any, index: number) => {
              const isActive = selectedDayIndex === index;
              const isCompleted = completedDays.has(index);
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayTab,
                    isActive && styles.dayTabActive,
                    isCompleted && !isActive && styles.dayTabCompleted,
                  ]}
                  onPress={() => setSelectedDayIndex(index)}
                >
                  {isCompleted && (
                    <View style={styles.dayCheckBadge}>
                      <Check color={colors.white} size={10} />
                    </View>
                  )}
                  <Text style={[
                    styles.dayTabText,
                    isActive && styles.dayTabTextActive,
                    isCompleted && !isActive && styles.dayTabTextCompleted,
                  ]}>
                    {d.dia}
                  </Text>
                  <Text style={[
                    styles.dayTabSub,
                    isActive && { color: colors.primary },
                    isCompleted && !isActive && { color: colors.success },
                  ]}>
                    {isCompleted ? '✅ Hecho' : `${d.ejercicios?.length || 0} ej.`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <ScrollView contentContainerStyle={styles.routineContent} showsVerticalScrollIndicator={false}>
          <View style={styles.dayFocusRow}>
            <View style={styles.dayFocusContainer}>
              <Target color={colors.secondary} size={18} />
              <Text style={styles.dayFocus}>{currentDay.enfoque}</Text>
            </View>
            <TouchableOpacity style={styles.editBtn} onPress={() => setIsEditing(true)}>
              <Edit3 color={colors.textSecondary} size={16} />
              <Text style={styles.editBtnText}>Editar</Text>
            </TouchableOpacity>
          </View>

          {isDayCompleted && (
            <View style={styles.completedBanner}>
              <CheckCircle color={colors.success} size={18} />
              <Text style={styles.completedBannerText}>¡Día completado! 🎉</Text>
            </View>
          )}

          {currentDay.ejercicios.map((ej: any, idx: number) => {
            const gc = groupColors[ej.grupoMuscular?.toLowerCase()] || colors.primary;
            return (
              <TouchableOpacity
                key={idx}
                style={[styles.exerciseCard, isDayCompleted && { opacity: 0.6 }]}
                onPress={() => router.push(`/(tabs)/exercises/${ej.ejercicioId}`)}
              >
                <View style={[styles.exNumber, { backgroundColor: `${gc}18` }]}>
                  <Text style={[styles.exNumberText, { color: gc }]}>{idx + 1}</Text>
                </View>
                <View style={styles.exInfo}>
                  <Text style={styles.exName} numberOfLines={1}>{ej.nombre}</Text>
                  <View style={styles.exMeta}>
                    <View style={[styles.exGroupDot, { backgroundColor: gc }]} />
                    <Text style={styles.exTarget}>{ej.grupoMuscular}</Text>
                    <Text style={styles.exSep}>•</Text>
                    <Text style={styles.exDetails}>{ej.series}x{ej.repeticiones}</Text>
                  </View>
                </View>
                <ChevronRight color={colors.textMuted} size={18} />
              </TouchableOpacity>
            );
          })}

          {!isDayCompleted && (
            <TouchableOpacity
              style={styles.completeButton}
              onPress={handleCompleteDay}
              disabled={isCompleting}
            >
              {isCompleting ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <>
                  <CheckCircle color={colors.white} size={20} />
                  <Text style={styles.completeButtonText}>¡Día Terminado!</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.newRoutineBtn} onPress={() => setShowNewRoutineAlert(true)}>
            <Text style={styles.newRoutineText}>Generar nueva rutina</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Custom alerts */}
        <CustomAlert
          visible={showCompleteAlert}
          title="¡Excelente! 🎉"
          message={`Has completado ${currentDay?.dia}. Las calorías se han sincronizado con tu dashboard.`}
          type="success"
          onConfirm={() => setShowCompleteAlert(false)}
          confirmText="¡Genial!"
        />

        <CustomAlert
          visible={showNewRoutineAlert}
          title="Nueva rutina"
          message="¿Quieres generar una nueva rutina? Esto reemplazará la actual."
          type="confirm"
          onConfirm={handleNewRoutine}
          onCancel={() => setShowNewRoutineAlert(false)}
          confirmText="Sí, generar"
          cancelText="Cancelar"
        />
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.subTabsRow}>
        <TouchableOpacity
          style={[styles.subTab, subTab === 'ia' && styles.subTabActive]}
          onPress={() => setSubTab('ia')}
        >
          <Zap color={subTab === 'ia' ? colors.secondary : colors.textMuted} size={16} />
          <Text style={[styles.subTabText, subTab === 'ia' && styles.subTabTextActive]}>Rutina IA</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.subTab, subTab === 'mi_lista' && styles.subTabActive]}
          onPress={() => setSubTab('mi_lista')}
        >
          <ListChecks color={subTab === 'mi_lista' ? colors.secondary : colors.textMuted} size={16} />
          <Text style={[styles.subTabText, subTab === 'mi_lista' && styles.subTabTextActive]}>Mi Lista</Text>
          {myList.length > 0 && (
            <View style={styles.subTabBadge}>
              <Text style={styles.subTabBadgeText}>{myList.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {subTab === 'ia' ? renderIAContent() : renderMyList()}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  subTabsRow: {
    flexDirection: 'row', marginHorizontal: 20, backgroundColor: colors.card,
    borderRadius: 14, padding: 3, marginBottom: 12, borderWidth: 1, borderColor: colors.border,
  },
  subTab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 10, borderRadius: 11, gap: 6,
  },
  subTabActive: { backgroundColor: colors.primary },
  subTabText: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  subTabTextActive: { color: colors.secondary, fontWeight: '700' },
  subTabBadge: {
    width: 18, height: 18, borderRadius: 9, backgroundColor: colors.secondary,
    justifyContent: 'center', alignItems: 'center',
  },
  subTabBadgeText: { fontSize: 10, fontWeight: '800', color: colors.primary },

  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  formContainer: { padding: 20, paddingBottom: 120 },
  formIcon: { alignItems: 'center', marginBottom: 12, marginTop: 10 },
  formTitle: { fontSize: 24, fontWeight: '800', color: colors.secondary, textAlign: 'center', marginBottom: 6 },
  formSubtitle: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: 28 },
  label: { fontSize: 15, fontWeight: '700', color: colors.secondary, marginBottom: 10 },

  goalGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  goalChip: {
    width: '47%', flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 14, paddingVertical: 14, borderRadius: 16,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
  },
  goalEmoji: { fontSize: 20 },
  goalText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },

  daysRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  dayChip: {
    flex: 1, height: 48, borderRadius: 14, backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center',
  },
  dayChipActive: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  dayChipText: { fontSize: 18, fontWeight: '700', color: colors.textSecondary },
  dayChipTextActive: { color: colors.primary },

  eqRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 32 },
  eqChip: {
    paddingHorizontal: 16, paddingVertical: 12, borderRadius: 14,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
  },
  eqChipActive: { backgroundColor: colors.primary, borderColor: colors.primaryDark },
  eqChipText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  eqChipTextActive: { color: colors.secondary, fontWeight: '800' },

  generateButton: {
    flexDirection: 'row', gap: 8, backgroundColor: colors.secondary, height: 56,
    borderRadius: 16, justifyContent: 'center', alignItems: 'center',
    shadowColor: colors.secondary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  generateButtonText: { color: colors.primary, fontSize: 16, fontWeight: '700' },
  cancelEditBtn: { alignItems: 'center', marginTop: 16 },
  cancelEditText: { fontSize: 15, fontWeight: '600', color: colors.textSecondary, textDecorationLine: 'underline' },

  activeContainer: { flex: 1 },
  daysSelector: { paddingBottom: 12 },
  dayTab: {
    paddingHorizontal: 18, paddingVertical: 10, borderRadius: 14, marginRight: 8,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, alignItems: 'center',
    position: 'relative',
  },
  dayTabActive: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  dayTabCompleted: { backgroundColor: '#E8F5E9', borderColor: colors.success },
  dayTabText: { fontSize: 13, fontWeight: '700', color: colors.textSecondary },
  dayTabTextActive: { color: colors.primary },
  dayTabTextCompleted: { color: colors.success },
  dayTabSub: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
  dayCheckBadge: {
    position: 'absolute', top: -4, right: -4,
    width: 16, height: 16, borderRadius: 8, backgroundColor: colors.success,
    justifyContent: 'center', alignItems: 'center',
  },

  routineContent: { padding: 20, paddingBottom: 120 },
  dayFocusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  dayFocusContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  dayFocus: { fontSize: 18, fontWeight: '800', color: colors.secondary },
  editBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
  },
  editBtnText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },

  completedBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#E8F5E9', paddingHorizontal: 16, paddingVertical: 12,
    borderRadius: 12, marginBottom: 16,
  },
  completedBannerText: { fontSize: 14, fontWeight: '700', color: colors.success },

  exerciseCard: {
    flexDirection: 'row', backgroundColor: colors.card, borderRadius: 14,
    padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.border, alignItems: 'center',
  },
  exNumber: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  exNumberText: { fontSize: 14, fontWeight: '800' },
  exInfo: { flex: 1 },
  exName: { fontSize: 15, fontWeight: '700', color: colors.secondary, marginBottom: 4 },
  exMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  exGroupDot: { width: 6, height: 6, borderRadius: 3 },
  exTarget: { fontSize: 12, color: colors.textSecondary },
  exSep: { fontSize: 12, color: colors.textMuted },
  exDetails: { fontSize: 12, fontWeight: '600', color: colors.secondary },

  completeButton: {
    flexDirection: 'row', backgroundColor: colors.success, height: 56, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 20,
    shadowColor: colors.success, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  completeButtonText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  newRoutineBtn: { alignItems: 'center', marginTop: 16 },
  newRoutineText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary, textDecorationLine: 'underline' },

  // Mi Lista
  myListContainer: { flex: 1 },
  emptyList: { alignItems: 'center', marginTop: 60, paddingHorizontal: 40 },
  emptyListTitle: { fontSize: 18, fontWeight: '700', color: colors.secondary, marginTop: 16, marginBottom: 6 },
  emptyListSub: { fontSize: 14, color: colors.textSecondary, textAlign: 'center' },
  myListHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12 },
  myListCount: { fontSize: 14, fontWeight: '700', color: colors.secondary },
  clearListBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  clearListText: { fontSize: 13, fontWeight: '600', color: colors.error },
  myListContent: { paddingHorizontal: 20, paddingBottom: 120 },
  myListCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: 14, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: colors.border,
  },
  myListIndex: {
    width: 28, height: 28, borderRadius: 8, backgroundColor: colors.background,
    justifyContent: 'center', alignItems: 'center', marginRight: 10,
  },
  myListIndexText: { fontSize: 13, fontWeight: '800', color: colors.secondary },
  myListInfo: { flex: 1 },
  myListName: { fontSize: 14, fontWeight: '700', color: colors.secondary, marginBottom: 4 },
  myListBadges: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  myListBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  myListBadgeText: { fontSize: 11, fontWeight: '700' },
  myListReps: { fontSize: 11, color: colors.textMuted, fontWeight: '600' },
  myListPlayBtn: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: colors.secondary,
    justifyContent: 'center', alignItems: 'center', marginRight: 8,
  },
  myListDeleteBtn: { padding: 6 },
  startAllBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: colors.secondary, height: 52, borderRadius: 14,
    marginHorizontal: 20, marginBottom: 20,
    shadowColor: colors.secondary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  startAllText: { fontSize: 15, fontWeight: '700', color: colors.white },
});
