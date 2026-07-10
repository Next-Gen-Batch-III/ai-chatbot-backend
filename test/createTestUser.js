// test/createTestUser.js
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { clerkClient } from '@clerk/express';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function createAndAssignRole() {
  try {
    const user = await clerkClient.users.createUser({
      emailAddress: ['testuser+clerk_test@example.com'],
      password: 'a_very_secure_password_123',
      firstName: 'Test',
      lastName: 'User'
    });
    console.log(`Created user: ${user.firstName} (ID: ${user.id})`);

    await clerkClient.users.updateUserMetadata(user.id, {
      publicMetadata: {
        role: 'admin'
      }
    });
    console.log(`Successfully assigned role "admin" to user publicMetadata.`);

  } catch (error) {
    console.error('Failed execution:', error);
  }
}

createAndAssignRole();