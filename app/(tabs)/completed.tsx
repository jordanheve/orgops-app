import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { client } from '../../lib/turso';

export default function CompletedTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('day');

  const fetchCompletedTasks = async () => {
    setLoading(true);
    
    // Desplazamiento para Tiempo del Centro de México (UTC-6)
    const mxOffset = "-06:00"; 
    let timeFilter = "";
    
    // Filtros de fecha optimizados para SQLite/Turso
    if (filter === 'day') {
      timeFilter = `AND date(completed_at, '${mxOffset}') = date('now', '${mxOffset}')`;
    } else if (filter === 'week') {
      timeFilter = `AND date(completed_at, '${mxOffset}') >= date('now', '${mxOffset}', '-7 days')`;
    }

    try {
      const res = await client.execute({
        sql: `SELECT * FROM tasks 
              WHERE is_completed = 1 ${timeFilter} 
              ORDER BY completed_at DESC`,
        args: []
      });
      setTasks(res.rows);
    } catch (e) {
      console.error("Error al traer completadas:", e);
    } finally {
      setLoading(false);
    }
  };

  // Reemplazamos useEffect por useFocusEffect para recarga automática al entrar a la pestaña
  useFocusEffect(
    useCallback(() => {
      fetchCompletedTasks();
    }, [filter])
  );

  const uncheckTask = async (id: number) => {
    try {
      await client.execute({
        sql: "UPDATE tasks SET is_completed = 0, completed_at = NULL WHERE id = ?",
        args: [id]
      });
      // Recargamos la lista localmente después de la acción
      fetchCompletedTasks(); 
    } catch (e) {
      console.error("Error al deshacer:", e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial</Text>
      
      <View style={styles.filterContainer}>
        {['day', 'week', 'all'].map((f) => (
          <TouchableOpacity 
            key={f} 
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'day' ? 'Hoy' : f === 'week' ? 'Semana' : 'Todo'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            let dateLabel = "Sin fecha";
            
            if (item.completed_at) {
              // Convertimos el string UTC de la DB a objeto Date local
              const dateUTC = new Date(item.completed_at.replace(' ', 'T') + 'Z');
              
              // Formateo específico para México
              dateLabel = dateUTC.toLocaleString('es-MX', {
                timeZone: 'America/Mexico_City',
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              });
            }

            return (
              <View style={styles.taskCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.taskTitle}>{item.title}</Text>
                  <Text style={styles.zonaTag}>{item.zona}</Text>
                  <Text style={styles.taskDate}>Finalizada: {dateLabel}</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => uncheckTask(item.id)}
                  style={styles.undoBtn}
                >
                  <Ionicons name="arrow-undo-circle" size={32} color="#64748b" />
                </TouchableOpacity>
              </View>
            );
          }}
          ListEmptyComponent={<Text style={styles.empty}>No hay tareas para mostrar.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#1e293b', marginTop: 40 },
  filterContainer: { flexDirection: 'row', marginBottom: 20, backgroundColor: '#e2e8f0', borderRadius: 10, padding: 4 },
  filterBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  filterBtnActive: { backgroundColor: 'white', elevation: 2 },
  filterText: { color: '#64748b', fontWeight: '600' },
  filterTextActive: { color: '#2563eb' },
  taskCard: { 
    flexDirection: 'row', 
    backgroundColor: 'white', 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 10, 
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#10b981'
  },
  taskTitle: { fontSize: 16, fontWeight: '600', color: '#1e293b', textDecorationLine: 'line-through', opacity: 0.6 },
  zonaTag: { fontSize: 10, color: '#2563eb', fontWeight: '700', textTransform: 'uppercase', marginTop: 2 },
  taskDate: { fontSize: 11, color: '#94a3b8', marginTop: 4 },
  undoBtn: { padding: 5 },
  empty: { textAlign: 'center', marginTop: 50, color: '#94a3b8' }
});