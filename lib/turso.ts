// NOTA: Importamos desde '@libsql/client/http' para evitar errores nativos de Windows/Node
import { createClient } from '@libsql/client/http';

export const client = createClient({
  // Asegúrate de que las variables en tu .env se llamen exactamente así
  url: process.env.EXPO_PUBLIC_TURSO_URL!,
  authToken: process.env.EXPO_PUBLIC_TURSO_AUTH_TOKEN!,
});