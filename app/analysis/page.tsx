"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Standard = {
  isNumber: string;
  title: string;
  productCategory?: string;
  keywords?: string[];
  scope?: string;
  requirements?: string[];
  evidenceNeeded?: string[];
  authority?: string;
  certificationStatus?: string;
  qcoStatus?: string;
  notes?: string;
  sourceType?: string;
  sourceUrl?: string;
  score?: number;
};

type AnalysisResult = {
  success?: boolean;
  analysis?: string;
  standards?: Standard[];
  matchedStandards?: Standard[];
  standardsCount?: number;
  aiGenerated?: boolean;
  aiError?: boolean;
  product?: string;
  category?: string;
  description?: string;
  intendedUse?: string;
  manufacturerType?: string;
  disclaimer?: string;
  error?: string;
};

/* =========================================================
   FORMAT AI ANALYSIS
   ========================================================= */

function formatAnalysis(text: string) {
  const lines = text.split("\n");

  return lines.map((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      return <div key={index} className="h-3" />;
    }

    /* Main headings */

    if (trimmed.startsWith("## ")) {
      return (
        <h3
          key={index}
          className="mt-7 mb-3 text-xl font-bold text-slate-900"
        >
          {trimmed.replace(/^## /, "")}
        </h3>
      );
    }

    /* Bullet points */

    if (
      trimmed.startsWith("- ") ||
      trimmed.startsWith("* ")
    ) {
      const content = trimmed.replace(/^[-*]\s+/, "");

      return (
        <div
          key={index}
          className="mb-2 flex gap-3 text-sm leading-6 text-slate-700"
        >
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />

          <span
            dangerouslySetInnerHTML={{
              __html: formatBoldText(content),
            }}
          />
        </div>
      );
    }

    /* Numbered steps */

    if (/^\d+\.\s/.test(trimmed)) {
      const match = trimmed.match(/^(\d+)\.\s+(.*)$/);

      if (match) {
        return (
          <div
            key={index}
            className="mb-3 flex gap-3 text-sm leading-6 text-slate-700"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">
              {match[1]}
            </span>

            <span
              dangerouslySetInnerHTML={{
                __html: formatBoldText(match[2]),
              }}
            />
          </div>
        );
      }
    }

    return (
      <p
        key={index}
        className="mb-3 text-sm leading-7 text-slate-700"
        dangerouslySetInnerHTML={{
          __html: formatBoldText(trimmed),
        }}
      />
    );
  });
}

/* =========================================================
   BOLD TEXT
   ========================================================= */

function formatBoldText(text: string) {
  return text.replace(
    /\*\*(.*?)\*\*/g,
    "<strong>$1</strong>"
  );
}

/* =========================================================
   INFO CARD
   ========================================================= */

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="text-base font-semibold text-slate-900">
        {value || "Not provided"}
      </p>
    </div>
  );
}

/* =========================================================
   STATUS BADGE
   ========================================================= */

function StatusBadge({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
      {children}
    </span>
  );
}

/* =========================================================
   PAGE
   ========================================================= */

