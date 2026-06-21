import linkModel from '../models/link.model.js';
import userModel from '../models/user.model.js';
import clickModel from '../models/click.model.js';


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

    try {
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
    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Failed to retrieve links',
        });
    }
}

export const incrementLinkClick = async (req, res) => {

    const { linkId } = req.params;

    try {
        const link = await linkModel.findById(linkId);

        if (!link) {
            return res.status(404).json({
                message: 'Link not found',
            });
        }

        link.clicks += 1;
        await link.save();

        // Create a click event document
        await clickModel.create({
            link: link._id,
            user: link.user,
            timestamp: new Date()
        });

        return res.status(200).json({
            message: 'Link click incremented successfully',
            link,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Failed to increment link click',
        });
    }
}

export const getLinkAnalyticsByUsername = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await userModel.findOne({ username });

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        // Check if user is authenticated and is requesting their own analytics
        if (user._id.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'Access denied: You can only view your own analytics',
            });
        }

        const links = await linkModel.find({ user: user._id });
        const totalLinks = links.length;
        let totalClicks = 0;

        const linkPerformance = links.map((link) => {
            totalClicks += link.clicks;
            return {
                id: link._id,
                title: link.title,
                url: link.url,
                clicks: link.clicks,
            };
        });

        // Sort performance statistics by clicks descending
        linkPerformance.sort((a, b) => b.clicks - a.clicks);

        // Fetch clicks in the last 7 days for daily activity
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // Include today + 6 days back
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const clicks = await clickModel.find({
            user: user._id,
            timestamp: { $gte: sevenDaysAgo },
        });

        const dailyActivity = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const count = clicks.filter((click) => {
                const clickTime = new Date(click.timestamp);
                return clickTime >= startOfDay && clickTime <= endOfDay;
            }).length;

            dailyActivity.push({
                date: dateStr,
                count,
            });
        }

        const averageClicks = totalLinks > 0 ? parseFloat((totalClicks / totalLinks).toFixed(1)) : 0;
        const topLink = linkPerformance.length > 0 && linkPerformance[0].clicks > 0 ? linkPerformance[0].title : 'N/A';

        return res.status(200).json({
            message: 'Analytics retrieved successfully',
            totalLinks,
            totalClicks,
            averageClicks,
            topLink,
            linkPerformance,
            dailyActivity,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Failed to retrieve analytics',
        });
    }
};

export const updateLink = async (req, res) => {
    const { linkId } = req.params;
    const { title, url } = req.body;

    if (!title || !url) {
        return res.status(400).json({
            message: 'Title and URL are required',
        });
    }

    try {
        const link = await linkModel.findById(linkId);

        if (!link) {
            return res.status(404).json({
                message: 'Link not found',
            });
        }

        if (link.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'Access denied: You do not own this link',
            });
        }

        link.title = title;
        link.url = url;
        await link.save();

        return res.status(200).json({
            message: 'Link updated successfully',
            link,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Failed to update link',
        });
    }
};

export const deleteLink = async (req, res) => {
    const { linkId } = req.params;

    try {
        const link = await linkModel.findById(linkId);

        if (!link) {
            return res.status(404).json({
                message: 'Link not found',
            });
        }

        if (link.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'Access denied: You do not own this link',
            });
        }

        await linkModel.deleteOne({ _id: linkId });
        await clickModel.deleteMany({ link: linkId });

        return res.status(200).json({
            message: 'Link deleted successfully',
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Failed to delete link',
        });
    }
};