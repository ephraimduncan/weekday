import type { Metadata } from "next";

export const metadata: Metadata = {
  description: "Privacy Policy for Weekday",
  title: "Privacy Policy for Weekday",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-3xl font-bold">Privacy Policy</h1>
      <p className="mb-4">
        <strong>Last updated: May 21, 2025</strong>
      </p>

      <h2 className="mt-6 mb-2 text-2xl font-bold">
        Our Commitment to Privacy
      </h2>
      <p className="mb-4">
        At Weekday, we believe that privacy is a fundamental right. Our
        open-source calendar solution with AI features is built with privacy at
        its core, and we're committed to being transparent about how we handle
        your data.
      </p>
      <p className="mb-4">
        <strong>Important</strong>: Weekday is a client-first calendar
        application. We DO NOT store your calendar events on our servers. All
        calendar data is processed directly between your browser and Google
        Calendar.
      </p>

      <h2 className="mt-6 mb-2 text-2xl font-bold">
        Our verified privacy commitments:
      </h2>
      <ul className="mb-4 list-inside list-disc">
        <li>
          <strong>Calendar Data Storage</strong>: We never store your calendar
          events - they remain in your Google Calendar account
        </li>
        <li>
          <strong>Client-Side Processing</strong>: All calendar processing
          happens in your browser
        </li>
        <li>
          <strong>Open Source</strong>: Our entire codebase is public and can be
          audited
        </li>
        <li>
          <strong>Minimal Data</strong>: We only request essential Google
          Calendar API permissions
        </li>
        <li>
          <strong>User Control</strong>: You can revoke our access to your
          Google Calendar at any time
        </li>
        <li>
          <strong>AI Features</strong>: All AI processing is done with
          privacy-preserving techniques
        </li>
      </ul>

      <h2 className="mt-6 mb-2 text-2xl font-bold">
        Google Account Integration
      </h2>
      <p className="mb-4">When you use Weekday with your Google Account:</p>
      <ul className="mb-4 list-inside list-disc">
        <li>
          We request access to your Google Calendar data only after receiving
          your explicit consent
        </li>
        <li>
          We access only the necessary Google Calendar API scopes required for
          calendar functionality
        </li>
        <li>Your Google account credentials are never stored on our servers</li>
        <li>We use secure OAuth 2.0 authentication provided by Google</li>
        <li>
          You can revoke our access to your Google account at any time through
          your Google Account settings
        </li>
      </ul>

      <h2 className="mt-6 mb-2 text-2xl font-bold">
        Data Collection and Usage
      </h2>

      <h3 className="mt-4 mb-2 text-xl font-bold">
        Google Services Data Handling
      </h3>
      <ul className="mb-4 list-inside list-disc">
        <li>
          Calendar data is processed in accordance with Google API Services User
          Data Policy
        </li>
        <li>
          We only process and display calendar data - we don't store copies of
          your events
        </li>
        <li>
          All data transmission between our service and Google is encrypted
          using industry-standard TLS 1.3 protocols
        </li>
        <li>
          We maintain limited temporary caches only as necessary for application
          functionality, with a maximum retention period of 24 hours
        </li>
        <li>
          We collect basic usage analytics (page views, feature usage) to
          improve the service, but this data is anonymized
        </li>
      </ul>

      <h3 className="mt-4 mb-2 text-xl font-bold">AI Feature Data Handling</h3>
      <ul className="mb-4 list-inside list-disc">
        <li>AI features process your calendar data only within your browser</li>
        <li>
          No calendar content is sent to external AI servers without explicit
          consent
        </li>
        <li>AI models are optimized to run locally when possible</li>
        <li>
          When cloud processing is required, data is anonymized and encrypted
        </li>
        <li>No AI training occurs on your personal calendar data</li>
      </ul>

      <h3 className="mt-4 mb-2 text-xl font-bold">Self-Hosted Instances</h3>
      <ul className="mb-4 list-inside list-disc">
        <li>
          When you self-host Weekday, your calendar data remains entirely under
          your control
        </li>
        <li>
          No data is sent to our servers or third parties without your explicit
          consent
        </li>
        <li>
          You maintain complete ownership and responsibility for your data
        </li>
        <li>
          We provide detailed documentation on secure self-hosting practices
        </li>
        <li>You can configure your own data retention and backup policies</li>
        <li>
          Optional telemetry can be enabled to help us improve the platform
        </li>
      </ul>

      <h3 className="mt-4 mb-2 text-xl font-bold">Data Processing Locations</h3>
      <ul className="mb-4 list-inside list-disc">
        <li>
          All data processing occurs in secure data centers in the United States
        </li>
        <li>
          Self-hosted instances can choose their own data processing location
        </li>
        <li>We comply with international data transfer regulations</li>
        <li>Data processing agreements are available for enterprise users</li>
      </ul>

      <h2 className="mt-6 mb-2 text-2xl font-bold">
        Data Protection and Security
      </h2>
      <h3 className="mt-4 mb-2 text-xl font-bold">Security Measures</h3>
      <ul className="mb-4 list-inside list-disc">
        <li>
          End-to-end encryption for all calendar communications using
          industry-standard protocols
        </li>
        <li>
          Secure OAuth 2.0 authentication for Google services with strict scope
          limitations
        </li>
        <li>Regular third-party security audits and penetration testing</li>
        <li>
          Open-source codebase for transparency and community security review
        </li>
        <li>
          Compliance with Google API Services User Data Policy and security
          requirements
        </li>
        <li>
          Real-time monitoring for suspicious activities and potential security
          threats
        </li>
        <li>Automated security patches and dependency updates</li>
      </ul>

      <h3 className="mt-4 mb-2 text-xl font-bold">Infrastructure Security</h3>
      <ul className="mb-4 list-inside list-disc">
        <li>All servers are hosted in SOC 2 Type II certified data centers</li>
        <li>Network-level security with enterprise-grade firewalls</li>
        <li>Regular backup and disaster recovery testing</li>
        <li>
          Multi-factor authentication required for all administrative access
        </li>
        <li>Encryption at rest for all stored data using AES-256</li>
      </ul>

      <h3 className="mt-4 mb-2 text-xl font-bold">Security Response</h3>
      <ul className="mb-4 list-inside list-disc">
        <li>24/7 security incident response team</li>
        <li>Incident response plan with clear notification procedures</li>
        <li>Regular security training for all team members</li>
      </ul>

      <h2 className="mt-6 mb-2 text-2xl font-bold">
        Google User Data Handling
      </h2>
      <h3 className="mt-4 mb-2 text-xl font-bold">Data Access and Usage</h3>
      <p className="mb-2">
        We access the following Google user data through the Google Calendar
        API:
      </p>
      <ul className="mb-4 list-inside list-disc">
        <li>Calendar events and details</li>
        <li>Calendar metadata (titles, dates, attendees)</li>
        <li>Calendar sharing settings</li>
        <li>Basic profile information</li>
      </ul>
      <p className="mb-2">
        This data is used exclusively for providing calendar functionality
        within Weekday
      </p>
      <ul className="mb-4 list-inside list-disc">
        <li>
          No Google user data is used for advertising, marketing, or profiling
          purposes
        </li>
        <li>
          We maintain detailed audit logs of all data access for security and
          compliance
        </li>
        <li>Access to user data is strictly limited to essential personnel</li>
      </ul>

      <h3 className="mt-4 mb-2 text-xl font-bold">Data Sharing and Transfer</h3>
      <ul className="mb-4 list-inside list-disc">
        <li>
          Google user data is never shared with third parties except as required
          for core service functionality
        </li>
        <li>
          When necessary, we only work with service providers who comply with
          Google API Services User Data Policy
        </li>
        <li>
          All service providers are bound by strict confidentiality agreements
        </li>
        <li>
          We maintain a current list of all third-party service providers with
          access to Google user data
        </li>
        <li>Data sharing agreements are reviewed annually</li>
        <li>
          Users are notified of any material changes to our data sharing
          practices
        </li>
      </ul>

      <h3 className="mt-4 mb-2 text-xl font-bold">
        Data Retention and Deletion
      </h3>
      <ul className="mb-4 list-inside list-disc">
        <li>
          Calendar data is processed in real-time and not permanently stored
        </li>
        <li>Temporary caches are automatically cleared after 24 hours</li>
        <li>Users can request immediate deletion of their cached data</li>
        <li>Account deletion process:</li>
        <ul className="ml-6 list-inside list-disc">
          <li>All user data is immediately marked for deletion</li>
          <li>Cached data is purged within 24 hours</li>
          <li>Audit logs are retained for 30 days then permanently deleted</li>
          <li>Backup data is removed within 7 days</li>
        </ul>
        <li>
          We provide a data export tool for users to download their settings
        </li>
      </ul>

      <h3 className="mt-4 mb-2 text-xl font-bold">User Rights and Controls</h3>
      <ul className="mb-4 list-inside list-disc">
        <li>Right to access: Request a copy of your data</li>
        <li>Right to rectification: Correct inaccurate data</li>
        <li>Right to erasure: Request deletion of your data</li>
        <li>Right to restrict processing: Limit how we use your data</li>
        <li>Right to data portability: Export your data</li>
        <li>Right to object: Opt-out of certain data processing</li>
      </ul>

      <h2 className="mt-6 mb-2 text-2xl font-bold">Limited Use Disclosure</h2>
      <p className="mb-4">
        Our use and transfer to any other app of information received from
        Google APIs will adhere to the Google API Services User Data Policy,
        including the Limited Use requirements.
      </p>

      <h2 className="mt-6 mb-2 text-2xl font-bold">Your Rights and Controls</h2>
      <ul className="mb-4 list-inside list-disc">
        <li>Right to revoke access to your Google account at any time</li>
        <li>Right to request deletion of any cached data</li>
        <li>Right to export your data</li>
        <li>Right to lodge complaints about data handling</li>
      </ul>

      <h2 className="mt-6 mb-2 text-2xl font-bold">Contact</h2>
      <p className="mb-4">For privacy-related questions or concerns:</p>
      <ul className="mb-4 list-inside list-disc">
        <li>hello@ephraimduncan.com</li>
      </ul>

      <h2 className="mt-6 mb-2 text-2xl font-bold">Updates to This Policy</h2>
      <p className="mb-4">
        We may update this privacy policy from time to time. We will notify
        users of any material changes through our application or website.
      </p>
    </div>
  );
}
