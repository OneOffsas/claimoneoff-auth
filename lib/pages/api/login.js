import { getUserByEmail } from '@/lib/google';
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';

export default async function handler(req, res) {
  const { email, password } = req.body;

  const user = await getUserByEmail(email);
  if (!user || user.Actif !== 'TRUE') return res.status(401).json({ error: 'Utilisateur non trouvé ou inactif' });

  const match = await bcrypt.compare(password, user.MotDePasse_Hash);
  if (!match) return res.status(401).json({ error: 'Mot de passe incorrect' });

  const cookie = serialize('user_role', user.Role, { path: '/', httpOnly: true, maxAge: 3600 });
  res.setHeader('Set-Cookie', cookie);
  res.status(200).json({ redirectTo: user.Role === 'admin' ? '/admin' : '/client' });
}
