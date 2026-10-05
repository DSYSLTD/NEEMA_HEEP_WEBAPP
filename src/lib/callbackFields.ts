export const CALLBACK_FORM_FIELDS = [
  { name: 'name', label: 'Full Name', type: 'text' as const, placeholder: 'e.g. Wanjiru Muthoni', required: true },
  { name: 'phone', label: 'Phone Number', type: 'tel' as const, placeholder: '07XX XXX XXX', required: true },
  { name: 'email', label: 'Email Address', type: 'email' as const, placeholder: 'yourname@email.com', required: true },
  { 
    name: 'interest', 
    label: 'I want to talk about', 
    type: 'select' as const, 
    required: true,
    options: [
      'General Loan Inquiry', 
      'Mali Plus Loan', 
      'Jijenge Facility', 
      'Microfinance Credit Solutions', 
      'Arise & Shine Program', 
      'Careers'
    ]
  },
  { 
    name: 'preferredTime', 
    label: 'Preferred Callback Time', 
    type: 'select' as const, 
    required: true,
    options: [
      'Morning (8am - 12pm)', 
      'Afternoon (1pm - 5pm)', 
      'Late Evening (5pm - 7pm)'
    ]
  }
];

export const CALLBACK_FORM_CTA = "Confirm Callback Request";
export const CALLBACK_FORM_TITLE = "Request a Call Back";
export const CALLBACK_FORM_DESC = "Prefer to speak directly with an officer? Leave your phone number and preferred time slot, and our loan specialist will reach out to you.";
