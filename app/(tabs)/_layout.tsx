import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Home, Dumbbell, Camera, UtensilsCrossed, User } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // El diseño de la imagen no tiene textos
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 30 : 25,
          marginHorizontal: 25, // Deja espacio a los lados
          backgroundColor: '#FFFFFF',
          borderRadius: 40, // Forma de píldora
          height: 70,
          paddingBottom: 0, // Elimina el padding de iOS que empuja los iconos hacia arriba
          paddingTop: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 15,
          elevation: 5,
          borderTopWidth: 0,
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
              <Home size={24} color={focused ? '#000000' : '#A0A0A0'} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
              <Dumbbell size={24} color={focused ? '#000000' : '#A0A0A0'} />
            </View>
          ),
        }}
      />
      
      {/* Botón Flotante Central (Cámara) */}
      <Tabs.Screen
        name="ai-camera"
        options={{
          tabBarIcon: () => (
            <View style={styles.floatingButtonContainer}>
              <View style={styles.floatingButton}>
                <Camera size={30} color="#9DFF20" />
              </View>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="foods"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
              <UtensilsCrossed size={24} color={focused ? '#000000' : '#A0A0A0'} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
              <User size={24} color={focused ? '#000000' : '#A0A0A0'} />
            </View>
          ),
        }}
      />
      {/* Oculto de la barra inferior pero accesible por navegación */}
      <Tabs.Screen
        name="stats"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerFocused: {
    backgroundColor: '#F0F0F0', // Fondo gris claro cuando está activo como en la imagen
  },
  floatingButtonContainer: {
    top: -20, // Sobresale de la barra
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  floatingButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#111111', // Negro oscuro
    justifyContent: 'center',
    alignItems: 'center',
  }
});
