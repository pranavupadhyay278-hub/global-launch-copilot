"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

type RequirementStatus =
  | "Completed"
  | "Verification Required"
  | "Missing"
  | "In Progress";

type Requirement = {
  title: string;
  description: string;
  status: RequirementStatus;
  evidence: string;
};

function PassportPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const product =
    searchParams.get("product") || "Your Product";

  const category =
    searchParams.get("category") || "Product Category";

  const origin =
    searchParams.get("origin") || "India";

  const market =
    searchParams.get("market") || "United States";

  const [documentAnalysis, setDocumentAnalysis] = useState("");
  const [showAnalysis, setShowAnalysis] = useState(false);

  /*
   * Read the document-analysis result saved by the Documents page.
   */
  useEffect(() => {
    const savedAnalysis = sessionStorage.getItem(
      "glc_document_analysis"
    );

    if (savedAnalysis) {
      setDocumentAnalysis(savedAnalysis);
    }
  }, []);

  /*
   * Demo compliance requirements.
   *
   * These remain intentionally cautious:
   * the system shows what needs to be verified rather than
   * claiming that a particular certificate automatically proves compliance.
   */
  const requirements: Requirement[] = useMemo(() => {
    return [
      {
        title: "Product Information",
        description:
          "Basic product, category, material and intended-use information has been provided.",
        status: "Completed",
        evidence: "Product information",
      },
      {
        title: "Market Requirements",
        description:
          `Requirements for selling ${product} in ${market} should be verified for the specific product and selling channel.`,
        status: "Verification Required",
        evidence: "Market requirement evidence",
      },
      {
        title: "Testing & Certification",
        description:
          "Applicable testing or certification requirements need to be confirmed for the specific product.",
        status: "Verification Required",
        evidence: "Applicable test reports / certificates",
      },
      {
        title: "Product Documentation",
        description: documentAnalysis
          ? "A document has been uploaded and analyzed by the Document Verification AI."
          : "Upload product certificates, test reports, labels or technical documents for AI-assisted evidence analysis.",
        status: documentAnalysis
          ? "Completed"
          : "In Progress",
        evidence: documentAnalysis
          ? "AI-analyzed document"
          : "Product documents",
      },
    ];
  }, [product, market, documentAnalysis]);

  /*
   * Calculate dashboard numbers.
   */
  const completedCount = requirements.filter(
    (item) => item.status === "Completed"
  ).length;

  const verifyCount = requirements.filter(
    (item) => item.status === "Verification Required"
  ).length;

  const missingCount = requirements.filter(
    (item) => item.status === "Missing"
  ).length;

  const inProgressCount = requirements.filter(
    (item) => item.status === "In Progress"
  ).length;

  /*
   * Prototype readiness indicator.
   */
  const readinessScore = Math.round(
    (completedCount / requirements.length) * 100
  );

  /*
   * Dynamic roadmap.
   *
   * The roadmap changes depending on whether the user
   * has already uploaded evidence.
   */
  const roadmap = [
    {
      number: "01",
      title: "Confirm Product Classification",
      description:
        `Confirm the correct product category and intended use for ${product}.`,
      status: "Current Step",
      action:
        "Review product details and intended use.",
    },
    {
      number: "02",
      title: `Verify ${market} Requirements`,
      description:
        `Identify the applicable requirements for ${category} products entering ${market}.`,
      status:
        verifyCount > 0
          ? "Verification Required"
          : "Review",
      action:
        "Check applicable regulatory, labeling and product requirements.",
    },
    {
      number: "03",
      title: "Prepare Testing & Certification Evidence",
      description:
        "Determine which tests, certificates or other evidence are applicable to the product.",
      status:
        documentAnalysis
          ? "Evidence Review"
          : "Next Action",
      action:
        documentAnalysis
          ? "Review the uploaded document against applicable requirements."
          : "Upload available certificates or test reports.",
    },
    {
      number: "04",
      title: "Resolve Compliance Gaps",
      description:
        "Address missing evidence and items that still require verification.",
      status:
        verifyCount > 0 || inProgressCount > 0
          ? "Pending"
          : "Ready for Review",
      action:
        "Complete missing evidence and verify unresolved requirements.",
    },
    {
      number: "05",
      title: "Prepare Market Entry",
      description:
        `Organize the final compliance evidence and prepare ${product} for ${market} market-entry activities.`,
      status: "Final Stage",
      action:
        "Review the Compliance Passport before market entry.",
    },
  ];

  function goToDocuments() {
    const params = new URLSearchParams({
      product,
      category,
      origin,
      market,
    });

    router.push(`/documents?${params.toString()}`);
  }

  function goToFounderBridge() {
    router.push("/founderbridge");
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <button
            onClick={() => router.push("/")}
            className="text-left"
          >
            <div className="text-xl font-bold tracking-tight text-slate-900">
              GL Global Launch Copilot
            </div>

            <div className="mt-1 text-xs text-slate-500">
              Compliance & Market Entry Platform
            </div>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/start")}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              New Analysis
            </button>

            <button
              onClick={goToFounderBridge}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              FounderBridge
            </button>
          </div>

        </div>
      </header>


      {/* PAGE */}
      <section className="mx-auto max-w-7xl px-6 py-10">

        {/* PAGE INTRO */}
        <div className="mb-8">

          <div className="mb-3 inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            STEP 4 OF 4
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Compliance Passport
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            A simple readiness profile showing what is completed,
            what needs verification, and what your startup should do next
            before entering the target market.
          </p>

        </div>


        {/* PRODUCT SUMMARY */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="grid gap-6 md:grid-cols-4">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Product
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                {product}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Category
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                {category}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Origin
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                {origin}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Target Market
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                {market}
              </p>
            </div>

          </div>

        </div>


        {/* READINESS DASHBOARD */}
        <div className="mb-8 grid gap-5 md:grid-cols-4">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Readiness Indicator
            </p>

            <div className="mt-3 flex items-end gap-2">
              <span className="text-4xl font-bold text-slate-900">
                {readinessScore}%
              </span>

              <span className="mb-1 text-sm text-slate-500">
                prototype score
              </span>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{
                  width: `${readinessScore}%`,
                }}
              />
            </div>
          </div>


          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Completed
            </p>

            <p className="mt-3 text-4xl font-bold text-slate-900">
              {completedCount}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              requirements
            </p>
          </div>


          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Verification
            </p>

            <p className="mt-3 text-4xl font-bold text-slate-900">
              {verifyCount}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              items to verify
            </p>
          </div>


          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Documents
            </p>

            <p className="mt-3 text-4xl font-bold text-slate-900">
              {documentAnalysis ? "✓" : "—"}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {documentAnalysis
                ? "AI analysis available"
                : "Upload required"}
            </p>
          </div>

        </div>


        {/* STATUS SUMMARY */}
        <div className="mb-8 grid gap-5 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
                ✓
              </div>

              <div>
                <p className="font-semibold text-slate-900">
                  Completed
                </p>

                <p className="text-sm text-slate-500">
                  {completedCount} items
                </p>
              </div>

            </div>

          </div>


          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                !
              </div>

              <div>
                <p className="font-semibold text-slate-900">
                  Verification Required
                </p>

                <p className="text-sm text-slate-500">
                  {verifyCount} items
                </p>
              </div>

            </div>

          </div>


          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                →
              </div>

              <div>
                <p className="font-semibold text-slate-900">
                  Next Actions
                </p>

                <p className="text-sm text-slate-500">
                  {Math.max(
                    verifyCount + missingCount + inProgressCount,
                    0
                  )} items
                </p>
              </div>

            </div>

          </div>

        </div>


        {/* REQUIREMENTS */}
        <section className="mb-10">

          <div className="mb-5">

            <h2 className="text-2xl font-bold text-slate-900">
              Compliance Requirements
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Your current compliance evidence and verification status.
            </p>

          </div>


          <div className="space-y-4">

            {requirements.map((item) => {

              const isCompleted =
                item.status === "Completed";

              const isVerify =
                item.status === "Verification Required";

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >

                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

                    <div className="flex gap-4">

                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-bold ${
                          isCompleted
                            ? "bg-green-100 text-green-700"
                            : isVerify
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {isCompleted
                          ? "✓"
                          : isVerify
                          ? "!"
                          : "→"}
                      </div>


                      <div>

                        <h3 className="font-semibold text-slate-900">
                          {item.title}
                        </h3>

                        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                          {item.description}
                        </p>

                        <p className="mt-3 text-xs font-medium text-slate-500">
                          Evidence: {item.evidence}
                        </p>

                      </div>

                    </div>


                    <span
                      className={`inline-flex w-fit shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                        isCompleted
                          ? "bg-green-50 text-green-700"
                          : isVerify
                          ? "bg-amber-50 text-amber-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {item.status}
                    </span>

                  </div>

                </div>
              );
            })}

          </div>

        </section>


        {/* DOCUMENT AI */}
        {documentAnalysis && (
          <section className="mb-10">

            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">

              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

                <div>

                  <div className="mb-2 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-700">
                    DOCUMENT AI VERIFIED
                  </div>

                  <h2 className="text-xl font-bold text-slate-900">
                    Uploaded document has been analyzed
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    The AI reviewed the uploaded document and extracted
                    information that can be used as compliance evidence.
                  </p>

                </div>

                <button
                  onClick={() =>
                    setShowAnalysis(!showAnalysis)
                  }
                  className="rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                >
                  {showAnalysis
                    ? "Hide AI Analysis"
                    : "View AI Analysis"}
                </button>

              </div>


              {showAnalysis && (
                <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">

                  <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-slate-700">
                    {documentAnalysis}
                  </pre>

                </div>
              )}

            </div>

          </section>
        )}


        {/* MARKET ENTRY ROADMAP */}
        <section className="mb-10">

          <div className="mb-6">

            <div className="mb-2 inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              MARKET ENTRY ROADMAP
            </div>

            <h2 className="text-2xl font-bold text-slate-900">
              Your next steps
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Global Launch Copilot converts the compliance findings into
              a practical sequence of actions for entering {market}.
            </p>

          </div>


          <div className="relative">

            {/* Connecting line */}
            <div className="absolute left-5 top-8 hidden h-[calc(100%-4rem)] w-px bg-slate-200 md:block" />

            <div className="space-y-4">

              {roadmap.map((step, index) => (

                <div
                  key={step.number}
                  className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >

                  <div className="flex gap-5">

                    {/* NUMBER */}
                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-sm font-bold text-blue-700">
                      {step.number}
                    </div>


                    {/* CONTENT */}
                    <div className="min-w-0 flex-1">

                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">

                        <div>

                          <h3 className="text-lg font-semibold text-slate-900">
                            {step.title}
                          </h3>

                          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                            {step.description}
                          </p>

                        </div>


                        <span
                          className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                            step.status === "Current Step"
                              ? "bg-blue-50 text-blue-700"
                              : step.status === "Next Action"
                              ? "bg-green-50 text-green-700"
                              : step.status === "Verification Required"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {step.status}
                        </span>

                      </div>


                      <div className="mt-4 rounded-lg bg-slate-50 px-4 py-3">

                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Recommended action
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-700">
                          {step.action}
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </section>


        {/* ACTION AREA */}
        <section className="mb-10 grid gap-5 md:grid-cols-2">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h3 className="text-lg font-bold text-slate-900">
              Need more evidence?
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Upload certificates, test reports, product labels or
              technical documents and let the Document Verification AI
              analyze them.
            </p>

            <button
              onClick={goToDocuments}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Upload Documents
            </button>

          </div>


          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h3 className="text-lg font-bold text-slate-900">
              Need practical startup guidance?
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Connect with experienced founders through FounderBridge
              for practical startup and market-entry guidance.
            </p>

            <button
              onClick={goToFounderBridge}
              className="mt-5 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              Explore FounderBridge
            </button>

          </div>

        </section>


        {/* FINAL NOTE */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">

          <p className="text-sm leading-6 text-amber-900">
            <strong>Important:</strong> This Compliance Passport is a
            prototype decision-support tool. AI-generated results should
            be verified against applicable official requirements and,
            where appropriate, with a qualified compliance professional.
          </p>

        </div>

      </section>


      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-8">

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="font-semibold text-slate-900">
                GL Global Launch Copilot
              </p>

              <p className="mt-1 text-sm text-slate-500">
                From Product Idea to Global Market Readiness.
              </p>
            </div>

            <p className="text-xs text-slate-400">
              Hackathon Prototype • 2026
            </p>

          </div>

        </div>

      </footer>

    </main>
  );
}
export default function PassportPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-sm text-slate-600">
            Loading Passport...
          </div>
        </main>
      }
    >
      <PassportPageContent />
    </Suspense>
  );
}