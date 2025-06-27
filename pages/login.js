import { useState } from 'react';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) router.push(data.redirectTo);
    else setError(data.error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Connexion</h2>
        <input type="email" placeholder="Email" className="border p-2 w-full mb-2"
               value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Mot de passe" className="border p-2 w-full mb-4"
               value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">Se connecter</button>
      </form>
    </div>
  );
}
