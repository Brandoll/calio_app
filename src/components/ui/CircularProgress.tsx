import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularProgressProps {
  size: number;
  strokeWidth: number;
  progress: number; // 0 to 100
  color: string;
  backgroundColor?: string;
  children?: React.ReactNode;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  size,
  strokeWidth,
  progress,
  color,
  backgroundColor = '#F0F0F0',
  children,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  // Limitar progreso entre 0 y 100
  const validProgress = Math.min(Math.max(progress, 0), 100);
  
  const animatedProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: validProgress,
      duration: 1000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true, // true funciona para strokeDashoffset en algunos entornos, si falla, cambiar a false
    }).start();
  }, [validProgress]);

  const strokeDashoffset = animatedProgress.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      {/* SVG Container */}
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background Circle */}
        <Circle
          stroke={backgroundColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Progress Circle */}
        <AnimatedCircle
          stroke={color}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      
      {/* Center Content */}
      <View style={[StyleSheet.absoluteFill, styles.centerContent]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  svg: {
    transform: [{ rotate: '-90deg' }], // Para que empiece desde arriba (12 en punto)
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
