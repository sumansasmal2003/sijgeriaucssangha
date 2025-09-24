import sendEmail from '../utils/sendEmail.js';

// --- Reusable Email Template ---
const createEmailTemplate = (title, preheader, content) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #0C0C0D; margin: 0; padding: 20px; color: #A1A1AA;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #18181B; border: 1px solid #27272A; border-radius: 12px;">
            <tr>
                <td align="center" style="padding: 30px 20px; background-color: #111113; border-bottom: 1px solid #27272A; border-radius: 12px 12px 0 0;">
                    <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #F8F8F8;">Sijgeria UCS Sangha</h1>
                </td>
            </tr>
            <tr>
                <td style="padding: 40px 30px;">
                    <h2 style="color: #F8F8F8; margin-top: 0; font-weight: 600;">${preheader}</h2>
                    ${content}
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 20px; background-color: #111113; border-top: 1px solid #27272A; border-radius: 0 0 12px 12px; color: #6c757d; font-size: 12px;">
                    &copy; ${new Date().getFullYear()} Sijgeria Umesh Chandra Smriti Sangha. All Rights Reserved.
                </td>
            </tr>
        </table>
    </body>
    </html>`;
};


export const submitContactForm = async (req, res, next) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return next(new Error('Please fill out all fields.', 400));
        }

        // --- STYLISH EMAIL to ADMIN ---
        const adminEmailContent = `
            <p style="font-size: 16px; line-height: 1.6;">You have received a new contact form submission with the following details:</p>
            <div style="background-color: #27272A; border-left: 4px solid #4F46E5; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${name}</p>
                <p style="margin: 0 0 10px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #4F46E5;">${email}</a></p>
                <p style="margin: 0 0 10px 0;"><strong>Subject:</strong> ${subject}</p>
                <p style="margin: 0;"><strong>Message:</strong></p>
                <p style="margin: 5px 0 0 0; white-space: pre-wrap;">${message}</p>
            </div>
        `;
        const adminHtmlBody = createEmailTemplate('New Contact Submission', 'New Message from Website', adminEmailContent);

        await sendEmail({
            email: process.env.SMTP_MAIL, // Your admin email
            subject: `New Contact Form Submission: ${subject}`,
            message: `New message from ${name} (${email}): ${message}`,
            htmlBody: adminHtmlBody,
        });

        // --- STYLISH EMAIL to USER ---
        const userEmailContent = `
            <p style="font-size: 16px; line-height: 1.6;">Dear ${name},</p>
            <p style="font-size: 16px; line-height: 1.6;">Thank you for contacting us. We have successfully received your message and will get back to you as soon as possible.</p>
            <p style="font-size: 16px; line-height: 1.6;">Here is a copy of your message for your records:</p>
            <div style="background-color: #27272A; border-left: 4px solid #BE185D; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; white-space: pre-wrap;"><em>"${message}"</em></p>
            </div>
            <p style="font-size: 16px; line-height: 1.6;">Sincerely,<br/>The Sijgeria UCS Sangha Team</p>
        `;
        const userHtmlBody = createEmailTemplate('Message Received', 'We\'ve Received Your Message', userEmailContent);

        await sendEmail({
            email: email,
            subject: 'We Have Received Your Message',
            message: `Dear ${name},\n\nThank you for contacting us. We have received your message and will get back to you as soon as possible.`,
            htmlBody: userHtmlBody,
        });

        res.status(200).json({
            success: true,
            message: "Your message has been sent successfully!",
        });

    } catch (error) {
        next(new Error('Failed to send message. Please try again later.', 500));
    }
};
