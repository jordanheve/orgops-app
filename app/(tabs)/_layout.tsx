import React, { useEffect, useState } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AuthService } from '../../lib/auth';

export default function TabLayout() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRole = async () => {
      try {
        const user = await AuthService.getUserSession();
        if (user) {
          // Limpiamos espacios y minúsculas para evitar errores de comparación
          setRole(user.role.toLowerCase().trim());
        }
      } catch (e) {
        console.error("Error al obtener rol:", e);
      } finally {
        setLoading(false);
      }
    };
    loadRole();
  }, []);

  if (loading) return null;

  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: '#2563eb',
      headerStyle: { backgroundColor: '#f8fafc' },
      headerTitleStyle: { fontWeight: 'bold' }
    }}>
      {/*Tareas: Siempre visible */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tareas',
          tabBarIcon: ({ color }) => <Ionicons name="clipboard-outline" size={24} color={color} />,
        }}
      />
      {/* Historial: Siempre visible hace falta que los cargue cuando se entra al screen */}

        <Tabs.Screen
          name="completed"
          options={{
            title: 'Historial',
            tabBarIcon: ({ color }) => <Ionicons name="checkmark-done-circle-outline" size={24} color={color} />,
          }}
        />

      {/* Gestión (Admin): Se oculta mediante href: null si no es admin */}
      <Tabs.Screen
        name="admin" 
        options={{
          title: 'Gestión',
          tabBarIcon: ({ color }) => <Ionicons name="stats-chart" size={24} color={color} />,
          // CLAVE: Si el rol no es admin, href es null y la pestaña desaparece
          href: role === 'admin' ? '/admin' : null,
        }}
      />

      {/* Perfil: Siempre visible */}
      <Tabs.Screen
        name="profileScreen"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <Ionicons name="person-circle-outline" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}