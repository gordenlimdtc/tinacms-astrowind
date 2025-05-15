import { createMediaHandler } from 'next-tinacms-cloudinary/dist/handlers';
import { AuthJsBackendAuthProvider, TinaAuthJSOptions } from 'tinacms-authjs';
import { LocalBackendAuthProvider } from '@tinacms/datalayer';
// @ts-expect-error generated file
import databaseClient from '../../tina/__generated__/databaseClient';

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';

export default createMediaHandler({
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
