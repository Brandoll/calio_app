import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Camera } from 'lucide-react-native';
import { colors } from '../../../src/theme/colors';
import { foodService } from '../../../src/services/foodService';
import { Food, FoodCategory } from '../../../src/types/food';
import { CategoryFilter } from '../../../src/components/foods/CategoryFilter';
import { FoodCard } from '../../../src/components/foods/FoodCard';
import { useRouter } from 'expo-router';

export default function FoodsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [foods, setFoods] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for initial rendering if backend is not available
  const mockCategories = [
    { id: 1, nombre: 'Frutas' },
    { id: 2, nombre: 'Verduras' },
    { id: 3, nombre: 'Carnes' },
    { id: 4, nombre: 'Cereales' },
  ];

  const mockFoods: Food[] = [
    { id: 1, nombre: 'Manzana', categoria: 'Frutas', calorias: 52, proteinas: 0.3, carbohidratos: 14, grasas: 0.2 },
    { id: 2, nombre: 'Pechuga de pollo', categoria: 'Carnes', calorias: 165, proteinas: 31, carbohidratos: 0, grasas: 3.6 },
    { id: 3, nombre: 'Arroz integral', categoria: 'Cereales', calorias: 111, proteinas: 2.6, carbohidratos: 23, grasas: 0.9 },
  ];

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Intenta obtener del backend
      const cats = await foodService.getCategories();
      setCategories(cats.length > 0 ? cats : mockCategories);
      
      const items = await foodService.getAll(search, selectedCategory || undefined);
      setFoods(items.length > 0 ? items : mockFoods);
    } catch (error) {
      // Fallback a mock data
      setCategories(mockCategories);
      setFoods(mockFoods);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    loadData();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Alimentos</Text>
        <View style={styles.headerActions}>
          <Camera color={colors.secondary} size={24} />
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Search color={colors.textMuted} size={20} style={styles.searchIcon} />
        <TextInput 
          style={styles.searchInput}
          placeholder="Busca un alimento..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
        />
      </View>

      <CategoryFilter 
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={foods}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <FoodCard 
              food={item} 
              onPress={() => router.push(`/(tabs)/foods/${item.id}`)}
              onAdd={() => console.log('Añadir a comida')}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No se encontraron alimentos</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: { fontSize: 24, fontWeight: '800', color: colors.secondary },
  headerActions: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: colors.secondary },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  loader: { marginTop: 40 },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: colors.textSecondary, fontSize: 16 },
});
