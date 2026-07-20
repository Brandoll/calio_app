import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Trash2, Sparkles, ChefHat } from 'lucide-react-native';
import { colors } from '../../../src/theme/colors';
import { useBasketStore } from '../../../src/stores/basketStore';
import { useAuthStore } from '../../../src/stores/authStore';
import { recipeService } from '../../../src/services/recipeService';
import { useRouter } from 'expo-router';
import { RecipeModal } from '../../../src/components/recipes/RecipeModal';

export default function BasketScreen() {
  const router = useRouter();
  const { items, removeItem, clearBasket } = useBasketStore();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<any>(null);

  const handleGenerateRecipe = async () => {
    if (items.length === 0) return;
    if (!user) {
      Alert.alert('Error', 'Debes iniciar sesión para generar recetas.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await recipeService.generateSingleRecipe({
        userId: user.id,
        ingredientes: items.map(i => i.nombre)
      });
      
      if (response && response.planJson) {
        let recipeData;
        try {
          recipeData = JSON.parse(response.planJson);
          
          // Gemini a veces devuelve el JSON dentro de un array o bloque markdown
          if (typeof recipeData === 'string') {
             recipeData = JSON.parse(recipeData.replace(/```json/g, '').replace(/```/g, ''));
          }

          setGeneratedRecipe(recipeData);
          clearBasket(); // Limpiamos la cesta tras generar con éxito
        } catch (e) {
           console.error("Error parseando receta", e);
           Alert.alert('Error', 'La receta generada tiene un formato inválido.');
        }
      } else {
        Alert.alert('Error', 'No se recibió respuesta de la IA.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema al generar la receta.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderRecipeModal = () => {
    return (
      <RecipeModal 
        visible={!!generatedRecipe} 
        recipe={generatedRecipe} 
        onClose={() => setGeneratedRecipe(null)} 
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft color={colors.secondary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Cesta</Text>
        <TouchableOpacity style={styles.backButton} onPress={clearBasket}>
           <Text style={styles.clearText}>Vaciar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay ingredientes en tu cesta.</Text>
            <Text style={styles.emptySubText}>Explora el catálogo y añade alimentos para crear una receta.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.foodItem}>
            <View style={styles.foodInfo}>
              <Text style={styles.foodName}>{item.nombre}</Text>
              <Text style={styles.foodCategory}>{item.categoria}</Text>
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={() => removeItem(item.id)}>
              <Trash2 color="#FF4B4B" size={20} />
            </TouchableOpacity>
          </View>
        )}
      />

      {items.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.generateButton} onPress={handleGenerateRecipe} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <>
                <Sparkles color={colors.background} size={20} />
                <Text style={styles.generateButtonText}>Generar Receta Mágica</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      {renderRecipeModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.secondary },
  clearText: { color: colors.error, fontWeight: '600', fontSize: 14 },
  listContainer: { padding: 20 },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  foodInfo: { flex: 1 },
  foodName: { fontSize: 16, fontWeight: '600', color: colors.secondary, marginBottom: 4 },
  foodCategory: { fontSize: 13, color: colors.textSecondary },
  deleteButton: { padding: 8, backgroundColor: 'rgba(255, 75, 75, 0.1)', borderRadius: 12 },
  emptyContainer: { alignItems: 'center', marginTop: 80, paddingHorizontal: 20 },
  emptyText: { fontSize: 18, fontWeight: '700', color: colors.secondary, marginBottom: 12 },
  emptySubText: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.background },
  generateButton: {
    backgroundColor: colors.primaryDark,
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  generateButtonText: { color: colors.background, fontSize: 16, fontWeight: '700' },
});
