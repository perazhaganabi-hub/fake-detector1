import React, { useState } from 'react';
import WelcomePage    from './components/WelcomePage';
import LoadingScreen  from './components/LoadingScreen';
import InputForm      from './components/InputForm';
import ResultCard     from './components/ResultCard';
import useAnalyze     from './hooks/useAnalyze';

const emptyForm = {
  username: '', followers: '', following: '',
  posts: '', profilePic: 1, fullname: '',
  bio: '', hasUrl: 0, isPrivate: 0,
  accountYear: '', accountAgeDays: '',
};

export default function App() {
  const [page, setPage] = useState('welcome'); // welcome | form | result
  const [form, setForm] = useState(emptyForm);
  const { result, loading, error, analyze, reset } = useAnalyze();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = () => {
    setPage('result');
    analyze(form);
  };

  const handleReset = () => {
    setForm(emptyForm);
    reset();
    setPage('form');
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {page === 'welcome' && (
        <WelcomePage onStart={() => setPage('form')} />
      )}

      {page === 'form' && !loading && !result && (
        <div style={{ paddingTop: 40, paddingBottom: 40 }}>
          <InputForm
            form={form} onChange={handleChange}
            onSubmit={handleSubmit} loading={loading} error={error}
          />
        </div>
      )}

      {loading && <LoadingScreen />}

      {result && !loading && (
        <div style={{ paddingTop: 40, paddingBottom: 40 }}>
          <ResultCard result={result} onReset={handleReset} />
        </div>
      )}
    </div>
  );
}