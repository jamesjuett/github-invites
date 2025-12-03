
// Create an emails.json file with an empty array if it doesn't exist

import { create } from 'domain';
import fs from 'fs';
import path from 'path';

// Create a .env file with placeholders if it doesn't exist

createIfNotExists(
  ".env",
`GITHUB_TOKEN=
ORGANIZATION_NAME=
TEAM_NAME=
`);

createIfNotExists(
  "emails.json",
`[

]`);

function createIfNotExists(fileName, content) {
  const filePath = path.resolve(process.cwd(), fileName);
  if (!fs.existsSync(filePath)) {
    try {
      fs.writeFileSync(filePath, content);
    } catch (error) {
      console.error(`SETUP ERROR: Failed to create ${fileName} file:`, error);
    }
  }
}