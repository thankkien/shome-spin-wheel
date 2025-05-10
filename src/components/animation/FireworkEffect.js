"use client";

import Firework from "./Firework";

export default function FireworkEffect() {
  return (
    <>
      {/* Góc và các vị trí đặc biệt */}
      <Firework className="-top-4 -left-4" />
      <Firework className="-top-4 -right-4" />
      <Firework className="-bottom-4 -left-4" />
      <Firework className="-bottom-4 -right-4" />
      <Firework className="top-1/3 -left-2" />
      <Firework className="top-1/3 -right-2" />
      <Firework className="top-1/4 left-1/4" />
      <Firework className="top-1/4 right-1/4" />

      {/* Pháo hóa ở các vị trí ngẫu nhiên */}
      {[...Array(4)].map((_) => (
        <Firework randomPosition={true} />
      ))}
    </>
  );
}
