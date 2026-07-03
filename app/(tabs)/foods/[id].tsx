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
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <ArrowLeft color={colors.secondary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle</Text>
        <TouchableOpacity style={styles.iconButton} onPress={toggleFavorite}>
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
          calories={food.calorias}
          protein={food.proteinas}
          carbs={food.carbohidratos}
          fat={food.grasas}
          fiber={food.fibra}
          glycemicIndex={food.indiceGlucemico}
        />

        <TouchableOpacity style={styles.addButton}>
          <Plus color={colors.secondary} size={20} style={{ marginRight: 8 }} />
          <Text style={styles.addButtonText}>Agregar a mi comida</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: colors.white,
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: colors.secondary },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: { padding: 20 },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    backgroundColor: colors.white,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  image: { width: '100%', height: '100%' },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.card },
  placeholderText: { fontSize: 64, fontWeight: '800', color: colors.textMuted },
  titleContainer: { marginBottom: 8 },
  name: { fontSize: 24, fontWeight: '800', color: colors.secondary, marginBottom: 4 },
  category: { fontSize: 14, color: colors.textSecondary },
  portionText: { fontSize: 14, fontWeight: '600', color: colors.primaryDark, marginBottom: 24 },
  addButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 40,
  },
  addButtonText: { fontSize: 16, fontWeight: '700', color: colors.secondary },
});
