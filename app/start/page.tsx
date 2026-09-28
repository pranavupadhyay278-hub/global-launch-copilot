"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StartPage() {
  const router = useRouter();

  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [intendedUse, setIntendedUse] = useState("");
  const [manufacturerType, setManufacturerType] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (
      !productName ||
      !category ||
      !description ||
      !intendedUse ||
      !manufacturerType
    ) {
      setError("Please complete all fields before continuing.");
      return;
    }

    const params = new URLSearchParams({
      product: productName,
      category,
      description,
      intendedUse,
      manufacturerType,
    });

    router.push(`/analysis?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
              GL
            </div>

            <div>
              <div className="text-lg font-bold tracking-tight">
                Global Launch
              </div>
              <div className="text-xs font-medium text-slate-500">
                Standards & Compliance Copilot
              </div>
            </div>
          </a>

          <a
            href="/"
            className="text-sm font-semibold text-slate-600 transition hover:text-blue-600"
          >
            ← Home
          </a>
        </div>
      </header>

      {/* Main */}
      <section className="px-6 py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-5xl">
          {/* Progress */}
          <div className="mb-10 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                Step 1 of 4
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Find Applicable Indian Standards
              </h1>

              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                Tell the AI about your product. The engine will use your
                product information to identify potentially relevant Indian
                Standards and explain what needs to be verified.
              </p>
            </div>

            <div className="hidden rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 sm:block">
              🇮🇳 India
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            {/* Form */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <form onSubmit={handleSubmit}>
                {/* Product name */}
                <div>
                  <label
                    htmlFor="productName"
                    className="text-sm font-bold text-slate-800"
                  >
                    Product Name
                  </label>

                  <input
                    id="productName"
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g. Electric Kettle"
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />

                  <p className="mt-2 text-xs text-slate-500">
                    Enter the common/product name used to describe your
                    product.
                  </p>
                </div>

                {/* Category */}
                <div className="mt-6">
                  <label
                    htmlFor="category"
                    className="text-sm font-bold text-slate-800"
                  >
                    Product Category
                  </label>

                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  >
                    <option value="">Select a category</option>
                    <option value="Electrical Appliances">
                      Electrical Appliances
                    </option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing & Apparel">
                      Clothing & Apparel
                    </option>
                    <option value="Food & Beverages">
                      Food & Beverages
                    </option>
                    <option value="Cosmetics">Cosmetics</option>
                    <option value="Medical Products">
                      Medical Products
                    </option>
                    <option value="Construction Materials">
                      Construction Materials
                    </option>
                    <option value="Manufacturing">
                      Manufacturing
                    </option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Description */}
                <div className="mt-6">
                  <label
                    htmlFor="description"
                    className="text-sm font-bold text-slate-800"
                  >
                    Product Description
                  </label>

                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the product, its main features, material, capacity, power rating, or other important characteristics."
                    rows={5}
                    className="mt-2 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />

                  <p className="mt-2 text-xs text-slate-500">
                    More product information helps the AI understand the
                    product more accurately.
                  </p>
                </div>

                {/* Intended use */}
                <div className="mt-6">
                  <label
                    htmlFor="intendedUse"
                    className="text-sm font-bold text-slate-800"
                  >
                    Intended Use
                  </label>

                  <select
                    id="intendedUse"
                    value={intendedUse}
                    onChange={(e) => setIntendedUse(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  >
                    <option value="">Select intended use</option>
                    <option value="Household">Household</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Medical">Medical</option>
                    <option value="Food Use">Food Use</option>
                    <option value="Personal Use">Personal Use</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Manufacturer */}
                <div className="mt-6">
                  <label
                    htmlFor="manufacturerType"
                    className="text-sm font-bold text-slate-800"
                  >
                    Manufacturer Type
                  </label>

                  <select
                    id="manufacturerType"
                    value={manufacturerType}
                    onChange={(e) =>
                      setManufacturerType(e.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  >
                    <option value="">Select manufacturer type</option>
                    <option value="Startup">Startup</option>
                    <option value="Small Business">Small Business</option>
                    <option value="Medium Business">Medium Business</option>
                    <option value="Large Manufacturer">
                      Large Manufacturer
                    </option>
                    <option value="Individual / New Founder">
                      Individual / New Founder
                    </option>
                  </select>
                </div>

                {/* Error */}
                {error && (
                  <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  className="mt-8 w-full rounded-xl bg-blue-600 px-6 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
                >
                  Find Applicable Indian Standards →
                </button>

                <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                  AI results are preliminary. Applicability and mandatory
                  requirements should be verified against the relevant
                  official source.
                </p>
              </form>
            </div>

            {/* Right information panel */}
            <aside className="space-y-5">
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
                <p className="text-sm font-bold text-blue-700">
                  How the AI Engine Works
                </p>

                <div className="mt-5 space-y-5">
                  <div className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                      1
                    </span>

                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Understand
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-600">
                        AI understands your product and intended use.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                      2
                    </span>

                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Match
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-600">
                        Potentially relevant Indian Standards are retrieved
                        from the knowledge base.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                      3
                    </span>

                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Explain
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-600">
                        AI explains requirements, evidence and next actions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <p className="text-sm font-bold text-slate-900">
                  What you can check
                </p>

                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  <li className="flex gap-2">
                    <span className="text-emerald-600">✓</span>
                    Relevant Indian Standards
                  </li>

                  <li className="flex gap-2">
                    <span className="text-emerald-600">✓</span>
                    Product requirements
                  </li>

                  <li className="flex gap-2">
                    <span className="text-emerald-600">✓</span>
                    Evidence to prepare
                  </li>

                  <li className="flex gap-2">
                    <span className="text-emerald-600">✓</span>
                    Testing areas
                  </li>

                  <li className="flex gap-2">
                    <span className="text-emerald-600">✓</span>
                    Potential compliance gaps
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6 text-center text-xs text-slate-500 lg:px-8">
          Global Launch Copilot · AI-assisted Indian Standards & Compliance
          Readiness
        </div>
      </footer>
    </main>
  );
}