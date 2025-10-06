"use client";

export default function AboutSection() {
  return (
    <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center">
      <div className="bg-black/80 backdrop-blur-md rounded-3xl p-12 max-w-3xl w-full mx-6 pointer-events-auto">
        <h2 className="text-4xl font-bold text-white mb-8">About</h2>

        <div className="space-y-6 text-white/90">
          <p className="text-lg leading-relaxed">
            Hi, I&apos;m [Your Name]. Add your introduction here - who you are, what you do, and what drives you.
          </p>

          <p className="text-lg leading-relaxed">
            Write about your background, experience, and expertise. Share what makes you unique and passionate about your work.
          </p>

          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-white mb-4">Skills</h3>
            <div className="flex flex-wrap gap-3">
              {['Skill 1', 'Skill 2', 'Skill 3', 'Skill 4', 'Skill 5', 'Skill 6'].map((skill) => (
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
