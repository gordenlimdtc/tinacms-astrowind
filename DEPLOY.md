# Step to deploy to Vercel

1. Fork the repository
2. Generate a personal access token from [Github](https://github.com/settings/personal-access-tokens) with the following repository permissions:
   - Contents: Read and Write
3. Create/Login to Vercel
4. Create a database(Upstash Redis)
5. Add new project
6. Import the repository from Github
7. Add the environment variables
8. Deploy the project


### Add the following secrets to Github repository:

- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

### Environment variables

Refer to the `.env.example` file for the environment variables.