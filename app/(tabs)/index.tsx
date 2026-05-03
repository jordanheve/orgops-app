import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, Modal, TextInput, Alert, ScrollView } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TaskService } from '../../lib/TaskService';
import { TaskCard } from '../../components/TaskCard';

export default function Dashboard() {
  interface Task {
    id: number;
    title: string;
    description: string;
    priority: number;
    zona: string;
    is_completed: number;
  }
  const [tasks, setTasks] = useState<Task[]>([]);
  const [zona, setZona] = useState('Cocina');
  const [refreshing, setRefreshing] = useState(false);
  
  const completarTarea = async (id: number) => {
    try {
      await TaskService.completeTask(id);
      loadTasks(); // Refrescar la lista después de completar
    } catch (error) {
      Alert.alert("Error", "No se pudo completar la tarea.");
    }
  };

  // Estados del Formulario
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState(2); // Default: Urgente
  const [newTime, setNewTime] = useState(30); // Default: 30 min
  const [titleError, setTitleError] = useState(false);

  const priorities = [
    { id: 3, label: 'Crítica', color: '#EF4444', icon: 'flash' },
    { id: 2, label: 'Urgente', color: '#F59E0B', icon: 'alarm' },
    { id: 1, label: 'Normal', color: '#3B82F6', icon: 'checkmark-circle' },
  ];

  const timeOptions = [15, 30, 60, 120];

  const loadTasks = async () => {
    setRefreshing(true);
    const data = await TaskService.getTasksByZona(zona) as unknown as Task[];
    setTasks(data);
    setRefreshing(false);
  };

  useFocusEffect(useCallback(() => { loadTasks(); }, [zona]));

  const handleCreateTask = async () => {
    if (!newTitle.trim()) {
      setTitleError(true);
      return;
    }
    
    const res = await TaskService.createTask(newTitle, newDesc, zona, newPriority, newTime);
    if (res.success) {
      setModalVisible(false);
      resetForm();
      loadTasks();
    }
  };

  const resetForm = () => {
    setNewTitle('');
    setNewDesc('');
    setNewPriority(2);
    setNewTime(30);
    setTitleError(false);
  };

  return (
    <View style={styles.container}>
      {/* Selector de Zona */}
      <View style={styles.selector}>
        {['Cocina', 'Site', 'Salas'].map((z) => (
          <TouchableOpacity 
            key={z} 
            onPress={() => setZona(z)}
            style={[styles.btn, zona === z && styles.btnActive]}
          >
            <Text style={{ color: zona === z ? 'white' : '#64748b', fontWeight: 'bold' }}>{z}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Tareas en {zona}</Text>

      <FlatList
  data={tasks}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    /* AQUÍ VA EL CAMBIO: Envolvemos la tarjeta para que sea cliqueable */
    <View style={{ marginBottom: 15 }}>
    <TouchableOpacity 
      onPress={() => router.push({
        pathname: "/detalle", 
        params: { 
          id: item.id,
          titulo: item.title,
          descripcion: item.description,
          prioridad: item.priority,
          zona: item.zona
        }
      })}
    >
      <TaskCard task={item} onComplete={completarTarea} />
    </TouchableOpacity>
    
    </View>
  )}
  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadTasks} />}
  ListEmptyComponent={<Text style={styles.emptyText}>Zona despejada.</Text>}
/>

      {/* MODAL DE CREACIÓN MEJORADO */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalHeader}>Nueva Tarea - {zona}</Text>
              
              <Text style={styles.label}>Título *</Text>
              <TextInput 
                style={[styles.input, titleError && styles.inputError]} 
                placeholder="Ej. Revisión de Servidores" 
                value={newTitle}
                onChangeText={(t) => {setNewTitle(t); setTitleError(false);}}
              />
              {titleError && <Text style={styles.errorMsg}>El título es obligatorio</Text>}

              <Text style={styles.label}>Descripción</Text>
              <TextInput 
                style={[styles.input, { height: 80, textAlignVertical: 'top' }]} 
                placeholder="Detalles de la tarea..." 
                multiline
                value={newDesc}
                onChangeText={setNewDesc}
              />

              <Text style={styles.label}>Prioridad</Text>
              <View style={styles.priorityRow}>
                {priorities.map((p) => (
                  <TouchableOpacity 
                    key={p.id} 
                    onPress={() => setNewPriority(p.id)}
                    style={[
                      styles.prioBtn, 
                      newPriority === p.id && { backgroundColor: p.color, borderColor: p.color }
                    ]}
                  >
                    <Ionicons name={p.icon as any} size={16} color={newPriority === p.id ? 'white' : '#64748b'} />
                    <Text style={[styles.prioText, { color: newPriority === p.id ? 'white' : '#64748b' }]}>{p.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Tiempo Límite (minutos)</Text>
              <View style={styles.timeRow}>
                {timeOptions.map((t) => (
                  <TouchableOpacity 
                    key={t} 
                    onPress={() => setNewTime(t)}
                    style={[styles.timeBtn, newTime === t && styles.timeBtnActive]}
                  >
                    <Text style={{ color: newTime === t ? 'white' : '#64748b' }}>{t}m</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity onPress={() => { setModalVisible(false); resetForm(); }} style={styles.btnCancel}>
                  <Text style={{color: '#94a3b8'}}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCreateTask} style={styles.btnSave}>
                  <Text style={{color: 'white', fontWeight: 'bold'}}>Crear Tarea</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F8FAFC' },
  selector: { flexDirection: 'row', gap: 10, marginBottom: 25, marginTop: 10 },
  btn: { flex: 1, padding: 12, backgroundColor: '#F1F5F9', borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  btnActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  sectionTitle: { fontSize: 20, fontWeight: '800', marginBottom: 15, color: '#1E293B' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#94A3B8' },
  fab: { position: 'absolute', bottom: 30, right: 25, backgroundColor: '#007AFF', width: 65, height: 65, borderRadius: 32.5, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', maxHeight: '80%', backgroundColor: 'white', borderRadius: 24, padding: 25, shadowColor: '#000', shadowOpacity: 0.25 },
  modalHeader: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#1E293B' },
  label: { fontSize: 13, fontWeight: '700', color: '#64748B', marginBottom: 8, textTransform: 'uppercase' },
  input: { backgroundColor: '#F8FAFC', padding: 15, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#E2E8F0', color: '#1E293B' },
  inputError: { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
  errorMsg: { color: '#EF4444', fontSize: 12, marginTop: -12, marginBottom: 10, marginLeft: 5 },
  priorityRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  prioBtn: { flex: 1, flexDirection: 'row', padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center', gap: 5 },
  prioText: { fontSize: 11, fontWeight: 'bold' },
  timeRow: { flexDirection: 'row', gap: 8, marginBottom: 25 },
  timeBtn: { flex: 1, padding: 10, borderRadius: 10, backgroundColor: '#F1F5F9', alignItems: 'center' },
  timeBtnActive: { backgroundColor: '#334155' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 10 },
  btnCancel: { padding: 15 },
  btnSave: { backgroundColor: '#007AFF', padding: 15, borderRadius: 12, minWidth: 120, alignItems: 'center' }
});