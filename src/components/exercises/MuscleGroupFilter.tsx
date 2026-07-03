import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';

interface MuscleGroupFilterProps {
  groups: string[];
  selectedGroup: string | null;
  onSelectGroup: (group: string | null) => void;
}

export const MuscleGroupFilter: React.FC<MuscleGroupFilterProps> = ({ groups, selectedGroup, onSelectGroup }) => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity 
          style={[styles.chip, selectedGroup === null && styles.chipSelected]}
          onPress={() => onSelectGroup(null)}
        >
          <Text style={[styles.chipText, selectedGroup === null && styles.chipTextSelected]}>
            Todos
          </Text>
        </TouchableOpacity>

        {groups.map((group) => (
          <TouchableOpacity 
            key={group} 
            style={[styles.chip, selectedGroup === group && styles.chipSelected]}
            onPress={() => onSelectGroup(group)}
          >
            <Text style={[styles.chipText, selectedGroup === group && styles.chipTextSelected]}>
              {group}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 16 },
  scrollContent: { paddingHorizontal: 20, gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 14, fontWeight: '500', color: colors.textSecondary },
  chipTextSelected: { color: colors.secondary, fontWeight: '700' },
});
