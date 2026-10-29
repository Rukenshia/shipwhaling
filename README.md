# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Contact form

The form at `/contact` uses the `modules/shipwhaling-contact` Lambda/API Gateway/SNS
module in `~/src/priv/aws`. Deploy that infrastructure, confirm its SNS email
subscription, and verify a notification arrives at `svc-shipwhaling@ruken.pw`.
Then set `VITE_CONTACT_ENDPOINT` in the ignored `.env` file (see `.env.example`)
to the Terraform `shipwhaling_contact_endpoint` output and rebuild.

Without this setting, the contact page shows the existing email address and the
Impressum retains its phone contact. With it, the Impressum links to the contact
form instead of displaying the phone number. Do not enable the form before
notification delivery is verified. Changing this build-time setting requires a
new build and deployment.

The API permits browser requests from `https://whaling.in.fkn.space` only. For
local UI testing, intercept requests in the browser; do not loosen production
CORS. Form submission errors preserve the visitor's message. No messages or
email addresses are stored in browser persistence.
