import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TaskService } from '@/lib/TaskService';// <-- Asegúrate de que la ruta sea correcta

export default function DetalleTarea() {
  const { id, titulo, descripcion, zona, prioridad } = useLocalSearchParams();

  const getPrioInfo = (prio: string | string[]) => {
    const p = Number(prio);
    if (p === 3) return { label: 'CRÍTICA', color: '#EF4444' };
    if (p === 2) return { label: 'URGENTE', color: '#F59E0B' };
    return { label: 'NORMAL', color: '#3B82F6' };
  };

  const prio = getPrioInfo(prioridad);

  // --- NUEVAS FUNCIONES OPERATIVAS ---

  const handleComplete = async () => {
    try {
      // Usamos el ID que viene de los params
      await TaskService.completeTask(Number(id));
      Alert.alert("OrgOps", "Tarea finalizada con éxito.");
      router.replace('/(tabs)'); // Volvemos al Dashboard para refrescar la lista
    } catch (error) {
      Alert.alert("Error", "No se pudo finalizar la tarea.");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Eliminar Tarea",
      "¿Estás seguro? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive", 
          onPress: async () => {
            try {
              await TaskService.deleteTask(Number(id));
              router.replace('/(tabs)');
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar.");
            }
          } 
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <View style={[styles.badge, { backgroundColor: prio.color }]}>
          <Text style={styles.badgeText}>{prio.label}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.zonaLabel}>{zona}</Text>
        <Text style={styles.taskTitle}>{titulo}</Text>
        
        <View style={styles.descContainer}>
          <Text style={styles.sectionLabel}>Descripción de la Tarea</Text>
          <Text style={styles.description}>
            {descripcion || "Sin descripción adicional proporcionada."}
          </Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionLabel}>Acciones de Campo</Text>
        
        {/* Botón de Cámara (Visual por ahora) */}
        {/* <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="camera" size={22} color="white" />
          <Text style={styles.actionText}>Subir Evidencia Fotográfica</Text>
        </TouchableOpacity> */}

        {/* Botón Finalizar - AHORA FUNCIONAL */}
        <TouchableOpacity 
            style={[styles.actionBtn, styles.completeBtn]}
            onPress={handleComplete}
        >
          <Ionicons name="checkmark-circle" size={22} color="white" />
          <Text style={styles.actionText}>Marcar como Finalizada</Text>
        </TouchableOpacity>

        {/* Botón Eliminar - NUEVO */}
        <TouchableOpacity 
            style={[styles.actionBtn, styles.deleteBtn]}
            onPress={handleDelete}
        >
          <Ionicons name="trash" size={22} color="#EF4444" />
          <Text style={[styles.actionText, { color: '#EF4444' }]}>Eliminar Tarea</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 60, 
    paddingBottom: 20 
  },
  backBtn: { padding: 8, backgroundColor: 'white', borderRadius: 12, elevation: 2 },
  content: { padding: 25 },
  zonaLabel: { color: '#64748B', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
  taskTitle: { fontSize: 28, fontWeight: '800', color: '#1E293B', marginTop: 5, marginBottom: 25 },
  descContainer: { backgroundColor: 'white', padding: 20, borderRadius: 16, elevation: 1 },
  sectionLabel: { fontSize: 14, fontWeight: 'bold', color: '#64748B', marginBottom: 10, textTransform: 'uppercase' },
  description: { fontSize: 16, color: '#475569', lineHeight: 24 },
  divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 30 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  badgeText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  actionBtn: { 
    backgroundColor: '#334155', 
    padding: 18, 
    borderRadius: 15, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 12
  },
  completeBtn: { backgroundColor: '#10B981' }, // Cambiado a verde para éxito
  deleteBtn: { backgroundColor: '#FEE2E2', borderWidth: 1, borderColor: '#FECACA' }, // Rojo suave
  actionText: { color: 'white', fontWeight: 'bold', marginLeft: 10, fontSize: 16 }
});