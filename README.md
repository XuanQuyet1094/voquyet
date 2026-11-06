# Rewards orchestration — Group 2

Isolated copy of `XuanQuyet1094/quyetvo` at commit `14baf955d81b65b16a1263822f9586aa04dbec6d`.
No credentials, sessions, claims, reports or account data were copied.

## Current status

- All earning and maintenance workflows are manual-only; no cron or one-off push triggers were copied.
- All workflows except synthetic Automation checks are locked until repository variable `REWARDS_GROUP2_ENABLED` is exactly `true`.
- Six workers remain sequential with concurrency `rewards-accounts-1-6` and random 100–180 second rest.
- Telegram notifications are prefixed with **NHÓM 2** and are saved privately before delivery.
- Source bot is unchanged and remains pinned by `rewards-account.yml`.
- Persistent state is fixed to `XuanQuyet1094/rewards-state-group2`, branch `rewards-state`.

## Required configuration in this public repository

Add these as **Actions repository secrets**, never as committed files:

| Secret | Purpose |
|---|---|
| `REWARDS_SOURCE_REPO` | Existing private bot source repository (`owner/repo`); this is NOT the state repository |
| `PRIVATE_REPO_TOKEN` | Read access to the source repository |
| `REWARDS_STATE_TOKEN` | Contents read/write access to `rewards-state-group2` |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Private notification destination for group 2 |
| `AZDIGI_SSH_HOST`, `AZDIGI_SSH_USER`, `AZDIGI_SSH_PORT` | Group 2 SSH SOCKS tunnel server; names are retained for compatibility with the original workflows |
| `AZDIGI_SSH_KEY`, `AZDIGI_KNOWN_HOSTS` | SSH private key and independently verified known-hosts entries for that server |
| `ACCOUNT_1_EMAIL` … `ACCOUNT_6_EMAIL` | Group 2 account identities |
| `ACCOUNT_1_PASSWORD` … `ACCOUNT_6_PASSWORD` | Corresponding account passwords, as required by each account |
| `ACCOUNT_1_TOTP_SECRET` … `ACCOUNT_6_TOTP_SECRET` | Authenticator setup secrets only for accounts that use TOTP; do not add arbitrary values for accounts without it |
| `ACCOUNT_1_RECOVERY_EMAIL` … `ACCOUNT_6_RECOVERY_EMAIL` | Recovery identities only where needed |

Do not add `REWARDS_PRIVATE_REPO`: workflow state destination is explicitly isolated already.
The source-access preflight checks `REWARDS_SOURCE_REPO` separately from private storage.
This copy currently supports the original **SSH dynamic SOCKS tunnel**, not an arbitrary HTTP proxy URL.
If the second hosting service only supplies HTTP/SOCKS credentials without SSH, the tunnel step must be adapted before activation.

## Activation checklist

1. Configure group 2 secrets and verify the SSH host key outside an untrusted keyscan alone.
2. Set Actions repository variable `REWARDS_GROUP2_ENABLED=true` only after setup is complete.
3. Run **Configuration check only** for one selected account. It verifies access without earning activities or Telegram messages.
4. Run **run-rewards** manually with the intended `morning`, `retry` or `reconcile` mode. Existing Vietnam date/deadline and per-account claim rules remain enforced.
5. Restore recurring cron triggers only after a real test passes and the intended schedule has been confirmed.

The old repository is not modified. GitHub concurrency groups are repository-scoped, so the same group name does not serialize two different repositories.

Use only accounts and activity permitted by Microsoft Rewards and GitHub terms. A new repository or proxy does not change account eligibility or service limits.

## Validation

Run `node --test .github/scripts/*.test.cjs` with Node 24.
Synthetic tests do not log in to real accounts or earn points.
