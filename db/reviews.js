const { client } = require('./client');

function validateReviewInput({ review, stars, userId, productId }) {
  if (!review || typeof review !== 'string') {
    throw new Error('Review text is required and must be a string.');
  }
  if (!stars || typeof stars !== 'number' || stars < 1 || stars > 5) {
    throw new Error('Stars rating is required and must be a number between 1 and 5.');
  }
  if (!userId || typeof userId !== 'number') {
    throw new Error('Valid userId is required.');
  }
  if (!productId || typeof productId !== 'number') {
    throw new Error('Valid productId is required.');
  }
}

async function createReview({ review, stars, userId, productId }) {
  try {
    validateReviewInput({ review, stars, userId, productId });

    const { rows: [newReview] } = await client.query(`
      INSERT INTO reviews (review, stars, "userId", "productId")
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `, [review, stars, userId, productId]);

    return newReview;
  } catch (err) {
    console.error('createReview failed:', err.message);
    throw err;
  }
}

async function getAllReviewsByUser({ userId }) {
  if (!userId || typeof userId !== 'number') {
    throw new Error('Valid userId is required to get reviews.');
  }

  try {
    const { rows: reviews } = await client.query(`
      SELECT * FROM reviews WHERE "userId" = $1;
    `, [userId]);

    return reviews;
  } catch (err) {
    console.error('getAllReviewsByUser failed:', err.message);
    throw err;
  }
}

async function getAllReviews() {
  try {
    const { rows: reviews } = await client.query(`
      SELECT reviews.*, users.username FROM reviews
      JOIN users ON reviews."userId" = users.id;
    `);

    return reviews;
  } catch (err) {
    console.error('getAllReviews failed:', err.message);
    throw err;
  }
}

async function getAllReviewsForProduct({ productId, limit = 10, offset = 0 }) {
  try {
    // Query total count for pagination metadata
    const countResult = await client.query(`
      SELECT COUNT(*) FROM reviews WHERE "productId" = $1;
    `, [productId]);

    const totalCount = parseInt(countResult.rows[0].count, 10);

    // Query reviews with limit and offset
    const { rows: reviews } = await client.query(`
      SELECT * FROM reviews 
      WHERE "productId" = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3;
    `, [productId, limit, offset]);

    return { reviews, totalCount };
  } catch (error) {
    throw error;
  }
}

async function deleteReview({ reviewId }) {
  if (!reviewId || typeof reviewId !== 'number') {
    throw new Error('Valid reviewId is required to delete a review.');
  }

  try {
    const { rows: [review] } = await client.query(`
      DELETE FROM reviews
      WHERE id = $1
      RETURNING *;
    `, [reviewId]);

    if (!review) {
      throw new Error(`No review found with id ${reviewId}`);
    }

    return review;
  } catch (err) {
    console.error('deleteReview failed:', err.message);
    throw err;
  }
}

module.exports = {
  createReview,
  getAllReviewsForProduct,
  deleteReview,
  getAllReviewsByUser,
  getAllReviews,
};