export default function AnalysisPage() {
  const searchParams = useSearchParams();

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [result, setResult] =
    useState<AnalysisResult | null>(null);

  const hasStarted =
    useRef(false);

  const product =
    searchParams.get("product") || "";

  const category =
    searchParams.get("category") || "";

  const description =
    searchParams.get("description") || "";

  const intendedUse =
    searchParams.get("intendedUse") || "";

  const manufacturerType =
    searchParams.get("manufacturerType") || "";

  /* =======================================================
     RUN ANALYSIS
     ======================================================= */

  useEffect(() => {
    if (hasStarted.current) {
      return;
    }

    if (!product || !category) {
      setLoading(false);
      setError(
        "Product information is missing. Please start a new analysis."
      );
      return;
    }

    hasStarted.current = true;

    async function runAnalysis() {
      try {
        setLoading(true);
        setError("");

        const response =
          await fetch("/api/analyze", {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              product,
              category,
              description,
              intendedUse,
              manufacturerType,
            }),
          });

        const raw =
          await response.text();

        let data: AnalysisResult;

        try {
          data = JSON.parse(raw);
        } catch {
          throw new Error(
            "The analysis service returned an invalid response."
          );
        }

        if (!response.ok || !data.success) {
          throw new Error(
            data.error ||
              "AI analysis could not be generated."
          );
        }

        setResult(data);
      } catch (err) {
        console.error(
          "Analysis page error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "AI analysis could not be generated."
        );
      } finally {
        setLoading(false);
      }
    }

    runAnalysis();
  }, [
    product,
    category,
    description,
    intendedUse,
    manufacturerType,
  ]);

  /* =======================================================
     STANDARDS
     ======================================================= */

  const standards =
    result?.matchedStandards ||
    result?.standards ||
    [];

  const standardsCount =
    result?.standardsCount ??
    standards.length;

  /* =======================================================
     LOADING
     ======================================================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link
              href="/"
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                GL
              </div>

              <div>
                <div className="text-lg font-bold text-slate-900">
                  Global Launch
                </div>

                <div className="text-xs font-medium text-slate-500">
                  Standards & Compliance Copilot
                </div>
              </div>
            </Link>
          </div>
        </header>

        <section className="px-6 py-20">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <h1 className="text-2xl font-bold text-slate-900">
                Analyzing Your Product
              </h1>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
                Our Indian Standards AI Engine is
                retrieving relevant standards and
                generating preliminary compliance
                guidance.
              </p>

              <div className="mt-8 rounded-2xl bg-blue-50 p-5 text-left">
                <p className="text-sm font-bold text-blue-900">
                  Current process
                </p>

                <div className="mt-4 space-y-3 text-sm text-blue-800">
                  <div>✓ Understanding product information</div>
                  <div>✓ Matching Indian Standards</div>
                  <div>● Generating AI reasoning</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  /* =======================================================
     ERROR
     ======================================================= */

  if (error || !result) {
    return (
      <main className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link
              href="/"
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                GL
              </div>

              <div>
                <div className="text-lg font-bold text-slate-900">
                  Global Launch
                </div>

                <div className="text-xs font-medium text-slate-500">
                  Standards & Compliance Copilot
                </div>
              </div>
            </Link>
          </div>
        </header>

        <section className="px-6 py-16">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-3xl border border-red-200 bg-white p-8 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-xl">
                !
              </div>

              <h1 className="text-2xl font-bold text-slate-900">
                Analysis Could Not Be Completed
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {error ||
                  "Please try the analysis again."}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/start"
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  Start New Analysis
                </Link>

                <Link
                  href="/"
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  /* =======================================================
     MAIN RESULT
     ======================================================= */

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ===================================================
          NAVBAR
          =================================================== */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
              GL
            </div>

            <div>
              <div className="text-lg font-bold text-slate-900">
                Global Launch
              </div>

              <div className="text-xs font-medium text-slate-500">
                Standards & Compliance Copilot
              </div>
            </div>
          </Link>

          <Link
            href="/start"
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            New Analysis
          </Link>
        </div>
      </header>

      {/* ===================================================
          CONTENT
          =================================================== */}

      <section className="px-6 py-10">
        <div className="mx-auto max-w-6xl">

          {/* Progress */}

          <div className="mb-8">
            <div className="flex items-center gap-3 text-sm font-bold text-blue-700">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                2
              </span>

              STEP 2 OF 4

              <span className="font-normal text-slate-400">
                Product Standards Analysis
              </span>
            </div>
          </div>

          {/* =================================================
              PRODUCT INFORMATION
              ================================================= */}

          <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-blue-700">
                  Product Information
                </p>

                <h1 className="mt-1 text-2xl font-bold text-slate-900">
                  Indian Standards AI Analysis
                </h1>

                <p className="mt-2 text-sm text-slate-600">
                  Information used by the Indian Standards AI Engine
                </p>
              </div>

              <span className="inline-flex w-fit rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
                🇮🇳 India
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <InfoCard
                label="Product"
                value={product}
              />

              <InfoCard
                label="Category"
                value={category}
              />

              <InfoCard
                label="Intended Use"
                value={intendedUse}
              />

              <InfoCard
                label="Manufacturer Type"
                value={manufacturerType}
              />

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-2">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Product Description
                </p>

                <p className="text-base font-medium leading-6 text-slate-900">
                  {description ||
                    "No description provided."}
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              AI STATUS
              ================================================= */}

          <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-green-500" />

                  <h2 className="text-lg font-bold text-slate-900">
                    AI Analysis Completed
                  </h2>
                </div>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                  Local AI has analyzed the retrieved Indian
                  Standards and generated preliminary compliance
                  guidance.
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                    Indian Standards Engine
                  </span>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                    Local Qwen AI
                  </span>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 px-5 py-4 text-center">
                <div className="text-2xl font-bold text-slate-900">
                  {standardsCount}
                </div>

                <div className="text-xs font-bold text-slate-500">
                  Standards Found
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              AI ANALYSIS
              ================================================= */}

          {result.analysis && (
            <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 border-b border-slate-200 pb-5">
                <p className="text-sm font-bold text-blue-700">
                  AI Reasoning
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  Preliminary Compliance Analysis
                </h2>

                <p className="mt-2 text-sm text-slate-600">
                  The analysis is based on the standards retrieved
                  from the current Indian Standards knowledge base.
                </p>
              </div>

              <div>
                {formatAnalysis(
                  result.analysis
                )}
              </div>
            </div>
          )}

          {/* =================================================
              RETRIEVED STANDARDS
              ================================================= */}

          <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <p className="text-sm font-bold text-blue-700">
                Standards Retrieval
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Relevant Indian Standards
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                These standards were retrieved from the project's
                Indian Standards knowledge base. Applicability and
                current requirements must be verified with the
                official authority.
              </p>
            </div>

            {standards.length === 0 ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <p className="font-bold text-amber-900">
                  No sufficiently relevant standards found
                </p>

                <p className="mt-2 text-sm leading-6 text-amber-800">
                  Verify the product classification and search the
                  official BIS Standards portal for additional
                  requirements.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {standards.map(
                  (standard, index) => (
                    <div
                      key={
                        standard.isNumber ||
                        index
                      }
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-bold text-blue-700">
                            {standard.isNumber}
                          </p>

                          <h3 className="mt-1 text-lg font-bold text-slate-900">
                            {standard.title}
                          </h3>
                        </div>

                        <StatusBadge>
                          {standard.certificationStatus ||
                            "Verification Required"}
                        </StatusBadge>
                      </div>

                      {standard.scope && (
                        <div className="mt-5">
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Scope
                          </p>

                          <p className="mt-1 text-sm leading-6 text-slate-700">
                            {standard.scope}
                          </p>
                        </div>
                      )}

                      {standard.authority && (
                        <div className="mt-4">
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Authority
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-800">
                            {standard.authority}
                          </p>
                        </div>
                      )}

                      {standard.qcoStatus && (
                        <div className="mt-4">
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            QCO Status
                          </p>

                          <p className="mt-1 text-sm text-slate-700">
                            {standard.qcoStatus}
                          </p>
                        </div>
                      )}

                      {standard.evidenceNeeded &&
                        standard.evidenceNeeded.length >
                          0 && (
                          <div className="mt-4">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                              Evidence Needed
                            </p>

                            <ul className="mt-2 space-y-1">
                              {standard.evidenceNeeded.map(
                                (
                                  item,
                                  itemIndex
                                ) => (
                                  <li
                                    key={
                                      itemIndex
                                    }
                                    className="flex gap-2 text-sm text-slate-700"
                                  >
                                    <span className="text-blue-600">
                                      •
                                    </span>

                                    {item}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}

                      {standard.sourceUrl && (
                        <div className="mt-5 border-t border-slate-200 pt-4">
                          <a
                            href={
                              standard.sourceUrl
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-bold text-blue-700 hover:text-blue-800"
                          >
                            View official source →
                          </a>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* =================================================
              NEXT STEPS
              ================================================= */}

          <div className="mb-8 rounded-3xl border border-blue-100 bg-blue-50 p-6 sm:p-8">
            <p className="text-sm font-bold text-blue-700">
              Continue Compliance Workflow
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              What would you like to do next?
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Upload compliance evidence and then create your
              Compliance Passport with the identified requirements,
              evidence and verification status.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/documents?product=${encodeURIComponent(
                  product
                )}&category=${encodeURIComponent(
                  category
                )}&origin=India&market=India`}
                className="rounded-xl bg-blue-600 px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-blue-700"
              >
                Continue to Documents →
              </Link>

              <Link
                href={`/passport?product=${encodeURIComponent(
                  product
                )}&category=${encodeURIComponent(
                  category
                )}&origin=India&market=India`}
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-center text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                View Compliance Passport
              </Link>
            </div>
          </div>

          {/* =================================================
              DISCLAIMER
              ================================================= */}

          <div className="mb-10 rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs leading-6 text-slate-500">
              <strong className="text-slate-700">
                Important:
              </strong>{" "}
              This is AI-assisted preliminary guidance based on the
              project's Indian Standards knowledge base. It is not
              legal or regulatory advice. Always verify applicable
              requirements, current editions, amendments, QCOs and
              certification requirements with the relevant official
              authority.
            </p>
          </div>

        </div>
      </section>

      {/* ===================================================
          FOOTER
          =================================================== */}

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6 text-center text-xs text-slate-500">
          Global Launch Copilot · AI-assisted Indian Standards &
          Compliance Readiness
        </div>
      </footer>
    </main>
  );
}