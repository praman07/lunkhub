import linkModel from '../models/link.model.js';
import userModel from '../models/user.model.js';


export const createLink = async (req, res) => {

    const user = req.user;
    const { title, url } = req.body;

    if (!title || !url) {
        return res.status(400).json({
            message: 'Title and URL are required',
        });
    }

    try {
        const newLink = await linkModel.create({
            user: user.id,
            title,
            url,
        });
        return res.status(201).json({
            message: 'Link created successfully',
            link: newLink,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Failed to create link',
        });
    }
}

export const getLinksByUsername = async (req, res) => {

    const { username } = req.params;

    const user = await userModel.findOne({ username })

    if (!user) {
        return res.status(404).json({
            message: 'User not found',
        });
    }

    const links = await linkModel.find({ user: user._id });

    return res.status(200).json({
        message: 'Links retrieved successfully',
        links,
    });
}