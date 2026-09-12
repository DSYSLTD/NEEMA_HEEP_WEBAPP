import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, animate } from 'motion/react';
import { Heart, Users, BookOpen, Star, ArrowRight, ShieldCheck, Award, Handshake, Mail, Smartphone } from 'lucide-react';
import { Helmet } from '../components/Helmet';
import SmartLeadForm from '../components/SmartLeadForm';

interface StatItemProps {
  value: string;
  label: string;
  index: number;
}

function StatItem({ value, label, index }: StatItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [displayText, setDisplayText] = useState('0');

  useEffect(() => {
    if (!isInView) return;

    const numericMatch = value.match(/[\d.]+/);
    if (!numericMatch) {
      setDisplayText(value);
      return;
    }

    const targetNum = parseFloat(numericMatch[0]);
    const prefix = value.substring(0, value.indexOf(numericMatch[0]));
    const suffix = value.substring(value.indexOf(numericMatch[0]) + numericMatch[0].length);

    const controls = animate(0, targetNum, {
      duration: 1.8,
      delay: index * 0.15,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(latest) {
        const isFloat = targetNum % 1 !== 0;
        const formatted = isFloat ? latest.toFixed(1) : Math.floor(latest).toLocaleString();
        setDisplayText(`${prefix}${formatted}${suffix}`);
      }
    });

    return () => controls.stop();
  }, [isInView, value, index]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 35, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, scale: 1.04 }}
      className="p-6 md:p-8 rounded-3xl bg-white hover:bg-emerald-50/50 border border-gray-100 hover:border-[#074504]/20 shadow-xs hover:shadow-xl transition-all duration-300 group cursor-default"
    >
      <motion.div 
        className="text-4xl md:text-6xl font-black text-[#074504] group-hover:text-[#599200] mb-2 tracking-tighter transition-colors"
      >
        {displayText}
      </motion.div>
      <div className="text-[10px] md:text-[11px] font-black text-[#C0991B] uppercase tracking-[0.25em] group-hover:tracking-[0.3em] transition-all">
        {label}
      </div>
    </motion.div>
  );
}

export default function Volunteer() {
  const volunteerRoles = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Academic Mentor",
      desc: "Guide our students through their high school subjects during holiday breaks and help them excel in national exams."
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Career Coach",
      desc: "Share your professional journey and help students understand different career paths, from tech to medicine."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Outreach",
      desc: "Assist in identifying deserving students in grassroots areas and supporting our field operations."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Life Skills Trainer",
      desc: "Facilitate workshops on leadership, financial literacy, and social responsibility for our beneficiaries."
    }
  ];

  const socialProofStats = [
    { value: '10+', label: 'Active Mentors' },
    { value: '2k', label: 'Hours Served' },
    { value: '100+', label: 'Students Guided' },
    { value: '100%', label: 'Impact Felt' },
  ];

  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      <Helmet>
        <title>Volunteer With Us | Neema HEEP</title>
        <meta name="description" content="Lend your expertise and time to mentor students and support Neema HEEP's community programs." />
      </Helmet>

      {/* Hero Header */}
      <section className="bg-[#074504] pt-24 pb-48 px-6 text-center relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"
        />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-[#C0991B]/20 backdrop-blur-md border border-[#C0991B]/30 px-6 py-2 rounded-full mb-8 shadow-xl"
          >
            <Users className="w-5 h-5 text-[#C0991B]" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#C0991B]">Be the Change Agent</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.8] mb-8"
          >
            Serve <br/><span className="text-[#C0991B]">to</span> Shine.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/70 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Your time, expertise, and passion can ignite the potential of thousands. Join our volunteer network and mentor the next generation of leaders.
          </motion.p>
        </div>
      </section>

      {/* Roles Grid */}
      <section className="max-w-7xl mx-auto px-6 -mt-24 relative z-30 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {volunteerRoles.map((role, idx) => (
            <motion.div 
              key={role.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 hover:scale-105 transition-all group"
            >
              <div className="w-16 h-16 bg-[#599200]/10 rounded-2xl flex items-center justify-center text-[#599200] mb-8 group-hover:bg-[#599200] group-hover:text-white transition-colors">
                {role.icon}
              </div>
              <h3 className="text-xl font-black text-[#074504] uppercase mb-4 leading-tight">{role.title}</h3>
              <p className="text-gray-500 font-medium text-sm leading-relaxed">{role.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Volunteer Form Section */}
      <section className="py-24 px-6 relative">
         <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
               <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 text-[#C0991B] font-black uppercase text-xs tracking-[0.3em] mb-4"
               >
                  <Handshake className="w-4 h-4" /> Ready to Impact?
               </motion.div>
               <h2 className="text-4xl md:text-6xl font-black text-[#074504] uppercase tracking-tighter leading-none mb-6">Volunteer <br/><span className="text-[#C0991B]">Application</span></h2>
               <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-2xl mx-auto">
                 Complete the form below to start your journey as a Neema HEEP volunteer. We'll verify your details and match you with a program.
               </p>
            </div>

            <div className="bg-white p-8 md:p-16 rounded-[4rem] border border-gray-100 shadow-[0_40px_100px_rgba(7,69,4,0.1)] relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#C0991B]/5 rounded-full blur-3xl -z-10" />
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#599200]/5 rounded-full blur-3xl -z-10" />
               
               <SmartLeadForm 
                  type="Volunteer"
                  title="Volunteer Registration"
                  ctaText="Submit My Application"
                  fields={[
                    { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Enter your given names', required: true },
                    { name: 'profession', label: 'Current Profession / Student ID', type: 'text', placeholder: 'e.g. Software Engineer or Teacher', required: true },
                    { 
                      name: 'role', 
                      label: 'Preferred Role', 
                      type: 'select', 
                      required: true,
                      options: ['Academic Mentorship', 'Career Coaching', 'Life Skills Trainer', 'Field Operations Assistant', 'Technical Support']
                    },
                    { name: 'availability', label: 'Availability', type: 'text', placeholder: 'e.g. Weekends, Holiday breaks, or Monthly', required: true },
                    { name: 'motivation', label: 'Why do you want to volunteer?', type: 'textarea', placeholder: 'Tell us a bit about your passion for impact...', required: true }
                  ]}
               />
            </div>
         </div>
      </section>

      {/* Impact Stats (Animated Social Proof Metrics) */}
      <section className="bg-white py-24 border-t border-gray-100">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
               {socialProofStats.map((stat, idx) => (
                 <StatItem 
                   key={stat.label}
                   value={stat.value}
                   label={stat.label}
                   index={idx}
                 />
               ))}
            </div>
         </div>
      </section>

      {/* Safety & Trust */}
      <section className="py-24 px-6 bg-gray-50 flex justify-center">
         <div className="max-w-3xl bg-white p-8 rounded-[3rem] shadow-sm flex items-center gap-8 border border-gray-100">
            <div className="w-20 h-20 bg-[#074504] rounded-3xl flex items-center justify-center text-[#C0991B] shrink-0">
               <ShieldCheck className="w-10 h-10" />
            </div>
            <div>
               <h4 className="text-xl font-black text-[#074504] uppercase mb-1">Safe Environment</h4>
               <p className="text-gray-500 font-medium text-sm leading-relaxed">
                  We prioritize student safety. All long-term volunteers undergo a standard vetting process and must adhere to our Child Protection Policy.
               </p>
            </div>
         </div>
      </section>
    </main>
  );
}
