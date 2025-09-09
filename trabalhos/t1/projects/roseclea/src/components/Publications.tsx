import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const publications = [
  {
    title: "A global database of soil respiration data",
    journal: "Biogeosciences, 2011",
    citations: 1595,
  },
  {
    title: "A global database of leaf respiration data",
    journal: "New Phytologist, 2016",
    citations: 619,
  },
  {
    title: "Global patterns of soil respiration in terrestrial ecosystems",
    journal: "Global Change Biology, 2010",
    citations: 581,
  },
];

export default function Publications() {
  return (
    <section id="publications" className="w-full py-20 lg:py-32">
      <div className="container mx-auto">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Publications</h2>
          <p className="text-muted-foreground md:text-xl/relaxed">
            A selection of my most cited publications. For a full list, please visit my Lattes profile.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {publications.map((pub) => (
            <Card key={pub.title}>
              <CardHeader>
                <CardTitle>{pub.title}</CardTitle>
                <CardDescription>{pub.journal}</CardDescription>
                <p className="text-sm text-muted-foreground">Cited by {pub.citations}</p>
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="text-center mt-10">
          <a href="http://lattes.cnpq.br/6560346309368052" target="_blank" rel="noopener noreferrer">
            <Button>View All Publications</Button>
          </a>
        </div>
      </div>
    </section>
  );
}
