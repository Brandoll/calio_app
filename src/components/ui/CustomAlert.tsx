import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { CheckCircle, AlertTriangle, XCircle, Trash2 } from 'lucide-react-native';
import { colors } from '../../theme/colors';

export type AlertType = 'success' | 'error' | 'warning' | 'confirm' | 'delete';

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  type: AlertType;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const CustomAlert = ({
  visible,
  title,
  message,
  type,
  onConfirm,
  onCancel,
  confirmText = 'Aceptar',
  cancelText = 'Cancelar'
}: CustomAlertProps) => {

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle color={colors.success} size={48} />;
      case 'error': return <XCircle color={colors.error} size={48} />;
      case 'warning': return <AlertTriangle color={colors.warning} size={48} />;
      case 'confirm': return <AlertTriangle color={colors.primaryDark} size={48} />;
      case 'delete': return <Trash2 color={colors.error} size={48} />;
      default: return null;
    }
  };

  const getConfirmColor = () => {
    switch (type) {
      case 'delete': return colors.error;
      case 'error': return colors.error;
      default: return colors.primaryDark;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel || onConfirm}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          
          <View style={styles.iconContainer}>
            {getIcon()}
          </View>
          
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonsRow}>
            {(type === 'confirm' || type === 'delete') && onCancel && (
              <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                <Text style={styles.cancelText}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[
                styles.confirmButton, 
                { backgroundColor: getConfirmColor() },
                (type !== 'confirm' && type !== 'delete') ? { flex: 1 } : {}
              ]} 
              onPress={onConfirm}
            >
              <Text style={styles.confirmText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
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
    padding: 24,
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
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.secondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.white,
  }
});
