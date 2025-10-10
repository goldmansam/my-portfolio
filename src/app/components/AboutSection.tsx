"use client";

export default function AboutSection() {
  return (
    <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center">
      <div className="bg-black/80 backdrop-blur-md rounded-3xl p-12 max-w-3xl w-full mx-6 pointer-events-auto">
        <h2 className="text-4xl font-bold text-white mb-8">About</h2>

        <div className="space-y-6 text-white/90">
          <p className="text-lg leading-relaxed">
            Hi, I&apos;m Samuel Goldman, a developer passionate about creating immersive web experiences with cutting-edge technology.
          </p>

          <p className="text-lg leading-relaxed">
            I specialize in building interactive 3D environments and modern web applications, combining technical precision with creative vision to bring ideas to life through code.
          </p>
        </div>
      </div>
    </div>
  );
}
