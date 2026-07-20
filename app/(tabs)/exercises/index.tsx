import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, X, SlidersHorizontal } from 'lucide-react-native';
import { colors } from '../../../src/theme/colors';
import { exerciseService } from '../../../src/services/exerciseService';
import { Exercise } from '../../../src/types/exercise';
import { MuscleGroupFilter } from '../../../src/components/exercises/MuscleGroupFilter';
import { EquipmentFilter } from '../../../src/components/exercises/EquipmentFilter';
import { ExerciseCard } from '../../../src/components/exercises/ExerciseCard';
import { MyWorkoutView } from '../../../src/components/exercises/MyWorkoutView';
import { ExerciseFilterModal } from '../../../src/components/exercises/ExerciseFilterModal';
import { useExerciseListStore } from '../../../src/stores/exerciseStore';
import { useRouter } from 'expo-router';

export default function ExercisesScreen() {
  const router = useRouter();
  const { exercises: myListExercises } = useExerciseListStore();
  const [search, setSearch] = useState('');
  const [allData, setAllData] = useState<Exercise[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [equipments, setEquipments] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'explorar' | 'mi_rutina'>('explorar');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  // Filtrar en tiempo real cuando cambian filtros o búsqueda
  useEffect(() => {
    applyFilters();
  }, [selectedGroup, selectedEquipment, selectedDifficulty, search, allData]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await exerciseService.getAll();
      if (data.length > 0) {
        setAllData(data);
        const uniqueGroups = Array.from(new Set(data.map(e => e.grupoMuscular)));
        setGroups(uniqueGroups);
        const uniqueEquipments = Array.from(new Set(data.map(e => e.equipo).filter(e => e)));
        setEquipments(uniqueEquipments);
      }
    } catch (error) {
      // silently fail, show empty state
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...allData];
    if (selectedGroup) {
      filtered = filtered.filter(e => e.grupoMuscular === selectedGroup);
    }
    if (selectedEquipment) {
      filtered = filtered.filter(e => e.equipo === selectedEquipment);
    }
    if (selectedDifficulty) {
      filtered = filtered.filter(e => e.dificultad === selectedDifficulty);
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(e => e.nombre.toLowerCase().includes(q));
    }
    setExercises(filtered);
  }, [allData, selectedGroup, selectedEquipment, selectedDifficulty, search]);

  const hasActiveFilters = selectedGroup || selectedEquipment || selectedDifficulty || search.trim();

  const clearAllFilters = () => {
    setSelectedGroup(null);
    setSelectedEquipment(null);
    setSelectedDifficulty(null);
    setSearch('');
  };

  const renderExplorar = () => (
    <>
      {/* Search */}
      <View style={styles.searchContainer}>
        <Search color={colors.textMuted} size={18} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar ejercicio..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <X color={colors.textMuted} size={18} />
          </TouchableOpacity>
        )}
        <View style={styles.searchDivider} />
        <TouchableOpacity onPress={() => setIsFilterModalVisible(true)} style={styles.filterTrigger}>
          <SlidersHorizontal color={hasActiveFilters ? colors.primaryDark : colors.textMuted} size={20} />
          {hasActiveFilters && <View style={styles.filterBadge} />}
        </TouchableOpacity>
      </View>

      {/* Counter + Clear */}
      <View style={styles.counterRow}>
        <Text style={styles.counterText}>
          {exercises.length} ejercicio{exercises.length !== 1 ? 's' : ''}
          {hasActiveFilters ? ' encontrados' : ''}
        </Text>
        {hasActiveFilters && (
          <TouchableOpacity style={styles.clearBtn} onPress={clearAllFilters}>
            <X color={colors.error} size={14} />
            <Text style={styles.clearBtnText}>Limpiar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* List */}
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
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyTitle}>No se encontraron ejercicios</Text>
              <Text style={styles.emptySubtitle}>Intenta ajustar los filtros</Text>
            </View>
          }
        />
      )}

      {/* Filter Modal */}
      <ExerciseFilterModal
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        groups={groups}
        selectedGroup={selectedGroup}
        onSelectGroup={setSelectedGroup}
        equipments={equipments}
        selectedEquipment={selectedEquipment}
        onSelectEquipment={setSelectedEquipment}
        selectedDifficulty={selectedDifficulty}
        onSelectDifficulty={setSelectedDifficulty}
      />
    </>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Ejercicios</Text>
        {myListExercises.length > 0 && (
          <View style={styles.listBadge}>
            <Text style={styles.listBadgeText}>{myListExercises.length}</Text>
          </View>
        )}
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'explorar' && styles.tabActive]}
          onPress={() => setActiveTab('explorar')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'explorar' && styles.tabTextActive]}>Explorar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'mi_rutina' && styles.tabActive]}
          onPress={() => setActiveTab('mi_rutina')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'mi_rutina' && styles.tabTextActive]}>Mi Rutina</Text>
          {myListExercises.length > 0 && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>{myListExercises.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {activeTab === 'explorar' ? renderExplorar() : <MyWorkoutView />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16, marginTop: 10 },
  title: { fontSize: 24, fontWeight: '800', color: colors.secondary, flex: 1 },
  listBadge: { 
    width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  listBadgeText: { fontSize: 13, fontWeight: '800', color: colors.secondary },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: colors.card,
    borderRadius: 30,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
    gap: 6,
  },
  tabActive: {
    backgroundColor: colors.secondary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: { fontSize: 15, fontWeight: '600', color: colors.textSecondary },
  tabTextActive: { color: colors.primary, fontWeight: '700' },
  tabBadge: {
    width: 20, height: 20, borderRadius: 10, backgroundColor: colors.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  tabBadgeText: { fontSize: 11, fontWeight: '800', color: colors.secondary },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    marginHorizontal: 20,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
    marginBottom: 16,
  },
  searchInput: { flex: 1, fontSize: 16, color: colors.secondary },
  searchDivider: { width: 1, height: 24, backgroundColor: colors.border, marginHorizontal: 4 },
  filterTrigger: { padding: 4, position: 'relative' },
  filterBadge: {
    position: 'absolute', top: 2, right: 2,
    width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primaryDark,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  counterText: { fontSize: 13, color: colors.textMuted, fontWeight: '600' },
  clearBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  clearBtnText: { fontSize: 13, color: colors.error, fontWeight: '600' },
  listContent: { paddingHorizontal: 20, paddingBottom: 120 },
  loader: { marginTop: 40 },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.secondary, marginBottom: 4 },
  emptySubtitle: { fontSize: 14, color: colors.textSecondary },
});
