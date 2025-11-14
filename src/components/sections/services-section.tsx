import { services } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ServicesSection() {
  return (
    <section className="bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-medium">How We Help</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="group">
              <Card className="h-full text-center border rounded-lg p-8 transition-all duration-300 group-hover:border-primary group-hover:-translate-y-2">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <service.icon className="w-10 h-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-headline font-medium">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-balance">{service.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
