import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { X, Plus, Minus, Droplet, GlassWater } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { CircularProgress } from '../ui/CircularProgress';

interface WaterModalProps {
  visible: boolean;
  onClose: () => void;
  currentGlasses: number;
  goalGlasses: number;
  onChangeWater: (amount: number) => void;
  isAdding: boolean;
}

export const WaterModal: React.FC<WaterModalProps> = ({
  visible,
  onClose,
  currentGlasses,
  goalGlasses,
  onChangeWater,
  isAdding
}) => {
  // Lógica de ML y Porcentaje
  const currentMl = currentGlasses * 250;
  const goalMl = goalGlasses * 250;
  const fillPercentage = Math.min(Math.round((currentMl / goalMl) * 100), 100);

  // Renderizador de filas (Vaso / Botella)
  const renderItemRow = (
    title: string, 
    ml: number, 
    Icon: any, 
    glassesAmount: number, 
    addedCount: number
  ) => (
    <View style={styles.itemRow}>
      <View style={styles.itemInfo}>
        <Icon color="#4facfe" size={32} />
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemTitle}>{title}</Text>
          <Text style={styles.itemSubtitle}>{ml}ml</Text>
        </View>
      </View>
      <View style={styles.itemControls}>
        <TouchableOpacity 
          style={[styles.circleButton, styles.minusButton, (isAdding || currentGlasses < glassesAmount) && styles.disabled]}
          onPress={() => onChangeWater(-glassesAmount)}
          disabled={isAdding || currentGlasses < glassesAmount}
        >
          <Minus color="#A0A0A0" size={24} />
        </TouchableOpacity>
        
        {/* Usamos un contador visual simple basado en la proporción, aunque la app mide el total de vasos */}
        <Text style={styles.itemCount}>{addedCount}</Text>
        
        <TouchableOpacity 
          style={[styles.circleButton, styles.plusButton, isAdding && styles.disabled]}
          onPress={() => onChangeWater(glassesAmount)}
          disabled={isAdding}
        >
          <Plus color="#FFFFFF" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );

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
            <View style={styles.headerSpacer} />
            <Text style={styles.title}>Hidratación</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
              <X size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Círculo Principal */}
          <View style={styles.circleContainer}>
            <CircularProgress
              size={200}
              strokeWidth={8}
              progress={fillPercentage}
              color="#3498db"
              backgroundColor="#E1F5FE"
            >
              <Text style={styles.percentageText}>{fillPercentage}%</Text>
            </CircularProgress>
          </View>

          {/* Píldora de Mililitros */}
          <View style={styles.mlPill}>
            <Text style={styles.mlPillText}>{currentMl} / {goalMl} ml</Text>
          </View>

          {/* Opciones de Agregar */}
          <View style={styles.optionsContainer}>
            {/* Si sumamos todo, 1 vaso = 250ml. Si tenemos currentGlasses, podemos decir que todos son vasos para simplificar la cuenta en UI */}
            {renderItemRow('Vaso', 250, GlassWater, 1, currentGlasses)}
            
            {/* Como la base de datos no distingue vasos vs botellas, solo mostramos 0 o la cantidad de "botellas" que caben */}
            {renderItemRow('Botella', 500, Droplet, 2, Math.floor(currentGlasses / 2))}
          </View>

          {/* Botón de Cerrar */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
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
  headerSpacer: {
    width: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.secondary,
  },
  closeIcon: {
    padding: 4,
  },
  circleContainer: {
    marginBottom: 20,
  },
  percentageText: {
    fontSize: 48,
    fontWeight: '800',
    color: '#4facfe',
  },
  mlPill: {
    backgroundColor: colors.background,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 30,
  },
  mlPillText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondary,
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 20,
    gap: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 20,
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTextContainer: {
    marginLeft: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.secondary,
  },
  itemSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
  },
  itemControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  circleButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  minusButton: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  plusButton: {
    backgroundColor: '#4facfe',
  },
  itemCount: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.secondary,
    minWidth: 16,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  closeButton: {
    width: '100%',
    backgroundColor: '#41C4FF', // Azul claro estilo imagen
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
  }
});
