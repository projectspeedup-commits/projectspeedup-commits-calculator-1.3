import { useState, useEffect } from 'react';

interface AppConfig {
  usePostgres: boolean;
  isProduction: boolean;
}

export function useAppConfig() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConfig() {
      try {
        const response = await fetch('/api/config');
        if (response.ok) {
          const data = await response.json();
          setConfig(data);
        }
      } catch (err) {
        console.warn('Backend not detected, falling back to Firebase only', err);
        setConfig({ usePostgres: false, isProduction: false });
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
  }, []);

  return { config, loading };
}
