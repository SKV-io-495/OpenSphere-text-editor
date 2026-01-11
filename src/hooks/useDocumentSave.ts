import { useState, useEffect, useCallback } from 'react';

export type SaveStatus = 'saved' | 'saving' | 'unsaved';

export const useDocumentSave = () => {
  const [status, setStatus] = useState<SaveStatus>('saved');

  // Mock save function (debounced caller should handle timing, or we handle it here)
  // Here we provide a trigger function.
  
  const saveDocument = useCallback(async (content: any) => {
    setStatus('saving');
    console.log("Saving document...", content);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setStatus('saved');
    console.log("Document saved.");
  }, []);

  return {
    status,
    saveDocument
  };
};
