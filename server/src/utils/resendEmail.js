import { Resend } from 'resend';
import { ApiError } from './api-error.js';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const generateHtml = ({ name, intro, actionText, actionLink, actionColor, outro }) => {
    return `
    <div style="font-family: sans-serif; padding: 20px;">
      <h2>Hello ${name},</h2>
      <p>${intro}</p>
      <p>
        <a href="${actionLink}" style="padding: 10px 20px; background-color: ${actionColor}; color: #fff; text-decoration: none; border-radius: 5px;">
          ${actionText}
        </a>
      </p>
      <p>${outro}</p>
    </div>
  `;
};

const sendMail = async ({ email, subject, mailGenContent }) => {
    const { name, intro, action, outro } = mailGenContent.body;

    const html = generateHtml({
        name,
        intro,
        actionText: action.button.text,
        actionLink: action.button.link,
        actionColor: action.button.color,
        outro,
    });

    try {
        await resend.emails.send({
            from: 'Spendwise <noreply@sujeettech.com>',
            to: email,
            subject,
            html,
        });
    } catch (error) {
        console.error('Failed to send email:', error.message);
        throw new ApiError(500, 'Failed to send email. Please try again later.');
    }
};

const emailVerificationMailGenContent = (name, verificationUrl) => ({
    body: {
        name,
        intro: "Welcome to Spendwise! We're excited to have you on board.",
        action: {
            instructions: "To get started, please verify your email address:",
            button: {
                color: "#22BC66",
                text: "Verify Email",
                link: verificationUrl,
            },
        },
        outro: "Need help or have questions? Just reply to this email—we're happy to help!",
    },
});

const forgotPasswordMailGenContent = (name, resetUrl) => ({
    body: {
        name,
        intro: "We received a request to reset your password.",
        action: {
            instructions: "Click the button below to reset your password:",
            button: {
                color: "#F2545B",
                text: "Reset Password",
                link: resetUrl,
            },
        },
        outro: "If you didn't request a password reset, you can safely ignore this email.",
    },
});

const withRetry = async (fn, maxRetries = 3) => {
    let attempt = 0;
    while (attempt < maxRetries) {
        try {
            return await fn();
        } catch (error) {
            attempt++;
            console.warn(`Attempt ${attempt} failed:`, error.message);
            if (attempt >= maxRetries) {
                throw new ApiError(500, 'Failed after multiple attempts.');
            }
            await new Promise(res => setTimeout(res, 500 * 2 ** (attempt - 1)));
        }
    }
};

const sendVerificationEmail = async ({ email, name, verificationToken }) => {
    const verificationUrl = `${process.env.BASE_URL}/api/v1/users/verify/${verificationToken}`;
    return withRetry(() =>
        sendMail({
            email,
            subject: 'Verify Your Email - Spendwise',
            mailGenContent: emailVerificationMailGenContent(name || 'User', verificationUrl),
        })
    );
};

const resendVerificationEmail = async ({ email, name, verificationToken }) => {
    const verificationUrl = `${process.env.BASE_URL}/api/v1/users/verify/${verificationToken}`;
    return withRetry(() =>
        sendMail({
            email,
            subject: 'Resend Verification - Spendwise',
            mailGenContent: emailVerificationMailGenContent(name || 'User', verificationUrl),
        })
    );
};

const sendForgotPasswordEmail = async ({ email, name, resetToken }) => {
    const resetUrl = `${process.env.BASE_URL}/api/v1/users/reset-password/${resetToken}`;
    return withRetry(() =>
        sendMail({
            email,
            subject: 'Password Reset - Spendwise',
            mailGenContent: forgotPasswordMailGenContent(name || 'User', resetUrl),
        })
    );
};

export {
    sendMail,
    emailVerificationMailGenContent,
    forgotPasswordMailGenContent,
    sendVerificationEmail,
    resendVerificationEmail,
    sendForgotPasswordEmail,
};
