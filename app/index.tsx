import { Redirect } from 'expo-router';

export default function Index() {
  // Al abrir la app, mandamos al usuario directo al login
  return <Redirect href="login" />;
}