/**
 * @module LoadingScreen
 * Boot screen that orchestrates the app startup sequence:
 * waits for the SQLite database, requests media permissions, runs the initial scan,
 * then navigates to the Home tab once unsorted items are found.
 *
 * @see {@link Loading} — the entry-point component that renders this screen
 * @see {@link scanDevicePhotos} — the thunk dispatched during boot
 */
import { DatabaseManager } from '@mas/mas-sqlite';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { scanDevicePhotos } from '../../../store';
import { useTheme } from '@mas/rn/ui';
import Logo from '@mas/rn/ui/logo/Logo';
import ProgressBar from '@mas/rn/ui/progress-bar/ProgressBar';
import { router } from 'expo-router';
import * as React from 'react';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import makeLoadingScreenStyles from './loadingScreen.style';

/** Props for {@link LoadingScreen}. */
export interface LoadingScreenProps {
  /** Optional headline text shown below the logo (e.g. `"Scanning media…"`). */
  loadingText?: string;
  /** Image source forwarded to {@link Logo}. */
  logoSource: Parameters<typeof Logo>[0]['source'];
  /** Logo display size in dp. @default `220` */
  logoSize?: number;
}

/**
 * Boot and redirect screen. Runs the startup sequence on mount and navigates
 * to `/(tabs)/HomeTab` once media items are ready.
 *
 * @param props - {@link LoadingScreenProps}
 */
export default function LoadingScreen({
  loadingText,
  logoSource,
  logoSize = 220,
}: LoadingScreenProps) {
  const { theme } = useTheme();
  const styles = makeLoadingScreenStyles(theme);
  const dispatch = useAppDispatch();

  // 1. On extrait 'unknown' au lieu de 'items'
  const { permission, isScanning, unknown, error } = useAppSelector((s) => s.mediaScan);

  /**
   * Effet de démarrage unique (Boot Sequence)
   */
  useEffect(() => {
    const bootApp = async () => {
      try {
        // A. Attendre que la DB soit prête (montée dans _layout.tsx)
        await DatabaseManager.ensureReady();

        // B. Petit délai pour la stabilité du bridge natif
        await new Promise((resolve) => setTimeout(resolve, 200));

        // C. Déclenchement du scan
        // Le résultat est maintenant un objet { unknown, trash, keep }
        const result = await dispatch(scanDevicePhotos()).unwrap();

        // D. Navigation si des nouveaux médias sont trouvés
        if (result.unknown.length > 0) {
          router.replace('/(tabs)/HomeTab');
        }
      } catch (e) {
        console.error('Boot Error', e);
      }
    };

    bootApp();
  }, [dispatch]);

  /**
   * Sécurité de navigation : redirection si le scan finit
   * et qu'on a des items dans le bac 'unknown'
   */
  useEffect(() => {
    if (!isScanning && unknown.items.length > 0) {
      router.replace('/(tabs)/HomeTab');
    }
  }, [isScanning, unknown.items.length]);

  /**
   * Message de statut dynamique
   */
  const subtitle =
    permission === 'granted'
      ? isScanning
        ? 'Recherche de nouveaux médias…'
        : 'Scan terminé.'
      : permission === 'denied'
        ? 'Accès à la galerie refusé.'
        : 'Vérification des permissions…';

  return (
    <View style={styles.container}>
      <Logo source={logoSource} size={logoSize} />

      {loadingText ? <Text style={styles.title}>{loadingText}</Text> : null}
      <Text style={styles.subtitle}>{subtitle}</Text>

      <View style={styles.bottom}>
        <ProgressBar variant="circular" isInfinite size={64} strokeWidth={6} />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}
