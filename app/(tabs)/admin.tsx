import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AdminPanel() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Facility Manager</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Métricas de Cumplimiento</Text>
        <View style={styles.chartSim}>
          <View style={[styles.bar, { width: '80%', backgroundColor: '#4CAF50' }]}>
            <Text style={styles.barText}>Completadas (80)</Text>
          </View>
          <View style={[styles.bar, { width: '20%', backgroundColor: '#F44336' }]}>
            <Text style={styles.barText}>Expiradas (20)</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Gestor de Zonas</Text>
      {[
        { zona: 'Cocina', user: 'Operador A' },
        { zona: 'Site', user: 'Operador B' },
        { zona: 'Salas', user: 'Operador A' }
      ].map((item, index) => (
        <View key={index} style={styles.userRow}>
          <View>
            <Text style={styles.userName}>{item.user}</Text>
            <Text style={styles.userZone}>Asignado a: {item.zona}</Text>
          </View>
          <Ionicons name="settings-outline" size={20} color="#666" />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F7FA' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 25, marginTop: 40 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 15, marginBottom: 25 },
  cardLabel: { fontSize: 16, fontWeight: '600', marginBottom: 15 },
  chartSim: { height: 100, justifyContent: 'center', gap: 10 },
  bar: { height: 30, borderRadius: 6, justifyContent: 'center', paddingLeft: 10 },
  barText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  userRow: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 10 
  },
  userName: { fontWeight: 'bold', fontSize: 15 },
  userZone: { color: '#666', fontSize: 13 }
});