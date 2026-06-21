import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/user.model.js';
import Link from './src/models/link.model.js';

dotenv.config();

const creators = [
    {
        username: 'comedycentral',
        email: 'comedycentral@linkhub.com',
        password: 'password123',
        links: [
            { title: 'Comedy Central Home', url: 'https://www.cc.com' },
            { title: 'Watch The Daily Show', url: 'https://www.cc.com/shows/the-daily-show' },
            { title: 'Comedy Central YouTube', url: 'https://www.youtube.com/@comedycentral' },
            { title: 'Comedy Central TikTok', url: 'https://www.tiktok.com/@comedycentral' },
            { title: 'Comedy Central Instagram', url: 'https://www.instagram.com/comedycentral' }
        ]
    },
    {
        username: 'hbo',
        email: 'hbo@linkhub.com',
        password: 'password123',
        links: [
            { title: 'HBO Official Site', url: 'https://www.hbo.com' },
            { title: 'Stream Max', url: 'https://www.max.com' },
            { title: 'HBO YouTube', url: 'https://www.youtube.com/@HBO' },
            { title: 'HBO Instagram', url: 'https://www.instagram.com/hbo' },
            { title: 'HBO Twitter / X', url: 'https://twitter.com/HBO' }
        ]
    },
    {
        username: 'selenagomez',
        email: 'selena@linkhub.com',
        password: 'password123',
        links: [
            { title: 'Rare Beauty by Selena Gomez', url: 'https://www.rarebeauty.com' },
            { title: 'Official Twitter / X', url: 'https://twitter.com/selenagomez' },
            { title: 'Selena Gomez YouTube Channel', url: 'https://www.youtube.com/@SelenaGomez' },
            { title: 'Official Instagram', url: 'https://www.instagram.com/selenagomez' },
            { title: 'Official TikTok', url: 'https://www.tiktok.com/@selenagomez' }
        ]
    },
    {
        username: 'pharrell',
        email: 'pharrell@linkhub.com',
        password: 'password123',
        links: [
            { title: 'Something in the Water Festival', url: 'https://www.somethinginthewater.com' },
            { title: 'Official TikTok', url: 'https://www.tiktok.com/@pharrell' },
            { title: 'Official YouTube', url: 'https://www.youtube.com/pharrell' },
            { title: 'Official Instagram', url: 'https://www.instagram.com/pharrell' },
            { title: 'Official Twitter / X', url: 'https://twitter.com/pharrell' }
        ]
    },
    {
        username: 'tonyhawk',
        email: 'tonyhawk@linkhub.com',
        password: 'password123',
        links: [
            { title: 'The Skatepark Project', url: 'https://skatepark.org' },
            { title: 'Tony Hawk YouTube Channel', url: 'https://www.youtube.com/@tonyhawk' },
            { title: 'Official Instagram', url: 'https://www.instagram.com/tonyhawk' },
            { title: 'Official Twitter / X', url: 'https://twitter.com/tonyhawk' },
            { title: 'Official TikTok', url: 'https://www.tiktok.com/@tonyhawk' }
        ]
    },
    {
        username: 'laclippers',
        email: 'laclippers@linkhub.com',
        password: 'password123',
        links: [
            { title: 'NBA Clippers Store', url: 'https://www.clippersstore.com' },
            { title: 'LA Clippers YouTube', url: 'https://www.youtube.com/@laclippers' },
            { title: 'LA Clippers Instagram', url: 'https://www.instagram.com/laclippers' },
            { title: 'LA Clippers Twitter / X', url: 'https://twitter.com/LAClippers' },
            { title: 'LA Clippers TikTok', url: 'https://www.tiktok.com/@laclippers' }
        ]
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        for (const creator of creators) {
            // Delete existing user
            const existingUser = await User.findOne({ username: creator.username });
            if (existingUser) {
                await Link.deleteMany({ user: existingUser._id });
                await User.deleteOne({ _id: existingUser._id });
                console.log(`Deleted existing profile for: ${creator.username}`);
            }

            // Create new user
            const newUser = new User({
                username: creator.username,
                email: creator.email,
                password: creator.password
            });
            await newUser.save();
            console.log(`Created user: ${creator.username}`);

            // Add links
            for (const lnk of creator.links) {
                await Link.create({
                    user: newUser._id,
                    title: lnk.title,
                    url: lnk.url
                });
            }
            console.log(`Seeded ${creator.links.length} links for: ${creator.username}`);
        }

        console.log('Database seeding successfully completed.');
        process.exit(0);
    } catch (err) {
        console.error('Error during seeding:', err);
        process.exit(1);
    }
};

seedDB();
