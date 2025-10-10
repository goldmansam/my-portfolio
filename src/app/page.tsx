"use client";

import Scene from "./components/Scene";

export default function Page() {
  return (
    <main className="w-screen h-screen overflow-hidden relative">
      {/* 3D Scene Background */}
      <Scene />
    </main>
  );
}