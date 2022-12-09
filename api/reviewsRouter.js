const express = require('express');
const {
  createReview,
  getAllReviewsForProduct,
  deleteReview } = require('../db');


const { requireAdmin, requireUser } = require('./utils');
const reviewsRouter = express.Router();

reviewsRouter.get('/product/:productId', async (req, res, next) => {

  try {
    const { productId } = req.params
    const allReviews = await getAllReviewsForProduct({ productId });
console.log(allReviews, "allreviews")
    if (!allReviews) {
      res.send('No reviews found.')
    }
    res.send(allReviews)


  } catch (err) {
    console.log('reviewsRouter.get-reviewsRouter.js FAILED', err)
    next(err)
  }
});

reviewsRouter.post('/products/:productId/reviews', requireUser, async (req, res, next) => {
  try {
    console.log(req.body)
    // console.log('In Products Router Testing')
    const { review, stars, productId } = req.body

    const newReview = await createReview({
      review,
       stars,
        userId:req.user.id,
         productId
    })

    res.send(newReview)

  } catch (err) {
    console.log('reviewsRouter.post FAILED', err)
    next(err)
  }
});

reviewsRouter.delete('/product/:productId/:reviewsId', requireAdmin, async (req, res, next) => {
  try {
    console.log('in delete product')
    const { reviewsId } = req.params;
    const deletedReview = await deleteReview(reviewsId)

    if (deletedReview) {
      res.send(deletedReview)
    } else {
      res.send('Error deleting review.')
    }
  } catch (err) {
    console.log('reviewsRouter.delete FAILED', err)
    next(err)
  }
});

module.exports = reviewsRouter;
