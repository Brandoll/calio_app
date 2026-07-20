import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, ShoppingCart, Plus, Heart, ShoppingBasket } from 'lucide-react-native';
import { colors } from '../../../src/theme/colors';
import { foodService } from '../../../src/services/foodService';
import { Food, FoodCategory } from '../../../src/types/food';
import { CategoryFilter } from '../../../src/components/foods/CategoryFilter';
import { FoodCard } from '../../../src/components/foods/FoodCard';
import { useRouter } from 'expo-router';
import { useBasketStore } from '../../../src/stores/basketStore';

export default function FoodsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [foods, setFoods] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'explorar' | 'mis_recetas'>('explorar');
  const [favoritesMap, setFavoritesMap] = useState<Record<number, boolean>>({});
  
  const { items: basketItems } = useBasketStore();
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const { addItem: addBasketItem, removeItem: removeBasketItem } = useBasketStore();

  useEffect(() => {
    loadData();
  }, [selectedCategory, activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (categories.length === 0) {
        const cats = await foodService.getCategories();
        setCategories(cats);
      }
      
      const favs = await foodService.getFavorites();
      const favMap: Record<number, boolean> = {};
      favs.forEach(f => { favMap[f.id] = true; });
      setFavoritesMap(favMap);

      let items: Food[] = [];
      if (activeTab === 'mis_recetas') {
        items = favs;
        if (search) {
          items = items.filter(f => f.nombre.toLowerCase().includes(search.toLowerCase()));
        }
        if (selectedCategory) {
          const catName = categories.find(c => c.id === selectedCategory)?.nombre;
          items = items.filter(f => f.categoria === catName);
        }
      } else {
        items = await foodService.getAll(search, selectedCategory || undefined);
      }
      
      setFoods(items.map(f => ({ ...f, esFavorito: !!favMap[f.id] })));
    } catch (error) {
      console.error('Error loading foods:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const openFoodSheet = (food: Food) => {
    setSelectedFood(food);
    setIsSheetVisible(true);
  };

  const closeFoodSheet = () => {
    setIsSheetVisible(false);
    setSelectedFood(null);
  };

  const handleToggleFavorite = async (food: Food) => {
    const isFav = !!food.esFavorito;
    const newStatus = !isFav;
    
    setFoods(prev => prev.map(f => f.id === food.id ? { ...f, esFavorito: newStatus } : f));
    if (selectedFood?.id === food.id) {
      setSelectedFood({ ...selectedFood, esFavorito: newStatus });
    }

    try {
      if (isFav) {
        await foodService.removeFavorite(food.id);
      } else {
        await foodService.addFavorite(food.id);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setFoods(prev => prev.map(f => f.id === food.id ? { ...f, esFavorito: isFav } : f));
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
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/(tabs)/foods/basket')}>
            <ShoppingCart color={colors.secondary} size={24} />
            {basketItems.length > 0 && (
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>{basketItems.length}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Plus color={colors.secondary} size={24} />
          </TouchableOpacity>
        </View>
      </View>

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
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <FoodCard 
              food={item} 
              isFavorite={!!item.esFavorito}
              onFavoritePress={() => handleToggleFavorite(item)}
              onPress={() => openFoodSheet(item)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No se encontraron alimentos</Text>
            </View>
          }
        />
      )}

      {/* Bottom Sheet Modal */}
      <Modal visible={isSheetVisible} animationType="slide" transparent={true} onRequestClose={closeFoodSheet}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalDismiss} onPress={closeFoodSheet} activeOpacity={1} />
          
          <View style={styles.sheetContainer}>
            <View style={styles.sheetIndicator} />
            
            {selectedFood && (
              <>
                <Text style={styles.sheetTitle}>{selectedFood.nombre}</Text>
                <Text style={styles.sheetCategory}>{selectedFood.categoria} • {selectedFood.porcionRef || '100g'}</Text>
                
                <View style={styles.sheetMacros}>
                  <View style={styles.sheetMacroItem}>
                    <Text style={[styles.sheetMacroValue, { color: colors.primaryDark }]}>
                      {Math.round(selectedFood.energiaKcal || 0)} kcal
                    </Text>
                    <Text style={styles.sheetMacroLabel}>Energía</Text>
                  </View>
                  <View style={styles.sheetMacroItem}>
                    <Text style={[styles.sheetMacroValue, { color: '#FF4B4B' }]}>{Math.round(selectedFood.proteinasG || 0)}g</Text>
                    <Text style={styles.sheetMacroLabel}>Proteína</Text>
                  </View>
                  <View style={styles.sheetMacroItem}>
                    <Text style={[styles.sheetMacroValue, { color: '#FFB800' }]}>{Math.round(selectedFood.carbohidratosTotalesG || 0)}g</Text>
                    <Text style={styles.sheetMacroLabel}>Carbs</Text>
                  </View>
                  <View style={styles.sheetMacroItem}>
                    <Text style={[styles.sheetMacroValue, { color: '#0080FF' }]}>{Math.round(selectedFood.grasaTotalG || 0)}g</Text>
                    <Text style={styles.sheetMacroLabel}>Grasas</Text>
                  </View>
                </View>

                <View style={styles.sheetActions}>
                  <TouchableOpacity 
                    style={[styles.sheetButton, styles.sheetFavoriteButton]} 
                    onPress={() => {
                      handleToggleFavorite(selectedFood);
                    }}
                  >
                    <Heart 
                      color={selectedFood.esFavorito ? "#FF4B4B" : colors.secondary} 
                      size={24} 
                      fill={selectedFood.esFavorito ? "#FF4B4B" : "transparent"} 
                    />
                    <Text style={styles.sheetButtonTextSecondary}>
                      {selectedFood.esFavorito ? 'Favorito' : 'Guardar'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.sheetButton, styles.sheetBasketButton]} 
                    onPress={() => {
                      const exists = basketItems.some(i => i.id === selectedFood.id);
                      if (exists) {
                        removeBasketItem(selectedFood.id);
                      } else {
                        addBasketItem(selectedFood);
                      }
                    }}
                  >
                    <ShoppingBasket color={colors.background} size={24} />
                    <Text style={styles.sheetButtonTextPrimary}>
                      {basketItems.some(i => i.id === selectedFood.id) ? 'Quitar de cesta' : 'Añadir a la cesta'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

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
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  loader: { marginTop: 40 },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: colors.textSecondary, fontSize: 16 },
  badgeContainer: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF4B4B',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalDismiss: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  sheetIndicator: {
    width: 40,
    height: 5,
    backgroundColor: colors.border,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.secondary,
    marginBottom: 4,
  },
  sheetCategory: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  sheetMacros: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sheetMacroItem: {
    alignItems: 'center',
  },
  sheetMacroValue: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  sheetMacroLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  sheetActions: {
    flexDirection: 'row',
    gap: 12,
  },
  sheetButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 16,
    gap: 8,
  },
  sheetFavoriteButton: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sheetBasketButton: {
    backgroundColor: colors.secondary,
    flex: 1.5,
  },
  sheetButtonTextSecondary: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.secondary,
  },
  sheetButtonTextPrimary: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.background,
  },
});
