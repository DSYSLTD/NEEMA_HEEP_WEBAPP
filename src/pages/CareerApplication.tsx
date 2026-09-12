import { useSearchParams } from 'react-router-dom';
import SmartLeadForm from '../components/SmartLeadForm';

export default function CareerApplication() {
  const [searchParams] = useSearchParams();
  const jobTitle = searchParams.get('jobTitle') || '';

  return (
    <main className="flex-grow bg-[#f8faf8] py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <SmartLeadForm 
          type="Career"
          title="Apply Directly"
          description={`Join our mission-driven team. You are applying for: ${jobTitle || 'Open Position'}`}
          fields={[
            { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your full name', required: true },
            { name: 'email', label: 'Email Address', type: 'email', placeholder: 'name@example.com', required: true },
            { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '07XX XXX XXX', required: true },
            { name: 'position', label: 'Position', type: 'text', placeholder: 'Position interested in', required: true, defaultValue: jobTitle },
            { name: 'message', label: 'Brief Intro / Cover Letter', type: 'textarea', placeholder: "Tell us why you're a great fit...", required: true }
          ]}
          ctaText="Submit Application"
        />
      </div>
    </main>
  );
}
