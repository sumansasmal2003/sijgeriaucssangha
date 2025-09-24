import User from '../models/userModel.js';
import sendToken from '../utils/jwtToken.js';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';

// Temporary storage for OTPs. In a production app, use a more robust solution like Redis.
const otpStore = new Map();

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

// 1. Register a User and Send Verification OTP
export const registerUser = async (req, res, next) => {
  try {
    const { fullName, email, phone, password } = req.body;

    if (!req.files || !req.files.profileImage) {
      return next(new Error('Profile image is required', 400));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new Error('User with this email already exists', 409));
    }

    // Upload image to Cloudinary
    const file = req.files.profileImage;
    const myCloud = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "club_members/user_profiles",
        width: 150,
        crop: "scale",
    });

    // Hash password is now handled by the 'pre.save' middleware in the model
    const user = {
      fullName,
      email,
      phone,
      password: password, // Send the plain password to the model
      profileImage: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    };

    // Generate and store OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore.set(email, { otp, user, expires: otpExpires });

    const emailContent = `
        <p style="font-size: 16px; line-height: 1.6;">Hello ${fullName},</p>
        <p style="font-size: 16px; line-height: 1.6;">Thank you for registering. Use the following One-Time Password (OTP) to verify your email address. This OTP is valid for 10 minutes.</p>
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td align="center" style="padding: 20px 0;">
                    <div style="background-color: #4F46E5; color: #ffffff; padding: 14px 28px; text-align: center; display: inline-block; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 4px;">
                        ${otp}
                    </div>
                </td>
            </tr>
        </table>
    `;
    const htmlBody = createEmailTemplate('Email Verification', 'Your Verification Code', emailContent);

    await sendEmail({
      email: user.email,
      subject: 'Email Verification OTP',
      message: `Your OTP for Sijgeria Club registration is: ${otp}`,
      htmlBody: htmlBody,
    });

    res.status(200).json({
      success: true,
      message: `OTP sent to ${user.email}. Please verify to complete registration.`,
    });

  } catch (error) {
    console.error("Registration Error:", error);
    next(new Error('Registration failed. Please try again.', 500));
  }
};

// 2. Verify Email with OTP and Save User
export const verifyEmail = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const storedData = otpStore.get(email);

        if (!storedData) {
            return next(new Error('Invalid or expired OTP. Please try registering again.', 400));
        }
        if (Date.now() > storedData.expires) {
            otpStore.delete(email);
            return next(new Error('OTP has expired. Please try registering again.', 400));
        }
        if (storedData.otp !== otp) {
            return next(new Error('Incorrect OTP.', 400));
        }

        const newUser = await User.create({
            ...storedData.user,
            isEmailVerified: true,
        });

        otpStore.delete(email);

        // --- FIX: Generate token before sending ---
        const token = newUser.getJWTToken();
        sendToken(newUser, 201, token, res);

    } catch (error) {
        console.error("Verification Error:", error);
        next(new Error('Email verification failed.', 500));
    }
};


// 3. Login User
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new Error('Please provide email and password', 400));
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return next(new Error('Invalid email or password', 401));
        }

        // --- FIX: Send date in a standard ISO format ---
        if (user.isBlocked && new Date() < new Date(user.blockedUntil)) {
            const error = new Error(`Your account is blocked until ${user.blockedUntil.toISOString()}. Reason: ${user.blockReason}`);
            error.statusCode = 403; // Forbidden
            return next(error);
        }

        if (!user.isEmailVerified) {
             return next(new Error('Please verify your email before logging in.', 403));
        }

        const isPasswordMatched = await user.comparePassword(password);
        if (!isPasswordMatched) {
            return next(new Error('Invalid email or password', 401));
        }

        const token = user.getJWTToken();
        sendToken(user, 200, token, res);

    } catch (error) {
         next(new Error('Login failed.', 500));
    }
};

// 4. Logout User
export const logoutUser = async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: 'Logged out successfully',
    });
};

// 5. Get Logged-in User Details
export const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        next(new Error('Failed to fetch user details.', 500));
    }
};

