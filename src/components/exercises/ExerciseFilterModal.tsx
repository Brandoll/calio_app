import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, SlidersHorizontal } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { MuscleGroupFilter } from './MuscleGroupFilter';
import { EquipmentFilter } from './EquipmentFilter';

interface ExerciseFilterModalProps {
  visible: boolean;
  onClose: () => void;
  groups: string[];
  selectedGroup: string | null;
  onSelectGroup: (g: string | null) => void;
  equipments: string[];
  selectedEquipment: string | null;
  onSelectEquipment: (e: string | null) => void;
  selectedDifficulty: string | null;
  onSelectDifficulty: (d: string | null) => void;
}

const DIFFICULTY_OPTIONS = ['principiante', 'intermedio', 'avanzado'];

export const ExerciseFilterModal: React.FC<ExerciseFilterModalProps> = ({
  visible,
  onClose,
  groups,
  selectedGroup,
  onSelectGroup,
  equipments,
  selectedEquipment,
  onSelectEquipment,
  selectedDifficulty,
  onSelectDifficulty,
}) => {

  const clearAll = () => {
    onSelectGroup(null);
    onSelectEquipment(null);
    onSelectDifficulty(null);
  };

  const hasActiveFilters = selectedGroup || selectedEquipment || selectedDifficulty;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.sheetContainer} edges={['bottom']}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <SlidersHorizontal color={colors.secondary} size={20} />
              <Text style={styles.title}>Filtros</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X color={colors.secondary} size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Grupo Muscular */}
            <MuscleGroupFilter
              groups={groups}
              selectedGroup={selectedGroup}
              onSelectGroup={onSelectGroup}
            />

            <View style={styles.divider} />

            {/* Equipo */}
            <EquipmentFilter
              equipments={equipments}
              selectedEquipment={selectedEquipment}
              onSelectEquipment={onSelectEquipment}
            />

            <View style={styles.divider} />

            {/* Dificultad */}
            <View style={styles.diffFilterContainer}>
              <Text style={styles.filterLabel}>DIFICULTAD</Text>
              <View style={styles.diffRow}>
                {DIFFICULTY_OPTIONS.map((dif) => {
                  const isActive = selectedDifficulty === dif;
                  const diffColor = dif === 'principiante' ? '#4CAF50' : dif === 'intermedio' ? '#FFC107' : '#FF5252';
                  return (
                    <TouchableOpacity
                      key={dif}
                      style={[styles.diffChip, isActive && { backgroundColor: diffColor, borderColor: diffColor }]}
                      onPress={() => onSelectDifficulty(isActive ? null : dif)}
                    >
                      <View style={[styles.diffDot, { backgroundColor: isActive ? '#fff' : diffColor }]} />
                      <Text style={[styles.diffChipText, isActive && { color: '#fff' }]}>
                        {dif.charAt(0).toUpperCase() + dif.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            {hasActiveFilters && (
              <TouchableOpacity style={styles.clearBtn} onPress={clearAll}>
                <Text style={styles.clearBtnText}>Limpiar</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={[styles.applyBtn, !hasActiveFilters && { flex: 1 }]} onPress={onClose}>
              <Text style={styles.applyBtnText}>Ver resultados</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.secondary,
  },
  closeBtn: {
    padding: 4,
  },
  content: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 20,
    marginVertical: 4, // Filters already have their own bottom margins
  },
  diffFilterContainer: { 
    paddingHorizontal: 20, 
    marginBottom: 24,
    marginTop: 10,
  },
  filterLabel: {
    fontSize: 13, fontWeight: '700', color: colors.textSecondary,
    marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5,
  },
  diffRow: { flexDirection: 'row', gap: 8 },
  diffChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 5,
  },
  diffDot: { width: 8, height: 8, borderRadius: 4 },
  diffChipText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16, // Extra safe area space added automatically by SafeAreaView
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 12,
    backgroundColor: colors.background,
  },
  clearBtn: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.error,
  },
  applyBtn: {
    flex: 1,
    backgroundColor: colors.secondary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  applyBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
  },
});
