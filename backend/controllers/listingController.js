const { Listing, HotelListing, CinemaListing, SpaceListing, VehicleListing } = require('../models/Listing');

exports.createListing = async (req, res) => {
    try {
        const { vendorId, title, description, type, price, location, ...details } = req.body;
        // In a real app, vendorId would come from req.user.id (from auth middleware)

        let newListing;

        // Create listing based on type using discriminators
        switch (type) {
            case 'hotel':
                newListing = new HotelListing({
                    vendorId,
                    title,
                    description,
                    price,
                    location,
                    roomType: details.roomType,
                    amenities: details.amenities || []
                });
                break;
            case 'cinema':
                newListing = new CinemaListing({
                    vendorId,
                    title,
                    description,
                    price,
                    location,
                    movieTitle: details.movieTitle,
                    showTime: details.showTime,
                    seatLayout: details.seatLayout
                });
                break;
            case 'space':
                newListing = new SpaceListing({
                    vendorId,
                    title,
                    description,
                    price,
                    location,
                    area: details.area,
                    usageType: details.usageType
                });
                break;
            case 'vehicle':
                newListing = new VehicleListing({
                    vendorId,
                    title,
                    description,
                    price,
                    location,
                    vehicleType: details.vehicleType,
                    features: details.features || [],
                    capacity: details.capacity
                });
                break;
            default:
                return res.status(400).json({ message: 'Invalid listing type' });
        }

        await newListing.save();
        res.status(201).json(newListing);
    } catch (error) {
        console.error('Create listing error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getAllListings = async (req, res) => {
    try {
        const listings = await Listing.find().populate('vendorId', 'name email');
        res.status(200).json(listings);
    } catch (error) {
        console.error('Get all listings error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getListingById = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id).populate('vendorId', 'name email');
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }
        res.status(200).json(listing);
    } catch (error) {
        console.error('Get listing by ID error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
