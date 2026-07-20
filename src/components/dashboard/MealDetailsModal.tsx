import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, Alert } from 'react-native';
import { X, Trash2, Flame } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { MealRecord } from '../../types/tracking';
import { API_BASE_URL } from '../../constants/api';

interface MealDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  meal: MealRecord | null;
  onDelete?: (id: number) => void;
}

export const MealDetailsModal = ({ visible, onClose, meal, onDelete }: MealDetailsModalProps) => {
  if (!meal) return null;

  const handleDelete = () => {
    Alert.alert(
      "Eliminar Comida",
      "¿Estás seguro de que deseas eliminar esta comida? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: () => {
            if (onDelete && meal.id) {
              onDelete(meal.id);
              onClose();
            }
          }
        }
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          
          {/* Header con Imagen */}
          <View style={styles.imageContainer}>
            {meal.imageUrl ? (
              <Image 
                source={{ uri: meal.imageUrl.startsWith('file://') ? meal.imageUrl : `${API_BASE_URL}${meal.imageUrl}` }} 
                style={styles.image} 
              />
            ) : (
              <View style={[styles.image, styles.placeholderImage]}>
                <Text style={styles.placeholderText}>{meal.nombre.charAt(0).toUpperCase()}</Text>
              </View>
            )}
            
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X color={colors.secondary} size={24} />
            </TouchableOpacity>

            <View style={styles.badgeCal}>
              <Flame color="#FF8A00" size={20} fill="#FF8A00" />
              <Text style={styles.badgeCalText}>{Math.round(meal.calorias)} kcal</Text>
            </View>
          </View>

          {/* Información */}
          <View style={styles.infoSection}>
            <Text style={styles.title}>{meal.nombre}</Text>
            <Text style={styles.subtitle}>{meal.tipoComida} • {meal.hora ? meal.hora.substring(0, 5) : ''}</Text>

            <View style={styles.macrosContainer}>
              <View style={styles.macroBox}>
                <Text style={[styles.macroValue, { color: '#FF4B4B' }]}>{Math.round(meal.proteinas)}g</Text>
                <Text style={styles.macroLabel}>Proteínas</Text>
              </View>
              <View style={styles.macroBox}>
                <Text style={[styles.macroValue, { color: '#85C872' }]}>{Math.round(meal.carbohidratos)}g</Text>
                <Text style={styles.macroLabel}>Carbohidratos</Text>
              </View>
              <View style={styles.macroBox}>
                <Text style={[styles.macroValue, { color: '#0080FF' }]}>{Math.round(meal.grasas)}g</Text>
                <Text style={styles.macroLabel}>Grasas</Text>
              </View>
            </View>

            {/* Botón Eliminar */}
            {onDelete && meal.id && (
              <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
                <Trash2 color={colors.error} size={20} />
                <Text style={styles.deleteBtnText}>Eliminar registro</Text>
              </TouchableOpacity>
            )}
          </View>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
    minHeight: '60%',
  },
  imageContainer: {
    width: '100%',
    height: 250,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 80,
    fontWeight: '800',
    color: colors.textMuted,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: colors.white,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  badgeCal: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  badgeCalText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.secondary,
  },
  infoSection: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.secondary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
    textTransform: 'capitalize',
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    padding: 20,
    borderRadius: 20,
    marginBottom: 30,
  },
  macroBox: {
    alignItems: 'center',
    flex: 1,
  },
  macroValue: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  macroLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 18,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFEBEA',
    backgroundColor: '#FFF0F0',
  },
  deleteBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.error,
  }
});
