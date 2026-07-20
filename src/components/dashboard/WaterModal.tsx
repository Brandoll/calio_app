import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, Easing } from 'react-native';
import { X, Plus, Droplets } from 'lucide-react-native';
import { colors } from '../../theme/colors';

interface WaterModalProps {
  visible: boolean;
  onClose: () => void;
  currentGlasses: number;
  goalGlasses: number;
  onAddGlass: () => void;
  isAdding: boolean;
}

export const WaterModal: React.FC<WaterModalProps> = ({
  visible,
  onClose,
  currentGlasses,
  goalGlasses,
  onAddGlass,
  isAdding
}) => {
  // Animación para el nivel del agua
  const fillAnimation = useRef(new Animated.Value(0)).current;

  // Calculamos el porcentaje de llenado (0 a 1)
  const fillPercentage = Math.min(currentGlasses / goalGlasses, 1);

  useEffect(() => {
    if (visible) {
      Animated.timing(fillAnimation, {
        toValue: fillPercentage,
        duration: 800, // 800ms de animación suave
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false, // height no soporta useNativeDriver
      }).start();
    } else {
      // Resetear al cerrar para que anime al volver a abrir si se quiere
      fillAnimation.setValue(fillPercentage);
    }
  }, [visible, currentGlasses, goalGlasses]);

  // Interpolamos de 0 a 100% de la altura del vaso
  const waterHeight = fillAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%']
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>¡Mantente Hidratado!</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Vaso y Animación */}
          <View style={styles.glassContainer}>
            <View style={styles.glass}>
              {/* Agua animada */}
              <Animated.View style={[styles.waterFill, { height: waterHeight }]} />
              
              {/* Medidor visual superpuesto */}
              <View style={styles.glassMarks}>
                <Droplets color="rgba(255,255,255,0.8)" size={40} />
              </View>
            </View>
          </View>

          {/* Estadísticas */}
          <Text style={styles.statsText}>
            <Text style={styles.highlight}>{currentGlasses}</Text> de {goalGlasses} vasos
          </Text>
          
          <Text style={styles.subtitle}>
            {(currentGlasses >= goalGlasses) 
              ? '¡Meta diaria alcanzada! 🎉' 
              : `Te faltan ${goalGlasses - currentGlasses} vasos para tu meta.`}
          </Text>

          {/* Botón de añadir */}
          <TouchableOpacity 
            style={[styles.addButton, isAdding && styles.addButtonDisabled]} 
            onPress={onAddGlass}
            disabled={isAdding}
          >
            <Plus color={colors.white} size={28} />
            <Text style={styles.addButtonText}>
              {isAdding ? 'Registrando...' : 'Añadir Vaso'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Fondo oscuro
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 24,
    width: '100%',
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.secondary,
  },
  closeButton: {
    padding: 4,
  },
  glassContainer: {
    height: 220,
    width: 140,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 30,
  },
  glass: {
    width: 120,
    height: 200,
    borderWidth: 4,
    borderColor: '#E0E0E0', // Borde del vaso
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    backgroundColor: 'rgba(240, 248, 255, 0.5)', // Tono ligero azul cielo para el vaso vacío
  },
  waterFill: {
    width: '100%',
    backgroundColor: '#3498db', // Azul agua vibrante
    position: 'absolute',
    bottom: 0,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  glassMarks: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  statsText: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  highlight: {
    color: '#3498db',
    fontWeight: '800',
    fontSize: 32,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 30,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#3498db',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: '100%',
  },
  addButtonDisabled: {
    opacity: 0.7,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 12,
  }
});
