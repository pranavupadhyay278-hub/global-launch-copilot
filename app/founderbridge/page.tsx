"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function FounderBridgePageContent() {
  const params = useSearchParams();

  const product = params.get("product") || "Cotton T-Shirt";
  const category =
    params.get("category") || "Clothing & Apparel";
  const market =
    params.get("market") || "United States";

  const [industry, setIndustry] = useState("");
  const [stage, setStage] = useState("");
  const [problem, setProblem] = useState("");
  const [matched, setMatched] = useState(false);

  function findMatch() {
    if (!industry || !stage || !problem.trim()) return;
    setMatched(true);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* NAVBAR */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
              GL
            </div>

            <div>
              <p className="font-bold text-slate-900">
                Global Launch
              </p>
              <p className="text-xs text-slate-500">
                Copilot
              </p>
            </div>
          </Link>

          <Link
            href="/"
            className="text-sm font-semibold text-slate-600 hover:text-blue-600"
          >
            ← Home
          </Link>

        </div>
      </nav>


      {/* HEADER */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-6 py-12 text-center">

          <span className="inline-block rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
            FOUNDERBRIDGE
          </span>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Learn from founders who
            <span className="text-blue-600"> have done it before.</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Get practical startup guidance, connect with experienced
            founders and receive AI-powered follow-up support.
          </p>

        </div>
      </section>


      {/* HOW IT WORKS */}
      <section className="px-6 pt-8">
        <div className="mx-auto max-w-5xl">

          <div className="grid gap-4 md:grid-cols-3">

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="text-sm font-bold text-blue-600">
                01
              </span>

              <h3 className="mt-3 text-lg font-bold text-slate-900">
                Tell us your challenge
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Share your startup stage, industry and the problem you
                are trying to solve.
              </p>
            </div>


            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="text-sm font-bold text-blue-600">
                02
              </span>

              <h3 className="mt-3 text-lg font-bold text-slate-900">
                Get matched
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Find an experienced founder relevant to your industry
                and market.
              </p>
            </div>


            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="text-sm font-bold text-blue-600">
                03
              </span>

              <h3 className="mt-3 text-lg font-bold text-slate-900">
                Grow with guidance
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Get practical advice and turn discussions into clear
                next steps with AI.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* SUBSCRIPTION PLANS */}
      <section className="px-6 py-12">

        <div className="mx-auto max-w-5xl">

          <div className="text-center">

            <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
              Choose Your Plan
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              FounderBridge Subscriptions
            </h2>

            <p className="mt-3 text-slate-600">
              Choose the level of founder support that fits your startup.
            </p>

          </div>


          <div className="mt-8 grid gap-5 md:grid-cols-3">

            {/* STARTER */}
            <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

              <div>
                <p className="text-sm font-bold text-slate-500">
                  STARTER
                </p>

                <h3 className="mt-3 text-3xl font-bold text-slate-900">
                  ₹5,000
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  For founders getting started
                </p>
              </div>

              <div className="my-6 h-px bg-slate-200" />

              <ul className="space-y-4 text-sm text-slate-700">

                <li>✓ Founder matching</li>

                <li>✓ 1 mentorship session</li>

                <li>✓ Startup guidance</li>

                <li>✓ Basic AI follow-up</li>

              </ul>

              <button className="mt-8 w-full rounded-lg border border-blue-600 px-5 py-3 font-semibold text-blue-600 hover:bg-blue-50">
                Choose Starter
              </button>

            </div>


            {/* GROWTH */}
            <div className="relative flex flex-col rounded-2xl border-2 border-blue-600 bg-white p-7 shadow-md">

              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-bold text-white">
                MOST POPULAR
              </div>

              <div>
                <p className="text-sm font-bold text-blue-600">
                  GROWTH
                </p>

                <h3 className="mt-3 text-3xl font-bold text-slate-900">
                  ₹10,000
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  For founders building momentum
                </p>
              </div>

              <div className="my-6 h-px bg-slate-200" />

              <ul className="space-y-4 text-sm text-slate-700">

                <li>✓ Everything in Starter</li>

                <li>✓ Multiple mentor sessions</li>

                <li>✓ Deeper startup guidance</li>

                <li>✓ AI action-plan support</li>

                <li>✓ Market-entry guidance</li>

              </ul>

              <button className="mt-8 w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
                Choose Growth
              </button>

            </div>


            {/* PREMIUM */}
            <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

              <div>
                <p className="text-sm font-bold text-slate-500">
                  PREMIUM
                </p>

                <h3 className="mt-3 text-3xl font-bold text-slate-900">
                  ₹15,000
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  For founders needing deeper support
                </p>
              </div>

              <div className="my-6 h-px bg-slate-200" />

              <ul className="space-y-4 text-sm text-slate-700">

                <li>✓ Everything in Growth</li>

                <li>✓ Priority founder matching</li>

                <li>✓ Advanced mentorship</li>

                <li>✓ Personalized AI follow-up</li>

                <li>✓ International market guidance</li>

              </ul>

              <button className="mt-8 w-full rounded-lg border border-blue-600 px-5 py-3 font-semibold text-blue-600 hover:bg-blue-50">
                Choose Premium
              </button>

            </div>

          </div>


          <p className="mt-5 text-center text-xs text-slate-500">
            Example subscription pricing for the prototype. Final pricing,
            mentor payout and subscription benefits can be configured by
            the platform.
          </p>

        </div>

      </section>


      {/* MATCHING FORM */}
      <section className="px-6 pb-12">

        <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-7 shadow-sm md:p-9">

          <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
            Founder Matching
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            Find a founder who understands your journey
          </h2>

          <p className="mt-2 text-slate-600">
            Tell us a little about your startup and what you need help with.
          </p>


          <div className="mt-6 grid gap-5 md:grid-cols-2">

            <div>

              <label
                htmlFor="industry"
                className="text-sm font-semibold text-slate-900"
              >
                Industry
              </label>

              <select
                id="industry"
                value={industry}
                onChange={(e) => {
                  setIndustry(e.target.value);
                  setMatched(false);
                }}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >

                <option value="">
                  Select industry
                </option>

                <option>Clothing & Apparel</option>
                <option>Electronics</option>
                <option>Food & Beverages</option>
                <option>Technology</option>
                <option>Manufacturing</option>
                <option>Other</option>

              </select>

            </div>


            <div>

              <label
                htmlFor="stage"
                className="text-sm font-semibold text-slate-900"
              >
                Startup Stage
              </label>

              <select
                id="stage"
                value={stage}
                onChange={(e) => {
                  setStage(e.target.value);
                  setMatched(false);
                }}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >

                <option value="">
                  Select stage
                </option>

                <option>Idea Stage</option>
                <option>Early Startup</option>
                <option>Product Ready</option>
                <option>Already Selling</option>
                <option>International Expansion</option>

              </select>

            </div>

          </div>


          <div className="mt-5">

            <label className="text-sm font-semibold text-slate-900">
              Target Market
            </label>

            <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
              {market}
            </div>

          </div>


          <div className="mt-5">

            <label
              htmlFor="problem"
              className="text-sm font-semibold text-slate-900"
            >
              What do you need help with?
            </label>

            <textarea
              id="problem"
              value={problem}
              onChange={(e) => {
                setProblem(e.target.value);
                setMatched(false);
              }}
              rows={4}
              placeholder="Example: I want to understand how to enter the US market."
              className="mt-2 w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>


          <button
            onClick={findMatch}
            className="mt-6 w-full rounded-lg bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700"
          >
            Find My Founder Match →
          </button>

        </div>

      </section>


      {/* MATCH RESULT */}
      {matched && (
        <section className="px-6 pb-12">

          <div className="mx-auto max-w-5xl rounded-2xl border border-emerald-200 bg-white p-7 shadow-sm">

            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              MATCH FOUND
            </span>

            <h2 className="mt-4 text-2xl font-bold text-slate-900">
              We found a relevant founder profile
            </h2>

            <p className="mt-2 text-slate-600">
              Based on your industry, startup stage and challenge, the
              platform can connect you with an experienced founder.
            </p>


            <div className="mt-6 grid gap-4 md:grid-cols-3">

              <div className="rounded-xl bg-slate-50 p-5">
                <p className="text-xs font-bold uppercase text-slate-500">
                  Industry
                </p>

                <p className="mt-2 font-bold text-slate-900">
                  {industry}
                </p>
              </div>


              <div className="rounded-xl bg-slate-50 p-5">
                <p className="text-xs font-bold uppercase text-slate-500">
                  Startup Stage
                </p>

                <p className="mt-2 font-bold text-slate-900">
                  {stage}
                </p>
              </div>


              <div className="rounded-xl bg-slate-50 p-5">
                <p className="text-xs font-bold uppercase text-slate-500">
                  Target Market
                </p>

                <p className="mt-2 font-bold text-slate-900">
                  {market}
                </p>
              </div>

            </div>


            <div className="mt-6 flex flex-col gap-4 rounded-xl bg-blue-50 p-5 md:flex-row md:items-center md:justify-between">

              <div>
                <p className="font-bold text-slate-900">
                  Ready to connect?
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  Choose a subscription plan to continue.
                </p>
              </div>

              <button className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
                Continue to Subscription →
              </button>

            </div>

          </div>

        </section>
      )}


      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white">

        <div className="mx-auto max-w-6xl px-6 py-6">

          <p className="text-center text-sm text-slate-500">
            Global Launch Copilot — From Product Idea to Global Market Readiness.
          </p>

        </div>

          </footer>

    </main>
  );
}

export default function FounderBridgePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-sm text-slate-600">
            Loading FounderBridge...
          </div>
        </main>
      }
    >
      <FounderBridgePageContent />
    </Suspense>
  );
}