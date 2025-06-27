import { google } from 'googleapis';

export async function getUserByEmail(email) {
  const auth = new google.auth.JWT(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    null,
    process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/spreadsheets.readonly']
  );

  const sheets = google.sheets({ version: 'v4', auth });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: 'Utilisateurs_ClaimOneOff!A2:J'
  });

  const rows = res.data.values;
  if (!rows) return null;

  const headers = ['ID_User', 'Societe', 'Nom', 'Prenom', 'Email', 'MotDePasse_Hash', 'Role', 'Actif', 'Date_Inscription', 'Derniere_Connexion'];

  return rows.map(row => Object.fromEntries(headers.map((h, i) => [h, row[i]])))
             .find(user => user.Email === email);
}
