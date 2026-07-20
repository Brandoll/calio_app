import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search } from 'lucide-react-native';
import { colors } from '../../../src/theme/colors';
import { exerciseService } from '../../../src/services/exerciseService';
import { Exercise } from '../../../src/types/exercise';
import { MuscleGroupFilter } from '../../../src/components/exercises/MuscleGroupFilter';
import { ExerciseCard } from '../../../src/components/exercises/ExerciseCard';
import { useRouter } from 'expo-router';

export default function ExercisesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [groups, setGroups] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data
  const mockExercises: Exercise[] = [
    { id: 1, nombre: 'Sentadillas', grupoMuscular: 'Piernas', equipo: 'Sin equipo', dificultad: 'Principiante', seriesRecomendadas: 4, repeticionesRecomendadas: '12', caloriasPorMinuto: 8, instrucciones: 'Párate con los pies separados. Baja las caderas.' },
    { id: 2, nombre: 'Flexiones', grupoMuscular: 'Pecho', equipo: 'Sin equipo', dificultad: 'Intermedio', seriesRecomendadas: 3, repeticionesRecomendadas: '15', caloriasPorMinuto: 7, instrucciones: 'Boca abajo, empuja tu peso hacia arriba.' },
    { id: 3, nombre: 'Dominadas', grupoMuscular: 'Espalda', equipo: 'Barra', dificultad: 'Avanzado', seriesRecomendadas: 3, repeticionesRecomendadas: '8', caloriasPorMinuto: 9, instrucciones: 'Cuélgate de una barra y sube hasta que tu barbilla la pase.' },
  ];
  const mockGroups = ['Pecho', 'Espalda', 'Piernas', 'Brazos', 'Core'];

  useEffect(() => {
    loadData();
  }, [selectedGroup]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const allExercises = await exerciseService.getAll();
      let filtered = allExercises.length > 0 ? allExercises : mockExercises;
      
      // Extraer grupos únicos
      const uniqueGroups = Array.from(new Set(filtered.map(e => e.grupoMuscular)));
      setGroups(uniqueGroups.length > 0 ? uniqueGroups : mockGroups);

      if (selectedGroup) {
        filtered = filtered.filter(e => e.grupoMuscular === selectedGroup);
      }
      if (search) {
        filtered = filtered.filter(e => e.nombre.toLowerCase().includes(search.toLowerCase()));
      }

      setExercises(filtered);
    } catch (error) {
      let filtered = mockExercises;
      if (selectedGroup) filtered = filtered.filter(e => e.grupoMuscular === selectedGroup);
      if (search) filtered = filtered.filter(e => e.nombre.toLowerCase().includes(search.toLowerCase()));
      
      setGroups(mockGroups);
      setExercises(filtered);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Ejercicios</Text>
      </View>

      <View style={styles.searchContainer}>
        <Search color={colors.textMuted} size={20} style={styles.searchIcon} />
        <TextInput 
          style={styles.searchInput}
          placeholder="Busca un ejercicio..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={loadData}
        />
      </View>

      <MuscleGroupFilter 
        groups={groups}
        selectedGroup={selectedGroup}
        onSelectGroup={setSelectedGroup}
      />

      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ExerciseCard 
              exercise={item} 
              onPress={() => router.push(`/(tabs)/exercises/${item.id}`)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No se encontraron ejercicios</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '800', color: colors.secondary },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: colors.secondary },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  loader: { marginTop: 40 },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: colors.textSecondary, fontSize: 16 },
});
