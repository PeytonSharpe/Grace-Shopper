const express = require('express');
const {
  createReview,
  getAllReviewsForProduct,
  deleteReview
} = require('../db');

const { requireAdmin, requireUser } = require('./utils');
const reviewsRouter = express.Router();

// GET /api/reviews/product/:productId - get all reviews for a product
reviewsRouter.get('/product/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params;
    const allReviews = await getAllReviewsForProduct({ productId });

    if (!allReviews || allReviews.length === 0) {
      return res.status(404).json({ message: 'No reviews found.' });
    }

    res.json(allReviews);
  } catch (err) {
    next(err);
  }
});

// POST /api/reviews/products/:productId/reviews - create a review for a product (logged-in user)
reviewsRouter.post('/products/:productId/reviews', requireUser, async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { review, stars } = req.body;

    // Basic validation
    if (!review || typeof review !== 'string') {
      return res.status(400).json({ error: 'Review text is required and must be a string.' });
    }
    if (typeof stars !== 'number' || stars < 1 || stars > 5) {
      return res.status(400).json({ error: 'Stars must be a number between 1 and 5.' });
    }

    // Ensure productId from URL and body match or just use param
    // Here, prefer param to avoid mismatch
    const newReview = await createReview({
      review,
      stars,
      userId: req.user.id,
      productId,
    });

    res.status(201).json(newReview);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/reviews/product/:productId/:reviewId - delete a review (admin only)
reviewsRouter.delete('/product/:productId/:reviewId', requireAdmin, async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const deletedReview = await deleteReview(reviewId);

    if (!deletedReview) {
      return res.status(404).json({ error: 'Review not found or already deleted.' });
    }

    res.json({ message: 'Review deleted successfully.', review: deletedReview });
  } catch (err) {
    next(err);
  }
});

module.exports = reviewsRouter;
