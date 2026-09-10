# ENGAGEMENT LETTER

---

**ROI FAST TRACK INFOTECH SOLUTIONS**
[Company Address]
[City, State - PIN Code]
Email: [your-email@domain.com] | Phone: [+91 XXXXXXXXXX]
GSTIN: [GSTIN if applicable]

---

**Date:** [DD/MM/YYYY]

**To:**
The Management
Luxeva Care Pvt Ltd
Jigani, Bengaluru
Karnataka, India
Email: atul.kumar@luxevacare.com
Attention: Mr. Atul Kumar, CEO

**Subject: Engagement Letter for Design, Development & Deployment of Corporate Website with Admin Panel**

---

Dear Mr. Kumar,

This Engagement Letter ("Letter") sets forth the terms and conditions under which **ROI Fast Track Infotech Solutions** ("Service Provider", "we", "us") agrees to provide website design, development, and deployment services to **Luxeva Care Pvt Ltd** ("Client", "you", "your").

Please review the terms below and confirm your acceptance by signing and returning a copy of this Letter.

---

## 1. PROJECT SCOPE OF WORK

The Service Provider shall design, develop, and deploy a corporate website with an integrated content management system for Luxeva Care Pvt Ltd. The scope includes:

### 1.1 Public-Facing Website (React Single Page Application)

A fully responsive, mobile-first corporate website comprising the following pages:

| # | Page | Description |
|---|------|-------------|
| 1 | Home Page | Hero slider, services overview, call-to-action sections |
| 2 | About Us | Company story, vision, leadership team profiles |
| 3 | Services | Complete catalogue of all service categories offered |
| 4 | Service Detail Pages | Individual pages per service with image galleries |
| 5 | Portfolio | Project showcase with filtering capability |
| 6 | Project Detail Pages | Individual project pages with scope of work |
| 7 | Testimonials | Client reviews and ratings section |
| 8 | FAQ | Frequently asked questions section |
| 9 | Team | Leadership and team member grid |
| 10 | Contact | Enquiry form with full lead capture fields |
| 11 | Privacy Policy | Compliant privacy policy page (v2.0) |
| 12 | Terms & Conditions | Compliant T&C page (v2.0) |

### 1.2 Lead Generation & Enquiry System

- Multi-field enquiry forms with validation (name, phone, email, service interest, property type, location, budget range, timeline, message, consent)
- Honeypot + rate-limiting anti-spam protection
- UTM parameter capture and source tracking
- Lead lifecycle management with statuses: New → Contacted → Qualified → Site Visit Scheduled → Quotation Sent → Follow-up → Converted / Closed
- WhatsApp click-to-chat integration on all devices
- One-tap phone dial integration for mobile users

### 1.3 Custom Admin Panel

A password-protected admin panel (role-based access) with the following modules:

| Module | Functionality |
|--------|---------------|
| Dashboard | Overview metrics, recent leads, enquiries by service chart |
| Content Editor | Edit all page content (Home, About, Services, Portfolio, FAQs, Testimonials, Leadership, Contact Settings) |
| Enquiry Manager | View, filter, and update lead statuses; add internal notes |
| Media Library | Upload, manage, and delete images with reference-safe deletion |
| User Management | Create admin users, manage roles (Super Admin / Editor), change passwords |
| Settings | Site configuration and preferences |

### 1.4 Backend & Database

- Express.js REST API server with CORS configuration
- PostgreSQL database with the following data stores:
  - **Enquiries** table — lead capture with 17 fields including UTM, source tracking, and status lifecycle
  - **Enquiry Notes** table — internal admin notes linked to leads
  - **Admin Users** table — authenticated admin panel users (bcrypt-hashed passwords)
  - **Admin Sessions** table — HTTP-only cookie-based session management
  - **Content Documents** table — JSONB key-value store for all CMS page content
- Database schema, migration scripts, and seed data

### 1.5 Technical Stack

- **Frontend:** React 19, TypeScript, Vite, React Router v7, Tailwind CSS v4
- **Backend:** Express.js 5, Node.js runtime
- **Database:** PostgreSQL (via pg driver)
- **Authentication:** Session-based with HTTP-only cookies, bcrypt password hashing
- **Forms:** react-hook-form v7 with zod v4 validation
- **Icons:** lucide-react
- **Deployment:** Vercel (configured and ready)

### 1.6 Hosting & Deployment

- Configuration prepared for deployment on Vercel platform
- Static SPA build output with API served on same port
- Environment configuration files for development and production

### 1.7 Documentation & Handover

- Complete source code repository with version control
- Database schema and migration documentation
- Admin panel credentials and user roles
- Deployment instructions
- [Additional: e.g., 30-day complimentary support post go-live]

---

## 2. FEES AND PAYMENT TERMS

**Total Project Value:** ₹ [Insert Amount in Figures and Words] (INR)

Payment shall be made in the following instalments:

| Milestone | Description | Percentage | Amount (INR) |
|-----------|-------------|-----------|--------------|
| Milestone 1 | Upon signing this Engagement Letter | [X]% | ₹ [Amount] |
| Milestone 2 | Upon delivery of functional prototype / demo | [X]% | ₹ [Amount] |
| Milestone 3 | Upon successful deployment and go-live | [X]% | ₹ [Amount] |

