import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { CircularProgress } from '../ui/CircularProgress';

export interface MacroInfoData {
  title: string;
  current: number;
  total: number;
  color: string;
  Icon: any;
  description: string;
  unit?: string;
}

interface MacroInfoModalProps {
  visible: boolean;
  onClose: () => void;
  data: MacroInfoData | null;
}

export const MacroInfoModal: React.FC<MacroInfoModalProps> = ({ visible, onClose, data }) => {
  if (!data) return null;

  const { title, current, total, color, Icon, description, unit = '' } = data;
  const progress = total > 0 ? (current / total) * 100 : 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{title}</Text>

          <View style={styles.contentContainer}>
            {/* Lado Izquierdo: Gráfico y Valores */}
            <View style={styles.leftSide}>
              <View style={styles.valuesContainer}>
                <Text style={styles.currentValue}>{Math.round(current)}</Text>
                <Text style={styles.totalValue}> /{Math.round(total)}</Text>
              </View>
              <Text style={styles.subtitle}>{title}</Text>
              
              <View style={styles.circleContainer}>
                <CircularProgress
                  size={90}
                  strokeWidth={8}
                  progress={progress}
                  color={color}
                  backgroundColor={colors.background}
                >
                  <Icon color={color} size={36} />
                </CircularProgress>
              </View>
            </View>

            {/* Divisor Vertical */}
            <View style={styles.divider} />

            {/* Lado Derecho: Descripción */}
            <View style={styles.rightSide}>
              <Text style={styles.descriptionTitle}>¿Para qué sirve?</Text>
              <Text style={styles.descriptionText}>{description}</Text>
            </View>
          </View>

          {/* Botón Entendido */}
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: color }]} 
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Entendido</Text>
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
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.secondary,
    marginBottom: 20,
  },
  contentContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  leftSide: {
    flex: 1,
    alignItems: 'center',
  },
  valuesContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  currentValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.secondary,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textMuted,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  circleContainer: {
    backgroundColor: 'rgba(240, 240, 240, 0.4)',
    borderRadius: 45, // Mitad del size (90)
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
  rightSide: {
    flex: 1.2,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  }
});
