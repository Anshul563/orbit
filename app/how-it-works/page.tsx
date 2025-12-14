import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HowItWorks } from "@/components/how-it-works"; // Reuse the component we made
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // Assuming you have this, otherwise see note below*

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen  text-slate-900">
      {/* --- NAVIGATION --- */}
      <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <Navbar />
      </nav>

      <main>
        {/* --- HERO HEADER --- */}
        <section className="relative py-30 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/40 rounded-full blur-3xl -z-10" />

          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-display text-slate-900 mb-6">
              The Economy of <br />
              <span className="text-blue-600">Pure Value.</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Orbit is designed to break the financial barrier to education and
              collaboration. We replaced the dollar sign with effort. Here is
              everything you need to know.
            </p>
          </div>
        </section>

        {/* --- CORE STEPS COMPONENT --- */}
        {/* We reuse the beautiful component you already built */}
        <div className="-mt-12 relative z-10">
          <HowItWorks />
        </div>

        {/* --- DEEP DIVE / FAQ SECTION --- */}
        <section className="py-24 max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-display text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 mt-2">
              Common questions about the credit system.
            </p>
          </div>

          <div className="space-y-4">
            {/* If you don't have the Accordion component installed, 
                you can replace these <Accordion> tags with standard <details> tags */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left font-medium text-lg">
                  Is Orbit really free?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed">
                  Yes! There are no subscription fees or hidden charges to join
                  Orbit. The only currency used is "Orbit Credits," which you
                  earn by helping others. You cannot buy credits with real
                  money—you have to earn them.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left font-medium text-lg">
                  How much is 1 Credit worth?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed">
                  We generally equate{" "}
                  <strong>1 Credit to roughly 1 minute of skilled work</strong>{" "}
                  or a simplified task unit. However, the market decides! A
                  simple logo design might cost 300 credits, while a 1-hour
                  tutoring session might cost 600 credits. You negotiate the
                  price with your peer.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left font-medium text-lg">
                  What if someone doesn't pay me?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed">
                  When you start a "Swap" (a job), the requester's credits are
                  held in <strong>Escrow</strong> by Orbit. They are only
                  released to you once the work is marked as complete. This
                  ensures you never work for free.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left font-medium text-lg">
                  Can I use this if I'm not a university student?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed">
                  Currently, Orbit is exclusive to students with a valid .edu
                  email address. This ensures a safe, verified environment for
                  collaboration. We plan to open to recent graduates soon.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left font-medium text-lg">
                  How do I earn my first credits?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed">
                  When you sign up, we give you a small{" "}
                  <strong>Welcome Bonus</strong> (usually 50 credits) to get
                  started. To earn more, browse the "Request" tab in the
                  marketplace and apply to help someone!
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* --- BOTTOM CTA --- */}
        <section className="py-20 bg-blue-600 text-white text-center">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">
              Start Building Your Network
            </h2>
            <p className="text-blue-100 mb-8 max-w-xl mx-auto text-lg">
              Join the ecosystem today. It takes less than 2 minutes to create
              your profile and list your first skill.
            </p>
            <Link href="/sign-up">
              <Button
                size="lg"
                className="h-14 px-10 rounded-full bg-white text-blue-600 hover:bg-blue-50 font-bold text-lg shadow-xl"
              >
                Get Started for Free
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
