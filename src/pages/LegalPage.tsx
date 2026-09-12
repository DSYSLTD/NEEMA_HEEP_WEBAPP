import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Shield, BookOpen, Scale } from 'lucide-react';

const LEGAL_DOCS: Record<string, { title: string, icon: React.JSX.Element, content: React.JSX.Element }> = {
  '/privacy-policy': {
    title: 'Privacy Policy',
    icon: <Shield className="w-8 h-8 text-[#C0991B]" />,
    content: (
      <div className="space-y-8 text-gray-700 leading-relaxed text-sm">
        {/* Document Info Header Box */}
        <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-6 mb-8 flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-[#074504]">
          <div>
            <span className="text-gray-500 uppercase tracking-wider block text-[10px] mb-0.5">Document Information</span>
            <p className="text-sm font-black">NeemaHeep LTD. Data Privacy Statement</p>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <span className="text-gray-500 uppercase tracking-wider block text-[10px]">Last Updated</span>
              <span className="font-extrabold text-gray-800">January 2025</span>
            </div>
            <div className="border-l border-emerald-200 pl-6">
              <span className="text-gray-500 uppercase tracking-wider block text-[10px]">Version</span>
              <span className="font-extrabold text-[#C0991B]">1.0</span>
            </div>
          </div>
        </div>
        
        {/* Section 1 */}
        <div className="space-y-3">
          <h3 className="text-lg font-black text-[#074504] uppercase tracking-wide flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#074504] text-white flex items-center justify-center text-xs">1</span>
            Introduction
          </h3>
          <p>This Data Privacy Statement describes our corporate practices regarding the collection and use of your information and tells you about your privacy rights and how the law protects you.</p>
          <p>Please read through this Privacy Statement carefully and if there are any provisions in this document that you disagree with please discontinue use of this products and/or our services.</p>
          <p>This Privacy Statement applies to all information collected by us in relation to the products and services we offer.</p>
          <p>By using and/or offering any service, you agree to the collection and use of information in accordance with this Privacy Statement.</p>
        </div>

        {/* Section 2 */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h3 className="text-lg font-black text-[#074504] uppercase tracking-wide flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#074504] text-white flex items-center justify-center text-xs">2</span>
            Definitions
          </h3>
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#074504] text-white font-bold">
                  <th className="p-3.5 w-1/3 border-b border-emerald-800">Term</th>
                  <th className="p-3.5 border-b border-emerald-800">Definition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white font-medium">
                <tr className="hover:bg-gray-50/80">
                  <td className="p-3.5 font-extrabold text-[#074504] bg-gray-50/50">Data Protection Act</td>
                  <td className="p-3.5">Refers to Act no. 24 of 2019 under the Laws of Kenya.</td>
                </tr>
                <tr className="hover:bg-gray-50/80">
                  <td className="p-3.5 font-extrabold text-[#074504] bg-gray-50/50">Customer / Data Subject / You</td>
                  <td className="p-3.5">Refers to the identified/identifiable natural person i.e the customer procuring our services.</td>
                </tr>
                <tr className="hover:bg-gray-50/80">
                  <td className="p-3.5 font-extrabold text-[#074504] bg-gray-50/50">Personal Data</td>
                  <td className="p-3.5">Is any information that relates to an identified or identifiable individual.</td>
                </tr>
                <tr className="hover:bg-gray-50/80">
                  <td className="p-3.5 font-extrabold text-[#074504] bg-gray-50/50">Processing / Processing activity</td>
                  <td className="p-3.5">Means any operation or set of operations that is performed on any data sets whether or not by automated means.</td>
                </tr>
                <tr className="hover:bg-gray-50/80">
                  <td className="p-3.5 font-extrabold text-[#074504] bg-gray-50/50">Service Provider / Data Processor</td>
                  <td className="p-3.5">Means any natural or legal person who processes the data on behalf of the Company. It refers to third-party companies or individuals employed by the Company to facilitate the Service, to provide the Service on behalf of the Company, to perform services related to the Service or to assist the Company in analyzing how the Service is used. It includes accountants, auditors, IT service and platform providers, intermediaries, reinsurers, investment managers, agents, selected third party financial and insurance product providers and our professional advisers.</td>
                </tr>
                <tr className="hover:bg-gray-50/80">
                  <td className="p-3.5 font-extrabold text-[#074504] bg-gray-50/50">Third-party Social Media Service</td>
                  <td className="p-3.5">Refers to any website or any social network website through which a User may log in or create an account to use the site/service.</td>
                </tr>
                <tr className="hover:bg-gray-50/80">
                  <td className="p-3.5 font-extrabold text-[#074504] bg-gray-50/50">We / Us</td>
                  <td className="p-3.5">Means NeemaHeep LTD. Company Limited and its affiliates.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3 */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <h3 className="text-lg font-black text-[#074504] uppercase tracking-wide flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#074504] text-white flex items-center justify-center text-xs">3</span>
            Personal Data Collected
          </h3>
          <p>While using our Service, we may collect or ask you to provide us with certain personally identifiable information that can be used to contact or identify you. This information includes your name, mobile number(s), postal/email/physical address, next of kin information, marital status, financial information (including but not limited to property details, bank account details), personal images (photos), household and business photos.</p>
          <p>All personal information that you provide to us must be true, complete and accurate, and you must notify us of any changes to such personal information.</p>
          <p>We only collect the personal information that is necessary for us to adequately provide our products and services to our customers.</p>
          <p className="font-bold text-[#074504]">For customer data, we rely on the following bases for processing as provided for under the Data Protection Act:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 font-medium">
            <li>Performance of the Contract of the provision of our products and services to you;</li>
            <li>Compliance with Legal Obligations and provisions of the Microfinance Act and other Laws of Kenya;</li>
            <li>Protecting our Legitimate interests or other third parties (such as existing or potential business partners, suppliers, customers, end-customers or governmental bodies or courts);</li>
            <li>Your Consent, where that is appropriate, as per the requirements of applicable Data Protection Act.</li>
          </ul>
        </div>

        {/* Section 4 */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <h3 className="text-lg font-black text-[#074504] uppercase tracking-wide flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#074504] text-white flex items-center justify-center text-xs">4</span>
            Information Collected From Other Sources
          </h3>
          <p>We may obtain information about you from other sources, such as public databases; joint marketing partners, social media platforms, as well as from other third parties.</p>
        </div>

        {/* Section 5 & Rights */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h3 className="text-lg font-black text-[#074504] uppercase tracking-wide flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#074504] text-white flex items-center justify-center text-xs">5</span>
            Use of Your Personal Data
          </h3>
          <p>We will use the personal information for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 font-medium">
            <li>To communicate with you,</li>
            <li>To enable us to administer, appraise and process our loans products and services to you,</li>
            <li>To comply with legal or regulatory KYC requirements,</li>
            <li>To improve our products and services i.e by sending you marketing and promotional material and requesting your feedback,</li>
            <li>To carry out checks using third party agencies or publicly available information and keeping your information on record as well as carrying out other internal business purposes.</li>
          </ul>

          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-4">
            <h4 className="text-sm font-black text-[#074504] uppercase tracking-wider">Data Subject Rights</h4>
            <p className="text-xs font-semibold text-gray-600">Under the Data Protection Act, you can exercise the following rights with regards to your personal data:</p>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-gray-100">
                <span className="font-black text-[#074504]">a) Right of Access</span> – You have the right to obtain confirmation from us whether personal data concerning you is being processed as well as copies of the same.
              </div>
              <div className="p-3 bg-white rounded-xl border border-gray-100">
                <span className="font-black text-[#074504]">b) Right to be Informed</span> – You have the right to information regarding the purpose processing your personal data, the categories of personal data being processed, the recipients or categories of recipients to whom the personal data has or will be disclosed, the period of storage.
              </div>
              <div className="p-3 bg-white rounded-xl border border-gray-100">
                <span className="font-black text-[#074504]">c) Right to Rectification</span> – You can request us to correct any inaccurate or misleading information about you.
              </div>
              <div className="p-3 bg-white rounded-xl border border-gray-100">
                <span className="font-black text-[#074504]">d) Right to Deletion</span> – You can ask us to delete false or misleading information about you.
              </div>
              <div className="p-3 bg-white rounded-xl border border-gray-100">
                <span className="font-black text-[#074504]">e) Right to Objection</span> – You can object to the processing of all or part of your personal data.
              </div>
              <div className="p-3 bg-white rounded-xl border border-gray-100">
                <span className="font-black text-[#074504]">f) Right to Data Portability</span> – You may seek to receive personal data concerning you, which you have provided to us, in a structured, commonly used and machine-readable format and you may have the right to transmit that data to another entity.
              </div>
              <div className="p-3 bg-white rounded-xl border border-gray-100">
                <span className="font-black text-[#074504]">g) Right to Object & Automated Decision-Making</span> – Under certain circumstances you may have the right to object, on grounds relating to your particular situation, at any time to the processing of your personal data, including profiling, by us and we can be required to no longer process your personal data. This may include requesting human intervention in relation to an automated decision so that you can express your view and to contest the decision.
              </div>
            </div>
          </div>
        </div>

        {/* Section 6 */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <h3 className="text-lg font-black text-[#074504] uppercase tracking-wide flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#074504] text-white flex items-center justify-center text-xs">6</span>
            Storage of Your Personal Data
          </h3>
          <p>Your information, including Personal Data, is processed at our operating offices within the Republic of Kenya and in any other places where our partners and third-parties involved in the processing are located. We shall take all steps reasonably necessary to ensure that your data is treated securely and in accordance with this Privacy Statement.</p>
        </div>

        {/* Section 7 */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <h3 className="text-lg font-black text-[#074504] uppercase tracking-wide flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#074504] text-white flex items-center justify-center text-xs">7</span>
            Retention of Your Personal Data
          </h3>
          <p>We will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Statement. We will retain and use your Personal Data to the extent necessary to comply with our legal obligations as per the Data Protection Act, resolve disputes, and enforce our legal agreements and internal policies. All your information will be kept in line with our internal Data Retention statement.</p>
          <p>We will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a shorter period, except when this data is used to strengthen the security or to improve the functionality of Products and Services, or we are legally obligated to retain this data for longer time periods.</p>
          <p>When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize it, or, if this is not possible we will securely store your personal information and isolate it from any further processing until deletion is possible.</p>
          <p>You can request: a copy of your personal information, that we correct anything that’s wrong, or complete any incomplete personal information or that we delete your personal information if it is no longer needed for the purposes set out above or there is no other legal basis for the processing of your personal information.</p>
        </div>

        {/* Section 8 */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <h3 className="text-lg font-black text-[#074504] uppercase tracking-wide flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#074504] text-white flex items-center justify-center text-xs">8</span>
            Disclosure of Your Personal Data
          </h3>
          <p>We may share your data with our third-party vendors, service providers, contractors or agents who perform services for us or on our behalf and require access to such information perform their services.</p>
          <p>We may share your personal information with Service Providers to monitor and analyze your use of our products and services, to show you advertisements that promote and support our products and services, to contact you, or for processing of payments and disbursements.</p>
          <p className="font-bold text-[#074504]">We will disclose your personal data under the following circumstances:</p>
          <div className="space-y-2 text-xs text-gray-600 pl-2">
            <p><strong>a)</strong> If we are involved in a merger, acquisition or asset sale, your Personal Data may be transferred. We will provide notice before your Personal Data is transferred and becomes subject to a different Privacy Statement.</p>
            <p><strong>b)</strong> Under certain circumstances, the Company may be required to disclose your Personal Data if required to do so by law or pursuant to an order of a court or other quasi-judicial body within the Republic of Kenya.</p>
            <p><strong>c)</strong> We may disclose your Personal Data in the good faith belief that such action is necessary to: Comply with a legal obligation, Protect and defend the rights or property of the Company, Prevent or investigate possible wrongdoing in connection with the services we offer, Protect the personal safety of Users of the Service or the public and/or protect against legal liability.</p>
            <p><strong>d)</strong> Where we are required to, we may, without your consent, share your personal information with legal, regulatory and government bodies and other financial crime prevention agencies to facilitate investigations or prevention of crime.</p>
          </div>
        </div>

        {/* Section 9 */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <h3 className="text-lg font-black text-[#074504] uppercase tracking-wide flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#074504] text-white flex items-center justify-center text-xs">9</span>
            Security of Your Personal Data
          </h3>
          <p>We have taken to protect your personal information against unauthorized access or processing, of the personal data. We have implemented organizational and technical measures to protect all your personal information held by us. Organizational measures include enacting relevant policies and procedures and employee training while technical measures include data encryption, access controls, monitoring and logging and data masking.</p>
          <p>The security of your Personal Data is important to us but no method of transmission over the Internet, or method of electronic storage is 100% secure. While we use commercially acceptable means to protect and secure your Personal Data, we cannot guarantee its absolute security. Please note to access our sites within a secure environment.</p>

          <div className="mt-4 bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-2">
            <h4 className="text-xs font-black text-[#074504] uppercase tracking-wider">Children's Privacy</h4>
            <p className="text-xs">We only collect personally identifiable information for children from parents for the purposes of including them in the insurance (any person under 18 years of age). If you are a parent or guardian and you are aware that your child has provided us with Personal Data, please contact us via <strong>0705324799</strong>. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from Our servers.</p>
            <p className="text-xs">By using our site, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor use of the Site.</p>
          </div>
        </div>

        {/* Section 10 */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <h3 className="text-lg font-black text-[#074504] uppercase tracking-wide flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#074504] text-white flex items-center justify-center text-xs">10</span>
            Changes to This Privacy Statement
          </h3>
          <p>We may update our Privacy Statement from time to time. We will notify you of any changes by posting the updated Privacy Statement on our website and on our forms.</p>
          <p>If we make a material change to the statement, we will let you know prior to the change becoming effective and update the "Last updated" date at the top of this Privacy Statement. You are advised to review this Privacy Statement periodically for any changes. Changes to this Privacy Statement are effective when they are posted on this page.</p>
        </div>

        {/* Section 11 */}
        <div className="pt-6 border-t border-gray-100">
          <div className="bg-[#074504] text-white rounded-2xl p-6 sm:p-8 space-y-4 shadow-md">
            <h3 className="text-lg font-black uppercase tracking-wide flex items-center gap-2 text-[#C0991B]">
              <span className="w-6 h-6 rounded-lg bg-[#C0991B] text-[#074504] flex items-center justify-center text-xs font-black">11</span>
              Contact Us
            </h3>
            <p className="text-xs sm:text-sm text-gray-200">If you have any questions /comments about this Privacy Statement, you can contact us via:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
              <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                <span className="text-[10px] text-gray-300 uppercase tracking-widest block font-bold">Email</span>
                <a href="mailto:info@neemaheep.org" className="font-extrabold text-[#C0991B] hover:underline">info@neemaheep.org</a>
              </div>
              <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                <span className="text-[10px] text-gray-300 uppercase tracking-widest block font-bold">Mobile / Call</span>
                <a href="tel:+254705324799" className="font-extrabold text-white">+254 705 324 799 / 0705324799</a>
              </div>
              <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                <span className="text-[10px] text-gray-300 uppercase tracking-widest block font-bold">Postal Address</span>
                <span className="font-bold text-gray-100">P.O. Box 1744-60100, Embu</span>
              </div>
            </div>
            <div className="pt-2 text-xs text-emerald-200 font-medium">
              <strong>Office Location:</strong> Neema Plaza, Mama Ngina Street, 3rd Floor, Embu.
            </div>
          </div>
        </div>
      </div>
    )
  },
  '/terms-conditions': {
    title: 'Terms and Conditions',
    icon: <BookOpen className="w-8 h-8 text-[#C0991B]" />,
    content: (
      <div className="space-y-6 text-gray-600">
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <h3 className="text-xl font-bold text-[#074504] mt-6">1. Agreement to Terms</h3>
        <p>By accessing or using the Neema HEEP Microfinance website, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, then you may not access our website or use our services.</p>

        <h3 className="text-xl font-bold text-[#074504] mt-6">2. Eligibility</h3>
        <p>To apply for a loan or access our portal, you must be a resident of Kenya, possess a valid National ID, and be at least 18 years of age. All applications are subject to approval based on our credit assessment policies.</p>

        <h3 className="text-xl font-bold text-[#074504] mt-6">3. Use of the Site</h3>
        <p>Our website is available for your personal, non-commercial use. You agree not to misuse our system, including introducing viruses, trojans, or conducting automated data extraction (scraping).</p>

        <h3 className="text-xl font-bold text-[#074504] mt-6">4. AdSense and External Links</h3>
        <p>Our site may display advertisements via Google AdSense. We do not endorse the specific products or services advertised by third-party ad networks. Additionally, our Service may contain links to third-party web sites or services that are not owned or controlled by Neema HEEP. We assume no responsibility for the content, privacy policies, or practices of any third party web sites or services.</p>

        <h3 className="text-xl font-bold text-[#074504] mt-6">5. Loan Agreements</h3>
        <p>Specific loan products carry their own individual contractual bindings. Any financial estimations provided are for demonstrative purposes and do not constitute a legally binding offer. Final rates, amounts, and fees will be stipulated formally in your loan contract upon approval.</p>
      </div>
    )
  },
  '/regulatory-disclosures': {
    title: 'Regulatory Disclosures',
    icon: <Scale className="w-8 h-8 text-[#C0991B]" />,
    content: (
      <div className="space-y-6 text-gray-600">
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <h3 className="text-xl font-bold text-[#074504] mt-6">1. Company Registration</h3>
        <p>Neema HEEP operates as a legally registered microfinance lender within the Republic of Kenya. Our operations span multiple branches including Embu, Meru, Kiritiri, Muranga, Chuka, and Siakago.</p>

        <h3 className="text-xl font-bold text-[#074504] mt-6">2. Compliance and Anti-Money Laundering (AML)</h3>
        <p>We strictly adhere to all guidelines set forth regarding Anti-Money Laundering (AML) and Combating the Financing of Terrorism (CFT). All clients are subject to strict KYC (Know Your Customer) verification protocols.</p>

        <h3 className="text-xl font-bold text-[#074504] mt-6">3. Transparent Pricing</h3>
        <p>In accordance with consumer protection guidelines, we commit to fully transparent pricing. All fees, interest rates, upfront deductions, and total cost of credit are declared explicitly to the borrower before signing any binding agreements. Our digital assessment tools attempt to model this accurately, though exact values may vary based on final underwriter assessments.</p>

        <h3 className="text-xl font-bold text-[#074504] mt-6">4. Data Protection</h3>
        <p>We are registered under the Office of the Data Protection Commissioner (ODPC) in Kenya and manage all PII (Personally Identifiable Information) in strict compliance with the Data Protection Act (2019).</p>
      </div>
    )
  }
};