export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return next(new Error('User not found with this email', 404));
        }

        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}?role=user`;
        const emailContent = `
            <p style="font-size: 16px; line-height: 1.6;">You requested a password reset. Please click the button below to set a new password. This link is valid for 15 minutes.</p>
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td align="center" style="padding: 20px 0;">
                        <a href="${resetPasswordUrl}" target="_blank" style="background-color: #4F46E5; color: #ffffff; padding: 14px 28px; text-align: center; text-decoration: none; display: inline-block; border-radius: 8px; font-size: 16px; font-weight: bold;">Reset Password</a>
                    </td>
                </tr>
            </table>
            <p style="font-size: 16px; line-height: 1.6;">If you did not request this, you can safely ignore this email.</p>
        `;
        const htmlBody = createEmailTemplate('Password Reset', 'Reset Your Password', emailContent);

        await sendEmail({
            email: user.email,
            subject: 'Sijgeria Club - Password Reset',
            message: `Your password reset link is: ${resetPasswordUrl}`,
            htmlBody: htmlBody,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully.`,
        });

    } catch (error) {
        if (req.body.email) {
            const user = await User.findOne({ email: req.body.email });
            if (user) {
                user.passwordResetToken = undefined;
                user.passwordResetTokenExpire = undefined;
                await user.save({ validateBeforeSave: false });
            }
        }
        next(new Error('Failed to send password reset email.', 500));
    }
};

// 6. Reset Password
export const resetPassword = async (req, res, next) => {
    try {
        const passwordResetToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            passwordResetToken,
            passwordResetTokenExpire: { $gt: Date.now() },
        }).select('+password');

        if (!user) {
            return next(new Error('Password reset token is invalid or has expired', 400));
        }

        if (req.body.password !== req.body.confirmPassword) {
            return next(new Error('Password and Confirm Password do not match', 400));
        }

        user.password = req.body.password;
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpire = undefined;

        await user.save();

        const token = user.getJWTToken();
        sendToken(user, 200, token, res);

    } catch (error) {
        console.error("USER PASSWORD RESET ERROR:", error);
        next(new Error('Failed to reset password.', 500));
    }
};

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        next(new Error('Failed to fetch users.', 500));
    }
};

export const blockUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { blockReason, blockDurationInDays } = req.body;

        if (!blockReason || !blockDurationInDays) {
            return next(new Error('Block reason and duration are required.', 400));
        }

        const user = await User.findById(userId);
        if (!user) {
            return next(new Error('User not found.', 404));
        }

        user.isBlocked = true;
        user.blockReason = blockReason;
        const blockUntilDate = new Date();
        blockUntilDate.setDate(blockUntilDate.getDate() + parseInt(blockDurationInDays));
        user.blockedUntil = blockUntilDate;

        await user.save({ validateBeforeSave: false });

        // Send an email notification to the blocked user
        const emailContent = `
            <p style="font-size: 16px; line-height: 1.6;">Dear ${user.fullName},</p>
            <p style="font-size: 16px; line-height: 1.6;">Your account has been temporarily blocked by a club member for the following reason:</p>
            <div style="background-color: #27272A; border-left: 4px solid #EF4444; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; font-size: 16px; line-height: 1.6;">${blockReason}</p>
            </div>
            <p style="font-size: 16px; line-height: 1.6;">Your account will be accessible again on: <strong style="color: #F8F8F8;">${blockUntilDate.toLocaleString()}</strong>.</p>
            <p style="font-size: 16px; line-height: 1.6;">If you believe this is a mistake, please contact the club administration.</p>
        `;
        const htmlBody = createEmailTemplate('Account Blocked', 'Your Account Has Been Blocked', emailContent);

        await sendEmail({
            email: user.email,
            subject: 'Your Club Account Has Been Temporarily Blocked',
            message: `Your account has been blocked. Reason: ${blockReason}`,
            htmlBody: htmlBody,
        });

        res.status(200).json({
            success: true,
            message: `User ${user.fullName} has been blocked successfully.`,
        });

    } catch (error) {
        next(new Error('Failed to block user.', 500));
    }
};

