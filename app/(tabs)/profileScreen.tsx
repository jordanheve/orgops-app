import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AuthService, User } from '../../lib/auth';

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUserData = async () => {
      const session = await AuthService.getUserSession();
      setUser(session);
      setLoading(false);
    };
    loadUserData();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres salir de OrgOps?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Salir", 
          style: "destructive", 
          onPress: async () => {
            await AuthService.logout();
            // Usamos replace para resetear el stack y que no pueda volver atrás
            router.replace('/login'); 
          } 
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Cabecera con Avatar Genérico */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <Text style={styles.userName}>{user?.name || 'Usuario'}</Text>
        <View style={[styles.roleBadge, { backgroundColor: user?.role === 'admin' ? '#dcfce7' : '#e0f2fe' }]}>
          <Text style={[styles.roleText, { color: user?.role === 'admin' ? '#166534' : '#0369a1' }]}>
            {user?.role?.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Información Detallada */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Información de la cuenta</Text>
        
        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={20} color="#64748b" />
          <View style={styles.infoTexts}>
            <Text style={styles.infoLabel}>Correo Electrónico</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="shield-checkmark-outline" size={20} color="#64748b" />
          <View style={styles.infoTexts}>
            <Text style={styles.infoLabel}>ID de Empleado</Text>
            <Text style={styles.infoValue}>#{user?.id || '---'}</Text>
          </View>
        </View>
      </View>

      {/* Botón de Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color="#ef4444" />
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>OrgOps v1.0.2</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 20 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', marginTop: 40, marginBottom: 30 },
  avatar: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    backgroundColor: '#2563eb', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 15,
    elevation: 4
  },
  avatarText: { color: '#white', fontSize: 32, fontWeight: 'bold' },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#1e293b' },
  roleBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 8 },
  roleText: { fontSize: 12, fontWeight: 'bold', letterSpacing: 0.5 },
  
  infoSection: { backgroundColor: 'white', borderRadius: 16, padding: 20, elevation: 2, marginBottom: 25 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#94a3b8', marginBottom: 15, textTransform: 'uppercase' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  infoTexts: { marginLeft: 15 },
  infoLabel: { fontSize: 12, color: '#64748b' },
  infoValue: { fontSize: 16, color: '#1e293b', fontWeight: '500' },

  logoutButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#fee2e2', 
    padding: 16, 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecaca'
  },
  logoutText: { color: '#ef4444', fontWeight: 'bold', marginLeft: 10, fontSize: 16 },
  versionText: { textAlign: 'center', color: '#94a3b8', fontSize: 12, marginTop: 20 }
});