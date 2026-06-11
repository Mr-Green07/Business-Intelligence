import React from 'react'

export default function LandingPage() {
  return (
    <div className="max-w-4xl mx-auto px-10 py-10 text-slate-900 leading-relaxed">
      <nav className="flex items-center justify-between mb-10">
        <div className="font-bold text-lg">BusinessIQ</div>
        <div className="flex gap-3 items-center">
          <a href="#features" className="text-slate-600 no-underline">Features</a>
          <a href="#pricing" className="text-slate-600 no-underline">Pricing</a>
          <a href="#contact" className="bg-teal-400 text-white px-4 py-2 rounded-md">Get Started</a>
        </div>
      </nav>

      <section className="flex gap-10 items-center">
        <div className="flex-1">
          <h1 className="text-3xl mb-4">Turn data into action with BusinessIQ</h1>
          <p className="mb-5 text-slate-600">A lightweight business intelligence dashboard built to help teams explore, visualize and share insights. Fast to deploy, easy to use.</p>
          <div className="flex gap-3">
            <button className="bg-teal-400 text-white px-4 py-3 rounded-md">Try Demo</button>
            <button className="bg-transparent text-slate-900 px-4 py-3 rounded-md border border-slate-300">View Docs</button>
          </div>
        </div>
        <div className="flex-1">
          <div className="h-64 rounded-xl bg-gradient-to-b from-teal-50 to-teal-100 flex items-center justify-center text-teal-800">
            Dashboard preview
          </div>
        </div>
      </section>

      <section id="features" className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-9">
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
          <h3 className="mt-0">Prebuilt Connectors</h3>
          <p className="m-0 text-slate-600">Connect to your databases and SaaS apps without complex ETL.</p>
        </div>
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
          <h3 className="mt-0">Interactive Visuals</h3>
          <p className="m-0 text-slate-600">Create charts and dashboards that update as your data changes.</p>
        </div>
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
          <h3 className="mt-0">Shareable Reports</h3>
          <p className="m-0 text-slate-600">Share insights via links, scheduled emails, or embedded widgets.</p>
        </div>
      </section>

      <footer className="mt-16 pt-5 border-t border-slate-100 text-slate-500">
        <div className="flex justify-between items-center">
          <div>© {new Date().getFullYear()} BusinessIQ</div>
          <div id="contact">support@businessiq.example</div>
        </div>
      </footer>
    </div>
  )
}
