"use client";

export default function WorkSection() {
  return (
    <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center">
      <div className="bg-black/80 backdrop-blur-md rounded-3xl p-12 max-w-4xl w-full mx-6 pointer-events-auto max-h-[80vh] overflow-y-auto">
        <h2 className="text-4xl font-bold text-white mb-8">Work</h2>

        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-2xl text-white/90">
              Content to be filled.
            </p>
            <p className="text-lg text-white/70 mt-4">
              Check back soon for updates!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
