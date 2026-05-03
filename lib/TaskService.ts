import { client } from './turso';

export const TaskService = {
  // READ: Obtener tareas por zona que no estén completadas
  async getTasksByZona(zona: string) {
    try {
      const res = await client.execute({
        sql: "SELECT * FROM tasks WHERE zona = ? AND is_completed = 0 ORDER BY priority DESC",
        args: [zona]
      });
      return res.rows;
    } catch (error) {
      console.error("Error al obtener tareas:", error);
      return [];
    }
  },

  // CREATE: Insertar nueva tarea efímera (30 min de vida)
 async createTask(title: string, desc: string, zona: string, priority: number, minutes: number) {
  const now = new Date();
  const expiration = new Date(now.getTime() + minutes * 60000);
  const created_at = now.toISOString(); 
  const expires_at = expiration.toISOString();
  try {
    await client.execute({
      sql: `INSERT INTO tasks (title, description, zona, priority, expires_at, is_completed) 
            VALUES (?, ?, ?, ?, ?, 0)`,
      args: [title, desc, zona, priority, expires_at]
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
},

  // UPDATE: Marcar como completada (Lógica de negocio de OrgOps)
  async completeTask(id: number) {
    try {
      await client.execute({
        sql: "UPDATE tasks SET is_completed = 1, completed_at = datetime('now') WHERE id = ?",
        args: [id]
      });
      return { success: true };
    } catch (error) {
      console.error("Error al completar tarea:", error);
      return { success: false };
    }
  },

  // UPDATE: Editar información de una tarea existente
  async updateTask(id: number, title: string, priority: number) {
    try {
      await client.execute({
        sql: "UPDATE tasks SET title = ?, priority = ? WHERE id = ?",
        args: [title, priority, id]
      });
      return { success: true };
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
      return { success: false };
    }
  },

  // DELETE: Borrado físico de la base de datos
  async deleteTask(id: number) {
    try {
      await client.execute({
        sql: "DELETE FROM tasks WHERE id = ?",
        args: [id]
      });
      return { success: true };
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
      return { success: false };
    }
  }
};