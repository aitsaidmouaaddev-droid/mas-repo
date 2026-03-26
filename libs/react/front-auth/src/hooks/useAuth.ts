import type { AuthIdentity } from '../interfaces';
import { useAuthContext } from '../context/auth.context';

export function useAuth<TIdentity extends AuthIdentity = AuthIdentity>() {
  return useAuthContext<TIdentity>();
}
