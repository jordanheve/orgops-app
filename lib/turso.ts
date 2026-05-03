
import { createClient } from '@libsql/client/http';

export const client = createClient({
  // variables de entorno que definimos en el .env
  url: process.env.EXPO_PUBLIC_TURSO_URL!,
  authToken: process.env.EXPO_PUBLIC_TURSO_AUTH_TOKEN!,
});