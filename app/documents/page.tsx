"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

type DocumentAnalysisResult = {
  success?: boolean;
  fileName?: string;
  fileType?: string;
  analysis?: string;
  error?: string;
};

function formatAnalysis(text: string) {
  const lines = text.split("\n");

  return lines.map((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      return <div key={index} className="h-3" />;
    }

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

function formatBoldText(text: string) {
  return text.replace(
    /\*\*(.*?)\*\*/g,
    "<strong>$1</strong>"
  );
}

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

export default function DocumentsPage() {
  const searchParams = useSearchParams();

  const product =
    searchParams.get("product") || "";

  const category =
    searchParams.get("category") || "";

  const origin =
    searchParams.get("origin") || "India";

  const market =
    searchParams.get("market") || "India";

  const [file, setFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState<DocumentAnalysisResult | null>(
      null
    );

  const [error, setError] =
    useState("");

  async function handleAnalyze() {
    if (!file) {
      setError(
        "Please select a compliance document first."
      );
      return;
    }

    if (!product || !category) {
      setError(
        "Product information is missing. Please return to the Analysis page."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const formData = new FormData();

      formData.append("file", file);
      formData.append("product", product);
      formData.append("category", category);
      formData.append("origin", origin);
      formData.append("market", market);

      const response = await fetch(
        "/api/document-analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      const raw =
        await response.text();

      let data: DocumentAnalysisResult;

      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error(
          "The document analysis service returned an invalid response."
        );
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            "Document analysis could not be completed."
        );
      }

      setResult(data);

      /*
        Save the analysis so the Compliance Passport
        can use it on the next page.
      */
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "glc_document_analysis",
          JSON.stringify(data)
        );
      }
    } catch (err) {
      console.error(
        "Document analysis error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Document analysis could not be completed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* =================================================
          NAVBAR
          ================================================= */}

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

      {/* =================================================
          MAIN
          ================================================= */}

      <section className="px-6 py-10">
        <div className="mx-auto max-w-6xl">

          {/* Progress */}

          <div className="mb-8 flex items-center gap-3 text-sm font-bold text-blue-700">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
              3
            </span>

            STEP 3 OF 4

            <span className="font-normal text-slate-400">
              Compliance Evidence
            </span>
          </div>

          {/* =================================================
              CONTEXT
              ================================================= */}

          <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <p className="text-sm font-bold text-blue-700">
                Analysis Context
              </p>

              <h1 className="mt-1 text-2xl font-bold text-slate-900">
                Upload Compliance Evidence
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                Upload a certificate, test report, product
                specification, label, or other technical document.
                The document can then be reviewed against the
                product's identified Indian Standards requirements.
              </p>
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
                label="Market"
                value={market}
              />
            </div>
          </div>

          {/* =================================================
              UPLOAD
              ================================================= */}

          <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <p className="text-sm font-bold text-blue-700">
                Document Verification
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Upload a Compliance Document
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Supported formats: PDF, JPG, PNG and WEBP.
                Maximum file size: 10 MB.
              </p>
            </div>

            <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition hover:border-blue-400 hover:bg-blue-50">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={(event) => {
                  const selected =
                    event.target.files?.[0] ||
                    null;

                  setFile(selected);
                  setError("");
                  setResult(null);
                }}
              />

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
                ↑
              </div>

              <p className="mt-4 text-base font-bold text-slate-900">
                {file
                  ? file.name
                  : "Choose a document"}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Click to browse from your computer
              </p>
            </label>

            {file && (
              <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-bold text-blue-900">
                      Selected Document
                    </p>

                    <p className="mt-1 text-sm text-blue-800">
                      {file.name}
                    </p>
                  </div>

                  <p className="text-xs font-semibold text-blue-700">
                    {(
                      file.size /
                      1024 /
                      1024
                    ).toFixed(2)}{" "}
                    MB
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-5">
                <p className="text-sm font-bold text-red-800">
                  {error}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={
                !file || loading
              }
              className="mt-6 w-full rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {loading
                ? "Analyzing Document..."
                : "Analyze Compliance Evidence →"}
            </button>
          </div>

          {/* =================================================
              AI PROCESS
              ================================================= */}

          <div className="mb-8 grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-700">
                1
              </div>

              <h3 className="font-bold text-slate-900">
                Extract
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Identify important information from the uploaded
                document.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-700">
                2
              </div>

              <h3 className="font-bold text-slate-900">
                Map
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Compare the evidence with the identified product
                and standards context.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-700">
                3
              </div>

              <h3 className="font-bold text-slate-900">
                Identify Gaps
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Highlight missing or verification-required evidence.
              </p>
            </div>
          </div>

          {/* =================================================
              RESULT
              ================================================= */}

          {result?.analysis && (
            <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-bold text-blue-700">
                    Document AI Review
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-slate-900">
                    Compliance Evidence Analysis
                  </h2>

                  <p className="mt-2 text-sm text-slate-600">
                    Preliminary AI-assisted review of the uploaded
                    document.
                  </p>
                </div>

                <span className="inline-flex w-fit rounded-full bg-green-50 px-4 py-2 text-xs font-bold text-green-700">
                  Analysis Completed
                </span>
              </div>

              <div>
                {formatAnalysis(
                  result.analysis
                )}
              </div>
            </div>
          )}

          {/* =================================================
              CONTINUE
              ================================================= */}

          {result?.analysis && (
            <div className="mb-8 rounded-3xl border border-blue-100 bg-blue-50 p-6 sm:p-8">
              <p className="text-sm font-bold text-blue-700">
                Next Step
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Build Your Compliance Passport
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Continue to the Compliance Passport to track
                completed evidence, verification requirements and
                remaining compliance tasks.
              </p>

              <Link
                href={`/passport?product=${encodeURIComponent(
                  product
                )}&category=${encodeURIComponent(
                  category
                )}&origin=${encodeURIComponent(
                  origin
                )}&market=${encodeURIComponent(
                  market
                )}`}
                className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                Continue to Compliance Passport →
              </Link>
            </div>
          )}

          {/* =================================================
              DISCLAIMER
              ================================================= */}

          <div className="mb-10 rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs leading-6 text-slate-500">
              <strong className="text-slate-700">
                Important:
              </strong>{" "}
              Document analysis is AI-assisted preliminary guidance.
              It does not establish legal or regulatory compliance.
              Verify applicable requirements, certificates, test
              reports and current standards with the relevant official
              authority or qualified compliance professional.
            </p>
          </div>
        </div>
      </section>

      {/* =================================================
          FOOTER
          ================================================= */}

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6 text-center text-xs text-slate-500">
          Global Launch Copilot · AI-assisted Indian Standards &
          Compliance Readiness
        </div>
      </footer>
    </main>
  );
}