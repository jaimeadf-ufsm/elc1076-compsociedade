import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Research from "@/components/Research";
import Projects from "@/components/Projects";
import Publications from "@/components/Publications";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Hero />
        <About />
        <Research />
        <Projects />
        <Publications />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}