import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, LayoutAnimation, Platform, UIManager, TextInput, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  UserCircle, Settings, Bell, Watch, HelpCircle, 
  LogOut, ChevronRight, Edit3, Flame, Droplet, Target, BarChart2,
  Calendar, Activity, Scale, Ruler, User
} from 'lucide-react-native';
import { colors } from '../src/theme/colors';
import { useAuthStore } from '../src/stores/authStore';
import { useAppStore } from '../src/stores/appStore';
import { useAuth } from '../src/features/auth/useAuth';
import { authService } from '../src/services/authService';
import { UserGoal } from '../src/types/auth';
import { CustomAlert } from '../src/components/ui/CustomAlert';
import { LinearGradient } from 'expo-linear-gradient';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Sub-componente para el Acordeón
const AccordionItem = ({ title, isOpen, onToggle, children }: any) => {
  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity 
        style={styles.accordionHeader} 
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          onToggle();
        }}
        activeOpacity={0.7}
      >
        <Text style={styles.accordionTitle}>{title}</Text>
        <ChevronRight 
          color={colors.textMuted} 
          size={20} 
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }} 
        />
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.accordionContent}>
          {children}
        </View>
      )}
    </View>
  );
};

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useAppStore();
  
  const [activeGoal, setActiveGoal] = useState<UserGoal | null>(null);
  const [manualGoalsEnabled, setManualGoalsEnabled] = useState(false);

  // Estados de Acordeones
  const [openAccordion, setOpenAccordion] = useState<string | null>('Nutricional');

  // Estados UI Adicionales
  const [logoutAlertVisible, setLogoutAlertVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  // Estado de Biometría y Perfil Editable
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    age: '24',
    weight: '64',
    height: '170'
  });

  // Estado de Objetivos Editables
  const [goalData, setGoalData] = useState({
    calories: '2198',
    protein: '120',
    carbs: '265',
    fats: '73',
    targetWeight: '60',
    water: '2500'
  });

  const [editGoalModalVisible, setEditGoalModalVisible] = useState(false);
  const [editWeightGoalModalVisible, setEditWeightGoalModalVisible] = useState(false);
  const [editWaterModalVisible, setEditWaterModalVisible] = useState(false);
  const [bmiModalVisible, setBmiModalVisible] = useState(false);

  // IMC Calculado
  const computedBmi = React.useMemo(() => {
    const w = parseFloat(profileData.weight);
    const h = parseFloat(profileData.height) / 100;
    if (w > 0 && h > 0) {
      return (w / (h * h)).toFixed(1);
    }
    return '--';
  }, [profileData.weight, profileData.height]);

  const getBmiCategory = (bmiValue: string) => {
    const bmi = parseFloat(bmiValue);
    if (isNaN(bmi)) return { label: '-', color: colors.textMuted };
    if (bmi < 18.5) return { label: 'Bajo peso', color: '#03A9F4' };
    if (bmi < 25) return { label: 'Saludable', color: '#4CAF50' };
    if (bmi < 30) return { label: 'Sobrepeso', color: '#FFC107' };
    return { label: 'Obeso', color: '#F44336' };
  };

  const bmiCategory = getBmiCategory(computedBmi);
  
  const getBmiPosition = (bmiValue: string) => {
    const bmi = parseFloat(bmiValue);
    if (isNaN(bmi)) return 0;
    // Map BMI 15-40 to 0-100%
    const min = 15;
    const max = 40;
    const percentage = ((bmi - min) / (max - min)) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  };

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const goal = await authService.getActiveGoal();
        setActiveGoal(goal);
        if (goal) {
          setGoalData(prev => ({
            ...prev,
            calories: String(goal.dailyCalories || prev.calories),
            protein: String(goal.proteinGrams || prev.protein),
            carbs: String(goal.carbsGrams || prev.carbs),
            fats: String(goal.fatGrams || prev.fats),
            targetWeight: String(goal.targetWeightKg || prev.targetWeight)
          }));
        }
      } catch (error) {
        console.log("No se pudo cargar la meta", error);
      }
    };
    fetchGoal();
  }, []);

  const handleLogout = () => {
    setLogoutAlertVisible(true);
  };

  const confirmLogout = async () => {
    setLogoutAlertVisible(false);
    await logout();
    router.replace('/(auth)/login');
  };

  const toggleAccordion = (name: string) => {
    setOpenAccordion(openAccordion === name ? null : name);
  };

  // (Mock states replaced by profileData)

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Ajustes</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* TARJETA DE USUARIO CON MÉTRICAS */}
        <View style={styles.profileCard}>
          <TouchableOpacity style={styles.editIconBtn} onPress={() => setEditModalVisible(true)}>
            <Edit3 color={colors.textSecondary} size={18} />
          </TouchableOpacity>

          <View style={styles.profileHeaderRow}>
            <View style={[styles.profileAvatar, { backgroundColor: user?.gender?.toUpperCase() === 'FEMALE' ? '#FCE4EC' : user?.gender?.toUpperCase() === 'MALE' ? '#E3F2FD' : '#E0E0E0' }]}>
              <User 
                color={user?.gender?.toUpperCase() === 'FEMALE' ? '#E91E63' : user?.gender?.toUpperCase() === 'MALE' ? '#2196F3' : '#757575'} 
                size={32} 
              />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {`${profileData.firstName} ${profileData.lastName}`.trim().toUpperCase() || 'USUARIO CALIO'}
              </Text>
              <Text style={styles.profileEmail}>{user?.email || 'usuario@email.com'}</Text>
            </View>
          </View>

          <View style={styles.metricsGrid}>
            <View style={styles.metricBox}>
              <View style={[styles.metricIconWrapper, { backgroundColor: '#F3E5F5' }]}>
                <Calendar color="#9C27B0" size={16} />
              </View>
              <Text style={styles.metricValue}>{profileData.age || '--'}</Text>
              <Text style={styles.metricLabel}>AÑOS</Text>
            </View>
            
            <TouchableOpacity style={styles.metricBox} onPress={() => setBmiModalVisible(true)}>
              <View style={[styles.metricIconWrapper, { backgroundColor: '#E8F5E9' }]}>
                <Activity color="#4CAF50" size={16} />
              </View>
              <Text style={styles.metricValue}>{computedBmi}</Text>
              <Text style={styles.metricLabel}>IMC</Text>
            </TouchableOpacity>
            
            <View style={styles.metricBox}>
              <View style={[styles.metricIconWrapper, { backgroundColor: '#FFF3E0' }]}>
                <Scale color="#FF9800" size={16} />
              </View>
              <Text style={styles.metricValue}>{profileData.weight || '--'}</Text>
              <Text style={styles.metricLabel}>KG</Text>
            </View>
            
            <View style={styles.metricBox}>
              <View style={[styles.metricIconWrapper, { backgroundColor: '#E3F2FD' }]}>
                <Ruler color="#2196F3" size={16} />
              </View>
              <Text style={styles.metricValue}>{profileData.height || '--'}</Text>
              <Text style={styles.metricLabel}>CM</Text>
            </View>
          </View>
        </View>

        {/* ACCESO RÁPIDO A MI PROGRESO */}
        <TouchableOpacity 
          style={styles.progressCard}
          onPress={() => router.push('/(tabs)/stats')}
        >
          <View style={styles.progressIconWrapper}>
            <BarChart2 color={colors.secondary} size={20} />
          </View>
          <View style={styles.progressTextWrapper}>
            <Text style={styles.progressTitle}>Mi Progreso</Text>
            <Text style={styles.progressSubtitle}>Estadísticas y gráficos</Text>
          </View>
          <ChevronRight color={colors.textMuted} size={20} />
        </TouchableOpacity>

        {/* SECCIÓN OBJETIVOS (ACORDEONES) */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>OBJETIVOS</Text>

          <AccordionItem 
            title="Nutricional" 
            isOpen={openAccordion === 'Nutricional'} 
            onToggle={() => toggleAccordion('Nutricional')}
          >
            <View style={styles.goalRow}>
              <View style={styles.goalIconWrapper}>
                <Flame color="#FF9800" size={24} fill="#FFE0B2" />
              </View>
              <View style={styles.goalInfo}>
                <Text style={styles.goalMainValue}>
                  {Number(goalData.calories).toLocaleString('es-ES')} kcal
                </Text>
                <Text style={styles.goalSubValue}>
                  <Text style={{ color: colors.protein }}>{goalData.protein}g</Text> prot ·{' '}
                  <Text style={{ color: colors.carbs }}>{goalData.carbs}g</Text> carbs ·{' '}
                  <Text style={{ color: colors.fat }}>{goalData.fats}g</Text> grasa
                </Text>
              </View>
              <TouchableOpacity onPress={() => setEditGoalModalVisible(true)} style={{ padding: 8 }}>
                <Edit3 color={colors.textMuted} size={18} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.switchRow}>
              <View style={styles.switchLabelRow}>
                <Settings color={colors.textMuted} size={16} />
                <Text style={styles.switchLabel}>Metas manuales</Text>
              </View>
              <Switch
                value={manualGoalsEnabled}
                onValueChange={setManualGoalsEnabled}
                trackColor={{ false: colors.border, true: colors.secondary }}
                thumbColor={colors.white}
              />
            </View>
          </AccordionItem>

          <View style={styles.divider} />

          <AccordionItem 
            title="Peso" 
            isOpen={openAccordion === 'Peso'} 
            onToggle={() => toggleAccordion('Peso')}
          >
            <TouchableOpacity style={styles.actionButton} onPress={() => setEditWeightGoalModalVisible(true)}>
              <Target color={colors.textMuted} size={18} />
              <Text style={styles.actionButtonText}>
                {goalData.targetWeight ? `Objetivo: ${goalData.targetWeight} kg` : 'Establecer objetivo de peso'}
              </Text>
            </TouchableOpacity>
          </AccordionItem>

          <View style={styles.divider} />

          <AccordionItem 
            title="Hidratación" 
            isOpen={openAccordion === 'Hidratación'} 
            onToggle={() => toggleAccordion('Hidratación')}
          >
            <View style={styles.goalRow}>
              <View style={[styles.goalIconWrapper, { backgroundColor: '#E3F2FD' }]}>
                <Droplet color="#2196F3" size={24} fill="#90CAF9" />
              </View>
              <View style={styles.goalInfo}>
                <Text style={styles.goalMainValue}>{goalData.water} ml</Text>
              </View>
              <TouchableOpacity onPress={() => setEditWaterModalVisible(true)} style={{ padding: 8 }}>
                <Edit3 color={colors.textMuted} size={18} />
              </TouchableOpacity>
            </View>
          </AccordionItem>
        </View>

        {/* OTRAS SECCIONES (Preferencias) */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>PREFERENCIAS</Text>
          <View style={styles.simpleMenuItem}>
            <Text style={styles.simpleMenuText}>Modo Oscuro</Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.simpleMenuItem}>
            <Text style={styles.simpleMenuText}>Centro de Ayuda</Text>
            <ChevronRight color={colors.textMuted} size={20} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut color={colors.error} size={20} />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Calio v1.0.0</Text>
      </ScrollView>

      {/* Alerta de Cierre de Sesión */}
      <CustomAlert
        visible={logoutAlertVisible}
        title="Cerrar sesión"
        message="¿Estás seguro de que quieres salir de tu cuenta?"
        type="confirm"
        confirmText="Salir"
        cancelText="Cancelar"
        onConfirm={confirmLogout}
        onCancel={() => setLogoutAlertVisible(false)}
      />

      {/* Modal de Edición de Perfil */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Perfil</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)} style={styles.modalCloseBtn}>
                <Text style={styles.modalCloseText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalForm}>
              <Text style={styles.inputLabel}>Nombre</Text>
              <TextInput
                style={styles.inputField}
                value={profileData.firstName}
                onChangeText={(text) => setProfileData(prev => ({ ...prev, firstName: text }))}
                placeholder="Tu nombre"
              />
              
              <Text style={styles.inputLabel}>Apellido</Text>
              <TextInput
                style={styles.inputField}
                value={profileData.lastName}
                onChangeText={(text) => setProfileData(prev => ({ ...prev, lastName: text }))}
                placeholder="Tu apellido"
              />

              <View style={styles.rowInputs}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.inputLabel}>Edad</Text>
                  <TextInput
                    style={styles.inputField}
                    value={profileData.age}
                    onChangeText={(text) => setProfileData(prev => ({ ...prev, age: text }))}
                    keyboardType="numeric"
                    placeholder="24"
                  />
                </View>
                <View style={{ flex: 1, marginHorizontal: 4 }}>
                  <Text style={styles.inputLabel}>Peso (kg)</Text>
                  <TextInput
                    style={styles.inputField}
                    value={profileData.weight}
                    onChangeText={(text) => setProfileData(prev => ({ ...prev, weight: text }))}
                    keyboardType="numeric"
                    placeholder="64"
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.inputLabel}>Altura (cm)</Text>
                  <TextInput
                    style={styles.inputField}
                    value={profileData.height}
                    onChangeText={(text) => setProfileData(prev => ({ ...prev, height: text }))}
                    keyboardType="numeric"
                    placeholder="170"
                  />
                </View>
              </View>

              <TouchableOpacity 
                style={styles.saveBtn}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.saveBtnText}>Guardar cambios</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de Edición de Meta Nutricional */}
      <Modal visible={editGoalModalVisible} transparent animationType="slide" onRequestClose={() => setEditGoalModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Meta Nutricional</Text>
              <TouchableOpacity onPress={() => setEditGoalModalVisible(false)} style={styles.modalCloseBtn}>
                <Text style={styles.modalCloseText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalForm}>
              <Text style={styles.inputLabel}>Calorías (kcal)</Text>
              <TextInput
                style={styles.inputField}
                value={goalData.calories}
                onChangeText={(text) => setGoalData(prev => ({ ...prev, calories: text }))}
                keyboardType="numeric"
              />
              <Text style={styles.inputLabel}>Proteínas (g)</Text>
              <TextInput
                style={styles.inputField}
                value={goalData.protein}
                onChangeText={(text) => setGoalData(prev => ({ ...prev, protein: text }))}
                keyboardType="numeric"
              />
              <Text style={styles.inputLabel}>Carbohidratos (g)</Text>
              <TextInput
                style={styles.inputField}
                value={goalData.carbs}
                onChangeText={(text) => setGoalData(prev => ({ ...prev, carbs: text }))}
                keyboardType="numeric"
              />
              <Text style={styles.inputLabel}>Grasas (g)</Text>
              <TextInput
                style={styles.inputField}
                value={goalData.fats}
                onChangeText={(text) => setGoalData(prev => ({ ...prev, fats: text }))}
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.saveBtn} onPress={() => setEditGoalModalVisible(false)}>
                <Text style={styles.saveBtnText}>Guardar meta</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de Edición de Peso Objetivo */}
      <Modal visible={editWeightGoalModalVisible} transparent animationType="slide" onRequestClose={() => setEditWeightGoalModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Objetivo de Peso</Text>
              <TouchableOpacity onPress={() => setEditWeightGoalModalVisible(false)} style={styles.modalCloseBtn}>
                <Text style={styles.modalCloseText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalForm}>
              <Text style={styles.inputLabel}>Peso deseado (kg)</Text>
              <TextInput
                style={styles.inputField}
                value={goalData.targetWeight}
                onChangeText={(text) => setGoalData(prev => ({ ...prev, targetWeight: text }))}
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.saveBtn} onPress={() => setEditWeightGoalModalVisible(false)}>
                <Text style={styles.saveBtnText}>Guardar peso</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Edición de Hidratación */}
      <Modal visible={editWaterModalVisible} transparent animationType="slide" onRequestClose={() => setEditWaterModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Meta de Hidratación</Text>
              <TouchableOpacity onPress={() => setEditWaterModalVisible(false)} style={styles.modalCloseBtn}>
                <Text style={styles.modalCloseText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalForm}>
              <Text style={styles.inputLabel}>Agua diaria (ml)</Text>
              <TextInput
                style={styles.inputField}
                value={goalData.water}
                onChangeText={(text) => setGoalData(prev => ({ ...prev, water: text }))}
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.saveBtn} onPress={() => setEditWaterModalVisible(false)}>
                <Text style={styles.saveBtnText}>Guardar hidratación</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal IMC (Diseño Personalizado) */}
      <Modal visible={bmiModalVisible} transparent animationType="fade" onRequestClose={() => setBmiModalVisible(false)}>
        <Pressable style={styles.bmiModalOverlay} onPress={() => setBmiModalVisible(false)}>
          <Pressable style={styles.bmiModalContent} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.bmiTitle}>Tu IMC</Text>
            
            <View style={styles.bmiHeaderRow}>
              <Text style={styles.bmiValue}>{computedBmi}</Text>
              <View style={styles.bmiBadgeWrapper}>
                <Text style={styles.bmiSubText}>"Tu peso es "</Text>
                <View style={[styles.bmiBadge, { backgroundColor: bmiCategory.color }]}>
                  <Text style={styles.bmiBadgeText}>{bmiCategory.label}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.bmiHelpIcon}>
                <HelpCircle color={colors.textSecondary} size={20} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.bmiBarContainer}>
              <LinearGradient
                colors={['#03A9F4', '#4CAF50', '#FFC107', '#F44336']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.bmiGradientBar}
              />
              <View 
                style={[styles.bmiMarker, { left: `${getBmiPosition(computedBmi)}%` }]} 
              />
            </View>

            <View style={styles.bmiLegend}>
              <View style={styles.bmiLegendItem}>
                <View style={[styles.bmiLegendDot, { backgroundColor: '#03A9F4' }]} />
                <Text style={styles.bmiLegendText}>Bajo peso</Text>
              </View>
              <View style={styles.bmiLegendItem}>
                <View style={[styles.bmiLegendDot, { backgroundColor: '#4CAF50' }]} />
                <Text style={styles.bmiLegendText}>Saludable</Text>
              </View>
              <View style={styles.bmiLegendItem}>
                <View style={[styles.bmiLegendDot, { backgroundColor: '#FFC107' }]} />
                <Text style={styles.bmiLegendText}>Sobrepeso</Text>
              </View>
              <View style={styles.bmiLegendItem}>
                <View style={[styles.bmiLegendDot, { backgroundColor: '#F44336' }]} />
                <Text style={styles.bmiLegendText}>Obeso</Text>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  header: { 
    paddingHorizontal: 20, 
    paddingTop: 10,
    paddingBottom: 20, 
  },
  title: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: colors.secondary 
  },
  content: { 
    paddingHorizontal: 20,
    paddingBottom: 40 
  },
  
  // PROFILE CARD
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  editIconBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInitials: { 
    fontSize: 22, 
    fontWeight: '800', 
    color: colors.white 
  },
  profileInfo: { 
    flex: 1 
  },
  profileName: { 
    fontSize: 16, 
    fontWeight: '800', 
    color: colors.secondary, 
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  profileEmail: { 
    fontSize: 13, 
    color: colors.textSecondary 
  },
  
  // METRICS GRID
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  metricBox: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.secondary,
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 1,
  },

  // MI PROGRESO CARD
  progressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  progressIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F2EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  progressTextWrapper: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: 2,
  },
  progressSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },

  // SECTIONS
  sectionContainer: {
    backgroundColor: colors.card,
    borderRadius: 24,
    paddingVertical: 20,
    marginBottom: 24,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: { 
    fontSize: 11, 
    fontWeight: '800', 
    color: colors.textMuted, 
    marginBottom: 16, 
    marginLeft: 20, 
    letterSpacing: 1.2,
  },
  divider: { 
    height: 1, 
    backgroundColor: colors.border, 
    marginHorizontal: 20,
  },

  // ACCORDIONS
  accordionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  accordionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.secondary,
  },
  accordionContent: {
    paddingTop: 8,
    paddingBottom: 16,
  },

  // OBJETIVOS CONTENT
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  goalInfo: {
    flex: 1,
  },
  goalMainValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.secondary,
    marginBottom: 4,
  },
  goalSubValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  switchLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  // SIMPLE MENU ITEMS
  simpleMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  simpleMenuText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.secondary,
  },

  // LOGOUT
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#FFF0F0',
    marginBottom: 24,
  },
  logoutText: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: colors.error, 
    marginLeft: 8 
  },
  versionText: { 
    textAlign: 'center', 
    fontSize: 13, 
    color: colors.textMuted, 
    marginBottom: 20 
  },
  
  // MODAL STYLES
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.secondary,
  },
  modalCloseBtn: {
    padding: 8,
  },
  modalCloseText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  modalForm: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  inputField: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: colors.secondary,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveBtn: {
    backgroundColor: colors.primaryDark,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 32,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.white,
  },

  // BMI MODAL
  bmiModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  bmiModalContent: {
    backgroundColor: colors.card,
    borderRadius: 24,
    width: '100%',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  bmiTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: 8,
  },
  bmiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  bmiValue: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.secondary,
    marginRight: 8,
  },
  bmiBadgeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bmiSubText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 4,
  },
  bmiBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bmiBadgeText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 12,
  },
  bmiHelpIcon: {
    padding: 4,
  },
  bmiBarContainer: {
    position: 'relative',
    height: 32,
    justifyContent: 'center',
    marginBottom: 24,
  },
  bmiGradientBar: {
    height: 8,
    borderRadius: 4,
    width: '100%',
  },
  bmiMarker: {
    position: 'absolute',
    width: 3,
    height: 24,
    backgroundColor: '#000',
    borderRadius: 2,
    transform: [{ translateX: -1.5 }],
  },
  bmiLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  bmiLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bmiLegendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  bmiLegendText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  }
});
