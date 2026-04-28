import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius } from '../constants/theme';

interface Props {
  percentage: number;
  color?: string;
  height?: number;
}

export function ProgressBar({ percentage, color = colors.green, height = 8 }: Props) {
  const clamped = Math.max(0, Math.min(100, percentage));
  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }]}>
      <View
        style={[
          styles.fill,
          {
            width: `${clamped}%`,
            backgroundColor: color,
            borderRadius: height / 2,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: colors.graySoft,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
