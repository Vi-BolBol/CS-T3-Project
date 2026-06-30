import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-20 bg-[#0b1224] border-t border-slate-900 text-left text-slate-400 font-sans">
      {/* Upper Content Grid Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Column 1: Brand & Subtitle pitch */}
        <div className="space-y-4">
          <Link to="/home" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Internship</span>
            <span className="text-[#10b981]">Finder</span>
          </Link>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
            Connecting ambitious students with world-class virtual internship opportunities.
          </p>
        </div>

        {/* Column 2: Audience Navigation Links */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white tracking-wide">Audience</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/companies" className="hover:text-white transition-colors">Companies</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">About US</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Column 3: Social Network Actions */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white tracking-wide">Follow us</h4>
          <div className="flex flex-col gap-3 max-w-[180px]">
            {/* Facebook Pill */}
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#131c35] border border-slate-800 hover:border-slate-700 transition-colors text-xs text-slate-300 font-medium group">
              <span className="text-sm">👤</span>
              <span className="group-hover:text-white transition-colors">Facebook</span>
            </a>
            {/* GitHub Pill */}
            <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#131c35] border border-slate-800 hover:border-slate-700 transition-colors text-xs text-slate-300 font-medium group">
              <span className="text-sm">💻</span>
              <span className="group-hover:text-white transition-colors">Github</span>
            </a>
            {/* LinkedIn Pill */}
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#131c35] border border-slate-800 hover:border-slate-700 transition-colors text-xs text-slate-300 font-medium group">
              <span className="text-sm">👔</span>
              <span className="group-hover:text-white transition-colors">LinkedIn</span>
            </a>
          </div>
        </div>

        {/* Column 4: Corporate Metadata Links */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white tracking-wide">Company</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/mission" className="hover:text-white transition-colors">Our mission</Link></li>
            <li><Link to="/team" className="hover:text-white transition-colors">Our team</Link></li>
            <li><Link to="/careers" className="hover:text-white transition-colors">Join us</Link></li>
            <li><Link to="/press" className="hover:text-white transition-colors">Press</Link></li>
          </ul>
        </div>

      </div>

      {/* Bottom Legal Sub-Footer Section */}
      <div className="border-t border-slate-900/60 bg-[#090f1f]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-500">
            © 2026 <span className="text-slate-400 font-medium">Virtual Internship</span>. All right Reserved
          </p>
          <div className="flex items-center gap-6 text-slate-500">
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-slate-300 transition-colors">Term of use</Link>
            <Link to="/cookies" className="hover:text-slate-300 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}