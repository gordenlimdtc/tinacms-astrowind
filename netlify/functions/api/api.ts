import ServerlessHttp from 'serverless-http';
import express, { Router } from 'express';
import { createMediaHandler } from 'next-tinacms-cloudinary/dist/handlers';
import { TinaAuthJSOptions } from 'tinacms-authjs';
// @ts-expect-error generated file
import databaseClient from '../../../tina/__generated__/databaseClient';
import { getServerSession } from 'next-auth/next';

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';

const app = express();

const router = Router();

const mediaHandler = createMediaHandler({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  authorized: async (req, res) => {
    try {
      if (isLocal) {
        console.warn("Authorizing media handler in development without specific auth check.");
        return true;
      }

      // Use getServerSession from NextAuth.js to check for an active session
      // Make sure 'authOptions' is correctly imported from your NextAuth.js setup
      const session = await getServerSession(req, res, TinaAuthJSOptions({
        databaseClient: databaseClient,
        secret: process.env.NEXTAUTH_SECRET!,
      }));

      // If a session exists, the user is considered authorized.
      // You can add more granular checks here if needed (e.g., user roles).
      if (session) {
        // Example: Check for a specific role if your session user object has it
        // if (session.user && session.user.role === 'admin') {
        //   return true;
        // }
        return true; // Or more specific checks based on session.user
      }

      return false; // No session, so not authorized
    } catch (e) {
      console.error('Error during media handler authorization:', e);
      return false;
    }
  },
});

// @ts-expect-error lib error
router.get('/cloudinary/media', (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.headers, req.query);

  mediaHandler(req, res);
});

// @ts-expect-error lib error
router.post('/cloudinary/media', mediaHandler);

router.delete('/cloudinary/media/:media', (req, res) => {
  req.query.media = ['media', req.params.media];
  // @ts-expect-error lib error
  return mediaHandler(req, res);
});

app.use('/api/', router);
app.use('/.netlify/functions/api/', router);

export const handler = ServerlessHttp(app);
