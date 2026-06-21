import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    clicks: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

const Link = mongoose.model('Link', linkSchema);

export default Link;