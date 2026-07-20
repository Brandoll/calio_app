import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';

interface EquipmentFilterProps {
  equipments: string[];
  selectedEquipment: string | null;
  onSelectEquipment: (equipment: string | null) => void;
}

const equipEmojis: Record<string, string> = {
  ninguno: '🤸',
  mancuernas: '🏋️',
  mancuerna: '🏋️',
  barra: '🪨',
  maquina: '⚙️',
  banda: '🔗',
  cable: '🔌',
  kettlebell: '🔔',
  'sin equipo': '🤸',
};

const getEmoji = (eq: string) => equipEmojis[eq?.toLowerCase()] || '🏋️';

const capitalize = (s: string) => {
  if (!s) return 'Sin equipo';
  if (s.toLowerCase() === 'ninguno') return 'Sin equipo';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const EquipmentFilter: React.FC<EquipmentFilterProps> = ({ equipments, selectedEquipment, onSelectEquipment }) => {
  if (equipments.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>Equipo</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity 
          style={[styles.chip, selectedEquipment === null && styles.chipSelected]}
          onPress={() => onSelectEquipment(null)}
        >
          <Text style={styles.chipEmoji}>🔥</Text>
          <Text style={[styles.chipText, selectedEquipment === null && styles.chipTextSelected]}>
            Cualquiera
          </Text>
        </TouchableOpacity>

        {equipments.map((eq) => (
          <TouchableOpacity 
            key={eq} 
            style={[styles.chip, selectedEquipment === eq && styles.chipSelected]}
            onPress={() => onSelectEquipment(eq)}
          >
            <Text style={styles.chipEmoji}>{getEmoji(eq)}</Text>
            <Text style={[styles.chipText, selectedEquipment === eq && styles.chipTextSelected]}>
              {capitalize(eq)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
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
