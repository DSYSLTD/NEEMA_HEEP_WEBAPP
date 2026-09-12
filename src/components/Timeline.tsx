import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ShieldCheck, Award, Smartphone, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function Timeline() {
  const steps = [
    {
      number: '01',
      title: 'Application & Registration',
      desc: 'Visit your nearest branch with your National ID for registration.',
      tag: 'Simple Registration',
      icon: FileText,
      color: 'from-[#074504] to-[#0a5c06]',
      accentColor: '#C0991B'
    },
    {
      number: '02',
      title: 'Assessment & Verification',
      desc: 'Field officer site visit or rapid automated credit evaluation using M-PESA statement analysis.',
      tag: 'Zero Friction',
      icon: ShieldCheck,
      color: 'from-[#C0991B] to-[#a38012]',
      accentColor: '#599200'
    },
    {
      number: '03',
      title: 'Group or Direct Approval',
      desc: 'Transparent committee review with instant appraisal feedback provided within 24 to 48 hours.',
      tag: '24-48 Hours',
      icon: Award,
      color: 'from-[#599200] to-[#477500]',
      accentColor: '#074504'
    },
    {
      number: '04',
      title: 'Mobile Disbursement',
      desc: 'Funds are disbursed directly and securely to your M-PESA phone number or bank account.',
      tag: 'Instant M-PESA',
      icon: Smartphone,
      color: 'from-[#074504] to-[#042d03]',
      accentColor: '#C0991B'
    }
  ];

  return (
    <section className="w-full py-20 lg:py-28 px-6 lg:px-12 bg-[#074504] text-white relative overflow-hidden my-0">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#599200]/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#C0991B]/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-4 bg-white/10 px-5 py-2 rounded-full border border-white/20 backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C0991B] animate-pulse" />
            <span className="text-[#C0991B] font-extrabold tracking-widest text-xs uppercase">STREAMLINED 4-STEP PROCESS</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-5 uppercase tracking-tight">
            How Neema HEEP <span className="text-[#C0991B]">Delivers Impact</span>
          </h2>
          <p className="text-white/80 font-medium text-base sm:text-lg leading-relaxed">
            A transparent, fast, and secure pathway designed to help you access business capital, asset financing, and emergency liquidity without complicated bureaucracy.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative mb-16">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.12, duration: 0.5 }}
                className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-7 relative flex flex-col justify-between group hover:bg-white/15 hover:border-[#C0991B]/50 transition-all duration-300 hover:-translate-y-1.5 shadow-xl"
              >
                {/* Step Top Bar */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-black text-[#C0991B] tracking-wider uppercase">
                      STEP {step.number}
                    </span>
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} border border-white/20 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <h3 className="text-xl font-extrabold text-white mb-3 group-hover:text-[#C0991B] transition-colors leading-snug">
                    {step.title}
                  </h3>

                  <p className="text-white/75 font-medium text-sm leading-relaxed mb-6">
                    {step.desc}
                  </p>
                </div>

                {/* Step Bottom Tag */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#C0991B] bg-black/20 px-3 py-1 rounded-full border border-[#C0991B]/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {step.tag}
                  </span>
                  <span className="text-xs text-white/50 font-bold group-hover:text-white transition-colors">
                    0{idx + 1}/04
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA Action Strip */}
        <div className="bg-white/10 border border-white/15 rounded-3xl p-6 sm:p-8 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#599200] flex items-center justify-center text-white shrink-0 shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-extrabold text-white">Ready to Access Growth Capital?</h4>
              <p className="text-sm text-white/80 font-medium">Check your pre-qualification status in under 2 minutes.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
            <Link
              to="/pre-qualification"
              className="w-full sm:w-auto bg-[#C0991B] hover:bg-[#a38012] text-[#074504] font-black px-6 py-3.5 rounded-full text-xs uppercase tracking-widest transition-all shadow-lg hover:scale-105 flex items-center justify-center gap-2"
            >
              Check Eligibility <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/checklists"
              className="w-full sm:w-auto border border-white/30 hover:bg-white/10 text-white font-bold px-6 py-3.5 rounded-full text-xs uppercase tracking-widest transition-all text-center"
            >
              View Requirements
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
