import React from 'react';
import { DollarSign, Clock, Activity, Users } from 'lucide-react';

export default function ImpactAreasSection() {
  const impacts = [
    {
      icon: DollarSign,
      title: 'Cost Risk',
      description: 'Identify cost escalations early',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: Clock,
      title: 'Schedule Risk',
      description: 'Predict potential delays',
      color: 'text-orange-500',
      bgColor: 'bg-orange-100',
    },
    {
      icon: Activity,
      title: 'Project Health',
      description: 'Track physical progress anomalies',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-100',
    },
    {
      icon: Users,
      title: 'Peer Benchmarking',
      description: 'Compare with similar projects',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <section id="impact-section" className="py-24 bg-white scroll-mt-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 items-start justify-between mb-16">
          <div className="max-w-xl">
            <div className="text-sm font-bold text-blue-600 tracking-widest uppercase mb-3">
              Key Impact Areas
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
              Turning Insight into National Progress
            </h2>
          </div>
          
          {/* Quote Block */}
          <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl max-w-md relative">
            <div className="absolute -top-4 -left-2 text-6xl text-slate-200 font-serif leading-none">&quot;</div>
            <p className="text-lg text-slate-700 italic relative z-10 font-medium">
              Proactive governance today, a developed India tomorrow.
            </p>
            <div className="mt-4 flex gap-1">
              <div className="h-1 w-6 bg-orange-500 rounded-full"></div>
              <div className="h-1 w-6 bg-white border border-slate-200 rounded-full"></div>
              <div className="h-1 w-6 bg-green-600 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Horizontal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {impacts.map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all group">
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-full ${item.bgColor} ${item.color} group-hover:scale-110 transition-transform`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-slate-900">{item.title}</h3>
              </div>
              <p className="text-slate-600 text-sm">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
