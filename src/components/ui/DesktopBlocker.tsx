import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { colors } from '../../theme/colors';

export const DesktopBlocker = ({ children }: { children: React.ReactNode }) => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [url, setUrl] = useState('https://calio.app'); // Default URL

  useEffect(() => {
    const checkIsDesktop = () => {
      if (Platform.OS === 'web') {
        const width = Dimensions.get('window').width;
        // Obtenemos el User-Agent para verificar si es un navegador de escritorio
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
        
        // Bloqueamos si la pantalla es ancha (> 768px) Y el user agent no es de móvil
        if (width > 768 && !isMobileDevice) {
          setIsDesktop(true);
          setUrl(window.location.href);
        } else {
          setIsDesktop(false);
        }
      }
    };

    checkIsDesktop();

    if (Platform.OS === 'web') {
      const subscription = Dimensions.addEventListener('change', checkIsDesktop);
      return () => subscription?.remove();
    }
  }, []);

  if (isDesktop) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Calio es exclusivo para móviles</Text>
          <Text style={styles.subtitle}>
            Escanea este código QR con la cámara de tu celular para continuar usando la aplicación de forma óptima.
          </Text>
          <View style={styles.qrContainer}>
            <QRCode value={url} size={200} backgroundColor="#ffffff" color="#000000" />
          </View>
          <Text style={styles.linkText}>{url}</Text>
        </View>
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.secondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  qrContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  linkText: {
    fontSize: 14,
    color: colors.primaryDark,
    textAlign: 'center',
    fontWeight: '500',
  }
});
