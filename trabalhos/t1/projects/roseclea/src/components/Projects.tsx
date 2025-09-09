import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const projects = [
  {
    title: "Gamified Learning Platform",
    description: "A web-based platform that uses gamification to improve student engagement in online courses.",
    tags: ["Gamification", "React", "Node.js"],
  },
  {
    title: "Network Traffic Analyzer",
    description: "A tool for monitoring and analyzing network traffic in real-time to identify bottlenecks and security threats.",
    tags: ["Computer Networks", "Python", "Wireshark"],
  },
  {
    title: "3D Virtual Campus",
    description: "An immersive 3D virtual environment representing the university campus for remote students.",
    tags: ["3D Environments", "Unity", "Blender"],
  },
];

export default function Projects() {
  return (
    <section id="projects" className="w-full py-20 lg:py-32 bg-secondary">
      <div className="container mx-auto">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Projects</h2>
          <p className="text-muted-foreground md:text-xl/relaxed">
            Here are some of the projects I have worked on.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {projects.map((project) => (
            <Card key={project.title}>
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
