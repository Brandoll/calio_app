import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { CheckCircle, Dumbbell } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { exerciseService } from '../../services/exerciseService';
import { useAuthStore } from '../../stores/authStore';
import { useRouter } from 'expo-router';
import { Rutina } from '../../types/exercise';

const DAYS_OPTIONS = [3, 4, 5, 6];
const EQUIPMENT_OPTIONS = ['Mancuernas', 'Barra', 'Máquina', 'Sin equipo'];

export const MyWorkoutView = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [rutina, setRutina] = useState<Rutina | null>(null);
  
  // Form state
  const [dias, setDias] = useState<number>(4);
  const [equipo, setEquipo] = useState<string[]>(['Sin equipo']);
  const [isGenerating, setIsGenerating] = useState(false);

  // View state
  const [parsedRoutine, setParsedRoutine] = useState<any>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    loadCurrentWorkout();
  }, []);

  const loadCurrentWorkout = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const current = await exerciseService.getCurrentWorkout(user.id);
      setRutina(current);
      if (current.rutinaJson) {
        setParsedRoutine(JSON.parse(current.rutinaJson));
      }
    } catch (error: any) {
      if (error?.response?.status === 404) {
        setRutina(null);
      }
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
        equipoDisponible: equipo.length > 0 ? equipo : ['Sin equipo']
      };
      const nueva = await exerciseService.generateWorkout(data);
      setRutina(nueva);
      if (nueva.rutinaJson) {
        setParsedRoutine(JSON.parse(nueva.rutinaJson));
      }
      setSelectedDayIndex(0);
    } catch (error) {
      Alert.alert('Error', 'No se pudo generar la rutina.');
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
      Alert.alert('¡Excelente!', `Has completado ${currentDay.dia}. Las calorías se han sincronizado.`);
    } catch (error) {
      Alert.alert('Error', 'No se pudo completar el día.');
    } finally {
      setIsCompleting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // --- FORMULARIO GENERACIÓN ---
  if (!rutina) {
    return (
      <ScrollView contentContainerStyle={styles.formContainer}>
        <View style={styles.formIcon}>
          <Dumbbell size={48} color={colors.primaryDark} />
        </View>
        <Text style={styles.formTitle}>Crea tu plan ideal</Text>
        <Text style={styles.formSubtitle}>Nuestra IA diseñará una rutina a tu medida.</Text>

        <Text style={styles.label}>¿Cuántos días entrenarás?</Text>
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

        <Text style={styles.label}>Equipo disponible:</Text>
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
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={styles.generateButtonText}>Generar mi Rutina</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // --- VISTA RUTINA ACTIVA ---
  if (!parsedRoutine) return null;

  const currentDay = parsedRoutine.dias[selectedDayIndex];

  return (
    <View style={styles.activeContainer}>
      {/* Selector de días */}
      <View style={styles.daysSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {parsedRoutine.dias.map((d: any, index: number) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.dayTab, selectedDayIndex === index && styles.dayTabActive]}
              onPress={() => setSelectedDayIndex(index)}
            >
              <Text style={[styles.dayTabText, selectedDayIndex === index && styles.dayTabTextActive]}>
                {d.dia}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.routineContent}>
        <Text style={styles.dayFocus}>Enfoque: {currentDay.enfoque}</Text>

        {currentDay.ejercicios.map((ej: any, idx: number) => (
          <TouchableOpacity 
            key={idx} 
            style={styles.exerciseCard}
            onPress={() => router.push(`/(tabs)/exercises/${ej.ejercicioId}`)}
          >
            <View style={styles.exInfo}>
              <Text style={styles.exName}>{ej.nombre}</Text>
              <Text style={styles.exTarget}>{ej.grupoMuscular}</Text>
              <View style={styles.exDetailsBox}>
                <Text style={styles.exDetailsText}>
                  {ej.series} series × {ej.repeticiones} reps
                </Text>
              </View>
            </View>
            <View style={styles.exAction}>
              <Text style={styles.exActionText}>Ver</Text>
            </View>
          </TouchableOpacity>
        ))}

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
              <Text style={styles.completeButtonText}>¡Entrenamiento Terminado!</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  formContainer: { padding: 20 },
  formIcon: { alignItems: 'center', marginBottom: 16, marginTop: 20 },
  formTitle: { fontSize: 26, fontWeight: '800', color: colors.secondary, textAlign: 'center', marginBottom: 8 },
  formSubtitle: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', marginBottom: 32 },
  label: { fontSize: 16, fontWeight: '700', color: colors.secondary, marginBottom: 12 },
  daysRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  dayChip: { flex: 1, height: 48, borderRadius: 24, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  dayChipActive: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  dayChipText: { fontSize: 16, fontWeight: '600', color: colors.textSecondary },
  dayChipTextActive: { color: colors.background },
  eqRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 40 },
  eqChip: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  eqChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  eqChipText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  eqChipTextActive: { color: colors.secondary, fontWeight: '800' },
  generateButton: { backgroundColor: colors.secondary, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  generateButtonText: { color: colors.background, fontSize: 16, fontWeight: '700' },
  
  activeContainer: { flex: 1 },
  daysSelector: { paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  dayTab: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, marginRight: 12, backgroundColor: colors.card },
  dayTabActive: { backgroundColor: colors.primary },
  dayTabText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  dayTabTextActive: { color: colors.secondary, fontWeight: '800' },
  routineContent: { padding: 20, paddingBottom: 40 },
  dayFocus: { fontSize: 18, fontWeight: '800', color: colors.secondary, marginBottom: 20 },
  exerciseCard: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  exInfo: { flex: 1 },
  exName: { fontSize: 16, fontWeight: '700', color: colors.secondary, marginBottom: 4 },
  exTarget: { fontSize: 13, color: colors.textSecondary, marginBottom: 8 },
  exDetailsBox: { backgroundColor: colors.background, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  exDetailsText: { fontSize: 12, fontWeight: '600', color: colors.secondary },
  exAction: { paddingLeft: 16 },
  exActionText: { color: colors.primaryDark, fontWeight: '700', fontSize: 14 },
  completeButton: { flexDirection: 'row', backgroundColor: '#FF4B4B', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 24, shadowColor: '#FF4B4B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  completeButtonText: { color: colors.white, fontSize: 16, fontWeight: '700' },
});
