# Public-repository privacy boundary

## Included

- interface components;
- synthetic demo records;
- local-state interactions;
- connector architecture;
- module and event schemas.

## Excluded

- real names, phone numbers, birthdays, addresses, employers, or relationships;
- emails, messages, browser history, listening history, or health exports;
- account balances, transactions, policies, VINs, registrations, or documents;
- resumes, job applications, relocation plans, or private project metadata;
- OAuth clients, access tokens, API keys, cookies, databases, and embeddings;
- absolute paths from any personal machine.

The public application must remain useful with `LCP_DEMO_MODE=true` and no
external credentials.
