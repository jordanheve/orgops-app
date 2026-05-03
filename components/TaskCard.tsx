import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TaskCardProps {
  task: {
    id: number;
    title: string;
    priority: number;
    expires_at: string; // Formato: "2026-05-03 14:30:00"
  };
  onComplete: (id: number) => void;
}

export const TaskCard = ({ task, onComplete }: TaskCardProps) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  
  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const expiration = new Date(task.expires_at.replace(' ', 'T')); // Formato ISO para JS
      const diffMs = expiration.getTime() - now.getTime();

      if (diffMs <= 0) {
        setTimeLeft('Vencido');
        setIsUrgent(true);
        return;
      }

      const diffMins = Math.floor(diffMs / 60000);
      const diffHrs = Math.floor(diffMins / 60);
      const remainingMins = diffMins % 60;

      // Si quedan menos de 10 minutos, marcar como urgente (rojo)
      setIsUrgent(diffMins < 10);

      const timeString = diffHrs > 0 
        ? `${diffHrs}h ${remainingMins}m` 
        : `${remainingMins}m`;
      
      setTimeLeft(timeString);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 60000); // Actualizar cada minuto

    return () => clearInterval(interval);
  }, [task.expires_at]);

  const getPriorityColor = (p: number) => {
    if (p === 3) return '#EF4444'; // Crítica
    if (p === 2) return '#F59E0B'; // Urgente
    return '#3B82F6'; // Normal
  };

  return (
    <View style={styles.card}>
      {/* Indicador de Prioridad lateral */}
      <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(task.priority) }]} />
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{task.title}</Text>
        
        <View style={styles.timerRow}>
          <Ionicons 
            name="time-outline" 
            size={14} 
            color={isUrgent ? '#EF4444' : '#64748B'} 
          />
          
          <Text style={[styles.timerText, isUrgent && styles.timerUrgent]}>
            {timeLeft === 'Vencido' ? '⌛ Expira pronto' : `Quedan ${timeLeft}`}
          </Text>
        </View>
      </View>

      <TouchableOpacity onPress={() => onComplete(task.id)} style={styles.checkBtn}>
        <Ionicons name="checkmark-circle" size={32} color="#10B981" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    alignItems: 'center',
  },
  priorityIndicator: { width: 6, height: '100%' },
  content: { flex: 1, padding: 15 },
  title: { fontSize: 16, fontWeight: '700', color: '#1E293B', marginBottom: 4 },
  timerRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timerText: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  timerUrgent: { color: '#EF4444', fontWeight: 'bold' },
  checkBtn: { paddingHorizontal: 15 },
});