export const PRODUCT_LINKS = [
  { id: 'nawiri', label: 'Nawiri loan' },
  { id: 'green-energy', label: 'Green energy loan' },
  { id: 'dairy', label: 'Climate Smart Dairy Loan' },
  { id: 'wash', label: 'WASH loan' },
  { id: 'imara', label: 'Imara loan' },
  { id: 'busara', label: 'Busara loan' },
  { id: 'boresha', label: 'Boresha loan' },
  { id: 'logbook', label: 'Log book loan' },
  { id: 'mali', label: 'Mali loan' },
  { id: 'dharura', label: 'Dharura loan' },
  { id: 'housing', label: 'Housing loan' },
  { id: 'ipf', label: 'IPF loan' }
];

export const LOAN_PRODUCTS: Record<string, { 
  id: string, 
  name: string, 
  tagline: string, 
  description: string, 
  targetMarket: string, 
  features: string[], 
  subHeading?: string,
  whoCanApply?: string[],
  howItWorks?: { step: number, title: string, desc: string }[],
  whyNawiri?: { tagline: string, description: string },
  eligibility?: string[],
  requiredDocuments?: string[],
  image?: string, 
  driveFallback?: string,
  associatedProgram?: {
    id: string,
    name: string,
    subtitle: string,
    programPath: string,
    ctaText?: string
  }
}> = {
  'nawiri': {
    id: 'nawiri',
    name: 'Nawiri Loan',
    subHeading: 'Grow Your Business with the Support of Your Group',
    tagline: 'Grow Your Business with the Support of Your Group',
    description: 'The Nawiri Loan is a simple and easy-to-access business loan offered through groups. Members of the group guarantee each other, making the group guarantee the main security for the loan. It is designed for small business owners who need affordable financing to grow their businesses, increase stock, improve operations or meet other business needs.',
    targetMarket: 'Designed for small business owners who need affordable financing to grow their businesses, increase stock, improve operations, or meet other business needs.',
    features: [
      'Simple & easy-to-access group business loan',
      'Group guarantee serves as the main security',
      'Affordable financing to scale stock and operations',
      'Supports collective financial growth for your group'
    ],
    whoCanApply: [
      'Be a member of a group.',
      'Have a valid National ID.',
      'Own a business that has been in operation for at least 6 months.',
      'Be willing to participate in the group guarantee arrangement.'
    ],
    howItWorks: [
      { step: 1, title: 'Join a group', desc: 'You must belong to a group.' },
      { step: 2, title: 'Apply for a loan', desc: 'Apply for the amount you need for your business.' },
      { step: 3, title: 'Group guarantee', desc: "Group members guarantee each other's loans." },
      { step: 4, title: 'Receive your loan', desc: 'Once approved, the loan is disbursed to help you grow your business.' },
      { step: 5, title: 'Repay as agreed', desc: 'Make your repayments on time and build a good borrowing record.' }
    ],
    whyNawiri: {
      tagline: 'Simple. Accessible. Group-supported.',
      description: 'With Nawiri, you can access financing to help your business grow while building a stronger financial future for yourself and your group.'
    },
    image: '/nawiri_loan.jpg',
    driveFallback: 'https://lh3.googleusercontent.com/d/1l0DD7hzzX23TzNLV6BpvByxaaJl3UIBc',
    associatedProgram: {
      id: 'economic-empowerment',
      name: 'Economic Empowerment Programme',
      subtitle: 'Resilient communities through sustainable business development.',
      programPath: '/programs/economic-empowerment',
      ctaText: 'View Economic Empowerment Programme'
    }
  },
  'green-energy': {
    id: 'green-energy',
    name: 'Green energy loan',
    tagline: 'Empower your home or business with sustainable solar and biogas solutions.',
    description: 'The NEEMA HEEP Green energy loan is part of our commitment to environmental sustainability and cost reduction for our clients. This specialized facility allows you to acquire solar energy systems and biogas units without the heavy upfront cost. By switching to renewable energy, you not only reduce your monthly energy bills but also contribute to a cleaner environment. We partner with certified suppliers to ensure you get high-quality equipment with professional installation.',
    targetMarket: 'Ideal for both residential and commercial clients looking to shift to sustainable energy sources like solar and biogas, reducing long-term overheads and supporting eco-friendly living.',
    features: ['Finances high-quality solar energy systems', 'Covers biogas installation and hardware', 'Reduced interest rates for green projects', 'Equipment serves as security'],
    image: '/green_energy_loan.jpg',
    driveFallback: 'https://lh3.googleusercontent.com/d/11BWldynRV0U4ojl5XyrydBnXRHJTBPnd',
    associatedProgram: {
      id: 'green-energy-programme',
      name: 'Neema Green Energy Programme',
      subtitle: 'Powering Progress, Reducing Costs, Building a Greener Future.',
      programPath: '/programs#green-energy-programme',
      ctaText: 'View Green Energy Programme Details'
    }
  },
  'dairy': {
    id: 'dairy',
    name: 'Climate Smart Dairy Loan',
    tagline: 'Modernize your agribusiness with premium dairy and biogas financing.',
    description: 'Aimed at strengthening the rural agricultural economy, the Dairy Cow Loan provides targeted funding for livestock and farm infrastructure. Backed by agricultural experts, this loan not only facilitates the purchase of high-yield dairy breeds but also finances modern ecological solutions like biogas installations. This dual approach boosts immediate milk-income while dramatically reducing household energy costs, defining a blueprint for sustainable farming success.',
    targetMarket: 'Designed explicitly for dairy farmers and agricultural clients focused on purchasing good-breed cows and investing in farm upgrades like biogas installations.',
    features: ['Finances high-yield dairy cattle breeds', 'Covers biogas and infrastructure installations', 'Repayment mapped to milk production cycles', 'Promotes zero-waste agricultural ecosystems'],
    image: '/dairy_loan.jpg',
    driveFallback: 'https://lh3.googleusercontent.com/d/197C_Hz2xbWteS6Ur8cZL9PIeKc_nhvlr',
    associatedProgram: {
      id: 'ngdpp',
      name: 'Neema Green Dairy Partnership Programme (NGDPP)',
      subtitle: 'Growing Dairy. Building Resilience. Financing the Future.',
      programPath: '/programs#ngdpp',
      ctaText: 'View NGDPP Programme Details'
    }
  },
  'wash': {
    id: 'wash',
    name: 'WASH loan',
    tagline: 'Enhance community health with premium Water, Sanitation, and Hygiene financing.',
    description: 'Physical health and financial health are intrinsically linked. The WASH (Water, Sanitation, and Hygiene) Loan demonstrates NEEMA HEEP\'s deep commitment to holistic community wellness. This loan ring-fences capital specifically for the acquisition of critical sanitation infrastructure, such as high-capacity water tanks, filtration systems, and piping. By improving household sanitation, we reduce medical vulnerabilities and enhance overall quality of life.',
    targetMarket: 'Targeted at households and community groups dedicated to enhancing their wellbeing through the installation of critical water and sanitation products (e.g., Tanks, Water generators, Pipes, Dispensers).',
    features: ['Finances water tanks, pipes, and dispensers', 'Focuses on preventative health and hygiene', 'Subsidized rates for social impact projects', 'Improves community living standards'],
    image: '/wash_loan.jpg',
    driveFallback: 'https://lh3.googleusercontent.com/d/1PlyHJ5ApAjpzNqf452b4VD4xlropAica',
    associatedProgram: {
      id: 'wash-programme',
      name: 'Neema WASH Finance Programme',
      subtitle: 'Financing Water, Improving Health, Transforming Lives.',
      programPath: '/programs#wash-programme',
      ctaText: 'View WASH Programme Details'
    }
  },
  'imara': {
    id: 'imara',
    name: 'Imara loan',
    tagline: 'Reliable working capital to stabilize and scale your day-to-day operations.',
    description: 'Engineered with the micro-entrepreneur in mind, the Imara Loan serves as an essential financial lifeline for sustainable business operations. Grounded in our decade of microfinance expertise, this credit facility injects vital working capital directly into micro, small, and medium enterprises (MSMEs). By easing cash flow bottlenecks, the Imara loan empowers you to restock inventory, pay suppliers, and maintain steady operational momentum without straining your personal finances.',
    targetMarket: 'Specifically tailored for small micro-business owners and sole proprietors who require consistent short-term capital for daily business running and operational liquidity.',
    features: [
      'Own a business that has been in operation for at least 6 months',
      'Requires 6 months bank statements',
      'Flexible, sales-aligned repayment schedules',
      'Competitive interest structures for MSMEs'
    ],
    eligibility: [
      'Valid Kenyan National ID',
      'Own a business that has been in operation for at least 6 months',
      'Age 18-70 years'
    ],
    requiredDocuments: [
      'National ID / Passport',
      '6 months bank statements'
    ],
    image: '/imara_loan.jpg',
    driveFallback: 'https://lh3.googleusercontent.com/d/1h0NJI1e4y10YMmaENJ6954diwn05eK-S'
  },
  'busara': {
    id: 'busara',
    name: 'Busara loan',
    tagline: 'Invest in the future with dedicated education financing.',
    description: 'Education is the most reliable equalizer against poverty. The Busara Loan is a purpose-built educational financing solution that ensures farmers and business owners never have to choose between their livelihoods and their children\'s education. By providing timely school fees financing, we align with sustainable development goals to guarantee uninterrupted learning. This loan product embodies our trustworthiness in safeguarding your family’s academic progression.',
    targetMarket: 'Targeted directly at business owners, entrepreneurs, and farmers who aspire to provide their loved ones with premium education without disrupting commercial cash flows.',
    features: ['Direct disbursement to educational institutions', 'Aligns with school term calendars', 'Affordable interest rates for families', 'Covers both tuition and educational materials'],
    image: '/busara_loan.jpg',
    driveFallback: 'https://lh3.googleusercontent.com/d/1d1nNEDP3oeojIipqadSUDWYq4vDUtSFU',
    associatedProgram: {
      id: 'arise-and-shine',
      name: 'Neema Arise & Shine Education Programme',
      subtitle: 'Financing Bright Futures. Empowering Communities. Educating Tomorrow.',
      programPath: '/programs#arise-and-shine',
      ctaText: 'View Education Programme Details'
    }
  },
  'boresha': {
    id: 'boresha',
    name: 'Boresha loan',
    tagline: 'A rapid-clear weekly loan designed to resolve temporary cash needs swiftly.',
    description: 'The NEEMA HEEP Boresha Loan is a fast-clear credit product designed for customers who want to secure a short-term loan and settle it within the shortest period. With a focus on rapid financial injection and swift, flexible recovery, it is structured around a 1-month repayment cycle with weekly installments, supporting up to a maximum duration of 3 months. The customer is intended to take the loan and clear it within the shortest period.',
    targetMarket: 'Ideal for microfinance customers, small traders, and individuals looking for quick bridging finance with an initial loan limit of up to KES 10,000, which increases on subsequent successful repayments.',
    features: [
      'Repayment period of 1 month (maximum period is 3 months)',
      'Structured weekly repayment schedule to match immediate cash flows',
      'Maximum of KES 10,000 for the first loan, with limits increasing on subsequent loans',
      'Designed for customers aiming to borrow and clear within the shortest period'
    ],
    image: '/boresha_loan.jpg',
    driveFallback: 'https://lh3.googleusercontent.com/d/1IlTlmJ6weoNsKKZ-CtYiNz6DfYaBmegE'
  },
  'logbook': {
    id: 'logbook',
    name: 'Log book loan',
    tagline: 'Unlock the hidden equity in your vehicle without surrendering your keys.',
    description: 'The NEEMA HEEP Logbook Loan is a highly competitive secured credit facility engineered for vehicle owners who require substantial capital injections. As an industry-leading logbook financing provider, we enable you to leverage your motor vehicle\'s logbook as collateral, providing immediate liquidity while you retain full driving rights. This product is meticulously designed for individuals experiencing temporary cash flow bridging needs or seeking capital investment without liquidating personal assets.',
    targetMarket: 'Aimed at both established business owners and Group (Chama) clients who require collateralized lending but prefer not to involve third-party guarantors or complex secondary mechanisms.',
    features: ['Competitive motor vehicle valuation-based lending', 'Retain full use of your vehicle during repayment', 'Fast-tracked appraisal and disbursement', 'No third-party guarantors required'],
    image: '/logbook_loan.jpg',
    driveFallback: 'https://lh3.googleusercontent.com/d/1n40-YIOAkRizg9GOyBOOSOqvhjanRrgO'
  },
  'mali': {
    id: 'mali',
    name: 'Mali loan',
    tagline: 'Acquire high-value assets securely and affordably.',
    description: 'Asset acquisition is a critical step toward wealth creation. The Mali Loan is a specialized asset financing product designed to help clients procure essential small-to-medium assets safely. Rather than depleting your working capital, this facility allows you to spread the cost over manageable installments. Driven by transparent lending practices, the Mali loan is structured to match your proven repayment capability, ensuring sustainable wealth accumulation.',
    targetMarket: 'Ideal for individuals and households looking to meet specific small-asset financing needs, ranging from solar installations to business equipment, tailored strictly to their verified financial capabilities.',
    features: ['Finances household and business equipment', 'The acquired asset serves as primary security', 'Structured to match client capability', 'Fosters long-term wealth accumulation'],
    image: '/mali_loan.jpg',
    driveFallback: 'https://lh3.googleusercontent.com/d/1sG0tDmPJBbqX8U1EdvhGVIs3BO4QUdwM'
  },
  'dharura': {
    id: 'dharura',
    name: 'Dharura loan',
    tagline: 'Rapid financial intervention when the unexpected strikes.',
    description: 'Emergencies demand immediate, reliable financial intervention. The Dharura Loan offers an expedited, low-friction credit line designed to mitigate sudden financial shocks. Leveraging our optimized group-lending architecture, this loan provides crucial social and financial security, covering everything from unexpected medical bills to urgent business repairs. It underscores our role as an authoritative, dependable financial partner in times of crisis.',
    targetMarket: 'Aimed at clients operating within our group set-ups who require immediate emergency funding for unforeseen household or business disruptions.',
    features: ['Rapid response and intervention', 'Operates seamlessly within group setups', 'Minimal bureaucratic friction', 'Short-term relief bridging'],
    image: '/dharura_loan.jpg',
    driveFallback: 'https://lh3.googleusercontent.com/d/19ThITFrsg7aMIpgSoA_HHxc6iig-Cgch'
  },
  'housing': {
    id: 'housing',
    name: 'Housing loan',
    tagline: 'Accelerate property value optimization for active landlords.',
    description: 'The NEEMA HEEP Housing Loan is an innovative property improvement facility tailored for the real estate sector. Designed specifically for landlords and landladies, this product leverages existing, verifiable rental income to provide immediate capital for property upgrades, renovations, or expansion. By partnering with registered agents, we offer a highly authoritative and risk-managed financing model that turns future rental yields into immediate liquid capital.',
    targetMarket: 'Caters strictly to landlords/landladies with immediate capital needs whose proven rental income is channeled through a formal, registered real estate agent.',
    features: ['Leverages formal rental income as basis', 'Funds renovations and property expansion', 'Requires formal engagement with a registered agent', 'Fast-tracks real estate asset improvement'],
    image: '/housing_loan.jpg',
    driveFallback: 'https://lh3.googleusercontent.com/d/1vDIl29TRxQetqPUXBP_bWtYUuJ4CHgeK'
  },
  'ipf': {
    id: 'ipf',
    name: 'IPF loan',
    tagline: 'Manage comprehensive insurance premiums without capital drain.',
    description: 'Insurance Premium Financing (IPF) is a sophisticated credit solution that ensures your business and personal assets remain fully protected without exhausting your primary working capital. Instead of paying hefty annual insurance premiums upfront, the IPF loan settles the premium directly with the insurer, allowing you to repay NEEMA HEEP in comfortable, predictable installments. This product demonstrates extreme financial prudence and operational expertise.',
    targetMarket: 'Aimed at vehicle owners, businesses, and individuals who need to cover mandatory annual insurance premiums without disrupting their current cash flows.',
    features: ['Direct settlement to insurance providers', 'Preserves essential working capital', 'Predictable, structured installments', 'Ensures continuous asset protection'],
    image: '/ipf_loan.jpg',
    driveFallback: 'https://lh3.googleusercontent.com/d/1AqlIQI3uaBa6bQxnRfu8bYNhKRWEKLO_'
  }
};
