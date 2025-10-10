"use client";

export default function WorkSection() {
  return (
    <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center">
      <div className="bg-black/80 backdrop-blur-md rounded-3xl p-12 max-w-4xl w-full mx-6 pointer-events-auto max-h-[80vh] overflow-y-auto">
        <h2 className="text-4xl font-bold text-white mb-8">Work</h2>

        <div className="space-y-8">
          {/* Project 1 */}
          <div className="bg-white/10 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300">
            <h3 className="text-2xl font-semibold text-white mb-3">Interactive 3D Portfolio</h3>
            <p className="text-white/80 mb-4 leading-relaxed">
              A fully immersive 3D web experience built with React Three Fiber and Next.js. Features dynamic camera animations,
              interactive scene elements including swaying trees and fireflies, custom post-processing effects, and responsive navigation.
              Demonstrates advanced WebGL techniques and modern web development practices.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-500/30 rounded-full text-white text-sm">Three.js</span>
              <span className="px-3 py-1 bg-blue-500/30 rounded-full text-white text-sm">React Three Fiber</span>
              <span className="px-3 py-1 bg-blue-500/30 rounded-full text-white text-sm">Next.js</span>
              <span className="px-3 py-1 bg-blue-500/30 rounded-full text-white text-sm">TypeScript</span>
              <span className="px-3 py-1 bg-blue-500/30 rounded-full text-white text-sm">WebGL</span>
            </div>
            <div className="text-white/60 text-sm">2025</div>
          </div>

          {/* Project 2 */}
          <div className="bg-white/10 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300">
            <h3 className="text-2xl font-semibold text-white mb-3">Real-Time Data Visualization Platform</h3>
            <p className="text-white/80 mb-4 leading-relaxed">
              A high-performance data visualization dashboard for analyzing complex datasets in real-time. Built with modern
              React architecture, featuring interactive charts, customizable filters, and responsive design. Optimized for
              handling large-scale data processing with minimal latency.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-green-500/30 rounded-full text-white text-sm">React</span>
              <span className="px-3 py-1 bg-green-500/30 rounded-full text-white text-sm">D3.js</span>
              <span className="px-3 py-1 bg-green-500/30 rounded-full text-white text-sm">Node.js</span>
              <span className="px-3 py-1 bg-green-500/30 rounded-full text-white text-sm">WebSocket</span>
            </div>
            <div className="text-white/60 text-sm">2024</div>
          </div>

          {/* Project 3 */}
          <div className="bg-white/10 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300">
            <h3 className="text-2xl font-semibold text-white mb-3">AI-Powered Content Management System</h3>
            <p className="text-white/80 mb-4 leading-relaxed">
              An intelligent CMS that leverages machine learning to automate content categorization and recommendations.
              Features include natural language processing for content analysis, automated tagging, and predictive analytics
              for content performance. Built with a focus on scalability and user experience.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-purple-500/30 rounded-full text-white text-sm">Next.js</span>
              <span className="px-3 py-1 bg-purple-500/30 rounded-full text-white text-sm">Python</span>
              <span className="px-3 py-1 bg-purple-500/30 rounded-full text-white text-sm">TensorFlow</span>
              <span className="px-3 py-1 bg-purple-500/30 rounded-full text-white text-sm">PostgreSQL</span>
            </div>
            <div className="text-white/60 text-sm">2024</div>
          </div>
        </div>
      </div>
    </div>
  );
}
