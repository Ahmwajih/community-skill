import mongoose from 'mongoose';
import db from '@/lib/db';


const saveLogoUrl = async (url) => {
    try {
        await db();
        await mongoose.connection.collection('settings').updateOne(
            { key: 'logoUrl' },
            { $set: { value: url } },
            { upsert: true }
        );
        console.log('Logo URL saved successfully');
    } catch (error) {
        console.error('Error saving logo URL:', error.message);
        console.error(error.stack);
    }
};

export { saveLogoUrl };