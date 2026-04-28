import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from '../types';

const STORAGE_KEY = 'amex_tracker_state';
const ONBOARDING_KEY = 'amex_tracker_onboarded';

export async function loadAppState(): Promise<AppState | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AppState;
  } catch {
    return null;
  }
}

export async function saveAppState(state: AppState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export async function getOnboarded(): Promise<boolean> {
  const v = await AsyncStorage.getItem(ONBOARDING_KEY);
  return v === 'true';
}

export async function setOnboarded(): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
}
