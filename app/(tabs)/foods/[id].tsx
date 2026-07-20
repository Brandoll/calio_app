import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Heart, Plus } from 'lucide-react-native';
import { colors } from '../../../src/theme/colors';
import { Food } from '../../../src/types/food';
import { foodService } from '../../../src/services/foodService';
import { NutritionInfo } from '../../../src/components/foods/NutritionInfo';

export default function FoodDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [food, setFood] = useState<Food | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadFood();
  }, [id]);

  const loadFood = async () => {
    setIsLoading(true);
    try {
      const data = await foodService.getById(parseInt(id));
      setFood(data);
    } catch (error) {
      // Mock fallback
      setFood({
        id: parseInt(id),
        nombre: 'Manzana',
        categoria: 'Frutas',
        calorias: 52,
        proteinas: 0.3,
        carbohidratos: 14,
        grasas: 0.2,
        fibra: 2.4,
        indiceGlucemico: 36,
        porcion: '1 unidad mediana (182g)',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await foodService.removeFavorite(food!.id);
      } else {
        await foodService.addFavorite(food!.id);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.log('Error favorite', error);
    }
  };

  if (isLoading || !food) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft color={colors.secondary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle</Text>
        <TouchableOpacity style={styles.backButton} onPress={toggleFavorite}>
          <Heart color={isFavorite ? colors.error : colors.secondary} size={24} fill={isFavorite ? colors.error : 'transparent'} />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          {food.imagen ? (
            <Image source={{ uri: food.imagen }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>{food.nombre.charAt(0)}</Text>
            </View>
          )}
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.name}>{food.nombre}</Text>
          <Text style={styles.category}>{food.categoria}</Text>
        </View>

        <Text style={styles.portionText}>Porción: {food.porcion || '100g'}</Text>

        <NutritionInfo 
          calories={food.energiaKcal}
          protein={food.proteinasG}
          carbs={food.carbohidratosTotalesG}
          fat={food.grasaTotalG}
          fiber={food.fibraDietariaG}
        />
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.mealSelector}>
          {['desayuno', 'almuerzo', 'cena', 'snack'].map((type) => (
            <TouchableOpacity 
              key={type} 
              style={[styles.mealOption, mealType === type && styles.mealOptionSelected]}
              onPress={() => setMealType(type)}
            >
              <Text style={[styles.mealOptionText, mealType === type && styles.mealOptionTextSelected]}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => console.log('Adding', {
          id: food.id,
          nombre: food.nombre,
          calorias: food.energiaKcal,
          proteinas: food.proteinasG,
          carbohidratos: food.carbohidratosTotalesG,
          grasas: food.grasaTotalG,
        })}>
          <Text style={styles.addButtonText}>Añadir a {mealType}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: colors.secondary },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  headerRight: { width: 40 },
  imageContainer: { width: '100%', height: 250, backgroundColor: colors.card, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: '100%' },
  placeholderText: { fontSize: 80, fontWeight: '800', color: colors.textMuted },
  content: { padding: 20 },
  title: { fontSize: 28, fontWeight: '800', color: colors.secondary, marginBottom: 8 },
  category: { fontSize: 16, color: colors.textSecondary, marginBottom: 24 },
  nutritionCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  nutritionTitle: { fontSize: 18, fontWeight: '700', color: colors.secondary, marginBottom: 16 },
  macroRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  macroLabel: { fontSize: 16, color: colors.textSecondary, fontWeight: '500' },
  macroValue: { fontSize: 16, fontWeight: '700', color: colors.secondary },
  footer: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  mealSelector: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  mealOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mealOptionSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  mealOptionText: { fontSize: 14, fontWeight: '500', color: colors.textSecondary },
  mealOptionTextSelected: { color: colors.secondary, fontWeight: '700' },
  addButton: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: { color: colors.background, fontSize: 18, fontWeight: '700' },
});
