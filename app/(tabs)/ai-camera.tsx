import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, UploadCloud, CheckCircle, XCircle } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { colors } from '../../src/theme/colors';
import { aiService, AiAnalysisResult } from '../../src/services/aiService';
import { trackingService } from '../../src/services/trackingService';
import { useAuthStore } from '../../src/stores/authStore';

export default function AiCameraScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [results, setResults] = useState<AiAnalysisResult | null>(null);

  const requestPermissions = async () => {
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    const libraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return cameraStatus.status === 'granted' && libraryStatus.status === 'granted';
  };

  const processImage = async (uri: string) => {
    setImageUri(uri);
    setIsAnalyzing(true);
    setResults(null);
    try {
      const data = await aiService.analyzeImage(uri);
      setResults(data);
    } catch (error: any) {
      console.error('Error analyzing image:', error);
      Alert.alert('Error', 'No se pudo analizar la imagen. Intenta de nuevo.');
      setImageUri(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return Alert.alert('Permisos requeridos', 'Necesitamos acceso a tu cámara.');
    
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      processImage(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return Alert.alert('Permisos requeridos', 'Necesitamos acceso a tu galería.');

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      processImage(result.assets[0].uri);
    }
  };

  const handleSaveMeal = async () => {
    if (!results || !user) return;
    setIsSaving(true);
    
    try {
      // Usar fecha local ajustada para evitar guardar en un día distinto al local
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      const fecha = now.toISOString().split('T')[0];
      
      const realNow = new Date(); // Para la hora usamos el original local
      const hora = realNow.toTimeString().split(' ')[0].substring(0, 5); // HH:mm
      
      let hourNumber = realNow.getHours();
      let tipoComida: 'DESAYUNO' | 'ALMUERZO' | 'CENA' | 'SNACK' = 'SNACK';
      if (hourNumber > 5 && hourNumber < 11) tipoComida = 'DESAYUNO';
      // Registramos cada item encontrado
      for (const item of results.items) {
        await trackingService.registerMeal({
          userId: user.id,
          alimentoId: 0, // Alimento no catalogado (custom)
          nombre: item.nombre,
          imageUrl: imageUri || undefined, // Guardar la URI local del teléfono
          calorias: item.calorias,
          proteinas: item.proteinas,
          grasas: item.grasas,
          carbohidratos: item.carbohidratos,
          cantidad: 100, // asumiendo base 100g para lo devuelto por la IA
          fecha,
          hora,
          tipoComida
        });
      }

      Alert.alert('¡Éxito!', 'Comida registrada correctamente.');
      router.replace('/(tabs)'); // Volver al inicio para ver los cambios
    } catch (error) {
      console.error('Error guardando comida:', error);
      Alert.alert('Error', 'No se pudo guardar la comida.');
    } finally {
      setIsSaving(false);
    }
  };

  const cancelAndRetry = () => {
    setImageUri(null);
    setResults(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {!imageUri ? (
          <>
            <View style={styles.header}>
              <Text style={styles.title}>Reconocimiento IA</Text>
              <Text style={styles.subtitle}>Toma una foto a tu comida y nuestra IA calculará las calorías y macronutrientes automáticamente.</Text>
            </View>

            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.mainAction} onPress={takePhoto}>
                <View style={styles.iconCircle}>
                  <Camera size={48} color={colors.white} />
                </View>
                <Text style={styles.actionTitle}>Tomar Foto</Text>
                <Text style={styles.actionSubtitle}>Usa la cámara de tu teléfono</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryAction} onPress={pickImage}>
                <UploadCloud size={24} color={colors.secondary} />
                <Text style={styles.secondaryActionText}>Subir desde galería</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.resultsContainer}>
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
            
            {isAnalyzing ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Analizando comida...</Text>
                <Text style={styles.loadingSub}>Nuestra IA está calculando los nutrientes</Text>
              </View>
            ) : results ? (
              <View style={styles.resultsBox}>
                <View style={styles.resultHeader}>
                  <CheckCircle color={colors.primary} size={24} />
                  <Text style={styles.resultTitle}>¡Análisis Completado!</Text>
                </View>

                {results.items.map((item, index) => (
                  <View key={index} style={styles.foodItem}>
                    <Text style={styles.foodName}>{item.nombre}</Text>
                    <Text style={styles.foodCal}>{item.calorias} kcal</Text>
                    <View style={styles.macroRow}>
                      <Text style={styles.macroText}>P: {item.proteinas}g</Text>
                      <Text style={styles.macroText}>C: {item.carbohidratos}g</Text>
                      <Text style={styles.macroText}>G: {item.grasas}g</Text>
                    </View>
                  </View>
                ))}

                <View style={styles.buttonRow}>
                  <TouchableOpacity style={styles.btnSecondary} onPress={cancelAndRetry} disabled={isSaving}>
                    <XCircle color={colors.danger || '#FF3B30'} size={20} />
                    <Text style={[styles.btnText, { color: colors.danger || '#FF3B30' }]}>Descartar</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.btnPrimary} onPress={handleSaveMeal} disabled={isSaving}>
                    {isSaving ? <ActivityIndicator color={colors.secondary} /> : <Text style={styles.btnPrimaryText}>Registrar Comida</Text>}
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.secondary,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  actionsContainer: {
    alignItems: 'center',
    gap: 24,
  },
  mainAction: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: 8,
  },
  actionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  secondaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.secondary,
  },
  resultsContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 24,
    marginBottom: 24,
  },
  loadingBox: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: colors.card,
    borderRadius: 20,
    width: '100%',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.secondary,
    marginTop: 16,
  },
  loadingSub: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  resultsBox: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.secondary,
  },
  foodItem: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  foodName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: 4,
  },
  foodCal: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryDark,
    marginBottom: 8,
  },
  macroRow: {
    flexDirection: 'row',
    gap: 12,
  },
  macroText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  btnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFEBEA',
    backgroundColor: '#FFF0F0',
    gap: 8,
  },
  btnText: {
    fontSize: 15,
    fontWeight: '600',
  },
  btnPrimary: {
    flex: 2,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  btnPrimaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.secondary,
  }
});
