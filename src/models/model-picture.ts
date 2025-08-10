import mongoose, { Schema } from 'mongoose';

const pictureSchema = new Schema(
    {
        public_id: { type: String, required: true },
        img_url: { type: String, required: true },
    },
    { timestamps: true, collection: 'Picture' }
);

export const Picture = mongoose.model('Picture', pictureSchema);
