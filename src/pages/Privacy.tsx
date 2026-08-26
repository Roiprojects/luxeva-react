import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Section";

type LegalSection = {
  title: string;
  body?: string;
  bullets?: string[];
};

const privacyMeta = {
  version: "Version 2.0",
  effectiveDate: "21 August 2026",
  headerLine: "Version 2.0 | Effective 21 August 2026",
  location: "Jigani, Bengaluru, Karnataka, India",
  contactName: "Atul Kumar, CEO",
  email: "atul.kumar@luxevacare.com",
  phone: "+91 77952 08640",
  website: "www.luxevacare.com",
} as const;

const privacySections: LegalSection[] = [
  {
    title: "1. Purpose and Scope",
    body:
      "This Privacy Policy explains how Luxeva Care Private Limited collects, uses, discloses, stores, protects and otherwise processes personal data in connection with www.luxevacare.com, enquiries, consultations, site visits, design services, interior and exterior works, renovation, construction-related coordination, procurement, project execution, handover, warranty and service support, and communications through telephone, email, WhatsApp, social media or other channels.",
  },
  {
    title: "2. Company and Data-Fiduciary Role",
    body:
      "Luxeva Care Private Limited may act as a Data Fiduciary for personal data processed for its own business purposes, including customer acquisition, contracting, project delivery, billing, support, security and marketing. Where the company processes data strictly on behalf of another party under a documented arrangement, the applicable contractual and legal allocation of responsibilities will apply.",
  },
  {
    title: "3. Personal Data We May Collect",
    bullets: [
      "Identity and contact: name, phone, email, communication preferences and correspondence details.",
      "Property and project: property address, type, size, layouts, measurements, plans, drawings, site conditions, requirements, budget, timeline and design preferences.",
      "Customer content: photographs, videos, floor plans, reference images, documents, messages, feedback, reviews and project records.",
      "Commercial and transaction: quotations, invoices, purchase records, payment and refund information, and accounting or tax records. Payment credentials may be processed by authorised payment providers.",
      "Technical and website: IP address, browser and device information, operating system, pages visited, referral source, access time, cookies and similar technical data.",
      "Support and complaints: service requests, warranty claims, complaint records, correspondence and resolution records.",
    ],
  },
  {
    title: "4. Sources of Data",
    bullets: [
      "Directly from customers or prospective customers through forms, calls, messages, email, consultations and project interactions.",
      "From authorised customer representatives or household and business contacts.",
      "From project partners, contractors, designers, suppliers or service providers where reasonably necessary for project delivery.",
      "Automatically from website and device interactions through cookies, logs and similar technologies.",
      "From publicly available sources where lawfully relevant to business operations.",
    ],
  },
  {
    title: "5. Purposes of Processing",
    bullets: [
      "Responding to enquiries and arranging consultations or site visits.",
      "Understanding requirements and preparing designs, layouts, renders, estimates and proposals.",
      "Project planning, procurement, manufacturing, logistics, installation and execution.",
      "Contract administration, billing, taxation, accounting, collections and payment or refund processing.",
      "Customer support, complaints, snagging, warranty and post-handover services.",
      "Quality assurance, analytics, security, fraud prevention and business continuity.",
      "Legal compliance, dispute management, audits and protection of rights.",
      "Marketing, portfolio, testimonials and promotional communication where permitted and appropriately authorised.",
    ],
  },
  {
    title: "6. Lawful Basis, Notice and Consent",
    body:
      "The company will process personal data on an applicable lawful basis, which may include consent, performance of a contract or steps requested before contract, compliance with legal obligations, legitimate uses recognised by law, or another permitted basis. Where consent is required, it will be presented in an appropriate notice and may be withdrawn subject to applicable law. Withdrawal does not invalidate processing already lawfully completed or processing that has another lawful basis.",
  },
  {
    title: "7. Project and Property Information",
    body:
      "Interior and related projects may require detailed property information, photographs, plans, measurements, drawings and site records. Customers should provide only information reasonably necessary for the service and should avoid submitting passwords, unnecessary government identifiers, financial credentials or other sensitive information through ordinary enquiry channels.",
  },
  {
    title: "8. Communications and WhatsApp / Telephone",
    body:
      "If a customer provides a telephone number or requests communication through WhatsApp, telephone, SMS or email, the company may use that channel for enquiries, quotations, project coordination, appointments, payment reminders, service updates, warranty support and other relevant communications. Promotional communications will be managed subject to applicable law and available preference or opt-out mechanisms.",
  },
  {
    title: "9. Sharing and Service Providers",
    body:
      "Personal data may be shared on a need-to-know basis with employees, designers, architects or consultants, project managers, contractors, manufacturers, suppliers, logistics and installation teams, technology, hosting and CRM providers, analytics providers, payment and communication providers, professional advisers, auditors, insurers, legal advisers and authorities where legally required or otherwise permitted. Service providers are expected to handle information according to applicable obligations and contractual controls.",
  },
  {
    title: "10. Third-Party Products and Manufacturer Support",
    body:
      "Where a project involves third-party products, appliances, hardware, lighting, smart-home systems or branded components, limited customer and project information may be shared with the relevant provider where reasonably necessary for procurement, installation, warranty or after-sales support.",
  },
  {
    title: "11. Cross-Border Processing",
    body:
      "Certain technology, cloud, communication or professional service providers may process information outside India. Where such processing occurs, the company will apply the safeguards and legal requirements applicable to the relevant transfer or processing.",
  },
  {
    title: "12. Cookies and Similar Technologies",
    body:
      "The website may use essential cookies and similar technologies for security and functionality and may use analytics, preference or marketing technologies where applicable. Browser and device controls may restrict some technologies, although essential functionality may be affected.",
  },
  {
    title: "13. Third-Party Websites and Social Platforms",
    body:
      "Links to payment providers, maps, social networks, manufacturers, technology providers or other websites are provided for convenience. Their privacy practices are governed by their own terms and policies. The company is not responsible for third-party privacy practices outside its control.",
  },
  {
    title: "14. Retention",
    body:
      "Personal data is retained only for as long as reasonably necessary for the purpose collected, contractual and project administration, warranty and service records, accounting and tax requirements, legal claims, dispute resolution, fraud prevention, security and legitimate business records, after which it will be deleted, anonymised or securely disposed of where appropriate.",
  },
  {
    title: "15. Security",
    body:
      "The company may use access controls, authentication, restricted permissions, secure hosting, backups, confidentiality obligations, vendor controls, monitoring and other reasonable technical and organisational measures. No internet or electronic system can be guaranteed completely secure.",
  },
  {
    title: "16. Personal Data Breach",
    body:
      "If the company becomes aware of a personal-data breach, it will assess, contain, investigate, remediate and make notifications or reports required by applicable law, including to affected persons or authorities where legally required.",
  },
  {
    title: "17. Data Principal Rights",
    bullets: [
      "Request information about applicable processing.",
      "Request correction or update of inaccurate or incomplete information.",
      "Request erasure where legally available and where retention is not required.",
      "Withdraw consent where processing is based on consent.",
      "Raise a grievance and seek appropriate redressal.",
      "Exercise other rights made available by applicable Indian data-protection law.",
    ],
  },
  {
    title: "18. Grievance Mechanism",
    body:
      "Privacy grievances may be submitted to Atul Kumar, CEO at atul.kumar@luxevacare.com, +91 77952 08640, or the registered office stated above. The company will acknowledge and handle grievances according to applicable law and its internal process.",
  },
  {
    title: "19. Children",
    body:
      "The company's ordinary services are directed to adults. The company does not intentionally seek children's personal data through ordinary service channels. Where processing involving a child is required, the company will apply safeguards required by applicable law.",
  },
  {
    title: "20. Sensitive and High-Risk Information",
    body:
      "Interior services ordinarily do not require health information, biometric information, passwords or financial authentication credentials. Customers should not voluntarily submit such information through general enquiry channels. Payment credentials, where applicable, should be entered only through authorised payment systems.",
  },
  {
    title: "21. Testimonials, Reviews and Project Photography",
    body:
      "The company may request voluntary reviews or testimonials. It may also request permission to photograph or record completed projects for portfolio, website, social media, presentations and advertising. Where consent or permission is required, the company will seek it before publicly using identifiable customer information or private project imagery.",
  },
  {
    title: "22. Legal and Regulatory Disclosure",
    body:
      "Information may be disclosed where required or permitted by law, lawful governmental request, court or tribunal process, tax or regulatory requirement, investigation, fraud prevention, protection of rights or property, or emergency and security purpose.",
  },
  {
    title: "23. Corporate Transactions",
    body:
      "In a merger, acquisition, restructuring, financing, transfer of business or sale of assets, relevant records may be transferred subject to applicable law, confidentiality and reasonable safeguards.",
  },
  {
    title: "24. Customer Responsibilities",
    bullets: [
      "Provide accurate information and update material changes.",
      "Do not upload information belonging to another person without authority.",
      "Do not provide unnecessary sensitive information.",
      "Use secure communication and payment channels.",
      "Inform the company if a communication method is no longer appropriate.",
    ],
  },
  {
    title: "25. Data from Business Customers and Representatives",
    body:
      "Where an individual provides information on behalf of a company, family, society, landlord, tenant or other entity, that person should have appropriate authority to provide it. The company may rely on such representation unless it has reason to believe otherwise.",
  },
  {
    title: "26. Changes to Policy",
    body:
      "This policy may be updated to reflect changes in services, technology, law or business practices. The latest version published on the website will apply prospectively, subject to applicable law.",
  },
  {
    title: "27. Governing Law",
    body:
      "This policy is governed by applicable laws of India. Nothing in it limits any mandatory statutory or consumer right.",
  },
  {
    title: "28. Contact",
    body: "Luxeva Care Private Limited",
    bullets: [
      "Atul Kumar, CEO",
      "Email: atul.kumar@luxevacare.com",
      "Mobile: +91 77952 08640",
      "Registered Office: Jigani, Bengaluru, Karnataka, India",
      "Website: www.luxevacare.com",
    ],
  },
] as const;

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero title="Privacy Policy" crumbs={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
      <section className="py-16">
        <Container className="max-w-4xl">
          <div className="rounded-2xl border border-gold/25 bg-gold/5 p-6 text-sm text-ink-soft/80">
            <p className="font-semibold text-ink">LUXEVA CARE PRIVATE LIMITED Privacy Policy</p>
            <p className="mt-2">{privacyMeta.headerLine}</p>
            <p className="mt-1">{privacyMeta.location}</p>
            <p className="mt-1">
              {privacyMeta.contactName} | {privacyMeta.email} | {privacyMeta.phone}
            </p>
            <p className="mt-1">{privacyMeta.website}</p>
          </div>

          <div className="mt-10 space-y-8 text-ink-soft/90 leading-relaxed [&_h2]:text-2xl [&_h2]:text-ink [&_h2]:font-[family-name:var(--font-display)]">
            {privacySections.map((section) => (
              <section key={section.title}>
                <h2>{section.title}</h2>
                {section.body ? <p className="mt-3">{section.body}</p> : null}
                {section.bullets ? (
                  <ul className="mt-4 space-y-2 list-disc pl-5">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
