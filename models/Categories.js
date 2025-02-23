import mongoose from 'mongoose';

const CategoriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        default: [],
        required: false
    },
});

export default mongoose.models.categories || mongoose.model('categories', CategoriesSchema)