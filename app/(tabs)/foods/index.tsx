import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, ShoppingCart, Plus } from 'lucide-react-native';
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
  const [activeTab, setActiveTab] = useState<'explorar' | 'mis_recetas'>('explorar');
  const [favoritesMap, setFavoritesMap] = useState<Record<number, boolean>>({});

  useEffect(() => {
    loadData();
  }, [selectedCategory, activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Cargar categorías si no existen
      if (categories.length === 0) {
        const cats = await foodService.getCategories();
        setCategories(cats);
      }
      
      // Obtener lista de favoritos actuales para marcar los corazones
      const favs = await foodService.getFavorites();
      const favMap: Record<number, boolean> = {};
      favs.forEach(f => { favMap[f.id] = true; });
      setFavoritesMap(favMap);

      // Cargar alimentos según la pestaña
      let items: Food[] = [];
      if (activeTab === 'mis_recetas') {
        // Para "Mis Alimentos", usamos los favoritos
        // Y aplicamos los filtros localmente ya que el endpoint de favoritos no soporta busqueda (asumiendo)
        items = favs;
        if (search) {
          items = items.filter(f => f.nombre.toLowerCase().includes(search.toLowerCase()));
        }
        if (selectedCategory) {
          items = items.filter(f => {
            // El backend retorna categoria (string). Habría que ver como filtrar por ID de categoría en favoritos
            // Por simplicidad, obtenemos el nombre de la categoría seleccionada
            const catName = categories.find(c => c.id === selectedCategory)?.nombre;
            return f.categoria === catName;
          });
        }
      } else {
        items = await foodService.getAll(search, selectedCategory || undefined);
      }
      
      setFoods(items);
    } catch (error) {
      console.error('Error loading foods:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    loadData();
  };

  const toggleFavorite = async (food: Food) => {
    const isFav = favoritesMap[food.id];
    
    // Actualización optimista
    setFavoritesMap(prev => ({ ...prev, [food.id]: !isFav }));
    
    // Si estamos en la pestaña de favoritos y desmarcamos uno, lo quitamos de la lista
    if (activeTab === 'mis_recetas' && isFav) {
      setFoods(prev => prev.filter(f => f.id !== food.id));
    }

    try {
      if (isFav) {
        await foodService.removeFavorite(food.id);
      } else {
        await foodService.addFavorite(food.id);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revertir optimista
      setFavoritesMap(prev => ({ ...prev, [food.id]: isFav }));
      if (activeTab === 'mis_recetas' && isFav) {
        loadData(); // Recargar completo para estar seguros
      }
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Alimentos</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <ShoppingCart color={colors.secondary} size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Plus color={colors.secondary} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs (Toggle) */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'explorar' && styles.tabActive]}
          onPress={() => setActiveTab('explorar')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'explorar' && styles.tabTextActive]}>Explorar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'mis_recetas' && styles.tabActive]}
          onPress={() => setActiveTab('mis_recetas')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'mis_recetas' && styles.tabTextActive]}>Mis Alimentos</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Search color={colors.textMuted} size={20} style={styles.searchIcon} />
        <TextInput 
          style={styles.searchInput}
          placeholder="Buscar alimentos..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
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
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <FoodCard 
              food={item} 
              isFavorite={favoritesMap[item.id] || false}
              onFavoritePress={() => toggleFavorite(item)}
              onPress={() => router.push(`/(tabs)/foods/${item.id}`)}
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
  container: { 
    flex: 1, 
    backgroundColor: colors.background, 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 10,
  },
  title: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: colors.secondary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: colors.card,
    borderRadius: 30,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 26,
  },
  tabActive: {
    backgroundColor: colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.secondary,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    marginHorizontal: 20,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 16, color: colors.secondary },
  listContent: { paddingHorizontal: 14, paddingBottom: 100 },
  columnWrapper: { justifyContent: 'space-between' },
  loader: { marginTop: 40 },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: colors.textSecondary, fontSize: 16 },
});
