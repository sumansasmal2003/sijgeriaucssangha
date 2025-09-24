import VolunteerLog from '../models/volunteerLogModel.js';
import Event from '../models/eventModel.js';

// 1. Submit Volunteer Hours
export const submitVolunteerHours = async (req, res, next) => {
    try {
        const { eventId, hours, description } = req.body;
        const userId = req.user.id;

        // Check if the user actually participated in the event
        const event = await Event.findById(eventId);
        const isParticipant = event.participants.some(p => p.registeredBy.toString() === userId);
        if (!isParticipant) {
            return next(new Error("You can only log hours for events you are registered in.", 403));
        }

        const log = await VolunteerLog.create({
            user: userId,
            event: eventId,
            hours,
            description,
        });

        res.status(201).json({
            success: true,
            message: "Volunteer hours submitted successfully for review.",
            log,
        });
    } catch (error) {
        next(new Error("Failed to submit volunteer hours.", 500));
    }
};

// 2. Get a User's Volunteer Logs
export const getMyVolunteerLogs = async (req, res, next) => {
    try {
        const logs = await VolunteerLog.find({ user: req.user.id }).populate('event', 'title date');
        res.status(200).json({
            success: true,
            logs,
        });
    } catch (error) {
        next(new Error("Failed to fetch volunteer logs.", 500));
    }
};

export const getAllPendingLogs = async (req, res, next) => {
    try {
        const pendingLogs = await VolunteerLog.find({ status: 'Pending' })
            .populate('user', 'fullName profileImage.url')
            .populate('event', 'title date')
            .sort({ loggedAt: 1 }); // Show the oldest first

        res.status(200).json({
            success: true,
            logs: pendingLogs,
        });
    } catch (error) {
        next(new Error("Failed to fetch pending logs.", 500));
    }
};

// 4. Update a Log's Status (for Members/Admins)
export const updateLogStatus = async (req, res, next) => {
    try {
        const { logId } = req.params;
        const { status } = req.body; // Expecting 'Approved' or 'Rejected'

        if (!['Approved', 'Rejected'].includes(status)) {
            return next(new Error("Invalid status provided.", 400));
        }

        const log = await VolunteerLog.findById(logId);
        if (!log) {
            return next(new Error("Log not found.", 404));
        }

        log.status = status;
        await log.save();

        // Optional: Send an email notification to the user about the status update

        res.status(200).json({
            success: true,
            message: `Log status has been updated to ${status}.`,
            log,
        });
    } catch (error) {
        next(new Error("Failed to update log status.", 500));
    }
};
