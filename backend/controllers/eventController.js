import Event from '../models/eventModel.js';
import { v2 as cloudinary } from 'cloudinary';
import User from '../models/userModel.js';

const createTeamIdentifier = (performers) => {
    if (!performers || performers.length === 0) return '';
    return performers
        .map(p => `${p.firstName.toLowerCase().trim()}${p.lastName.toLowerCase().trim()}`)
        .sort()
        .join(',');
};

// 1. Create a new Event (Members/Admin)
export const createEvent = async (req, res, next) => {
  try {
    if (!req.files || !req.files.bannerImage) {
      return next(new Error('Event image is required', 400));
    }

    const { title, description, date, time, location, eventType } = req.body;

    const file = req.files.bannerImage;
    const myCloud = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "club_events",
    });

    const event = await Event.create({
        title,
        description,
        date,
        time,
        location,
        eventType,
        bannerImage: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        },
        createdBy: req.user.id, // Logged-in member
    });

    res.status(201).json({
        success: true,
        event,
    });

  } catch (error) {
    console.error("Create Event Error:", error);
    next(new Error('Failed to create event.', 500));
  }
};

// 2. Get All Events (Public)
export const getAllEvents = async (req, res, next) => {
    try {
        const events = await Event.find().sort({ date: -1 }); // Show newest first
        res.status(200).json({
            success: true,
            events,
        });
    } catch (error) {
        next(new Error('Could not fetch events.', 500));
    }
};

// 3. Get Single Event Details (Public)
export const getSingleEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('participants.registeredBy', 'fullName email');

        if (!event) {
            return next(new Error(`Event not found with id: ${req.params.id}`, 404));
        }
        res.status(200).json({
            success: true,
            event,
        });
    } catch (error) {
        next(new Error('Error fetching event details.', 500));
    }
};

// 4. Update Event (Members/Admin)
export const updateEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return next(new Error(`Event not found with id: ${req.params.id}`, 404));
        }

        // Manually update the fields from the request body
        event.title = req.body.title || event.title;
        event.description = req.body.description || event.description;
        event.date = req.body.date || event.date;
        event.location = req.body.location || event.location;
        event.eventType = req.body.eventType || event.eventType;

        // Handle new image upload only if a new file is provided
        if (req.files && req.files.bannerImage) {
            // Delete the old image from Cloudinary
            if (event.bannerImage && event.bannerImage.public_id) {
                await cloudinary.uploader.destroy(event.bannerImage.public_id);
            }

            // Upload the new image
            const file = req.files.bannerImage;
            const myCloud = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: "club_events",
            });
            event.bannerImage = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }

        // Save the updated event document
        const updatedEvent = await event.save();

        res.status(200).json({
            success: true,
            message: 'Event updated successfully.',
            event: updatedEvent,
        });

    } catch (error) {
        // Add more detailed logging for future debugging
        console.error("UPDATE EVENT ERROR:", error);
        next(new Error('Failed to update event.', 500));
    }
};

// 5. Delete Event (Members/Admin)
export const deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return next(new Error(`Event not found with id: ${req.params.id}`, 404));
        }

        await cloudinary.uploader.destroy(event.bannerImage.public_id); // <-- Corrected field name
        await event.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Event deleted successfully.',
        });
    } catch (error) {
        next(new Error('Failed to delete event.', 500));
    }
};

// 6. Participate in an Event (Users)
export const participateInEvent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { phone, email, performers } = req.body;

        const event = await Event.findById(id);
        if (!event) {
            return next(new Error('Event not found.', 404));
        }
        if (event.eventType !== 'PARTICIPATION') {
            return next(new Error('This event does not accept participants.', 400));
        }

        // --- NEW LOGIC: Check for duplicate performer teams from the same user ---
        const newTeamIdentifier = createTeamIdentifier(performers);

        const hasDuplicateTeam = event.participants.some(participant => {
            // Check if the registration is by the same user
            if (participant.registeredBy.toString() === req.user.id) {
                const existingTeamIdentifier = createTeamIdentifier(participant.performers);
                // Return true if the teams are identical
                return existingTeamIdentifier === newTeamIdentifier;
            }
            return false;
        });

        if (hasDuplicateTeam) {
            return next(new Error('You have already registered this exact team of performers for the event.', 409));
        }

        const newParticipant = {
            registeredBy: req.user.id,
            phone,
            email,
            performers,
        };

        event.participants.push(newParticipant);
        await event.save();

        res.status(200).json({
            success: true,
            message: 'Successfully registered your new team for the event!',
        });

    } catch (error) {
        next(new Error('Failed to register for the event.', 500));
    }
};

// 7. Get Event Participants (Members/Admin) - UPDATED
export const getEventParticipants = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id)
            // --- FIX: Populate the full user object for the registrant ---
            .populate('participants.registeredBy', 'fullName email contactNumber profileImage.url');

        if (!event) {
            return next(new Error('Event not found.', 404));
        }
        res.status(200).json({
            success: true,
            participants: event.participants,
        });
    } catch (error) {
        next(new Error('Could not fetch participants.', 500));
    }
};

export const getMyRegisteredEvents = async (req, res, next) => {
    try {
        // Find all events where the current user is listed as a participant
        const events = await Event.find({ 'participants.registeredBy': req.user.id })
            .select('title date location participants')
            .sort({ date: 1 });

        const allMyRegistrations = [];

        // Iterate through each event to find all of the user's registrations
        events.forEach(event => {
            const userRegistrationsForThisEvent = event.participants.filter(
                p => p.registeredBy.toString() === req.user.id
            );

            // For each registration, create a detailed record
            userRegistrationsForThisEvent.forEach(registration => {
                allMyRegistrations.push({
                    eventId: event._id,
                    eventTitle: event.title,
                    eventDate: event.date,
                    eventLocation: event.location,
                    registrationId: registration._id,
                    performers: registration.performers,
                });
            });
        });

        res.status(200).json({
            success: true,
            registrations: allMyRegistrations,
        });
    } catch (error) {
        next(new Error('Could not fetch your registered events.', 500));
    }
};

export const cancelMyRegistration = async (req, res, next) => {
    try {
        const { eventId, registrationId } = req.params;

        const event = await Event.findById(eventId);
        if (!event) {
            return next(new Error('Event not found.', 404));
        }

        // --- NEW: Robust date check to prevent same-day cancellation ---
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to the beginning of today

        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0); // Set to the beginning of the event day

        if (eventDate <= today) {
            return next(new Error('Cancellations are not allowed on or after the event date.', 400));
        }

        const registration = event.participants.id(registrationId);

        if (!registration || registration.registeredBy.toString() !== req.user.id) {
            return next(new Error('Registration not found or you are not authorized to cancel it.', 404));
        }

        await Event.findByIdAndUpdate(eventId, {
            $pull: { participants: { _id: registrationId } }
        });

        res.status(200).json({
            success: true,
            message: 'Your registration has been successfully cancelled.',
        });

    } catch (error) {
        next(new Error('Failed to cancel registration.', 500));
    }
};
