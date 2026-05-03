import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* 
        Al estar en app/(auth)/login.tsx, el nombre debe incluir el grupo 
        para que el Stack sepa a qué pantalla quitarle el header.
      */}
      <Stack.Screen 
        name="(auth)/login" 
        options={{ 
          headerShown: false 
        }} 
      />
      
      <Stack.Screen 
        name="(tabs)" 
        options={{ 
          headerShown: false 
        }} 
      />
    </Stack>
  );
}