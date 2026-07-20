import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { ChefHat } from 'lucide-react-native';
import { colors } from '../../theme/colors';

interface RecipeModalProps {
  visible: boolean;
  recipe: any;
  onClose: () => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ visible, recipe, onClose }) => {
  if (!recipe) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.recipeModalOverlay}>
        <View style={styles.recipeModalContainer}>
          <View style={styles.recipeModalHeader}>
            <Text style={styles.recipeModalTitle}>¡Tu Receta!</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.recipeScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.recipeIconContainer}>
              <ChefHat size={48} color={colors.primaryDark} />
            </View>
            <Text style={styles.recipeTitle}>{recipe.titulo || recipe.title}</Text>
            <Text style={styles.recipeDescription}>{recipe.descripcion || recipe.description}</Text>

            <Text style={styles.sectionTitle}>Macros Estimados</Text>
            <View style={styles.macrosContainer}>
              <View style={styles.macroBox}>
                <Text style={styles.macroValue}>{recipe.macros?.calorias || 0}</Text>
                <Text style={styles.macroLabel}>Kcal</Text>
              </View>
              <View style={[styles.macroBox, { backgroundColor: 'rgba(255, 75, 75, 0.1)' }]}>
                <Text style={[styles.macroValue, { color: '#FF4B4B' }]}>{recipe.macros?.proteinas || 0}g</Text>
                <Text style={styles.macroLabel}>Pro</Text>
              </View>
              <View style={[styles.macroBox, { backgroundColor: 'rgba(255, 184, 0, 0.1)' }]}>
                <Text style={[styles.macroValue, { color: '#FFB800' }]}>{recipe.macros?.carbohidratos || 0}g</Text>
                <Text style={styles.macroLabel}>Carb</Text>
              </View>
              <View style={[styles.macroBox, { backgroundColor: 'rgba(0, 128, 255, 0.1)' }]}>
                <Text style={[styles.macroValue, { color: '#0080FF' }]}>{recipe.macros?.grasas || 0}g</Text>
                <Text style={styles.macroLabel}>Gra</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Ingredientes</Text>
            {(recipe.ingredientes || recipe.ingredients || []).map((ing: string, i: number) => (
              <Text key={`ing-${i}`} style={styles.listItem}>• {ing}</Text>
            ))}

            <Text style={styles.sectionTitle}>Pasos</Text>
            {(recipe.pasos || recipe.steps || []).map((paso: string, i: number) => (
              <Text key={`step-${i}`} style={styles.listItem}>{i + 1}. {paso}</Text>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  recipeModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  recipeModalContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: '90%',
    padding: 24,
  },
  recipeModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  recipeModalTitle: { fontSize: 24, fontWeight: '800', color: colors.primaryDark },
  closeText: { fontSize: 16, color: colors.textSecondary, fontWeight: '600' },
  recipeScroll: { flex: 1 },
  recipeIconContainer: { alignItems: 'center', marginVertical: 20 },
  recipeTitle: { fontSize: 28, fontWeight: '800', color: colors.secondary, textAlign: 'center', marginBottom: 12 },
  recipeDescription: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', marginBottom: 24, lineHeight: 22 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.secondary, marginTop: 24, marginBottom: 16 },
  macrosContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  macroBox: { flex: 1, backgroundColor: colors.card, padding: 12, borderRadius: 16, marginHorizontal: 4, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  macroValue: { fontSize: 16, fontWeight: '800', color: colors.secondary, marginBottom: 4 },
  macroLabel: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  listItem: { fontSize: 15, color: colors.textSecondary, marginBottom: 12, lineHeight: 22 },
});
