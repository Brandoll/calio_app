import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  UserCircle, Settings, Bell, Watch, HelpCircle, 
  LogOut, ChevronRight, Scale 
} from 'lucide-react-native';
import { colors } from '../../src/theme/colors';
import { useAuthStore } from '../../src/stores/authStore';
import { useAppStore } from '../../src/stores/appStore';
import { useAuth } from '../../src/features/auth/useAuth';

export default function MoreScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useAppStore();

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro de que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Salir', 
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        }
      }
    ]);
  };

  const renderMenuItem = (icon: any, title: string, subtitle?: string, showArrow = true, onPress?: () => void) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIconContainer}>
        {icon}
      </View>
      <View style={styles.menuTextContainer}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      {showArrow && <ChevronRight color={colors.textMuted} size={20} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Más</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Summary */}
        <TouchableOpacity style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileInitials}>
              {user?.nombre?.charAt(0) || 'U'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.nombre || 'Usuario'}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'usuario@email.com'}</Text>
          </View>
          <ChevronRight color={colors.textMuted} size={20} />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Mi Cuenta</Text>
        <View style={styles.section}>
          {renderMenuItem(<Scale color={colors.secondary} size={22} />, 'Medidas Corporales', 'Peso, altura, perímetros')}
          <View style={styles.divider} />
          {renderMenuItem(<UserCircle color={colors.secondary} size={22} />, 'Datos Personales', 'Edad, género, actividad')}
          <View style={styles.divider} />
          {renderMenuItem(<Bell color={colors.secondary} size={22} />, 'Notificaciones', 'Recordatorios de agua y comidas')}
        </View>

        <Text style={styles.sectionTitle}>Integraciones</Text>
        <View style={styles.section}>
          {renderMenuItem(<Watch color={colors.secondary} size={22} />, 'Dispositivos y Apps', 'Apple Health, Google Fit')}
        </View>

        <Text style={styles.sectionTitle}>Preferencias</Text>
        <View style={styles.section}>
          <View style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Settings color={colors.secondary} size={22} />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Modo Oscuro</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
          <View style={styles.divider} />
          {renderMenuItem(<HelpCircle color={colors.secondary} size={22} />, 'Centro de Ayuda', 'Preguntas frecuentes')}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut color={colors.error} size={20} />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Calio v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '800', color: colors.secondary },
  content: { padding: 20 },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: colors.border,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInitials: { fontSize: 24, fontWeight: '800', color: colors.secondary },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: '700', color: colors.secondary, marginBottom: 4 },
  profileEmail: { fontSize: 14, color: colors.textSecondary },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.textSecondary, marginBottom: 12, marginLeft: 4, textTransform: 'uppercase' },
  section: {
    backgroundColor: colors.card,
    borderRadius: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuTextContainer: { flex: 1 },
  menuTitle: { fontSize: 16, fontWeight: '600', color: colors.secondary },
  menuSubtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.border, marginLeft: 72 },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFF0F0',
    marginBottom: 24,
  },
  logoutText: { fontSize: 16, fontWeight: '700', color: colors.error, marginLeft: 8 },
  versionText: { textAlign: 'center', fontSize: 13, color: colors.textMuted, marginBottom: 40 },
});
