"use client";

import dynamic from "next/dynamic";

const EditMap = dynamic(() => import('./EditMap'), { ssr: false });

const Home = ( {coords,  onSelectLocation } ) =>  {

  return (
    <div>
      <EditMap givenCoords={coords} onSelectLocation={onSelectLocation}  />
    </div>
  );
}

export default Home;