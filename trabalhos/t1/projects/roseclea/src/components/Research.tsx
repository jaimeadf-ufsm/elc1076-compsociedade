import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Network, GraduationCap, Gamepad2, Orbit, Smartphone } from "lucide-react";

const researchAreas = [
  {
    icon: <Network className="w-8 h-8" />,
    title: "Computer Networks",
    description: "Exploring network management, performance, and security.",
  },
  {
    icon: <GraduationCap className="w-8 h-8" />,
    title: "Informatics in Education",
    description: "Leveraging technology to enhance learning and teaching methodologies.",
  },
  {
    icon: <Gamepad2 className="w-8 h-8" />,
    title: "Educational Games & Gamification",
    description: "Designing and applying game mechanics to educational contexts.",
  },
  {
    icon: <Orbit className="w-8 h-8" />,
    title: "3D Virtual Environments",
    description: "Creating immersive virtual worlds for learning and collaboration.",
  },
  {
    icon: <Smartphone className="w-8 h-8" />,
    title: "M-learning",
    description: "Developing and evaluating mobile learning applications and strategies.",
  },
];

export default function Research() {
  return (
    <section id="research" className="w-full py-20 lg:py-32">
      <div className="container mx-auto">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Research Areas</h2>
          <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            My research focuses on the application of technology to solve real-world problems in networking and education.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {researchAreas.map((area) => (
            <Card key={area.title}>
              <CardHeader>
                {area.icon}
                <CardTitle>{area.title}</CardTitle>
                <CardDescription>{area.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
