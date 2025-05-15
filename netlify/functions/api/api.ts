import ServerlessHttp from 'serverless-http';
import express, { Router } from 'express';
import { createMediaHandler } from 'next-tinacms-cloudinary/dist/handlers';
import { LocalBackendAuthProvider } from '@tinacms/datalayer';
import { AuthJsBackendAuthProvider, TinaAuthJSOptions } from 'tinacms-authjs';
// @ts-expect-error generated file
import databaseClient from '../../../tina/__generated__/databaseClient';

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';

const app = express();

const router = Router();

const mediaHandler = createMediaHandler({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  authorized: async (req, res) => {
    try {
      if (process.env.NODE_ENV == 'development') {
        return true;
      }

      const authProvider = isLocal
        ? LocalBackendAuthProvider()
        : AuthJsBackendAuthProvider({
            authOptions: TinaAuthJSOptions({
              databaseClient: databaseClient,
              secret: process.env.NEXTAUTH_SECRET!,
            }),
          });

      const { isAuthorized } = await authProvider.isAuthorized(req, res);

      return isAuthorized || false;
    } catch (e) {
      console.error(e);
      return false;
    }
  },
});

// @ts-expect-error lib error
router.get('/cloudinary/media', mediaHandler);

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
