import { useRouter, useSegments } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { AuthService } from '../lib/auth';

export default function Index() {
  const [hasSession, setHasSession] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await AuthService.getUserSession();
        // Si session es null o undefined, !!session será false
        setHasSession(!!session);
      } catch (e) {
        setHasSession(false);
      }
    };
    checkSession();
  }, []);

  useEffect(() => {
    // Solo navegamos cuando ya tenemos un veredicto (true o false)
    if (hasSession === true) {
      router.replace('/(tabs)');
    } else if (hasSession === false) {
      router.replace('/(auth)/login');
    }
  }, [hasSession]);

  // Loader de seguridad mientras decide
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' }}>
      <ActivityIndicator size="large" color="#2563eb" />
    </View>
  );
}