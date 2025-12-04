# Github Organization Invites

This script uses the Github API to create invitations to a Github organization
(e.g. "eecs280staff") and a single team (e.g. "Course Staff"). Users to invite
are specified by a list of emails in a JSON file (any users that are already
a member of the organization will be ignored).

## Getting Started

Ensure you have `node` (and `npm`) installed:

```console
sudo apt update
sudo apt install nodejs
```

OR

```console
brew install nodejs
```

If you already have node, make sure you have a somewhat recent version:

```console
node --version
```

From the base directory of this repo, install dependencies using `npm`:

```console
npm install
```

A post-install script should created template `.env` and `emails.json` files.

## Github Configuration

Edit the `.env` file. Make sure spaces are escaped or enclosed in quotes. For example:

```env
GITHUB_TOKEN=your_github_token_here
ORGANIZATION_NAME=eecs280staff
TEAM_NAME="Course Staff"
```

Consider generating a new token with a short lifetime for this purpose.
See [https://github.com/settings/tokens](https://github.com/settings/tokens).
Either a fine-grained token with Administration privileges or a classic token
with `admin:org` scope will work. Using an existing, long-lived token is not
recommended.

## Email List
Edit the `emails.json` file to include the list of emails to invite. For example:

```json
[
  "uniqname1@umich.edu",
  "uniqname2@umich.edu",
  "uniqname3@umich.edu"
]
```

The script checks if a user is already a member of the organization before sending an
invite, so it's fine to include emails that may already be members.

## Running the Script

Double check your configuration in `.env` and `emails.json`, then run:

```console
npx tsx invite-users.ts
```