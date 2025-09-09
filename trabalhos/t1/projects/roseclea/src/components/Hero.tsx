import Image from 'next/image';

export default function Hero() {
  return (
    <section id="hero" className="w-full py-20 lg:py-32">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="flex flex-col items-start space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Roseclea Duarte Medina
          </h1>
          <p className="text-lg text-muted-foreground">
            Full Professor at the Federal University of Santa Maria (UFSM). Researcher in Computer Networks, Distance Education, and Educational Technologies.
          </p>
          <div className="flex gap-4">
            <a href="#contact" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
              Contact
            </a>
            <a href="#about" className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
              About Me
            </a>
          </div>
        </div>
        <div className="flex justify-center">
          <Image
            src="/roseclea.jpeg"
            alt="Professor Roseclea Duarte Medina"
            width={400}
            height={400}
            className="rounded-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
