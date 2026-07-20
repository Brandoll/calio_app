import { Tabs } from 'expo-router';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Home, Dumbbell, Camera, UtensilsCrossed, User } from 'lucide-react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  // Filtramos los tabs normales en el orden deseado
  const orderedRouteNames = ['index', 'exercises', 'foods', 'more'];
  const normalTabs = orderedRouteNames.map(name => state.routes.find(r => r.name === name)).filter(Boolean) as typeof state.routes;
  const cameraRoute = state.routes.find(r => r.name === 'ai-camera');

  return (
    <View style={styles.tabBarWrapper}>
      {/* Píldora Blanca para los 4 iconos */}
      <View style={styles.pillContainer}>
        {normalTabs.map((route, index) => {
          const isFocused = state.index === state.routes.findIndex(r => r.key === route.key);
          
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          let Icon = Home;
          if (route.name === 'exercises') Icon = Dumbbell;
          if (route.name === 'foods') Icon = UtensilsCrossed;
          if (route.name === 'more') Icon = User;

          return (
            <TouchableOpacity key={route.key} onPress={onPress} style={styles.tabItem}>
              <View style={[styles.iconContainer, isFocused && styles.iconContainerFocused]}>
                <Icon size={24} color={isFocused ? '#000000' : '#A0A0A0'} />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Botón de Cámara Separado a la derecha */}
      {cameraRoute && (
        <TouchableOpacity
          style={styles.cameraButtonWrapper}
          onPress={() => {
            navigation.navigate(cameraRoute.name);
          }}
        >
          <View style={styles.cameraButton}>
            <Camera size={28} color="#9DFF20" />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="exercises" />
      <Tabs.Screen name="ai-camera" />
      <Tabs.Screen name="foods" />
      <Tabs.Screen name="more" />
      <Tabs.Screen name="stats" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 35 : 25,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Separa el pill de la cámara
  },
  pillContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    height: 70,
    borderRadius: 35,
    marginRight: 15, // Espacio entre la píldora y la cámara
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
    justifyContent: 'space-around', // Espaciado equitativo
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30, // Redondo perfecto
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // Asegura que el fondo no sea cuadrado en algunos dispositivos
  },
  iconContainerFocused: {
    backgroundColor: '#F0F0F0',
  },
  cameraButtonWrapper: {
    // Wrapper para el botón
  },
  cameraButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  }
});
