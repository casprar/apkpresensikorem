import { useState } from 'react';
import { submitAttendance } from '../services/attendanceService';

export const useAttendanceSubmit = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const submit = async (sessionId, name, className, gender) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await submitAttendance(sessionId, name, className, gender);
      setResult(data);
      return data;
    } catch (err) {
      setError(err.message || 'An error occurred during submission.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setResult(null);
  };

  return { submit, loading, result, error, reset };
};
