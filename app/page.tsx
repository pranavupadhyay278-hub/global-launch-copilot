import Link from "next/link";

const features = [
  {
    number: "01",
    title: "AI Compliance Engine",
    description:
      "Understand the key market requirements for your product and identify what needs to be verified before entering a new country.",
  },
  {
    number: "02",
    title: "Standards & Sources",
    description:
      "Connect requirements with relevant authorities, evidence and official sources instead of relying on unsupported AI answers.",
  },
  {
    number: "03",
    title: "Document Verification",
    description:
      "Upload certificates, reports or product documents and use AI to identify important information and possible evidence gaps.",
  },
  {
    number: "04",
    title: "Compliance Passport",
    description:
      "Keep your product's market-readiness information, evidence status and next actions in one simple place.",
  },
  {
    number: "05",
    title: "Market Entry Roadmap",
    description:
      "Turn compliance findings into a practical sequence of actions for preparing your product for the target market.",
  },
  {
    number: "06",
    title: "FounderBridge",
    description:
      "Connect new founders with experienced entrepreneurs for practical guidance alongside AI-powered support.",
  },
];

const steps = [
  {
    step: "01",
    title: "Tell us about your product",
    text: "Enter your product, category, origin country and target market.",
  },
  {
    step: "02",
    title: "Understand requirements",
    text: "The AI analyzes the product against the platform's compliance knowledge base.",
  },
  {
    step: "03",
    title: "Check your evidence",
    text: "Upload documents and identify available evidence and potential gaps.",
  },
  {
    step: "04",
    title: "Prepare for market entry",
    text: "Follow your compliance passport and market-entry roadmap.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white shadow-sm">
              GL
            </div>

            <div>
              <div className="text-lg font-bold tracking-tight">
                Global Launch
              </div>
              <div className="text-xs font-medium text-slate-500">
                Compliance Copilot
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              How It Works
            </a>

            <a
              href="#features"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              Features
            </a>

            <Link
              href="/founderbridge"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              FounderBridge
            </Link>

            <Link
              href="/start"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Get Started
            </Link>
          </nav>

          <Link
            href="/start"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white md:hidden"
          >
            Start
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              AI-powered market readiness platform
            </div>

            <h1 className="max-w-4xl text-5xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              From Product Idea
              <span className="block text-blue-600">
                to Global Market Readiness.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">
              Global Launch Copilot helps startups and businesses understand
              foreign-market requirements, organize compliance evidence,
              identify gaps and plan their next steps before entering a new
              market.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/start"
                className="rounded-xl bg-blue-600 px-7 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-blue-600/15 transition hover:bg-blue-700"
              >
                Analyze My Product →
              </Link>

              <a
                href="#how-it-works"
                className="rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-center text-sm font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                See How It Works
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-sm text-slate-500">
              <span>✓ Product analysis</span>
              <span>✓ Evidence mapping</span>
              <span>✓ Market roadmap</span>
            </div>
          </div>

          {/* Hero product card */}
          <div className="relative">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-xl shadow-slate-900/5">
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Market Analysis
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-slate-900">
                      Cotton T-Shirt
                    </h2>
                  </div>

                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    India → USA
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-800">
                        Textile labeling
                      </span>
                      <span className="text-xs font-semibold text-amber-600">
                        Verify
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Check applicable labeling information and supporting
                      evidence.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-800">
                        Care labeling
                      </span>
                      <span className="text-xs font-semibold text-amber-600">
                        Verify
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Review care instructions for the specific garment.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-800">
                        Evidence
                      </span>
                      <span className="text-xs font-semibold text-blue-600">
                        AI Ready
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Upload product documents for evidence mapping.
                    </p>
                  </div>
                </div>

                <Link
                  href="/start"
                  className="mt-6 block rounded-xl bg-slate-900 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  Start Market Analysis
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
              The Problem
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Going global should not start with scattered information.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Startups often have to search across regulations, standards,
              testing information, documents and market-entry resources before
              they can understand what needs to be verified.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="text-2xl font-bold text-slate-900">01</div>
              <h3 className="mt-5 text-lg font-bold">Too much information</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Requirements can be spread across different authorities and
                documents.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="text-2xl font-bold text-slate-900">02</div>
              <h3 className="mt-5 text-lg font-bold">Evidence is unclear</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                A startup may have documents but still not know what each
                document actually supports.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="text-2xl font-bold text-slate-900">03</div>
              <h3 className="mt-5 text-lg font-bold">Next steps are unclear</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Finding information is only the beginning. Businesses also
                need an actionable market-entry plan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
              How It Works
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              One simple workflow from product to market.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
              >
                <div className="text-sm font-bold text-blue-600">
                  {item.step}
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                Platform
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Everything a startup needs to prepare for a new market.
              </h2>
            </div>

            <Link
              href="/start"
              className="w-fit rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-600"
            >
              Explore the Copilot →
            </Link>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.number}
                className="bg-white p-7 transition hover:bg-slate-50"
              >
                <div className="text-sm font-bold text-blue-600">
                  {feature.number}
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Engine */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                Global Compliance Engine
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Product → Country → Requirements → Evidence → Action
              </h2>

              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
                The platform connects product information with the selected
                market, organizes relevant requirements and helps the founder
                understand what evidence still needs to be verified.
              </p>

              <Link
                href="/start"
                className="mt-7 inline-flex rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                Try the Compliance Engine →
              </Link>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="space-y-3">
                {[
                  ["Product", "Cotton T-Shirt"],
                  ["Origin", "India"],
                  ["Target Market", "United States"],
                  ["Requirements", "6 areas to verify"],
                  ["Evidence", "Documents + test reports"],
                  ["Next Step", "Resolve verification gaps"],
                ].map(([label, value], index) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-5 rounded-xl border border-slate-200 bg-white px-5 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                        {index + 1}
                      </span>
                      <span className="text-sm font-semibold text-slate-600">
                        {label}
                      </span>
                    </div>

                    <span className="text-right text-sm font-bold text-slate-900">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FounderBridge */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:p-12">
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                  FounderBridge
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                  AI guidance meets real founder experience.
                </h2>

                <p className="mt-5 max-w-2xl leading-7 text-slate-600">
                  New founders can find experienced entrepreneurs based on
                  industry, startup stage, target market and the problem they
                  need help with.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
                    Founder matching
                  </span>
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
                    Mentorship
                  </span>
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
                    AI follow-up
                  </span>
                </div>
              </div>

              <Link
                href="/founderbridge"
                className="rounded-xl bg-slate-900 px-7 py-4 text-center text-sm font-bold text-white transition hover:bg-slate-800"
              >
                Explore FounderBridge →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-slate-950">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center lg:px-8 lg:py-24">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-400">
            Ready to go global?
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Start with your product.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300">
            Tell us what you are building and where you want to sell it.
            Global Launch Copilot will guide you through the next steps.
          </p>

          <Link
            href="/start"
            className="mt-8 inline-flex rounded-xl bg-blue-600 px-8 py-4 text-sm font-bold text-white transition hover:bg-blue-500"
          >
            Start Market Analysis →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-7 text-sm text-slate-400 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <span className="font-semibold text-white">
              Global Launch Copilot
            </span>{" "}
            — From Product Idea to Global Market Readiness.
          </div>

          <div className="flex gap-5">
            <Link
              href="/start"
              className="transition hover:text-white"
            >
              Get Started
            </Link>

            <Link
              href="/founderbridge"
              className="transition hover:text-white"
            >
              FounderBridge
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}