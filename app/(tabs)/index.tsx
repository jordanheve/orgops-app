import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function Dashboard() {
  const [zona, setZona] = useState('Cocina');

  const tareas = [
    { id: '1', titulo: 'Limpieza de Cafetera', zona: 'Cocina', tiempo: '04:59' },
    { id: '2', titulo: 'Revisión de Racks', zona: 'Site', tiempo: '11:20' },
    { id: '3', titulo: 'Fuga reportada', zona: 'Salas', tiempo: '02:15' },
  ];

  return (
    <View style={styles.container}>
      {/* Selector de Zona (Tabs) */}
      <View style={styles.selector}>
        {['Cocina', 'Site', 'Salas'].map((z) => (
          <TouchableOpacity 
            key={z} 
            onPress={() => setZona(z)}
            style={[styles.btn, zona === z && styles.btnActive]}
          >
            <Text style={{ color: zona === z ? 'white' : '#666', fontWeight: 'bold' }}>{z}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Tareas Efímeras</Text>

      {/* Lista de Tareas */}
      <FlatList
        data={tareas.filter(t => t.zona === zona)}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => router.push({ pathname: '/detalle', params: { id: item.id, titulo: item.titulo } })}
          >
            <View>
              <Text style={styles.titulo}>{item.titulo}</Text>
              <View style={styles.timerContainer}>
                <Ionicons name="time-outline" size={14} color="#D32F2F" />
                <Text style={styles.timer}> {item.tiempo} restante</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        )}
      />

      {/* Botón de Acción Rápida (FAB) */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F7FA' },
  selector: { flexDirection: 'row', gap: 10, marginBottom: 25, marginTop: 10 },
  btn: { flex: 1, padding: 12, backgroundColor: '#E0E4E8', borderRadius: 12, alignItems: 'center' },
  btnActive: { backgroundColor: '#007AFF' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  card: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: 'white', padding: 18, borderRadius: 15, marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3
  },
  titulo: { fontSize: 16, fontWeight: '600', color: '#1A1A1A' },
  timerContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  timer: { color: '#D32F2F', fontSize: 13, fontWeight: 'bold' },
  fab: { 
    position: 'absolute', bottom: 30, right: 25, backgroundColor: '#007AFF', 
    width: 65, height: 65, borderRadius: 32.5, justifyContent: 'center', alignItems: 'center', elevation: 8 
  }
});