"use client";

export default function AboutSection() {
  return (
    <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center">
      <div className="bg-black/80 backdrop-blur-md rounded-3xl p-12 max-w-3xl w-full mx-6 pointer-events-auto">
        <h2 className="text-4xl font-bold text-white mb-8">About</h2>

        <div className="space-y-6 text-white/90">
          <p className="text-lg leading-relaxed">
            Hi, I&apos;m Samuel Goldman. I&apos;m a developer passionate about creating immersive web experiences that blend creativity with cutting-edge technology.
          </p>

          <p className="text-lg leading-relaxed">
            I specialize in building interactive 3D environments and modern web applications. My approach combines technical precision with artistic vision, bringing ideas to life through code. Whether it&apos;s crafting dynamic visual experiences with Three.js or developing robust full-stack solutions, I&apos;m driven by the challenge of turning complex concepts into elegant, user-friendly interfaces.
          </p>

          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-white mb-4">Skills</h3>
            <div className="flex flex-wrap gap-3">
              {['React', 'Three.js', 'Next.js', 'TypeScript', 'WebGL', '3D Graphics', 'Full-Stack Development', 'UI/UX Design'].map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 bg-white/20 rounded-full text-white text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
