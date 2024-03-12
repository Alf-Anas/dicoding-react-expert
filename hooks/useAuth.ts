import { SESSION_STORAGE } from '@/constants';
import { ProfileResponsesType } from '@/types/profile-responses.interface';
import { useEffect, useState } from 'react';

const useAuth = () => {
  const [token, setToken] = useState('');
  const [profile, setProfile] = useState<ProfileResponsesType>();
  const [isAuthenticated, setIsAuthenticated] = useState<
    'loading' | 'unauthenticated' | 'authenticated'
  >('loading');

  useEffect(() => {
    const eToken = sessionStorage.getItem(SESSION_STORAGE.TOKEN);
    const eProfile = sessionStorage.getItem(SESSION_STORAGE.PROFILE);
    if (eToken) {
      setToken(eToken);
      setIsAuthenticated('authenticated');
      if (eProfile) {
        setProfile(JSON.parse(eProfile));
      }
    } else {
      setIsAuthenticated('unauthenticated');
    }
  }, []);
  return { token, isAuthenticated, profile };
};
export default useAuth;
