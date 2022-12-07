const { client } = require('./client');

async function createReview({
    
    description,
    stars,
    userId,
    productId
}) {
    try{
        const {rows:[review] } =await client.query(`
        INSERT INTO reviews (description, stars, "userId","productId")
        VALUES ($1,$2,$3,$4)
        RETURNING *;
        `[description, stars, userId,productId])
        
        return review;
    }
    catch (err) {
        console.log('createReviews-reviews.js FAILED', err)
        throw err
      }

}
 async function getAllReviewsForProduct({
    productId
 }) {
    try{
        const { rows: reviews } = await client.query(`
        SELECT * FROM reviews        
        WHERE "productId"= $1;
        `,[productId])
        return reviews
    }  catch (err) {
        console.log('getAllReviewsForProduct-reviews.js FAILED', err)
        throw err
      }
 }

async function deleteReview({
    reviewId
}) {
    try{
        const { rows: [review] } = await client.query(`
        DELETE FROM reviews
        WHERE id =$1
        RETURNING *;
        `,[id])
        return review
    } catch (err) {
        console.log('deleteReview-reviews.js FAILED', err)
        throw err
      }
}

module.exports = {
    createReview,
    getAllReviewsForProduct,
    deleteReview
}