import React from 'react';
import { CheckSquare } from 'lucide-react';

export default function ChecklistsPage() {
  const checklists = [
    { 
      title: 'Individual/ SME loan', 
      items: [
        'ID copy', 
        'KRA PIN certificate', 
        '6 months mpesa or bank statements'
      ] 
    },
    { 
      title: 'Group Loan (Chama)', 
      items: [
        'Group/ willingness to join or form one', 
        'ID Copy'
      ] 
    },
    { 
      title: 'Agribusiness/ Dairy loans', 
      items: [
        'National ID', 
        'KRA PIN Certificate'
      ] 
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div className="bg-[#074504] text-white p-8 rounded-3xl space-y-2">
        <h1 className="text-2xl font-black flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-[#C0991B]" /> Loan Application Checklists
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {checklists.map((c, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-gray-900 border-b pb-2">{c.title}</h3>
            <ol className="space-y-2 text-xs text-gray-600 list-decimal list-inside">
              {c.items.map((item, idx) => (
                <li key={idx} className="font-medium leading-relaxed">
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}
