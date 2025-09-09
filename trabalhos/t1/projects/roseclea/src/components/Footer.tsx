export default function Footer() {
  return (
    <footer className="w-full py-6 bg-background">
      <div className="container mx-auto flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Prof. Dr. Roseclea Duarte Medina. All rights reserved.
        </p>
        <a href="https://www.ufsm.br/" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary">
          Federal University of Santa Maria
        </a>
      </div>
    </footer>
  );
}
