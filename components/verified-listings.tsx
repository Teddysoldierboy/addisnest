import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function VerifiedListings() {
  return (
    <section className="py-20 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-6">
              Only Verified Listings You Can Trust
            </h2>
            <p className="text-primary-foreground/90 text-lg mb-8 leading-relaxed">
              At AddisNest, we take verification seriously. Every property listed on our platform goes through a rigorous verification process to ensure you get accurate information and genuine listings.
            </p>
            <ul className="flex flex-col gap-4 mb-8">
              {[
                "Physical property inspection by our team",
                "Document verification and legal checks",
                "Ownership and title confirmation",
                "Accurate pricing and property details",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-primary-foreground/90">
                  <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              Browse Verified Properties
            </Button>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-primary-foreground/10 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-24 h-24 mx-auto rounded-full bg-accent/20 flex items-center justify-center mb-6">
                  <CheckCircle className="h-12 w-12 text-accent" />
                </div>
                <div className="text-5xl font-bold text-primary-foreground mb-2">100%</div>
                <p className="text-primary-foreground/80 text-lg">Verified Properties</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
