import { Menu } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-background/80 backdrop-blur-sm">
      <a href="#" className="text-lg font-bold">
        Prof. Dr. Roseclea Duarte Medina
      </a>
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
        <a href="#about" className="hover:text-primary">About</a>
        <a href="#research" className="hover:text-primary">Research</a>
        <a href="#projects" className="hover:text-primary">Projects</a>
        <a href="#publications" className="hover:text-primary">Publications</a>
        <a href="#contact" className="hover:text-primary">Contact</a>
      </nav>
      <button className="md:hidden">
        <Menu className="w-6 h-6" />
      </button>
    </header>
  );
}
