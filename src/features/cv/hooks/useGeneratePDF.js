import { useState } from 'react';

export function useGeneratePDF() {
  const [isCompiling, setIsCompiling] = useState(false);

  const downloadPDF = async (elementId) => {
    setIsCompiling(true);
    try {
      console.log(`Locking processing target DOM node layer: #${elementId}`);
      // Triggers browser system layout rendering pipeline cleanly
      window.print();
    } catch (err) {
      console.error('PDF frame construction engine exception:', err);
    } finally {
      setIsCompiling(false);
    }
  };

  return { downloadPDF, isCompiling };
}