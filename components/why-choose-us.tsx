import { CheckCircle, Shield, BarChart3, MapPin, Clock, Headphones } from "lucide-react"

const features = [
  {
    icon: CheckCircle,
    title: "Verified Listings",
    description: "Every property is personally verified by our team to ensure accuracy and quality.",
  },
  {
    icon: Shield,
    title: "Secure Transactions",
    description: "Safe and transparent property transactions with legal support throughout the process.",
  },
  {
    icon: BarChart3,
    title: "Smart Comparison",
    description: "Compare multiple properties side-by-side to make informed decisions.",
  },
  {
    icon: MapPin,
    title: "Location Insights",
    description: "Detailed neighborhood information including amenities, schools, and transport.",
  },
  {
    icon: Clock,
    title: "Real-Time Updates",
    description: "Get instant notifications when new properties matching your criteria are listed.",
  },
  {
    icon: Headphones,
    title: "Expert Support",
    description: "Our dedicated team is available to assist you throughout your property journey.",
  },
]

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Why Choose AddisNest
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We are committed to making your property search simple, secure, and successful.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-xl border border-border bg-card hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
