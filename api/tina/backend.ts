import { LocalBackendAuthProvider, TinaNodeBackend } from '@tinacms/datalayer';
import { AuthJsBackendAuthProvider, TinaAuthJSOptions } from 'tinacms-authjs';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// @ts-expect-error generated file
import databaseClient from '../../tina/__generated__/databaseClient';

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';

const tinaBackend = TinaNodeBackend({
  authProvider: isLocal
    ? LocalBackendAuthProvider()
    : AuthJsBackendAuthProvider({
        authOptions: TinaAuthJSOptions({
          databaseClient: databaseClient,
          secret: process.env.NEXTAUTH_SECRET!,
        }),
      }),
  databaseClient,
});

const handler = async (req: VercelRequest, res: VercelResponse) => {
  // modify the request object here if needed
  tinaBackend(req, res);
};

export default handler;
