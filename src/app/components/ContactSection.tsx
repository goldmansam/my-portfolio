"use client";

export default function ContactSection() {
  return (
    <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center">
      <div className="bg-black/80 backdrop-blur-md rounded-3xl p-12 max-w-2xl w-full mx-6 pointer-events-auto">
        <h2 className="text-4xl font-bold text-white mb-8">Contact</h2>

        <div className="space-y-6">
          <p className="text-lg text-white/90">
            Let&apos;s connect! Feel free to reach out through any of the following channels.
          </p>

          <div className="space-y-4">
            {/* Email */}
            <div className="bg-white/10 rounded-2xl p-6 hover:bg-white/20 transition-colors">
              <h3 className="text-xl font-semibold text-white mb-2">Email</h3>
              <a href="mailto:your.email@example.com" className="text-white/90 hover:text-white underline">
                your.email@example.com
              </a>
            </div>

            {/* LinkedIn */}
            <div className="bg-white/10 rounded-2xl p-6 hover:bg-white/20 transition-colors">
              <h3 className="text-xl font-semibold text-white mb-2">LinkedIn</h3>
              <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-white underline">
                linkedin.com/in/yourprofile
              </a>
            </div>

            {/* GitHub */}
            <div className="bg-white/10 rounded-2xl p-6 hover:bg-white/20 transition-colors">
              <h3 className="text-xl font-semibold text-white mb-2">GitHub</h3>
              <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-white underline">
                github.com/yourusername
              </a>
            </div>

            {/* Twitter/X */}
            <div className="bg-white/10 rounded-2xl p-6 hover:bg-white/20 transition-colors">
              <h3 className="text-xl font-semibold text-white mb-2">Twitter</h3>
              <a href="https://twitter.com/yourhandle" target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-white underline">
                @yourhandle
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
