import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  BookOpen, 
  HeartPulse, 
  TrendingUp, 
  CheckCircle2, 
  Users, 
  GraduationCap, 
  Target, 
  Sprout, 
  Droplets, 
  Sun, 
  Handshake, 
  Award, 
  ShieldCheck, 
  Coins 
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Programs() {
  const stats = [
    {
      icon: <Users className="w-10 h-10" />,
      value: "1000+",
      label: "Entrepreneurs Supported",
      description: "Through our core microfinance loans, we've helped scale thousands of businesses and livelihoods across 7 counties.",
      to: "/programs/economic-empowerment",
      cta: "Economic Programs"
    },
    {
      icon: <GraduationCap className="w-10 h-10" />,
      value: "15,000+",
      label: "Students Impacted",
      description: "Securing the future of junior secondary students from grade 10 to 12 through our Arise & Shine sponsorship and holiday mentorship since 2011.",
      to: "/programs/education-support",
      cta: "Arise & Shine Program"
    },
    {
      icon: <HeartPulse className="w-10 h-10" />,
      value: "50+",
      label: "Health Outreaches Conducted",
      description: "Bringing essential preventive screenings, consultations, and healthcare support directly to marginalized communities across Mount Kenya.",
      to: "/programs/community-health",
      cta: "Health Initiatives"
    }
  ];

  const flagshipPrograms = [
    {
      id: "mosquito-net-programme",
      title: "Neema Mosquito Net Distribution Programme",
      subtitle: "Preventing Malaria. Saving Medical Costs. Protecting Livelihoods.",
      icon: <ShieldCheck className="w-10 h-10 text-[#074504]" />,
      badge: "Malaria Prevention & Health",
      loanId: "wash",
      loanName: "Health & WASH Integration",
      loanLink: "/loans/wash",
      description: "Initiated in September 2013, the Neema Mosquito Net Distribution Programme provides long-lasting insecticide-treated mosquito nets (LLINs) to microfinance clients, expectant mothers, children under 5, the elderly, and vulnerable rural households in malaria-endemic regions across Mount Kenya and Eastern Kenya.",
      loanContext: "Malaria inflicts severe financial strain through unexpected medical bills and lost productivity. By preventing malaria, households protect their physical health and preserve hard-earned money to invest in micro-enterprises and economic empowerment.",
      impactTitle: "Creating Measurable Health & Economic Impact",
      impactPoints: [
        "Distributed over 5,000+ long-lasting insecticide-treated mosquito nets across rural counties",
        "Targeted protection for expectant mothers, children under 5, and microfinance borrower groups",
        "Prevented catastrophic hospital bill expenses, preserving client working capital",
        "Special seasonal distribution during high-risk rain periods (e.g., El Niño heavy rains)"
      ],
      coopImpact: "For client groups, local schools, and community institutions, the program reduces malaria-induced absenteeism, improves child school attendance, and fosters resilient local economies.",
      partnerTitle: "Partner With Us to Eliminate Malaria",
      partnerDesc: "We welcome health organizations, donors, rotary clubs, development partners, and international well-wishers to join Neema HEEP Ltd in expanding mosquito net distribution to vulnerable rural households.",
      brandTagline: "Neema HEEP Ltd. Financing Sustainable Livelihoods.",
      accentBg: "bg-[#074504]/5 border-[#074504]/20",
      badgeBg: "bg-[#C0991B] text-[#074504]"
    },
    {
      id: "ngdpp",
      title: "Neema Green Dairy Partnership Programme (NGDPP)",
      subtitle: "Growing Dairy. Building Resilience. Financing the Future.",
      icon: <Sprout className="w-10 h-10 text-[#074504]" />,
      badge: "Agribusiness & Dairy",
      loanId: "dairy",
      loanName: "Climate Smart Dairy Loan",
      loanLink: "/loans/dairy",
      description: "The Neema Green Dairy Partnership Programme connects dairy farmers, cooperatives, value-chain partners and impact-focused financiers to build productive, sustainable and climate-resilient dairy enterprises.",
      loanContext: "Through the Climate Smart Dairy Loan, farmers access financing for improved cows, quality fodder, dairy equipment, farm improvements, solar energy, biogas and other green investments.",
      impactTitle: "Creating Impact Across the Dairy Value Chain",
      impactPoints: [
        "Increase milk production and household incomes",
        "Reduce production costs and environmental impact",
        "Adopt renewable energy and better farm practices",
        "Build resilience against climate change"
      ],
      coopImpact: "For cooperatives and processors, the programme supports stronger farmers, increased milk volumes and more reliable quality supply.",
      partnerTitle: "Partner With Us",
      partnerDesc: "We welcome dairy cooperatives, processors, development partners, investors and climate-finance institutions to join us in financing sustainable dairy enterprises and creating measurable economic and environmental impact.",
      brandTagline: "Neema HEEP Ltd. Financing Sustainable Livelihoods.",
      accentBg: "bg-[#074504]/5 border-[#074504]/20",
      badgeBg: "bg-[#074504] text-white"
    },
    {
      id: "wash-programme",
      title: "Neema WASH Finance Programme",
      subtitle: "Financing Water, Improving Health, Transforming Lives.",
      icon: <Droplets className="w-10 h-10 text-[#074504]" />,
      badge: "Water & Sanitation",
      loanId: "wash",
      loanName: "WASH Loan",
      loanLink: "/loans/wash",
      description: "The Neema WASH Finance Programme provides accessible financing to households, institutions, small businesses and communities to invest in safe water, sanitation and hygiene solutions.",
      loanContext: "We finance practical WASH solutions such as water connections, storage tanks, sanitation facilities, rainwater harvesting, SINKING SHALLOW WELLS, water treatment, pumps and other approved water and sanitation improvements.",
      impactTitle: "Creating Impact Where It Matters",
      impactPoints: [
        "Access safe and reliable water",
        "Improve sanitation and hygiene",
        "Reduce time spent searching for water",
        "Improve household and business productivity",
        "Build resilience to water-related challenges"
      ],
      coopImpact: "",
      partnerTitle: "A Partnership for Greater Impact",
      partnerDesc: "Neema HEEP works with WASH organizations, development partners, water utilities, financial institutions, investors and impact funders to expand access to sustainable WASH solutions. Together, we can finance better water, healthier communities and more resilient livelihoods.",
      brandTagline: "Neema HEEP Ltd. Financing Sustainable Livelihoods.",
      accentBg: "bg-[#074504]/5 border-[#074504]/20",
      badgeBg: "bg-[#074504] text-white"
    },
    {
      id: "green-energy-programme",
      title: "Neema Green Energy Programme",
      subtitle: "Powering Progress, Reducing Costs, Building a Greener Future.",
      icon: <Sun className="w-10 h-10 text-[#074504]" />,
      badge: "Renewable & Clean Energy",
      loanId: "green-energy",
      loanName: "Green Energy Loan",
      loanLink: "/loans/green-energy",
      description: "The Neema Green Energy Programme enables households, farmers and small businesses to access financing for clean, affordable and reliable energy solutions.",
      loanContext: "We support investments in solar power, biogas, energy-efficient equipment, clean cooking solutions and other renewable energy technologies that improve productivity while reducing dependence on conventional energy.",
      impactTitle: "Creating Sustainable Impact",
      impactPoints: [
        "Reduce energy costs",
        "Access reliable and clean energy",
        "Improve household and business productivity",
        "Adopt environmentally sustainable technologies",
        "Build resilience to rising energy costs and climate change"
      ],
      coopImpact: "",
      partnerTitle: "Partner With Us",
      partnerDesc: "We welcome climate-finance institutions, development partners, renewable energy companies, impact investors and technology providers to help scale clean energy access and finance a greener, more inclusive economy. Together, we can finance clean energy, stronger livelihoods and a sustainable future.",
      brandTagline: "Neema HEEP Ltd. Financing Sustainable Livelihoods.",
      accentBg: "bg-[#074504]/5 border-[#074504]/20",
      badgeBg: "bg-[#C0991B] text-[#074504]"
    },
    {
      id: "arise-and-shine",
      title: "Neema Arise & Shine Education Programme",
      subtitle: "Financing Bright Futures. Empowering Communities. Educating Tomorrow.",
      icon: <GraduationCap className="w-10 h-10 text-[#074504]" />,
      badge: "Education & Mentorship",
      loanId: "busara",
      loanName: "Busara Education Loan",
      loanLink: "/loans/busara",
      description: "The Neema Arise & Shine Education Programme provides accessible school fee financing, secondary school sponsorships, and holiday-time mentorship for junior and senior secondary students from Grade 10 to 12.",
      loanContext: "Through the Busara Education Loan and Arise & Shine Scholarship Fund, families and guardians access flexible tuition financing structured specifically around school term calendars.",
      impactTitle: "Transforming Lives Through Quality Education",
      impactPoints: [
        "Keep vulnerable Grade 10 to 12 students consistently in school",
        "Provide structured holiday mentorship and professional career guidance",
        "Ease household cash flow pressure during school term openings",
        "Build long-term community resilience through educated youth"
      ],
      coopImpact: "For secondary schools and institutions, the programme ensures reliable, on-time fee settlements and higher student retention.",
      partnerTitle: "Partner With Us",
      partnerDesc: "We welcome donors, corporate sponsors, educational institutions, alumni networks, and impact partners to join us in expanding secondary school sponsorships and mentorship access across the region.",
      brandTagline: "Neema HEEP Ltd. Financing Sustainable Livelihoods.",
      accentBg: "bg-[#074504]/5 border-[#074504]/20",
      badgeBg: "bg-[#074504] text-[#C0991B]"
    }
  ];

  const coreInitiatives = [
    {
      title: "Arise & Shine Education",
      icon: <BookOpen className="w-12 h-12" />,
      tagline: "Academic merit. Social need. Mentorship.",
      description: "Empowering junior secondary students from grade 10 to 12 through comprehensive school scholarships, fee support, and holiday-time mentorship.",
      highlights: ["Sponsorship Since 2011", "Holiday Mentorship", "Grade 10 to 12 Focus"],
      to: "/programs/education-support",
      associatedLoan: "/loans/busara",
      associatedLoanName: "Busara Loan",
      iconColor: "text-[#C0991B]"
    },
    {
      title: "Community Health",
      icon: <HeartPulse className="w-12 h-12" />,
      tagline: "Well-being is the foundation of wealth.",
      description: "Promoting well-being by combining preventive health outreaches, mosquito net distribution, maternal care support, and WASH loans to ensure families stay healthy and productive.",
      highlights: ["Preventive Health Outreaches", "Mosquito Net Distribution", "WASH & Hygiene Loans"],
      to: "/programs/community-health",
      associatedLoan: "/loans/wash",
      associatedLoanName: "WASH Loan",
      iconColor: "text-[#C0991B]"
    },
    {
      title: "Economic Empowerment",
      icon: <TrendingUp className="w-12 h-12" />,
      tagline: "Resilient communities through business.",
      description: "Fostering resilience through business mentorship, group lending, and market linkages for SMEs relying on sustainable financial solutions.",
      highlights: ["Business Mentorship", "Market Network Linkages", "Group Growth Capital"],
      to: "/programs/economic-empowerment",
      associatedLoan: "/loans/nawiri",
      associatedLoanName: "Nawiri Loan",
      iconColor: "text-[#C0991B]"
    }
  ];

  return (
    <main className="flex-grow bg-[#f8faf8] pb-20 font-sans">
      {/* Hero Section */}
      <section className="bg-[#074504] text-white py-24 lg:py-32 px-6 lg:px-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#C0991B] rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#074504] rounded-full blur-[150px]" />
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-8"
          >
            <Target className="w-4 h-4 text-[#C0991B]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#C0991B]">Driven by Purpose & Sustainable Impact</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-8 tracking-tighter uppercase leading-[0.95]"
          >
            Our <span className="text-[#C0991B]">Programs</span> & <br/>
            Product <span className="text-[#C0991B]">Partnerships</span>.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Neema HEEP connects social impact programmes directly with tailored microfinance products. We build resilient livelihoods across agriculture, clean energy, WASH, and education.
          </motion.p>
        </div>
      </section>

      {/* Impact Stats Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 -mt-16 relative z-20">
        <div className="grid md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-[0_15px_40px_rgba(0,0,0,0.1)] text-center flex flex-col items-center group"
            >
              <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 text-[#C0991B] group-hover:bg-[#C0991B]/10 transition-all">
                {stat.icon}
              </div>
              <h3 className="text-4xl font-black text-[#074504] mb-1 tracking-tighter">{stat.value}</h3>
              <p className="text-[#C0991B] font-bold text-xs mb-4 uppercase tracking-[0.2em]">{stat.label}</p>
              <p className="text-gray-500 font-medium text-xs leading-relaxed mb-6">
                {stat.description}
              </p>
              <Link 
                to={stat.to} 
                className="mt-auto flex items-center gap-2 text-[#074504] font-black uppercase text-[10px] tracking-widest hover:gap-3 transition-all"
              >
                {stat.cta} <ArrowRight className="w-3 h-3 text-[#C0991B]" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Programs Grid (Core Support Initiatives) */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-12">
        <div className="text-center mb-16">
           <div className="inline-flex items-center gap-2 text-[#074504] font-black uppercase text-xs tracking-widest mb-4">
              <span className="w-6 h-0.5 bg-[#C0991B]"></span> COMMUNITY INITIATIVES <span className="w-6 h-0.5 bg-[#C0991B]"></span>
           </div>
           <h2 className="text-3xl md:text-5xl font-extrabold text-[#074504] uppercase tracking-tight">Broad Social <span className="text-[#C0991B]">Upliftment</span></h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {coreInitiatives.map((program, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="h-full"
            >
              <div 
                className="group h-full bg-white border border-gray-100 p-10 rounded-[2.5rem] flex flex-col items-start hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:border-[#C0991B]/20 transition-all duration-500"
              >
                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-8 group-hover:bg-[#C0991B]/10 transition-colors duration-500">
                  <div className={`${program.iconColor} group-hover:scale-110 transition-transform duration-500`}>
                    {program.icon}
                  </div>
                </div>
                
                <h3 className="text-3xl font-extrabold text-[#074504] mb-2 uppercase tracking-tight">{program.title}</h3>
                <p className="text-[#C0991B] font-bold text-sm mb-4 tracking-wide uppercase">{program.tagline}</p>
                <p className="text-gray-600 mb-8 leading-relaxed font-semibold text-sm">
                  {program.description}
                </p>
                
                <div className="space-y-3 mb-8 w-full flex-grow">
                  {program.highlights.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm font-bold text-[#074504]/80">
                      <CheckCircle2 className="w-4 h-4 text-[#C0991B]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 w-full pt-6 border-t border-gray-100 mt-auto">
                  <Link 
                    to={program.to}
                    className="flex items-center justify-between text-[#074504] font-black uppercase text-[10px] tracking-widest hover:text-[#C0991B] transition-colors w-full"
                  >
                    <span>Read More</span>
                    <ArrowRight className="w-4 h-4 text-[#C0991B]" />
                  </Link>

                  <Link 
                    to={program.associatedLoan}
                    className="flex items-center justify-between text-xs font-bold text-[#C0991B] hover:text-[#074504] transition-colors w-full pt-1"
                  >
                    <span>{program.associatedLoanName}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Strategic Programmes (Detailed User-Requested Programs) */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-[#074504] font-black uppercase text-xs tracking-widest mb-4">
            <Award className="w-4 h-4 text-[#C0991B]" /> FLAGSHIP PARTNERSHIP PROGRAMMES
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#074504] uppercase tracking-tight">
            Integrated <span className="text-[#C0991B]">Programme Frameworks</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-medium text-sm mt-3">
            Each programme directly powers tailored credit solutions for sustainable livelihoods. Click any product link to view loan terms or navigate seamlessly.
          </p>
        </div>

        <div className="space-y-16">
          {flagshipPrograms.map((prog, idx) => (
            <motion.div
              key={prog.id}
              id={prog.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className={`bg-white rounded-[3rem] p-8 md:p-12 border ${prog.accentBg} shadow-xl relative overflow-hidden scroll-mt-28`}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-gray-200/80 mb-8">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shadow-sm shrink-0">
                    {prog.icon}
                  </div>
                  <div>
                    <span className={`inline-block px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${prog.badgeBg}`}>
                      {prog.badge}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-[#074504] uppercase tracking-tight">
                      {prog.title}
                    </h3>
                    <p className="text-sm font-bold text-[#C0991B] italic mt-0.5">
                      "{prog.subtitle}"
                    </p>
                  </div>
                </div>

                <div className="shrink-0 w-full lg:w-auto flex flex-col sm:flex-row gap-3">
                  <Link 
                    to={prog.loanLink} 
                    className="inline-flex items-center justify-center gap-2 bg-[#074504] hover:bg-[#052903] text-white px-6 py-3.5 rounded-full font-extrabold uppercase text-xs tracking-widest transition-all shadow-md hover:scale-105"
                  >
                    <span>View {prog.loanName}</span>
                    <ArrowRight className="w-4 h-4 text-[#C0991B]" />
                  </Link>
                  <Link 
                    to="/loans" 
                    className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-[#074504] border border-gray-300 px-5 py-3.5 rounded-full font-bold uppercase text-xs tracking-wider transition-all"
                  >
                    <span>View All Products</span>
                  </Link>
                </div>
              </div>

              <div className="grid lg:grid-cols-12 gap-8">
                {/* Main Overview */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#074504] mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4 text-[#C0991B]" /> Programme Overview
                    </h4>
                    <p className="text-gray-700 font-medium leading-relaxed text-base">
                      {prog.description}
                    </p>
                  </div>

                  {/* Connected Loan Product Highlight Box */}
                  <div className="bg-[#074504] text-white p-6 rounded-2xl shadow-md border border-[#074504] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C0991B] flex items-center gap-1.5">
                        <Coins className="w-3.5 h-3.5" /> Direct Loan Integration
                      </span>
                      <Link 
                        to={prog.loanLink}
                        className="text-xs text-[#C0991B] font-bold underline hover:text-white transition-colors"
                      >
                        Open {prog.loanName} Page &rarr;
                      </Link>
                    </div>
                    <p className="text-sm font-medium leading-relaxed text-white/90">
                      {prog.loanContext}
                    </p>
                  </div>

                  {/* Partnerships */}
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#074504] mb-2 flex items-center gap-2">
                      <Handshake className="w-4 h-4 text-[#C0991B]" /> {prog.partnerTitle}
                    </h4>
                    <p className="text-gray-600 font-medium leading-relaxed text-sm">
                      {prog.partnerDesc}
                    </p>
                  </div>
                </div>

                {/* Impact Points Column */}
                <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
                  <div className="space-y-4">
                    <h4 className="text-sm font-black text-[#074504] uppercase tracking-tight flex items-center gap-2 border-b pb-3">
                      <ShieldCheck className="w-4 h-4 text-[#C0991B]" /> {prog.impactTitle}
                    </h4>
                    <ul className="space-y-3">
                      {prog.impactPoints.map((point, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-3 text-xs md:text-sm font-bold text-gray-800">
                          <CheckCircle2 className="w-4 h-4 text-[#C0991B] shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>

                    {prog.coopImpact && (
                      <div className="pt-3 border-t border-gray-100 text-xs font-medium text-gray-600 leading-relaxed italic">
                        {prog.coopImpact}
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-gray-100 mt-6 flex flex-col gap-4">
                    <span className="text-[10px] font-black text-[#074504] uppercase tracking-widest">
                      {prog.brandTagline}
                    </span>
                    <Link 
                      to="/request-partnership" 
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#074504] hover:bg-[#052903] text-white py-3 px-5 rounded-full font-extrabold text-xs uppercase tracking-widest transition-all shadow-md hover:scale-[1.02]"
                    >
                      <span>Partner With Us</span>
                      <Handshake className="w-4 h-4 text-[#C0991B]" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sponsorship Application Block */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-24">
         <div className="bg-[#074504] rounded-[3.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 border border-[#074504]">
            <div className="absolute top-[-50%] right-[-10%] w-[350px] h-[350px] bg-[#C0991B]/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative z-10 lg:max-w-3xl">
               <span className="bg-[#C0991B] text-[#074504] px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] inline-block mb-4">Scholarship Intake Open</span>
               <h3 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight mb-4">Seeking School Fees Scholarship Support?</h3>
               <p className="text-white/80 text-sm font-semibold leading-relaxed max-w-2xl">
                 Disadvantaged families, single mothers, and youth seeking active secondary school scholarships for grades 10 to 12 can apply directly through the Arise & Shine Junior/Senior School Scholarship portal.
               </p>
            </div>
            <div className="relative z-10 shrink-0 w-full lg:w-auto flex flex-col sm:flex-row gap-4">
               <Link to="/sponsorship" className="block w-full sm:w-auto text-center bg-[#C0991B] hover:bg-[#A38217] text-[#074504] px-8 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg transition-transform hover:scale-105 min-w-[200px]">
                 Apply For Scholarship
               </Link>
               <Link to="/beneficiaries" className="block w-full sm:w-auto text-center bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-sm px-8 py-5 rounded-2xl font-bold uppercase text-xs tracking-widest transition-all min-w-[200px]">
                 View Beneficiaries
               </Link>
            </div>
         </div>
      </section>

      {/* Vision Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-32">
        <div className="bg-white rounded-[4rem] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-16 overflow-hidden relative border border-[#074504]/10 shadow-sm">
          
          <div className="lg:w-1/2 relative z-10">
            <div className="inline-flex items-center gap-2 text-[#074504] font-black uppercase text-xs tracking-widest mb-6">
              <Target className="w-4 h-4 text-[#C0991B]" /> The Vision
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#074504] mb-8 leading-[1.1] uppercase tracking-tight">
              Sustainable <br/>
              Wealth <span className="text-[#C0991B]">Generation</span>.
            </h2>
            <div className="space-y-6 text-gray-600 font-medium leading-relaxed">
              <p>
                Our impact strategy is built on the belief that financial inclusion is the most powerful tool for poverty eradication. By providing not just credit, but the knowledge to use it effectively, we create a ripple effect of prosperity.
              </p>
              <p>
                Since 2010, Neema HEEP has grown from a small local initiative to a multi-branch powerhouse of community transformation, serving thousands of families in the Mount Kenya region and beyond.
              </p>
            </div>
          </div>
          
          <div className="lg:w-1/2 grid grid-cols-2 gap-4 w-full relative z-10">
            <div className="space-y-4">
              <div className="bg-[#f8faf8] p-8 rounded-[2.5rem] border border-gray-100">
                <h4 className="text-3xl font-black text-[#074504] mb-1">98%</h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Repayment Success</p>
              </div>
              <div className="bg-[#074504] text-white p-8 rounded-[2.5rem] shadow-xl">
                <h4 className="text-3xl font-black text-[#C0991B] mb-1">24Hr</h4>
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Response Time</p>
              </div>
            </div>
            <div className="space-y-4 mt-8">
              <div className="bg-[#f8faf8] p-8 rounded-[2.5rem] border border-gray-100">
                <h4 className="text-3xl font-black text-[#C0991B] mb-1">60%</h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Women Borrowers</p>
              </div>
              <div className="bg-[#074504] text-white p-8 rounded-[2.5rem] shadow-xl border border-[#074504]/20">
                <h4 className="text-3xl font-black text-white mb-1">100%</h4>
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Local Execution</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] px-6 lg:px-12 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#074504] rounded-[3.5rem] p-10 md:p-20 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C0991B] rounded-full blur-[100px] opacity-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#074504] rounded-full blur-[100px] opacity-20 pointer-events-none" />
            
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-[#C0991B] text-[#074504] px-4 py-1.5 rounded-full mb-6 font-black text-[10px] uppercase tracking-[0.2em] shadow-lg">
                Get Involved
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight leading-tight uppercase">
                Ready to <span className="text-[#C0991B]">Partner</span> with <br className="hidden lg:block"/> the Neema family?
              </h2>
              <p className="text-white/70 text-lg font-medium mb-0 max-w-xl">
                We are always looking for institutional partners, NGOs, and stakeholders who share our vision of sustainable financial solutions and community upliftment.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full md:w-auto">
              <Link to="/request-partnership" className="bg-[#C0991B] hover:bg-[#A38217] text-[#074504] px-10 py-5 rounded-full font-extrabold shadow-xl transition-all hover:scale-105 text-center min-w-[200px] uppercase text-xs tracking-widest">
                Partner with us
              </Link>
              <Link to="/registration" className="bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm text-white px-10 py-5 rounded-full font-bold transition-all text-center min-w-[200px] uppercase text-xs tracking-widest">
                Become a Member
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
