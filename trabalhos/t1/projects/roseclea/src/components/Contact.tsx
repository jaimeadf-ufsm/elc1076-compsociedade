import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Contact() {
  return (
    <section id="contact" className="w-full py-20 lg:py-32 bg-secondary">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Get in Touch</h2>
          <p className="text-muted-foreground">
            Subscribe to my newsletter for updates on my research and projects.
          </p>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input type="email" placeholder="Email" />
            <Button type="submit">Subscribe</Button>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">Contact Information</h3>
          <p className="text-muted-foreground">
            <strong>Email:</strong> roseclea.medina@ufsm.br (example)
          </p>
          <p className="text-muted-foreground">
            <strong>University:</strong> Federal University of Santa Maria (UFSM)
          </p>
        </div>
      </div>
    </section>
  );
}
