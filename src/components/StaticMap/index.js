"use client";

import dynamic from "next/dynamic";

const StaticMap = dynamic(() => import('./StaticMap'), { ssr: false });

const Home = ( {coords} ) =>  {

  return (
    <div>
      <StaticMap givenCoords={coords}  />
    </div>
  );
}

export default Home;