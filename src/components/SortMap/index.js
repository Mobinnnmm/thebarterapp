// import dynamic from "next/dynamic";

// const Map = dynamic(() => import('./Map'), {
//     ssr: false
// })

// export default Map

"use client";

import dynamic from "next/dynamic";

const SortMap = dynamic(() => import('./SortMap'), { ssr: false });

export default function Home({ onSelectLocation, onSelectRadius }) {
  return (
    <div>
      <SortMap onSelectLocation={onSelectLocation} onSelectRadius={onSelectRadius}  />
    </div>
  );
}