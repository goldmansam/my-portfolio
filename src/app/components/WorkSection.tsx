"use client";

export default function WorkSection() {
  return (
    <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center">
      <div className="bg-black/80 backdrop-blur-md rounded-3xl p-12 max-w-4xl w-full mx-6 pointer-events-auto max-h-[80vh] overflow-y-auto">
        <h2 className="text-4xl font-bold text-white mb-8">Work</h2>

        <div className="space-y-8">
          {/* Project 1 - You'll fill this in later */}
          <div className="bg-white/10 rounded-2xl p-6 hover:bg-white/20 transition-colors">
            <h3 className="text-2xl font-semibold text-white mb-3">Project Title 1</h3>
            <p className="text-white/80 mb-4">
              Project description goes here. Add details about what you built, technologies used, and outcomes.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-white/90 hover:text-white underline">View Project</a>
              <a href="#" className="text-white/90 hover:text-white underline">GitHub</a>
            </div>
          </div>

          {/* Project 2 */}
          <div className="bg-white/10 rounded-2xl p-6 hover:bg-white/20 transition-colors">
            <h3 className="text-2xl font-semibold text-white mb-3">Project Title 2</h3>
            <p className="text-white/80 mb-4">
              Project description goes here. Add details about what you built, technologies used, and outcomes.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-white/90 hover:text-white underline">View Project</a>
              <a href="#" className="text-white/90 hover:text-white underline">GitHub</a>
            </div>
          </div>

          {/* Project 3 */}
          <div className="bg-white/10 rounded-2xl p-6 hover:bg-white/20 transition-colors">
            <h3 className="text-2xl font-semibold text-white mb-3">Project Title 3</h3>
            <p className="text-white/80 mb-4">
              Project description goes here. Add details about what you built, technologies used, and outcomes.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-white/90 hover:text-white underline">View Project</a>
              <a href="#" className="text-white/90 hover:text-white underline">GitHub</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
