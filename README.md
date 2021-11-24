# Next Lectures

Fullstack TS application to schedule lectures with Google authentication.

## Features

- [Next.js](https://nextjs.org/)
- [NextAuth](https://next-auth.js.org/) 
- TypeScript
- React
- [ReduxToolkit](https://redux-toolkit.js.org/)
- MongoBD, mongoose
- unit tested (100% coverage)
- [PicoCSS](https://picocss.com/) - minimal CSS framework
- [Formik](https://formik.org/) - for easy form handle
- [react-select-search](https://github.com/tbleckert/react-select-search) for select with search
- [React Icons](https://react-icons.github.io/react-icons/)

## How to run locally

1. Clone repo.

2. Install deps (`npm i`).

3. Copy `.env.local.example` to `.env.local` (this file should not be versioned).
    - Set up `NEXTAUTH_URL` to your domain (if running locally, set to `http://localhost:3000/`)

4. You will need a MongoDB (you can try [Atlas](https://www.mongodb.com/atlas) or install one locally).
    - Set up connection string in `.env.local` under `MONGODB_URI` key.

5. You will need to set up Google OAuth2 to use as auth method.
    - [NextAuth](https://next-auth.js.org/providers/google) docs and [this article](https://dev.to/ndom91/adding-authentication-to-an-existing-serverless-next-js-app-in-no-time-with-nextauth-js-192h) should be helpful.
    - Set up auth strings in `.env.local` under `GOOGLE_ID`, `GOOGLE_SECRET`, `SECRET` keys.  
    - Specify allowed email under `ALLOWED_EMAIL` (app is created to be used by one person and mail is just hardcoded).

6. Now app can by run by `npm run dev`.

## Deployment

You can use [Vercel](https://vercel.com/).