export const unblockUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            return next(new Error('User not found.', 404));
        }

        user.isBlocked = false;
        user.blockedUntil = undefined;
        user.blockReason = undefined;

        await user.save({ validateBeforeSave: false });

        // Optionally, send an email that the account has been unblocked
        const emailContent = `
            <p style="font-size: 16px; line-height: 1.6;">Dear ${user.fullName},</p>
            <p style="font-size: 16px; line-height: 1.6;">Your account has been unblocked by a club member and is now active.</p>
            <p style="font-size: 16px; line-height: 1.6;">You can now log in to your account as usual.</p>
             <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td align="center" style="padding: 20px 0;">
                        <a href="${process.env.FRONTEND_URL}/login" target="_blank" style="background-color: #4F46E5; color: #ffffff; padding: 14px 28px; text-align: center; text-decoration: none; display: inline-block; border-radius: 8px; font-size: 16px; font-weight: bold;">Login to Your Account</a>
                    </td>
                </tr>
            </table>
        `;
        const htmlBody = createEmailTemplate('Account Unblocked', 'Your Account Is Now Active', emailContent);

        await sendEmail({
            email: user.email,
            subject: 'Your Club Account Has Been Unblocked',
            message: 'Your account has been unblocked and is now active.',
            htmlBody: htmlBody,
        });

        res.status(200).json({
            success: true,
            message: `User ${user.fullName} has been unblocked successfully.`,
        });

    } catch (error) {
        next(new Error('Failed to unblock user.', 500));
    }
};

export const updateMyProfile = async (req, res, next) => {
    try {
        const { fullName, phone } = req.body;
        const user = await User.findById(req.user.id);

        if (fullName) user.fullName = fullName;
        if (phone) user.phone = phone;

        if (req.files && req.files.profileImage) {
            if (user.profileImage && user.profileImage.public_id) {
                await cloudinary.uploader.destroy(user.profileImage.public_id);
            }
            const file = req.files.profileImage;
            const myCloud = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: "club_members/user_profiles",
                width: 150,
                crop: "scale",
            });
            user.profileImage = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }

        await user.save();
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully.',
            user,
        });
    } catch (error) {
        next(new Error('Failed to update profile.', 500));
    }
};

// 7. Update Logged-in User's Password
export const updateMyPassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;
        if (!oldPassword || !newPassword || !confirmPassword) {
            return next(new Error('Please provide all password fields.', 400));
        }

        const user = await User.findById(req.user.id).select('+password');
        const isPasswordMatched = await user.comparePassword(oldPassword);
        if (!isPasswordMatched) {
            return next(new Error('Incorrect old password.', 401));
        }
        if (newPassword !== confirmPassword) {
            return next(new Error('New password and confirm password do not match.', 400));
        }

        user.password = newPassword;
        await user.save();

        const token = user.getJWTToken();
        sendToken(user, 200, token, res);
    } catch (error) {
        next(new Error('Failed to update password.', 500));
    }
};

export const getPublicVolunteers = async (req, res, next) => {
    try {
        const users = await User.find({ role: 'User' })
            .select('fullName profileImage email phone'); // Select only public fields

        res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        next(new Error('Failed to fetch volunteers.', 500));
    }
};

export const resendVerificationOtp = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return next(new Error('Email is required to resend OTP.', 400));
        }

        const storedData = otpStore.get(email);
        if (!storedData) {
            return next(new Error('No pending registration found for this email. Please register first.', 404));
        }

        // Generate and store a new OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        // Update the existing entry in the map
        storedData.otp = otp;
        storedData.expires = otpExpires;
        otpStore.set(email, storedData);

        // --- STYLISH EMAIL ---
        const emailContent = `
            <p style="font-size: 16px; line-height: 1.6;">Hello,</p>
            <p style="font-size: 16px; line-height: 1.6;">As requested, here is your new One-Time Password (OTP). This OTP is valid for 10 minutes.</p>
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td align="center" style="padding: 20px 0;">
                        <div style="background-color: #4F46E5; color: #ffffff; padding: 14px 28px; text-align: center; display: inline-block; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 4px;">
                            ${otp}
                        </div>
                    </td>
                </tr>
            </table>
        `;
        const htmlBody = createEmailTemplate('New Verification Code', 'Your New OTP', emailContent);

        await sendEmail({
            email: email,
            subject: 'New Email Verification OTP',
            message: `Your new OTP for Sijgeria Club registration is: ${otp}`,
            htmlBody: htmlBody,
        });

        res.status(200).json({
            success: true,
            message: `A new OTP has been sent to ${email}.`,
        });

    } catch (error) {
        console.error("Resend OTP Error:", error);
        next(new Error('Failed to resend OTP.', 500));
    }
};
