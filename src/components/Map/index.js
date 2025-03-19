"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import('./Map'), { ssr: false });

const Home = ({ onSelectLocation }) =>  {

  return (
    <div>
      <Map onSelectLocation={onSelectLocation} />
    </div>
  );
}

export default Home;