import Donation from '../models/donationModel.js';

export const createDonationRecord = async (req, res, next) => {
    try {
        const { name, email, amount } = req.body;

        await Donation.create({ name, email, amount });

        res.status(201).json({
            success: true,
            message: 'Donation record created. Please proceed to payment.',
        });

    } catch (error) {
        next(new Error('Failed to create donation record.', 500));
    }
};
