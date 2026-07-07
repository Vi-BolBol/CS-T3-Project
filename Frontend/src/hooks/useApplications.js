import { useState, useCallback } from 'react';

export default function useApplications() {
  const [processingId, setProcessingId] = useState(null);

  // Mutation handler to advance a candidate's pipeline tracking node state
  const dispatchApplicationStatus = useCallback(async (applicantId, targetStatus) => {
    setProcessingId(applicantId);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log(`Candidate tracking reference #${applicantId} shifted successfully to state: ${targetStatus}`);
      return true;
    } catch (error) {
      console.error("Pipeline transition failure:", error);
      return false;
    } finally {
      setProcessingId(null);
    }
  }, []);

  return {
    dispatchApplicationStatus,
    isProcessing: processingId !== null,
    processingId
  };
}