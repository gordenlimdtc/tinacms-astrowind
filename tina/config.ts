import { defineConfig, LocalAuthProvider } from 'tinacms';
import { TinaUserCollection, UsernamePasswordAuthJSProvider } from 'tinacms-authjs/dist/tinacms';

const branch = process.env.GITHUB_BRANCH || process.env.HEAD || 'main';

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';

export default defineConfig({
  branch,
  // clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // token: process.env.TINA_TOKEN,
  contentApiUrlOverride: '/api/tina/gql',
  authProvider: isLocal ? new LocalAuthProvider() : new UsernamePasswordAuthJSProvider(),
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'uploads',
      publicFolder: 'public',
      static: false,
    },
  },
  schema: {
    collections: [
      TinaUserCollection,
      {
        name: 'post',
        label: 'Posts',
        path: 'src/data/post',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'excerpt',
            label: 'Description',
          },
          {
            type: 'datetime',
            name: 'publishDate',
            label: 'Publish Date',
            required: true,
          },
          {
            type: 'string',
            name: 'image',
            label: 'Image',
          },
          {
            type: 'string',
            name: 'category',
            label: 'Category',
          },
          {
            type: 'string',
            name: 'tags',
            label: 'Tags',
            list: true,
          },
          {
            type: 'string',
            name: 'author',
            label: 'Author',
          },
          {
            type: 'object',
            name: 'metadata',
            label: 'Metadata',
            fields: [
              {
                type: 'string',
                name: 'canonical',
                label: 'Canonical',
              },
            ],
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Body',
            isBody: true,
          },
        ],
      },
    ],
  },
});
