import { getUserByEmail } from '../../lib/google';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Méthode non autorisée' });
    }

    const { email, password } = req.body;

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    const passwordMatch = await bcrypt.compare(password, user.MotDePasse_Hash);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    // Connexion OK
    res.status(200).json({
      message: 'Connexion réussie',
      role: user.Role,
      email: user.Email,
      societe: user.Societe
    });

  } catch (error) {
    console.error('Erreur API /login :', error);  // 🔥 Voir l’erreur dans Netlify logs
    res.status(500).json({ message: 'Erreur serveur', detail: error.message });
  }
}

