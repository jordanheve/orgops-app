import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthService } from '../../lib/auth';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  
  // Añadimos 'general' para errores que no pertenecen a un solo campo (opcional)
  const [errors, setErrors] = useState({ name: '', email: '', password: '', general: '' });

  const router = useRouter();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  const validatePassword = (password: string) => {
  // Regex: 
  // (?=.*[A-Z]) -> Al menos una mayúscula
  // (?=.*\d) -> Al menos un número
  // (?=.*[@$!%*?&]) -> Al menos un caracter especial
  // {8,} -> Mínimo 8 caracteres
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-A-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

  const handleAuth = async () => {
    let currentErrors = { name: '', email: '', password: '', general: '' };
    let isValid = true;

    // Validaciones Locales
    if (!isLogin && form.name.trim().length < 3) {
      currentErrors.name = "El nombre es muy corto";
      isValid = false;
    }
    if (!validateEmail(form.email)) {
      currentErrors.email = "Ingresa un correo válido";
      isValid = false;
    }


    if (!validatePassword(form.password) || form.password.length == 0) {

      if(form.password.length == 0) {
        currentErrors.password = "La contraseña es requerida";
      }else {
      currentErrors.password = "La contraseña debe tener al menos 8 caracteres y contener una mayúscula, un número y un carácter especial";
      }
      isValid = false;
    }

    setErrors(currentErrors);
    if (!isValid) return;

    setLoading(true);
    try {
      if (isLogin) {
        const response = await AuthService.login(form.email, form.password);
        if (response.success) {
          router.replace('/(tabs)');
        } else {
          // Si falla el login, mostramos el error en el campo de contraseña o email
          const msg = response.message || 'Credenciales inválidas.';
          setErrors({ ...currentErrors, general: msg });
        }
      } else {
        const response = await AuthService.register(form.name, form.email, form.password);
        if (response.success) {
          setIsLogin(true);
          setForm({ ...form, password: '' });
          setErrors({ ...currentErrors, general: '¡Cuenta creada! Ya puedes entrar.' });
        } else {
          // Error de registro (ej. Usuario ya existe)
          const msg = response.message || 'Error al registrar.';
          if (msg.includes('registrado') || msg.includes('email')) {
            setErrors({ ...currentErrors, email: "Este correo ya está en uso." });
          } else {
            setErrors({ ...currentErrors, general: msg });
          }
        }
      }
    } catch (e: any) {
      let errorMsg = "Error de conexión. Intenta de nuevo.";
      if (e.message?.includes("UNIQUE")) errorMsg = "El correo ya está registrado.";
      setErrors({ ...currentErrors, general: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'OrgOps' : 'Nueva Cuenta'}</Text>

      {/* Mensaje General (Tipo Banner) */}
      {errors.general ? (
        <View style={[styles.alertBanner, { backgroundColor: errors.general.includes('creada') ? '#dcfce7' : '#fee2e2' }]}>
          <Text style={[styles.alertText, { color: errors.general.includes('creada') ? '#166534' : '#991b1b' }]}>
            {errors.general}
          </Text>
        </View>
      ) : null}
      
      {!isLogin && (
        <View>
          <TextInput 
            style={[styles.input, errors.name ? styles.inputError : null]} 
            placeholder="Nombre completo" 
            placeholderTextColor="#94a3b8"
            value={form.name}
            onChangeText={(t) => {
                setForm({...form, name: t});
                if(errors.name || errors.general) setErrors({...errors, name: '', general: ''});
            }}
          />
          {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
        </View>
      )}
      
      <View>
        <TextInput 
          style={[styles.input, errors.email ? styles.inputError : null]} 
          placeholder="Correo electrónico" 
          placeholderTextColor="#94a3b8"
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(t) => {
              setForm({...form, email: t});
              if(errors.email || errors.general) setErrors({...errors, email: '', general: ''});
          }}
        />
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
      </View>
      
      <View>
        <TextInput 
          style={[styles.input, (errors.password || errors.general) ? styles.inputError : null]} 
          placeholder="Contraseña" 
          placeholderTextColor="#94a3b8"
          secureTextEntry 
          value={form.password}
          onChangeText={(t) => {
              setForm({...form, password: t});
              if(errors.password || errors.general) setErrors({...errors, password: '', general: ''});
          }}
        />
        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
      </View>

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

      <TouchableOpacity onPress={() => {
          setIsLogin(!isLogin);
          setErrors({name: '', email: '', password: '', general: ''});
      }}>
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
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', padding: 15, borderRadius: 12, marginBottom: 5, fontSize: 16, color: '#1e293b' },
  inputError: { borderColor: '#ef4444' },
  errorText: { color: '#ef4444', fontSize: 12, marginBottom: 10, marginLeft: 5 },
  // Estilos para el nuevo Banner de error/éxito
  alertBanner: { padding: 15, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: 'transparent' },
  alertText: { textAlign: 'center', fontSize: 14, fontWeight: '600' },
  button: { backgroundColor: '#2563eb', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  linkText: { color: '#2563eb', textAlign: 'center', fontSize: 14, fontWeight: '500', marginTop: 20 }
});