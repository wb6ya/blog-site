import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-6 pointer-events-none">
      <nav className="glass-panel mx-auto flex max-w-4xl items-center justify-between px-6 py-3 rounded-full border border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.5)] pointer-events-auto">
        <div className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Link href="/" className="flex items-center gap-3">
                {/* يمكنك استبدال الصورة بنص أو استخدام لوقو بدقة عالية */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand to-brand-light flex items-center justify-center shadow-[0_0_15px_rgba(138,43,226,0.5)]">
                  <span className="text-white font-bold text-sm">WB</span>
                </div>
                <span className="text-white font-bold tracking-wider hidden sm:block">Blogs</span>
            </Link>
        </div>
        <div className="flex gap-8 items-center text-sm font-medium tracking-wide">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">الرئيسية</Link>
          <Link href="https://wb6ya.com" target="_blank" className="relative group">
            <span className="text-gray-300 group-hover:text-white transition-colors">موقعي الشخصي</span>
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-brand group-hover:w-full transition-all duration-300"></span>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;