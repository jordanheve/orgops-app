import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
// Importamos el servicio que creamos
import { AuthService } from '../lib/auth';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const router = useRouter();

  const handleAuth = async () => {
    // 1. Validaciones básicas
    if (!form.email || !form.password || (!isLogin && !form.name)) {
      Alert.alert("Error", "Por favor llena todos los campos");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // --- LLAMADA AL SERVICIO: LOGIN (READ) ---
        const response = await AuthService.login(form.email, form.password);
        
        if (response.success) {
          router.replace('/(tabs)');
        } else {
          Alert.alert("Error", response.message);
        }
      } else {
        // --- LLAMADA AL SERVICIO: REGISTRO (CREATE) ---
        await AuthService.register(form.name, form.email, form.password);
        
        Alert.alert("¡Éxito!", "Cuenta creada correctamente. Ahora puedes iniciar sesión.");
        setIsLogin(true); // Switch automático a Login
      }
    } catch (e: any) {
      // Manejo de errores específicos de Turso/Red
      const errorMsg = e.message?.includes("UNIQUE") 
        ? "Este correo ya está registrado." 
        : "Hubo un problema de conexión con la base de datos.";
      Alert.alert("Error", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'OrgOps' : 'Nueva Cuenta'}</Text>
      
      {!isLogin && (
        <TextInput 
          style={styles.input} 
          placeholder="Nombre completo" 
          placeholderTextColor="#94a3b8"
          onChangeText={(t) => setForm({...form, name: t})}
        />
      )}
      
      <TextInput 
        style={styles.input} 
        placeholder="Correo electrónico" 
        placeholderTextColor="#94a3b8"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={(t) => setForm({...form, email: t})}
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Contraseña" 
        placeholderTextColor="#94a3b8"
        secureTextEntry 
        onChangeText={(t) => setForm({...form, password: t})}
      />

      <TouchableOpacity 
        style={[styles.button, loading && { opacity: 0.7 }]} 
        onPress={handleAuth} 
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={{ marginTop: 20 }}>
        <Text style={styles.linkText}>
          {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Entra aquí'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 25, backgroundColor: '#f8fafc' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 40, color: '#2563eb' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', padding: 15, borderRadius: 12, marginBottom: 15, fontSize: 16, color: '#1e293b' },
  button: { backgroundColor: '#2563eb', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10, elevation: 3, shadowColor: '#2563eb', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 } },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  linkText: { color: '#2563eb', textAlign: 'center', fontSize: 14, fontWeight: '500' }
});