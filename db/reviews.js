const { client } = require('./client');

async function createReview({
    
    review,
    stars,
    userId,
    productId
}) {
    try{
        console.log(
            review,
            stars,
            userId,
            productId)
        const {rows:[newReview] } =await client.query(`
        INSERT INTO reviews (review, stars, "userId","productId")
        VALUES ($1,$2,$3,$4)
        RETURNING *;
        `,[review, stars, userId,productId])
        
        return newReview;
    }
    catch (err) {
        console.log('createReviews-reviews.js FAILED', err)
        throw err
      }

}

async function getallReviewsByUser({
    userId
}) {
    try{
        const { rows: reviews } = await client.query(`
        SELECT * FROM reviews
        WHERE reviews."userId" = $1`,[userId])
    }
}

async function getAllReviews(){
    try{
        const {rows: reivews} = await client.query(`
        SELECT reviews.*, users.username FROM reviews
        JOIN users ON reviews."userId"= users.id
        `)
    }
}

 async function getAllReviewsForProduct({
    productId
 }) {
    try{
        const { rows: reviews } = await client.query(`
        SELECT reviews.*, users.username FROM reviews 
        JOIN users ON reviews."userId" = users.id              
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