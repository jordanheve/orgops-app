import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function DetalleTarea() {
  const { titulo } = useLocalSearchParams();
  const [synced, setSynced] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle de Tarea</Text>
        {/* Estado de Sincronización */}
        <TouchableOpacity onPress={() => setSynced(!synced)}>
          <Ionicons 
            name={synced ? "cloud-done" : "cloud-offline"} 
            size={28} 
            color={synced ? "#4CAF50" : "#FF9800"} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.taskTitle}>{titulo}</Text>
        
        <Text style={styles.sectionLabel}>Checklist de Insumos / Pasos</Text>
        {['Limpieza de filtro', 'Reposición de grano', 'Prueba de goteo'].map((item, i) => (
          <TouchableOpacity key={i} style={styles.checkItem}>
            <Ionicons name="square-outline" size={24} color="#007AFF" />
            <Text style={styles.checkText}>{item}</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.divider} />

        {/* Evidencia Fotográfica */}
        <TouchableOpacity style={styles.cameraBtn}>
          <Ionicons name="camera" size={24} color="white" />
          <Text style={styles.cameraText}>Capturar Evidencia (Expo Camera)</Text>
        </TouchableOpacity>
        
        <Text style={styles.infoText}>Sincronización: {synced ? 'Enviado a Servidor' : 'Guardado local (Turso)'}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { padding: 20 },
  taskTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#007AFF' },
  sectionLabel: { fontSize: 16, color: '#666', marginBottom: 15, fontWeight: '600' },
  checkItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  checkText: { marginLeft: 10, fontSize: 16 },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 20 },
  cameraBtn: { backgroundColor: '#1A1A1A', padding: 18, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  cameraText: { color: 'white', fontWeight: 'bold', marginLeft: 10 },
  infoText: { textAlign: 'center', marginTop: 15, color: '#999', fontSize: 12 }
});