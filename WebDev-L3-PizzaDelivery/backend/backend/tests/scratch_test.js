import { sendVerificationEmail } from '../src/services/mail.services.js';

async function test() {
    await sendVerificationEmail('test@example.com', 'test-token-123');
    process.exit(0);
}

test();
