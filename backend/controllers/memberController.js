import Member from '../models/memberModel.js';
import sendToken from '../utils/jwtToken.js';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';

// 1. Invite a new Member (Admin Only)
export const inviteMember = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, designation } = req.body;

    const memberExists = await Member.findOne({ email });
    if (memberExists) {
      return next(new Error(`Member with email ${email} already exists.`, 409));
    }

    const invitationToken = crypto.randomBytes(32).toString('hex');

    // No need to manually add memberId here, the model handles it now
    const member = await Member.create({
      firstName,
      lastName,
      email,
      phone,
      designation,
      invitationToken,
    });

    // Create the profile completion URL
    const completeProfileUrl = `${process.env.FRONTEND_URL}/complete-profile/${invitationToken}`;

    const plainTextMessage = `You have been invited to join the Sijgeria Umesh Chandra Smriti Sangha.\n\nPlease complete your profile by clicking the link below:\n\n${completeProfileUrl}\n\nThis link is valid for 7 days.`;

    const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invitation to Sijgeria Club</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 20px;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #ffffff; border: 1px solid #dee2e6; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <!-- Header -->
        <tr>
            <td align="center" style="padding: 30px 20px; background-color: #6a1b9a; color: #ffffff; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0; font-size: 28px; font-weight: 500;">Sijgeria Umesh Chandra Smriti Sangha</h1>
            </td>
        </tr>
        <!-- Body -->
        <tr>
            <td style="padding: 40px 30px;">
                <h2 style="color: #343a40; margin-top: 0; font-weight: 600;">You're Invited to Join Us!</h2>
                <p style="color: #495057; font-size: 16px; line-height: 1.6;">Hello ${firstName},</p>
                <p style="color: #495057; font-size: 16px; line-height: 1.6;">You have been personally invited to become a member of our community. We are delighted to extend this invitation and look forward to welcoming you.</p>
                <p style="color: #495057; font-size: 16px; line-height: 1.6;">To accept your invitation and set up your profile, please click the button below:</p>
                <!-- CTA Button -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td align="center" style="padding: 20px 0;">
                            <a href="${completeProfileUrl}" target="_blank" style="background-color: #7b1fa2; color: #ffffff; padding: 14px 28px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px; font-size: 16px; font-weight: bold; transition: background-color 0.3s;">Complete Your Profile</a>
                        </td>
                    </tr>
                </table>
                <p style="color: #495057; font-size: 16px; line-height: 1.6;">This invitation link will be valid for the next 7 days.</p>
                <p style="color: #495057; font-size: 16px; line-height: 1.6;">If you have any questions, feel free to contact us.</p>
                <p style="color: #495057; font-size: 16px; line-height: 1.6; margin-top: 30px;">Best regards,<br/><strong>The Admin Team</strong><br/>Sijgeria Umesh Chandra Smriti Sangha</p>
            </td>
        </tr>
        <!-- Footer -->
        <tr>
            <td align="center" style="padding: 20px; background-color: #f1f3f5; border-radius: 0 0 8px 8px; color: #6c757d; font-size: 12px;">
                &copy; ${new Date().getFullYear()} Sijgeria Umesh Chandra Smriti Sangha. All Rights Reserved.
            </td>
        </tr>
    </table>
