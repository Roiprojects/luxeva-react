import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Section";

type LegalSection = {
  title: string;
  body?: string;
  bullets?: string[];
};

const termsMeta = {
  version: "Version 2.0",
  effectiveDate: "21 August 2026",
  location: "Jigani, Bengaluru, Karnataka, India",
  contactName: "Atul Kumar, CEO",
  email: "atul.kumar@luxevacare.com",
  phone: "+91 77952 08640",
  website: "www.luxevacare.com",
} as const;

const termsSections: LegalSection[] = [
  {
    title: "1. Acceptance and Scope",
    body:
      "These Terms govern access to and use of www.luxevacare.com, its content, enquiry mechanisms and digital interactions. They apply to prospective customers, customers and other users to the extent relevant.",
  },
  {
    title: "2. Company and Service Categories",
    body:
      "Luxeva Care may provide residential interiors, villa and apartment interiors, modular kitchens, wardrobes, living and bedroom interiors, TV units, false ceilings, lighting, wall treatments, furniture and furnishing, office and commercial interiors, renovation, remodelling, turnkey execution, smart-home solutions, exterior-related or construction-related coordination and design or consulting services, subject to project feasibility, location and accepted scope.",
  },
  {
    title: "3. Website Information Is Not an Automatic Contract",
    body:
      "Website content, enquiry forms, indicative prices, portfolio images and communications are informational unless expressly incorporated into an accepted project document. Submitting an enquiry does not itself create a contract, reserve capacity, accept a quotation or commence work.",
  },
  {
    title: "4. Quotations and Proposals",
    body:
      "Formal quotations or proposals may contain scope, BOQ, assumptions, exclusions, taxes, validity, payment milestones, specifications and timelines. A quotation becomes binding only according to its stated acceptance mechanism and applicable project documentation.",
  },
  {
    title: "5. Project Document Hierarchy",
    body:
      "A project may include proposal or quotation, BOQ, scope, work order, purchase order, design approval, payment schedule, Interior Project Agreement, Change Orders and Warranty or Handover Certificate. The document specifically governing the subject matter should prevail over general website content, subject to mandatory law.",
  },
  {
    title: "6. Portfolio, Renders and Illustrative Material",
    body:
      "Images may depict completed projects, design concepts, 3D renders, material references or inspiration. Actual results can vary because of dimensions, site conditions, lighting, product availability, material variation, tolerances, installation conditions and customer selections.",
  },
  {
    title: "7. Estimates and Measurements",
    body:
      "Indicative estimates are subject to site measurement, design finalisation, material selection, quantities, technical feasibility, access, taxes and scope. Site measurement and final BOQ should be relied upon for project pricing.",
  },
  {
    title: "8. Customer Responsibilities",
    bullets: [
      "Provide accurate requirements and site information.",
      "Provide timely approvals and decisions.",
      "Provide site access and utilities as agreed.",
      "Obtain customer-assigned society, building and municipal permissions.",
      "Disclose known structural, electrical, plumbing or other constraints.",
      "Make payments according to accepted project terms.",
      "Keep valuables and personal belongings appropriately secured.",
    ],
  },
  {
    title: "9. Design Development and Approval",
    body:
      "Designs may progress through concept, layout, 3D visualisation, material selection and execution drawings. Customer approval establishes the agreed execution basis. Changes after approval may require redesign, replacement, rework, additional cost and time.",
  },
  {
    title: "10. Site Conditions",
    body:
      "Existing or concealed wiring and plumbing, structural limitations, moisture, uneven surfaces, undocumented modifications, building rules, access limitations or other conditions may affect scope, price and timeline. Technical or structural work may require qualified professionals and approvals.",
  },
  {
    title: "11. Construction, Renovation and Regulated Work",
    body:
      "Where construction or renovation-related work is included, the scope and allocation of professional design, structural assessment, approvals and statutory permissions should be expressly stated in the project documents. Luxeva Care will not knowingly undertake unlawful work.",
  },
  {
    title: "12. Materials, Samples and Availability",
    body:
      "Materials can vary in shade, grain, texture and batch. Natural materials inherently vary. Products are subject to availability and supplier lead times. Where an approved item becomes unavailable or discontinued, an alternative may be proposed with appropriate commercial and timeline adjustment.",
  },
  {
    title: "13. Payment",
    body:
      "Payment milestones, taxes and due dates are determined by project documents. A payment delay may affect procurement, manufacturing, installation and timelines. Where contractually permitted, work may be suspended following appropriate notice.",
  },
  {
    title: "14. Cancellation, Refund and Warranty",
    body:
      "Cancellation and refund are governed by the current Cancellation, Refund & Payment Policy and project-specific terms. Warranty is governed by the Warranty & Handover Policy, manufacturer terms and the project warranty certificate, as applicable.",
  },
  {
    title: "15. Change Orders",
    body:
      "A customer-requested change after approval should be documented through a Change Order or revised quotation stating scope, price and tax impact, and timeline impact.",
  },
  {
    title: "16. Intellectual Property",
    body:
      "Luxeva Care's branding, website content, templates, photographs, videos, original design systems and other protected materials remain the property of their respective rights holders. Customer-specific design ownership and licensing are determined by the project agreement and payment status.",
  },
  {
    title: "17. Customer-Supplied Material",
    body:
      "Customers are responsible for having rights or permission to use plans, photographs, logos, reference designs and other material supplied to Luxeva Care. Customers should not knowingly provide infringing or unlawfully obtained material.",
  },
  {
    title: "18. Project Photography and Marketing",
    body:
      "The company may request permission to photograph completed work. Identifiable customer information or private property imagery will be used publicly only where appropriate permission or consent has been obtained or another lawful basis applies.",
  },
  {
    title: "19. Reviews and Testimonials",
    body:
      "Customers may provide reviews voluntarily. Luxeva Care may publish genuine reviews in accordance with applicable law and reasonable editorial and formatting requirements.",
  },
  {
    title: "20. Third Parties",
    body:
      "Projects may involve manufacturers, suppliers, contractors, logistics providers, architects, consultants, appliance brands and technology providers. Third-party products may carry separate warranties and terms.",
  },
  {
    title: "21. Website Security and Acceptable Use",
    bullets: [
      "Do not attempt unauthorised access.",
      "Do not introduce malware or malicious code.",
      "Do not disrupt or overload website infrastructure.",
      "Do not unlawfully scrape or reproduce protected content.",
      "Do not impersonate another person or submit fraudulent enquiries.",
      "Do not use the website for unlawful purposes.",
    ],
  },
  {
    title: "22. Availability",
    body:
      "The website may occasionally be unavailable for maintenance, upgrades, network issues or events outside reasonable control. The company does not guarantee uninterrupted or error-free operation.",
  },
  {
    title: "23. Third-Party Links",
    body: "Third-party links are provided for convenience and do not constitute endorsement or control of those websites.",
  },
  {
    title: "24. Disclaimer",
    body:
      "Website information is general and does not replace project-specific architectural, structural, electrical, legal, tax, municipal or other professional advice. Formal project documents govern actual scope and obligations.",
  },
  {
    title: "25. Liability",
    body:
      "To the maximum extent permitted by law, Luxeva Care is not liable for indirect or consequential loss arising solely from website use. Nothing excludes liability or statutory and consumer remedies that cannot legally be excluded.",
  },
  {
    title: "26. Indemnity",
    body:
      "To the extent permitted by law, a user may be responsible for losses directly caused by unlawful website use, deliberate misuse, infringement of third-party rights or material breach of these Terms.",
  },
  {
    title: "27. Force Majeure",
    body:
      "Events beyond reasonable control may include natural disasters, fire, flood, epidemic or pandemic, war, civil disturbance, government restrictions, strikes, major supply disruption, transportation failure or utility failure.",
  },
  {
    title: "28. Dispute Escalation",
    body:
      "Website and project concerns should first be raised with the relevant project or contact team, followed by senior management and good-faith negotiation or mediation where appropriate. Arbitration applies only if expressly agreed in the project agreement.",
  },
  {
    title: "29. Governing Law and Jurisdiction",
    body:
      "These Terms are governed by Indian law. Subject to mandatory jurisdiction rules and statutory forums, competent courts in Bengaluru, Karnataka may have jurisdiction over website-related matters.",
  },
  {
    title: "30. Consumer and Statutory Rights",
    body:
      "Nothing in these Terms waives mandatory rights available under Indian consumer or other applicable legislation.",
  },
  {
    title: "31. Privacy",
    body: "Use of the website is also subject to the Luxeva Care Privacy Policy.",
  },
  {
    title: "32. Changes",
    body:
      "The company may update these Terms prospectively. Continued use after publication may constitute acceptance to the extent permitted by law.",
  },
  {
    title: "33. Severability",
    body:
      "If any provision is held invalid or unenforceable, the remainder will continue to the extent legally permitted.",
  },
  {
    title: "34. No Agency",
    body:
      "Website use does not create agency, partnership, joint venture, employment or franchise.",
  },
  {
    title: "35. Contact",
    body: "Luxeva Care Private Limited",
    bullets: [
      "Atul Kumar, CEO",
      "atul.kumar@luxevacare.com",
      "+91 77952 08640",
      "Jigani, Bengaluru, Karnataka, India",
      "www.luxevacare.com",
    ],
  },
] as const;

export default function TermsPage() {
  return (
    <>
      <PageHero title="Terms & Conditions" crumbs={[{ label: "Home", href: "/" }, { label: "Terms & Conditions" }]} />
      <section className="py-16">
        <Container className="max-w-4xl">
          <div className="rounded-2xl border border-gold/25 bg-gold/5 p-6 text-sm text-ink-soft/80">
            <p className="font-semibold text-ink">LUXEVA CARE PRIVATE LIMITED Website Terms & Conditions</p>
            <p className="mt-2">
              {termsMeta.version} | Effective {termsMeta.effectiveDate}
            </p>
            <p className="mt-1">{termsMeta.location}</p>
            <p className="mt-1">
              {termsMeta.contactName} | {termsMeta.email} | {termsMeta.phone}
            </p>
            <p className="mt-1">{termsMeta.website}</p>
          </div>

          <div className="mt-10 space-y-8 text-ink-soft/90 leading-relaxed [&_h2]:text-2xl [&_h2]:text-ink [&_h2]:font-[family-name:var(--font-display)]">
            {termsSections.map((section) => (
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
