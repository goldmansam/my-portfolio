"use client";

interface NavigationProps {
  onSectionChange: (section: 'home' | 'work' | 'about' | 'contact') => void;
  currentSection: string;
}

export default function Navigation({ onSectionChange, currentSection }: NavigationProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo/Name */}
        <button
          onClick={() => onSectionChange('home')}
          className="text-2xl font-bold text-white hover:text-white/80 transition-colors"
        >
          Your Name
        </button>

        {/* Navigation Links */}
        <div className="flex gap-8">
          {['work', 'about', 'contact'].map((section) => (
            <button
              key={section}
              onClick={() => onSectionChange(section as 'work' | 'about' | 'contact')}
              className={`text-lg font-medium transition-colors ${
                currentSection === section
                  ? 'text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
