import type { Metadata } from "next";

export const metadata: Metadata = {
  description: "Terms of Service for Weekday",
  title: "Terms of Service - Weekday",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-3xl font-bold">Terms of Service</h1>
      <p className="mb-4">
        <strong>Last updated: May 21, 2025</strong>
      </p>

      <h2 className="mt-6 mb-2 text-2xl font-bold">Overview</h2>
      <p className="mb-4">
        Weekday is an open-source calendar solution with AI features that
        enables users to self-host their calendar service or integrate with
        Google Calendar. By using Weekday, you agree to these terms.
      </p>

      <h2 className="mt-6 mb-2 text-2xl font-bold">Service Description</h2>

      <h3 className="mt-4 mb-2 text-xl font-bold">Self-Hosted Service</h3>
      <ul className="mb-4 list-inside list-disc">
        <li>
          Weekday provides software that users can deploy on their own
          infrastructure
        </li>
        <li>
          Users are responsible for their own hosting, maintenance, and
          compliance
        </li>
        <li>
          The software is provided "as is" under the GNU Affero General Public
          License v3 (AGPLv3)
        </li>
      </ul>

      <h3 className="mt-4 mb-2 text-xl font-bold">
        Google Calendar Integration
      </h3>
      <ul className="mb-4 list-inside list-disc">
        <li>
          Weekday integrates with Google Calendar as a primary calendar provider
        </li>
        <li>Users must comply with Google's terms of service</li>
        <li>
          We are not responsible for disruptions to Google Calendar services
        </li>
        <li>
          AI features process calendar data in accordance with our Privacy
          Policy
        </li>
      </ul>

      <h2 className="mt-6 mb-2 text-2xl font-bold">User Responsibilities</h2>
      <p className="mb-2">Users agree to:</p>
      <ul className="mb-4 list-inside list-disc">
        <li>Comply with all applicable laws and regulations</li>
        <li>Maintain the security of their instance if self-hosting</li>
        <li>Not use the service for spam or malicious purposes</li>
        <li>Respect intellectual property rights</li>
        <li>Report security vulnerabilities responsibly</li>
        <li>Use AI features in accordance with ethical guidelines</li>
      </ul>

      <h2 className="mt-6 mb-2 text-2xl font-bold">Software License</h2>
      <p className="mb-2">
        Weekday is licensed under the GNU Affero General Public License v3
        (AGPLv3):
      </p>
      <ul className="mb-4 list-inside list-disc">
        <li>
          You are free to use, modify, and distribute the software under the
          terms of the AGPLv3.
        </li>
        <li>
          If you run a modified version on a network and offer it to others, you
          must also offer them the source code.
        </li>
        <li>The software is provided "as is" with no warranties.</li>
        <li>
          You must include the original AGPLv3 license and copyright notices
          with any distribution.
        </li>
      </ul>

      <h2 className="mt-6 mb-2 text-2xl font-bold">AI Features</h2>
      <p className="mb-2">When using Weekday's AI features:</p>
      <ul className="mb-4 list-inside list-disc">
        <li>Users retain ownership of their calendar data</li>
        <li>AI processing follows our privacy commitments</li>
        <li>Generated content must be reviewed by users for accuracy</li>
        <li>
          We do not guarantee the accuracy of AI-generated recommendations
        </li>
        <li>AI features are provided on an "as is" basis</li>
      </ul>

      <h2 className="mt-6 mb-2 text-2xl font-bold">Community Guidelines</h2>
      <p className="mb-2">Users participating in our community agree to:</p>
      <ul className="mb-4 list-inside list-disc">
        <li>Follow our code of conduct</li>
        <li>Contribute constructively to discussions</li>
        <li>Respect other community members</li>
        <li>Report inappropriate behavior</li>
      </ul>

      <h2 className="mt-6 mb-2 text-2xl font-bold">Data Usage</h2>
      <ul className="mb-4 list-inside list-disc">
        <li>We handle your data as described in our Privacy Policy</li>
        <li>We adhere to Google API Services User Data Policy</li>
        <li>You can revoke access to your Google Calendar at any time</li>
        <li>We only request necessary permissions</li>
      </ul>

      <h2 className="mt-6 mb-2 text-2xl font-bold">Service Modifications</h2>
      <ul className="mb-4 list-inside list-disc">
        <li>We may modify or discontinue features with reasonable notice</li>
        <li>We strive to maintain backward compatibility when possible</li>
        <li>Critical security updates may be deployed without prior notice</li>
      </ul>

      <h2 className="mt-6 mb-2 text-2xl font-bold">Disclaimer of Warranties</h2>
      <ul className="mb-4 list-inside list-disc">
        <li>Weekday is provided "as is" without warranties</li>
        <li>We do not guarantee uninterrupted or error-free service</li>
        <li>We are not responsible for scheduling errors or missed events</li>
        <li>AI recommendations are provided without warranty of accuracy</li>
      </ul>

      <h2 className="mt-6 mb-2 text-2xl font-bold">Limitation of Liability</h2>
      <ul className="mb-4 list-inside list-disc">
        <li>
          We are not liable for any indirect, incidental, or consequential
          damages
        </li>
        <li>
          Our total liability is limited to the amounts paid by you (if any) for
          the service
        </li>
        <li>
          We are not responsible for data loss or breaches not caused by our
          negligence
        </li>
      </ul>

      <h2 className="mt-6 mb-2 text-2xl font-bold">Contact Information</h2>
      <p className="mb-2">For questions about these terms:</p>
      <ul className="mb-4 list-inside list-disc">
        <li>Email: hello@ephraimduncan.com</li>
      </ul>

      <h2 className="mt-6 mb-2 text-2xl font-bold">Changes to Terms</h2>
      <p className="mb-4">
        We may update these terms from time to time. We will notify users of any
        material changes through our application or website.
      </p>
    </div>
  );
}
