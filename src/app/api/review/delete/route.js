import express from 'express';
import Review from '../models/Review.js';

const router = express.Router();

// DELETE a review by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting review', details: error.message });
  }
});

export default router;
