import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { FoodCategory } from '../../types/food';

interface CategoryFilterProps {
  categories: FoodCategory[];
  selectedCategory: number | null;
  onSelectCategory: (id: number | null) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity 
          style={[styles.chip, selectedCategory === null && styles.chipSelected]}
          onPress={() => onSelectCategory(null)}
        >
          <Text style={[styles.chipText, selectedCategory === null && styles.chipTextSelected]}>
            Todos
          </Text>
        </TouchableOpacity>

        {categories.map((category) => (
          <TouchableOpacity 
            key={category.id} 
            style={[styles.chip, selectedCategory === category.id && styles.chipSelected]}
            onPress={() => onSelectCategory(category.id)}
          >
            <Text style={[styles.chipText, selectedCategory === category.id && styles.chipTextSelected]}>
              {category.nombre}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: '#904616', // Color marrón/naranja oscuro del diseño
    borderColor: '#904616',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
