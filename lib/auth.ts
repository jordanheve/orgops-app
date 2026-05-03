import { client } from './turso';
import bcrypt from 'bcryptjs';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id?: number;
  name: string;
  email: string;
  role: string;
}

export const AuthService = {
  // Guarda la sesión físicamente en el teléfono
  async saveSession(user: User) {
    try {
      await AsyncStorage.setItem('user_session', JSON.stringify(user));
    } catch (e) {
      console.error("Error guardando sesión:", e);
    }
  },

  // Recupera los datos para que no pida login al abrir la app
  async getUserSession(): Promise<User | null> {
    try {
      const session = await AsyncStorage.getItem('user_session');
      return session ? JSON.parse(session) : null;
    } catch (e) {
      console.log("Error obteniendo sesión:", e);
      return null;

    }
  },

  // Registra nuevos usuarios con contraseña encriptada
  async register(name: string, email: string, password: string) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await client.execute({
        sql: "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'staff')",
        args: [name, email, hashedPassword]
      });
      return { success: true, result };
    } catch (error: any) {
      console.error("Error en registro:", error);
      throw error; 
    }
  },

  // Valida credenciales y activa la persistencia
  async login(email: string, password: string) {
    try {
      const res = await client.execute({
        sql: "SELECT * FROM users WHERE email = ?",
        args: [email]
      });

      if (res.rows.length > 0) {
        const userRow = res.rows[0];
        const isPasswordValid = await bcrypt.compare(password, userRow.password as string);

        if (isPasswordValid) {
          const user: User = {
            id: userRow.id as number,
            name: userRow.name as string,
            email: userRow.email as string,
            role: userRow.role as string
          };

          // Guardamos sesión para el auto-login
          await this.saveSession(user);
          
          return { success: true, user };
        }
      }
      return { success: false, message: "Correo o contraseña incorrectos" };
    } catch (error: any) {
      console.error("Error en login:", error);
      throw error;
    }
  },

  // Borra la sesión y permite salir de la app
  async logout() {
    try {
      await AsyncStorage.removeItem('user_session');
    } catch (e) {
      console.error("Error borrando sesión", e);
    }
  }
};