export default function LegalPage() {
  const location = useLocation();
  const document = LEGAL_DOCS[location.pathname] || LEGAL_DOCS['/privacy-policy'];

  return (
    <main className="flex-grow bg-[#f8faf8]">
      {/* Header */}
      <section className="bg-[#074504] text-white py-16 px-6 lg:px-12 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#599200] rounded-full blur-[150px] opacity-10 pointer-events-none" />
        <div className="w-16 h-16 bg-[#E8F5E9] rounded-full flex items-center justify-center mx-auto mb-6">
          {document.icon}
        </div>
        <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 relative z-10">{document.title}</h1>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-6 lg:px-12 py-16">
        <div className="bg-white">
          {document.content}
        </div>
      </section>

      <section className="bg-gray-50 py-12 px-6 border-t border-gray-100">
        <div className="max-w-2xl mx-auto text-center">
            <p className="text-gray-600 text-sm font-medium mb-4">You can refer back to the <Link to="/" className="text-[#C0991B] hover:underline font-bold">Return to homepage</Link> to explore <span className="font-semibold text-gray-700">Microfinance Kenya</span>, or <Link to="/contact" className="text-[#C0991B] hover:underline font-bold">Contact our team</Link> for <span className="font-semibold text-gray-700">Customer support Kenya</span>.</p>
        </div>
      </section>
      
    </main>
  );
}