**Payment Terms:**
- Payment shall be due within **[X] days** of invoice issuance.
- All payments to be made via [NEFT / RTGS / UPI / Bank Transfer] to the Service Provider's account:
  - Account Name: [ROI Fast Track Infotech Solutions]
  - Bank: [Bank Name]
  - Account Number: [Account Number]
  - IFSC Code: [IFSC Code]
  - Branch: [Branch Name, City]
- [Add: Late payment interest clause if applicable, e.g., 1.5% per month on overdue amounts]

---

## 3. PROJECT TIMELINE

| Phase | Description | Estimated Timeline |
|-------|-------------|-------------------|
| Phase 1 | Discovery & Requirements Finalisation | [Date Range] |
| Phase 2 | Design & Prototype Approval | [Date Range] |
| Phase 3 | Development & Testing | [Date Range] |
| Phase 4 | Client Review & Feedback | [Date Range] |
| Phase 5 | Final Deployment & Go-Live | [Date Range] |

**Projected Go-Live Date:** [DD/MM/YYYY]

*Note: Timelines are indicative and subject to change based on the promptness of client feedback, content provision, and approvals at each milestone. Delays attributable to the Client (e.g., delayed feedback, late content submission) shall extend the project timeline proportionately.*

---

## 4. CLIENT RESPONSIBILITIES

The Client agrees to:

- Provide all necessary content (text, images, logos, brand guidelines) within agreed timelines.
- Designate a single point of contact for approvals, feedback, and communication.
- Review and provide consolidated feedback within **[X] business days** of each milestone delivery.
- Provide access to any third-party services, accounts, or APIs required for integration.
- Ensure all content provided is accurate, lawful, and does not infringe any third-party rights.

---

## 5. INTELLECTUAL PROPERTY

- Upon full and final payment of all fees, the Service Provider shall assign all intellectual property rights in the developed website code, database schema, and custom components to the Client.
- The Client warrants that all content, logos, brand assets, and materials provided to the Service Provider are owned by or licensed to the Client, and shall indemnify the Service Provider against any third-party claims arising from such content.
- The Service Provider retains the right to showcase the completed project in its portfolio and marketing materials, unless the Client explicitly requests otherwise in writing.

---

## 6. WARRANTIES AND SUPPORT

- The Service Provider warrants that the delivered website shall be free from material defects in workmanship for a period of **[X] days** from the go-live date.
- This warranty does not cover defects arising from Client modifications, third-party service failures, or misuse.
- Post go-live, the Service Provider shall provide **[X] days** of complimentary bug-fix support. Any additional development, feature enhancements, or maintenance work beyond the warranty period shall be separately quoted and agreed upon.

---

## 7. CONFIDENTIALITY

Both parties agree to keep confidential all proprietary information, business data, and project details shared during the course of this engagement. This obligation shall survive the termination of this agreement for a period of **[X] years**.

---

## 8. LIMITATION OF LIABILITY

The Service Provider's total liability under this Engagement Letter shall not exceed the total project fees paid by the Client. Neither party shall be liable for any indirect, incidental, consequential, or punitive damages arising from this engagement.

---

## 9. TERMINATION

- Either party may terminate this agreement with **[X] days** written notice.
- In the event of termination by the Client, fees shall be payable for all work completed up to the date of termination.
- The Service Provider may terminate this agreement if the Client fails to make payments within **[X] days** of the due date, or fails to provide required content/feedback for a continuous period of **[X] days**.

---

## 10. GOVERNING LAW AND DISPUTE RESOLUTION

- This Engagement Letter shall be governed by and construed in accordance with the laws of India.
- Any dispute arising out of or in connection with this Letter shall first be attempted to be resolved amicably through good-faith negotiations between authorised representatives of both parties within **[X] days**.
- Failing amicable resolution, the dispute shall be referred to arbitration by a sole arbitrator appointed by mutual consent, under the Arbitration and Conciliation Act, 1996, with the seat of arbitration being Bengaluru, Karnataka.
- [Alternative: The courts of Bengaluru, Karnataka shall have exclusive jurisdiction.]

---

## 11. GENERAL PROVISIONS

- This Engagement Letter constitutes the entire agreement between the parties with respect to the subject matter herein and supersedes all prior discussions, proposals, and agreements.
- No amendment to this Letter shall be valid unless made in writing and signed by both parties.
- If any provision of this Letter is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
- This Letter may be executed in counterparts, each of which shall be deemed an original.

---

## 12. ACCEPTANCE

By signing below, both parties acknowledge that they have read, understood, and agree to be bound by all terms and conditions of this Engagement Letter.

| | **For and on behalf of ROI Fast Track Infotech Solutions** | **For and on behalf of Luxeva Care Pvt Ltd** |
|---|---|---|
| **Name:** | [Authorised Signatory Name] | [Atul Kumar / Authorised Signatory Name] |
| **Designation:** | [Designation] | [CEO / Authorised Signatory Designation] |
| **Signature:** | _________________________ | _________________________ |
| **Date:** | [DD/MM/YYYY] | [DD/MM/YYYY] |
| **Company Stamp:** | [Stamp / Seal] | [Stamp / Seal] |

---

*This document is generated in accordance with Indian contract law norms. We recommend both parties seek independent legal advice before execution.*

---

**ROI FAST TRACK INFOTECH SOLUTIONS**
[Company Address]
[City, State - PIN Code]
Email: [your-email@domain.com] | Phone: [+91 XXXXXXXXXX]
Website: [www.your-website.com]
