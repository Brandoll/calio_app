import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';

interface MuscleGroupFilterProps {
  groups: string[];
  selectedGroup: string | null;
  onSelectGroup: (group: string | null) => void;
}

// Emoji por grupo muscular
const groupEmojis: Record<string, string> = {
  pecho: '🫁',
  espalda: '🔙',
  piernas: '🦵',
  hombros: '💪',
  brazos: '💪',
  core: '🎯',
};

const getEmoji = (group: string) => groupEmojis[group?.toLowerCase()] || '🏋️';

const capitalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

export const MuscleGroupFilter: React.FC<MuscleGroupFilterProps> = ({ groups, selectedGroup, onSelectGroup }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>Grupo muscular</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity 
          style={[styles.chip, selectedGroup === null && styles.chipSelected]}
          onPress={() => onSelectGroup(null)}
        >
          <Text style={styles.chipEmoji}>🔥</Text>
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
            <Text style={styles.chipEmoji}>{getEmoji(group)}</Text>
            <Text style={[styles.chipText, selectedGroup === group && styles.chipTextSelected]}>
              {capitalize(group)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  sectionLabel: { 
    fontSize: 13, 
    fontWeight: '700', 
    color: colors.textSecondary, 
    marginBottom: 10, 
    paddingHorizontal: 20,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scrollContent: { paddingHorizontal: 20, gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  chipSelected: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  chipEmoji: { fontSize: 16 },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  chipTextSelected: { color: colors.primary, fontWeight: '700' },
});
