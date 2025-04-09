"use client";

import dynamic from "next/dynamic";

const UserReview = dynamic(() => import('./UserReview'), { ssr: false });

const Home = ( {reviews} ) =>  {

  return (
    <div>
      <UserReview list={reviews}  />
    </div>
  );
}

export default Home;