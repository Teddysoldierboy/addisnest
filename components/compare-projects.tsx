import { Scale, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CompareProjects() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[4/5] rounded-xl bg-background border border-border p-4 flex flex-col">
                <div className="w-full aspect-video bg-muted rounded-lg mb-3" />
                <div className="h-3 w-3/4 bg-muted rounded mb-2" />
                <div className="h-2 w-1/2 bg-muted rounded mb-auto" />
                <div className="h-8 w-full bg-primary/10 rounded mt-3" />
              </div>
              <div className="aspect-[4/5] rounded-xl bg-background border border-border p-4 flex flex-col mt-8">
                <div className="w-full aspect-video bg-muted rounded-lg mb-3" />
                <div className="h-3 w-3/4 bg-muted rounded mb-2" />
                <div className="h-2 w-1/2 bg-muted rounded mb-auto" />
                <div className="h-8 w-full bg-primary/10 rounded mt-3" />
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center mb-6">
              <Scale className="h-7 w-7 text-accent" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Compare Properties Side by Side
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Make informed decisions by comparing multiple properties simultaneously. View prices, features, amenities, and locations in one comprehensive comparison view.
            </p>
            <ul className="flex flex-col gap-3 mb-8">
              {[
                "Compare up to 4 properties at once",
                "Side-by-side feature comparison",
                "Price and value analysis",
                "Save comparisons for later review",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <Button size="lg" className="gap-2">
              Start Comparing
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
