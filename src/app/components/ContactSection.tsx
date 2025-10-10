"use client";

export default function ContactSection() {
  return (
    <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center">
      <div className="bg-black/80 backdrop-blur-md rounded-3xl p-12 max-w-2xl w-full mx-6 pointer-events-auto">
        <h2 className="text-4xl font-bold text-white mb-8">Contact</h2>

        <div className="space-y-6">
          <p className="text-lg text-white/90">
            Please reach out for any inquiries.
          </p>

          <div className="space-y-4">
            {/* Name */}
            <div className="bg-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Name</h3>
              <p className="text-white/90">Samuel Goldman</p>
            </div>

            {/* Phone */}
            <div className="bg-white/10 rounded-2xl p-6 hover:bg-white/20 transition-colors">
              <h3 className="text-xl font-semibold text-white mb-2">Phone</h3>
              <a href="tel:6464830840" className="text-white/90 hover:text-white underline">
                (646) 483-0840
              </a>
            </div>

            {/* Email */}
            <div className="bg-white/10 rounded-2xl p-6 hover:bg-white/20 transition-colors">
              <h3 className="text-xl font-semibold text-white mb-2">Email</h3>
              <a href="mailto:goldman.j.sam@gmail.com" className="text-white/90 hover:text-white underline">
                goldman.j.sam@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
