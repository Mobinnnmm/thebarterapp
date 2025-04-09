import React, { useState, useEffect } from 'react';

const ReviewsComponent = ({ reviews }) => {

  let total ;

  useEffect(() => {
    if (reviews){
    if (reviews.length > 0) {
        console.log(reviews)
      reviews.forEach((e) => {
        total += e.rating;
      })
      total /= reviews.length;
    }}
  }, [reviews]); 

  return (
    <div>
      <h2>Reviews</h2>
      {reviews? (
        <p>No reviews available.</p>
      ) : (
        <p>{total}</p>
      )}
    </div>
  );
};

export default ReviewsComponent;