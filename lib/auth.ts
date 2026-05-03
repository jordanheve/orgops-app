import { client } from './turso';
import bcrypt from 'bcryptjs';

// Definimos la interfaz para mantener el tipado fuerte en la App
export interface User {
  id?: number;
  name: string;
  email: string;
  role: string;
}

export const AuthService = {
  /**
   * Registro de usuario con Hashing de contraseña
   */
  async register(name: string, email: string, password: string) {
    try {
      // Encriptamos la contraseña antes de mandarla a Turso
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await client.execute({
        // Usamos 'staff' para que sea compatible con el CONSTRAINT del SQL
        sql: "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'staff')",
        args: [name, email, hashedPassword]
      });

      return { success: true, result };
    } catch (error: any) {
      console.error("Error en registro:", error);
      throw error;
    }
  },

  /**
   * Login seguro comparando Hashes
   */
  async login(email: string, password: string) {
    try {
      // 1. Buscamos al usuario por su identificador único (email)
      const res = await client.execute({
        sql: "SELECT * FROM users WHERE email = ?",
        args: [email]
      });

      if (res.rows.length > 0) {
        const userRow = res.rows[0];

        // 2. Comparamos la contraseña en bruto contra el hash de la DB
        const isPasswordValid = await bcrypt.compare(password, userRow.password as string);

        if (isPasswordValid) {
          // Mapeamos los datos de la DB a nuestro objeto User
          const user: User = {
            id: userRow.id as number,
            name: userRow.name as string,
            email: userRow.email as string,
            role: userRow.role as string
          };
          return { success: true, user };
        }
      }

      return { success: false, message: "Correo o contraseña incorrectos" };
    } catch (error: any) {
      console.error("Error en login:", error);
      throw error;
    }
  }
};