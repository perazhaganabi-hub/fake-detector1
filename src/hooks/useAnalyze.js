import { useState } from 'react';

const FLASK_URL = 'https://fake-detector1-backend.onrender.com/predict';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

export default function useAnalyze() {
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const analyze = async (form) => {
    setLoading(true);
    setError('');
    setResult(null);

    const [apiResult] = await Promise.all([
      (async () => {
        try {
          const res = await fetch(FLASK_URL, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(form),
          });

          const data = await res.json();
          if (data.error) return { error: data.error };
          return { result: data };
        } catch (e) {
          return { error: 'Flask server running-a check pannunga!' };
        }
      })(),
      sleep(3000),
    ]);

    if (apiResult.error) {
      setError(apiResult.error);
    } else {
      setResult(apiResult.result);
    }

    setLoading(false);
  };

  const reset = () => { setResult(null); setError(''); };

  return { result, loading, error, analyze, reset };
}