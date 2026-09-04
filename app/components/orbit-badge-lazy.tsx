"use client";

import dynamic from "next/dynamic";

const OrbitBadge = dynamic(() => import("./three/orbit-badge"), {
  ssr: false,
});

export { OrbitBadge };
