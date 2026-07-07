import { useState, useCallback } from 'react';

export default function useToast() {
  const [message, setMessage] = useState(null);

  const showToast = useCallback((msg) => {
    setMessage(msg);
  }, []);

  const clearToast = useCallback(() => setMessage(null), []);

  return { message, showToast, clearToast };
}