import dotenv from "dotenv";
import { Octokit } from "octokit";
import { readFileSync } from "fs";

function requireEnvVar(varName: string): string {
  const value = process.env[varName];
  if (!value) {
    console.error(`Please set the ${varName} environment variable or add to the .env file.`);
    process.exit(1);
  }
  return value;
}

async function main() {

  // Load environment variables from .env file
  dotenv.config();

  const env = {
    GITHUB_TOKEN: requireEnvVar("GITHUB_TOKEN"),
    ORGANIZATION_NAME: requireEnvVar("ORGANIZATION_NAME"),
    TEAM_NAME: requireEnvVar("TEAM_NAME"),
  };

  const octokit = new Octokit({
    auth: env.GITHUB_TOKEN
    // Authentication not checked immediately, only upon requests
  });

  const EMAILS = JSON.parse(readFileSync('emails.json', 'utf-8'));
  if (!Array.isArray(EMAILS) || !EMAILS.every(email => typeof email === 'string')) {
    console.error("staff-emails.json must contain a JSON array of email addresses.");
    process.exit(1);
  }

  const teams_response = await octokit.request(`GET /orgs/{org}/teams`, {
    org: env.ORGANIZATION_NAME,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });

  const team_id = teams_response.data.find((team: any) => team.name === env.TEAM_NAME)?.id;

  if (team_id === undefined) {
    console.log(`Team ${env.TEAM_NAME} not found in organization ${env.ORGANIZATION_NAME}`);
    process.exit(1);
  }

  console.log(`Found team ${env.TEAM_NAME} in organization ${env.ORGANIZATION_NAME} with team id: ${team_id}`);
  console.log(`Inviting ${EMAILS.length} staff members...`);
  
  await Promise.all(EMAILS.map(async email => {
    try {
      const invite_response = await octokit.request(`POST /orgs/{org}/invitations`, {
        org: env.ORGANIZATION_NAME,
        email: email,
        role: 'direct_member',
        team_ids: [
          team_id
        ],
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });

      console.log(`Created an invite for: ${invite_response.data.email}`);
    }
    catch(e: any) {
      if (e.status === 422 && e.response.data.errors?.[0]?.message === "A user with this email address is already a part of this organization") {
        console.log(`${email} is already a member of the organization.`);
      }
      else {
        console.error(`Unable to invite ${email}.`);
        console.error(e.response.data);
      }
    }
  }));

  console.log("Finished! Check membership and the list of pending invites via the web:");
  console.log(`https://github.com/orgs/${env.ORGANIZATION_NAME}/people`);

}

main();