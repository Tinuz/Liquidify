import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
  mbAccessToken?: string;
  mbAdministrationId?: string;
}

const sessionOptions = {
  password: process.env.SESSION_SECRET || 'dev_change_me_in_production',
  cookieName: 'liquidify-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
};

export async function getSession() {
  return getIronSession<SessionData>(cookies(), sessionOptions);
}
