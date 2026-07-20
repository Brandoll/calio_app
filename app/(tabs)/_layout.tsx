import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Home, Dumbbell, Camera, UtensilsCrossed, User } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarShowLabel: true,
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 30 : 20,
          left: 20,
          right: 20,
          elevation: 10,
          backgroundColor: colors.white,
          borderRadius: 30,
          height: 70,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
          borderTopWidth: 0,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          title: 'Ejercicios',
          tabBarIcon: ({ color, size }) => <Dumbbell size={24} color={color} />,
        }}
      />
      
      {/* Botón Flotante Central */}
      <Tabs.Screen
        name="ai-camera"
        options={{
          title: 'Cámara',
          tabBarLabel: () => null, // Ocultar el texto para que resalte el botón
          tabBarIcon: ({ focused }) => (
            <View style={styles.floatingButtonContainer}>
              <View style={[styles.floatingButton, focused && styles.floatingButtonFocused]}>
                <Camera size={28} color={colors.white} />
              </View>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="foods"
        options={{
          title: 'Comida',
          tabBarIcon: ({ color, size }) => <UtensilsCrossed size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'Cuenta',
          tabBarIcon: ({ color, size }) => <User size={24} color={color} />,
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
  floatingButtonContainer: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  floatingButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.background, // Da el efecto de separación
  },
  floatingButtonFocused: {
    backgroundColor: colors.primaryDark,
    transform: [{ scale: 1.05 }],
  }
});
