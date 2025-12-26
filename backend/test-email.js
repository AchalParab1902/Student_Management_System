import { sendEmail } from './src/utils/sendEmail.js'; // Adjust path if needed
import dotenv from 'dotenv';

dotenv.config();

const testEmail = async () => {
    console.log("Testing email configuration...");
    console.log(`Host: ${process.env.EMAIL_HOST}`);
    console.log(`User: ${process.env.EMAIL_USER}`);
    
    try {
        await sendEmail({
            email: process.env.EMAIL_USER, // Send to self
            subject: 'Test Email',
            message: 'This is a test email to verify configuration.'
        });
        console.log("✅ Email sent successfully!");
    } catch (error) {
        console.error("❌ Email failed to send:");
        console.error(error);
    }
};

testEmail();