</body>
</html>
`;

    await sendEmail({
      email: member.email,
      subject: 'Invitation to Join Sijgeria Club',
      message: plainTextMessage,
      htmlBody: htmlBody,
    });

    res.status(200).json({
      success: true,
      message: `Invitation sent to ${member.email}`,
    });
  } catch (error) {
    console.error("Invite Error:", error);
    next(new Error('Failed to send invitation.', 500));
  }
};

// 2. Complete Member Profile (using invitation token)
export const completeMemberProfile = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return next(new Error("Passwords do not match!", 400));
        }

        if (!req.files || !req.files.profileImage) {
            return next(new Error('Profile image is required', 400));
        }

        const member = await Member.findOne({ invitationToken: token });

        if (!member) {
            return next(new Error('Invalid or expired invitation link.', 400));
        }

        // Upload image to Cloudinary
        const file = req.files.profileImage;
        const myCloud = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: "club_members/member_profiles",
            width: 150,
            crop: "scale",
        });

        member.password = password; // The 'pre.save' hook will hash this
        member.profileImage = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };
        member.status = 'ACTIVE';
        member.invitationToken = undefined; // Clear the token

        await member.save();

        // --- FIX: Generate token first, then send ---
        const authToken = member.getJWTToken();
        sendToken(member, 200, authToken, res);

    } catch (error) {
        console.error("Profile Completion Error:", error);
        next(new Error('Failed to complete profile.', 500));
    }
};

// 3. Login Member
export const loginMember = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new Error('Please provide email and password', 400));
        }

        const member = await Member.findOne({ email }).select('+password');

        if (!member) {
            return next(new Error('Invalid email or password', 401));
        }
        if (member.status !== 'ACTIVE') {
             return next(new Error('Your account is not active. Please complete your profile or contact an admin.', 403));
        }

        const isPasswordMatched = await member.comparePassword(password);

        if (!isPasswordMatched) {
            return next(new Error('Invalid email or password', 401));
        }

        // --- FIX: Generate token before sending ---
        const token = member.getJWTToken();
        sendToken(member, 200, token, res);

    } catch (error) {
         next(new Error('Login failed.', 500));
    }
};


// --- ADMIN CRUD OPERATIONS ---

// 4. Get All Members (Admin)
export const getAllMembers = async (req, res, next) => {
    try {
        const members = await Member.find();
        res.status(200).json({
            success: true,
            members,
        });
    } catch (error) {
        next(new Error('Could not fetch members.', 500));
    }
};

// 5. Get Single Member Details (Admin)
export const getSingleMember = async (req, res, next) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) {
            return next(new Error(`Member not found with id: ${req.params.id}`, 404));
        }
        res.status(200).json({
            success: true,
            member,
        });
    } catch (error) {
        next(new Error('Error fetching member details.', 500));
    }
};

// 6. Update Member Details (Admin)
export const updateMemberDetails = async (req, res, next) => {
    try {
        // Only allow updating designation and phone number by admin for now
        const { designation, phone } = req.body;
        const member = await Member.findByIdAndUpdate(req.params.id, { designation, phone }, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });

        if (!member) {
            return next(new Error(`Member not found with id: ${req.params.id}`, 404));
        }

        res.status(200).json({
            success: true,
            message: 'Member details updated.',
            member,
        });
    } catch (error) {
        next(new Error('Failed to update member details.', 500));
    }
};

// 7. Delete Member (Admin)
export const deleteMember = async (req, res, next) => {
    try {
        const member = await Member.findById(req.params.id);

        if (!member) {
            return next(new Error(`Member not found with id: ${req.params.id}`, 404));
        }

        // Optional: Delete profile image from Cloudinary
        if (member.profileImage && member.profileImage.public_id) {
            await cloudinary.uploader.destroy(member.profileImage.public_id);
        }

        await member.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Member deleted successfully.',
        });
    } catch (error) {
        next(new Error('Failed to delete member.', 500));
    }
};

export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const member = await Member.findOne({ email });

        if (!member) {
            return next(new Error('Member not found with this email', 404));
        }
        if (member.status !== 'ACTIVE') {
            return next(new Error('Cannot reset password for a non-active member.', 400));
        }

        const resetToken = member.getResetPasswordToken();
        await member.save({ validateBeforeSave: false });

        const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}?role=member`;

        const plainTextMessage = `A password reset was requested for your member account. Please click the link to proceed:\n\n${resetPasswordUrl}\n\nThis link is valid for 15 minutes.`;

        const htmlBody = `
        <!DOCTYPE html>
        <html lang="en">
        <body style="font-family: Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 20px;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #ffffff; border: 1px solid #dee2e6; border-radius: 8px;">
                <tr><td align="center" style="padding: 30px 20px; background-color: #6a1b9a; color: #ffffff; border-radius: 8px 8px 0 0;"><h1 style="margin: 0;">Member Password Reset</h1></td></tr>
                <tr>
                    <td style="padding: 40px 30px;">
                        <h2 style="color: #343a40;">Reset Your Member Password</h2>
                        <p style="color: #495057; font-size: 16px;">Click the button below to set a new password for your member account.</p>
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr><td align="center" style="padding: 20px 0;"><a href="${resetPasswordUrl}" target="_blank" style="background-color: #7b1fa2; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Member Password</a></td></tr>
                        </table>
                        <p style="color: #495057; font-size: 16px;">This link is valid for 15 minutes. If you did not request this, please ignore this email.</p>
                    </td>
                </tr>
                <tr><td align="center" style="padding: 20px; background-color: #f1f3f5; border-radius: 0 0 8px 8px; color: #6c757d; font-size: 12px;">&copy; ${new Date().getFullYear()} Sijgeria Umesh Chandra Smriti Sangha. All Rights Reserved.</td></tr>
            </table>
        </body>
        </html>
        `;

        await sendEmail({
            email: member.email,
            subject: 'Sijgeria Club - Member Password Reset',
            message: plainTextMessage,
            htmlBody: htmlBody
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${member.email} successfully.`,
        });

    } catch (error) {
        if (req.body.email) {
            const member = await Member.findOne({ email: req.body.email });
            if (member) {
                member.passwordResetToken = undefined;
                member.passwordResetTokenExpire = undefined;
                await member.save({ validateBeforeSave: false });
            }
        }
        next(new Error('Failed to send password reset email.', 500));
    }
};

// 9. Reset Member Password
export const resetPassword = async (req, res, next) => {
    try {
        const passwordResetToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const member = await Member.findOne({
            passwordResetToken,
            passwordResetTokenExpire: { $gt: Date.now() },
        }).select('+password');

        if (!member) {
            return next(new Error('Password reset token is invalid or has expired', 400));
        }

        if (req.body.password !== req.body.confirmPassword) {
            return next(new Error('Passwords do not match', 400));
        }

        member.password = req.body.password;
        member.passwordResetToken = undefined;
        member.passwordResetTokenExpire = undefined;

        await member.save();

        const token = member.getJWTToken();
        sendToken(member, 200, token, res);

    } catch (error) {
        console.error("MEMBER PASSWORD RESET ERROR:", error);
        next(new Error('Failed to reset member password.', 500));
    }
};

export const logoutMember = (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        message: 'Member logged out successfully',
    });
};

// NEW: Get Logged-in Member Details
export const getMe = async (req, res, next) => {
    try {
        const member = await Member.findById(req.user.id);
        res.status(200).json({
            success: true,
            member,
        });
    } catch (error) {
        next(new Error('Failed to fetch member details.', 500));
    }
};

export const updateMyProfile = async (req, res, next) => {
    try {
        const { firstName, lastName, phone } = req.body;
        const member = await Member.findById(req.user.id);

        if (firstName) member.firstName = firstName;
        if (lastName) member.lastName = lastName;
        if (phone) member.phone = phone;

        // Handle new profile image upload
        if (req.files && req.files.profileImage) {
            // Delete old image from Cloudinary if it exists
            if (member.profileImage && member.profileImage.public_id) {
                await cloudinary.uploader.destroy(member.profileImage.public_id);
            }
            const file = req.files.profileImage;
            const myCloud = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: "club_members/member_profiles",
                width: 150,
                crop: "scale",
            });
            member.profileImage = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }

        await member.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully.',
            member,
        });
    } catch (error) {
        next(new Error('Failed to update profile.', 500));
    }
};

// Update Logged-in Member's Password
export const updateMyPassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;

        if (!oldPassword || !newPassword || !confirmPassword) {
            return next(new Error('Please provide all password fields.', 400));
        }

        const member = await Member.findById(req.user.id).select('+password');

        const isPasswordMatched = await member.comparePassword(oldPassword);
        if (!isPasswordMatched) {
            return next(new Error('Incorrect old password.', 401));
        }

        if (newPassword !== confirmPassword) {
            return next(new Error('New password and confirm password do not match.', 400));
        }

        member.password = newPassword;
        await member.save();

        // Send a fresh token after password update
        const token = member.getJWTToken();
        sendToken(member, 200, token, res);

    } catch (error) {
        next(new Error('Failed to update password.', 500));
    }
};

export const getMemberDirectory = async (req, res, next) => {
    try {
        const members = await Member.find({ status: 'ACTIVE' })
            .select('firstName lastName designation profileImage phone email')
            .sort({ firstName: 1 });

        res.status(200).json({
            success: true,
            members,
        });
    } catch (error) {
        next(new Error('Could not fetch member directory.', 500));
    }
};

export const getPublicDirectory = async (req, res, next) => {
    try {
        const officials = await Member.find({
            status: 'ACTIVE',
            designation: { $in: ['President', 'Secretary', 'Member', 'Admin'] }
        })
        .select('firstName lastName designation profileImage phone email')
        .sort({ designation: 1 }); // Sort to show President first

        res.status(200).json({
            success: true,
            officials,
        });
    } catch (error) {
        next(new Error('Could not fetch public directory.', 500));
    }
};
