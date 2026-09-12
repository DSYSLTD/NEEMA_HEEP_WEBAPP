import React from 'react';
import { Users, TrendingUp, MapPin, Award } from 'lucide-react';
import CountUp from 'react-countup';

interface StatItem {
  label: string;
  num: number;
  suffix: string;
  icon: React.ElementType;
  prefix?: string;
  isDecimal?: boolean;
}

export default function ImpactCounters() {
  const stats: StatItem[] = [
    { label: 'Families Reached', num: 8600, suffix: '+', icon: Users },
    { label: 'Years Empowering Communities', num: 15, suffix: '+', icon: Award },
    { label: 'Counties Served', num: 7, suffix: '', icon: MapPin },
    { label: 'Repayment & Growth Rate', num: 98.4, suffix: '%', isDecimal: true, icon: TrendingUp },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-8">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div key={idx} className="p-4 bg-white rounded-2xl border border-gray-200 shadow-xs flex items-center gap-3 hover:border-[#074504]/30 transition-all hover:shadow-md">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#074504] flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-black text-gray-900">
                {stat.prefix || ''}
                {stat.isDecimal ? (
                  <CountUp end={stat.num} decimals={1} duration={2.5} enableScrollSpy scrollSpyOnce />
                ) : (
                  <CountUp end={stat.num} duration={2.5} separator="," enableScrollSpy scrollSpyOnce />
                )}
                {stat.suffix}
              </div>
              <div className="text-xs text-gray-600 font-medium">{stat.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
