import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';

interface EquipmentFilterProps {
  equipments: string[];
  selectedEquipment: string | null;
  onSelectEquipment: (equipment: string | null) => void;
}

export const EquipmentFilter: React.FC<EquipmentFilterProps> = ({ equipments, selectedEquipment, onSelectEquipment }) => {
  if (equipments.length === 0) return null;

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity 
          style={[styles.chip, selectedEquipment === null && styles.chipSelected]}
          onPress={() => onSelectEquipment(null)}
        >
          <Text style={[styles.chipText, selectedEquipment === null && styles.chipTextSelected]}>
            Cualquier Equipo
          </Text>
        </TouchableOpacity>

        {equipments.map((eq) => (
          <TouchableOpacity 
            key={eq} 
            style={[styles.chip, selectedEquipment === eq && styles.chipSelected]}
            onPress={() => onSelectEquipment(eq)}
          >
            <Text style={[styles.chipText, selectedEquipment === eq && styles.chipTextSelected]}>
              {eq}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  scrollContent: { paddingHorizontal: 20, gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  chipText: { fontSize: 13, fontWeight: '500', color: colors.textSecondary },
  chipTextSelected: { color: colors.background, fontWeight: '700' },
});
