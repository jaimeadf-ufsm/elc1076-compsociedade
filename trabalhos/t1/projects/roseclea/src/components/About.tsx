export default function About() {
  return (
    <section id="about" className="w-full py-20 lg:py-32 bg-secondary">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">About Me</h2>
          <p className="text-muted-foreground">
            I am a Full Professor in the Applied Computing Department at the Federal University of Santa Maria (UFSM). My academic journey began with a Master's in Computation (1995) and a Ph.D. in Informatics in Education (2004), both from the Federal University of Rio Grande do Sul (UFRGS).
          </p>
          <p className="text-muted-foreground">
            My passion lies in exploring the intersection of technology and education. I am an active faculty member in the Graduate Program in Computer Science (PPGCC) at UFSM, where I mentor and guide the next generation of researchers. My work is dedicated to advancing knowledge in computer networks, network management, and leveraging technology for innovative educational experiences.
          </p>
        </div>
        <div className="flex justify-center">
          {/* You can add an image or illustration here */}
        </div>
      </div>
    </section>
  );
}
