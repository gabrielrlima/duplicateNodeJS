import { useRef, useState, useEffect, useCallback } from 'react';

// ----------------------------------------------------------------------

type UseCountdownProps = {
  initialSeconds: number;
  storageKey?: string;
};

type UseCountdownReturn = {
  seconds: number;
  isActive: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
};

// ----------------------------------------------------------------------

export function useCountdown({ 
  initialSeconds, 
  storageKey = 'countdown-timer' 
}: UseCountdownProps): UseCountdownReturn {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // Função para salvar no localStorage
  const saveToStorage = useCallback((endTime: number | null) => {
    if (storageKey) {
      if (endTime) {
        localStorage.setItem(storageKey, endTime.toString());
      } else {
        localStorage.removeItem(storageKey);
      }
    }
  }, [storageKey]);

  // Função para carregar do localStorage
  const loadFromStorage = useCallback((): number | null => {
    if (!storageKey) return null;
    
    const stored = localStorage.getItem(storageKey);
    if (!stored) return null;
    
    const endTime = parseInt(stored, 10);
    const now = Date.now();
    
    if (endTime > now) {
      return Math.ceil((endTime - now) / 1000);
    }
    
    // Se o tempo já passou, limpar o storage
    localStorage.removeItem(storageKey);
    return null;
  }, [storageKey]);

  // Inicializar o countdown ao montar o componente
  useEffect(() => {
    const remainingSeconds = loadFromStorage();
    if (remainingSeconds && remainingSeconds > 0) {
      setSeconds(remainingSeconds);
      setIsActive(true);
    }
  }, [loadFromStorage]);

  // Gerenciar o interval do countdown
  useEffect(() => {
    if (isActive && seconds > 0) {
      intervalRef.current = window.setInterval(() => {
        setSeconds((prevSeconds) => {
          const newSeconds = prevSeconds - 1;
          
          if (newSeconds <= 0) {
            setIsActive(false);
            saveToStorage(null);
            return 0;
          }
          
          return newSeconds;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, seconds, saveToStorage]);

  // Função para iniciar o countdown
  const start = useCallback(() => {
    const endTime = Date.now() + (initialSeconds * 1000);
    setSeconds(initialSeconds);
    setIsActive(true);
    saveToStorage(endTime);
  }, [initialSeconds, saveToStorage]);

  // Função para parar o countdown
  const stop = useCallback(() => {
    setIsActive(false);
    saveToStorage(null);
  }, [saveToStorage]);

  // Função para resetar o countdown
  const reset = useCallback(() => {
    setSeconds(0);
    setIsActive(false);
    saveToStorage(null);
  }, [saveToStorage]);

  // Cleanup ao desmontar o componente
  useEffect(() => () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
  }, []);

  return {
    seconds,
    isActive,
    start,
    stop,
    reset,
  };
}