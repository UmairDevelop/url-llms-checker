import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RedditBar } from "@/components/RedditBar";
import { updateSEO } from "@/utils/seo";

const Terms = () => {
	useEffect(() => {
		updateSEO({
			title: "Terms & Conditions – ezllmstxt.com",
			description: "Read the Terms and Conditions for using ezllmstxt.com, including our LLMs.txt generator and validator tools.",
			keywords: ["terms and conditions", "ezllmstxt", "llms.txt", "generator", "validator"],
		});
	}, []);

	return (
		<div className="min-h-screen bg-background">
			<RedditBar />
			<Header />
			<main className="container mx-auto px-4 py-12">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-4xl font-bold text-center mb-8">Terms and Conditions – ezllmstxt.com</h1>

					<div className="max-w-none">
						<section className="mb-12">
							<p className="text-lg leading-relaxed mb-6">
								Welcome to ezllmstxt.com. By accessing or using our website and tools, including the LLMs.txt file generator
								and validator, you agree to comply with and be bound by the following Terms and Conditions. Please read them
								carefully.
							</p>
						</section>

						<section className="mb-12">
							<h2 className="text-2xl font-semibold mb-6">1. Acceptance of Terms</h2>
							<p className="text-lg leading-relaxed mb-6">
								By using ezllmstxt.com, you acknowledge that you have read, understood, and agree to these Terms and
								Conditions. If you do not agree, you must discontinue use of our website and services immediately.
							</p>
						</section>

						<section className="mb-12">
							<h2 className="text-2xl font-semibold mb-6">2. Services Provided</h2>
							<p className="text-lg leading-relaxed mb-6">ezllmstxt.com offers free and paid online tools including but not limited to:</p>
							<ul className="list-disc pl-6 mb-6 space-y-2">
								<li>LLMs.txt generator</li>
								<li>LLMs.txt validator</li>
								<li>Educational content about AI crawler control and LLMs.txt for websites</li>
							</ul>
							<p className="text-lg leading-relaxed mb-6">We reserve the right to modify, update, or discontinue any service without prior notice.</p>
						</section>

						<section className="mb-12">
							<h2 className="text-2xl font-semibold mb-6">3. Eligibility</h2>
							<p className="text-lg leading-relaxed mb-6">
								You must be at least 18 years old or have legal parental/guardian consent to use this website. By using the
								site, you represent that you meet these requirements.
							</p>
						</section>

						<section className="mb-12">
							<h2 className="text-2xl font-semibold mb-6">4. User Responsibilities</h2>
							<p className="text-lg leading-relaxed mb-6">When using ezllmstxt.com, you agree not to:</p>
							<ul className="list-disc pl-6 mb-6 space-y-2">
								<li>Use the tools or content for unlawful purposes.</li>
								<li>Attempt to hack, disrupt, or misuse the website.</li>
								<li>Copy, redistribute, or resell our services without written consent.</li>
							</ul>
						</section>

						<section className="mb-12">
							<h2 className="text-2xl font-semibold mb-6">5. Disclaimer of Warranties</h2>
							<p className="text-lg leading-relaxed mb-6">
								Our tools, including the LLMs.txt generator and validator, are provided “as is” and “as available.” We do not
								guarantee:
							</p>
							<ul className="list-disc pl-6 mb-6 space-y-2">
								<li>Accuracy or completeness of generated/validated files.</li>
								<li>Compliance with all third-party AI crawlers.</li>
								<li>That use of our services will achieve specific SEO or business results.</li>
							</ul>
							<p className="text-lg leading-relaxed mb-6">Use of the services is at your own risk.</p>
						</section>

						<section className="mb-12">
							<h2 className="text-2xl font-semibold mb-6">6. Limitation of Liability</h2>
							<p className="text-lg leading-relaxed mb-6">
								ezllmstxt.com, its owners, and affiliates are not liable for any damages, losses, or issues arising from:
							</p>
							<ul className="list-disc pl-6 mb-6 space-y-2">
								<li>Use or inability to use the website or tools.</li>
								<li>Errors, bugs, or downtime.</li>
								<li>Actions taken by third-party AI crawlers or search engines.</li>
							</ul>
						</section>

						<section className="mb-12">
							<h2 className="text-2xl font-semibold mb-6">7. Intellectual Property</h2>
							<p className="text-lg leading-relaxed mb-6">
								All content, branding, design, and tools on ezllmstxt.com are protected by copyright, trademarks, and
								intellectual property rights. You may not copy, modify, or distribute them without permission.
							</p>
						</section>

						<section className="mb-12">
							<h2 className="text-2xl font-semibold mb-6">8. External Links & Third-Party Content</h2>
							<p className="text-lg leading-relaxed mb-6">
								ezllmstxt.com may contain links to third-party websites. We are not responsible for the content, policies, or
								actions of those websites. Accessing external sites is at your own risk.
							</p>
						</section>

						<section className="mb-12">
							<h2 className="text-2xl font-semibold mb-6">9. Privacy Policy</h2>
							<p className="text-lg leading-relaxed mb-6">
								Your use of the site is also governed by our Privacy Policy, which outlines how we collect, use, and protect your
								information.
							</p>
						</section>

						<section className="mb-12">
							<h2 className="text-2xl font-semibold mb-6">10. Changes to Terms</h2>
							<p className="text-lg leading-relaxed mb-6">
								We reserve the right to update or modify these Terms and Conditions at any time. Updates will be posted on this
								page with a new “Effective Date.”
							</p>
						</section>

						<section className="mb-12">
							<h2 className="text-2xl font-semibold mb-6">11. Governing Law</h2>
							<p className="text-lg leading-relaxed mb-6">
								These Terms and Conditions are governed by and construed in accordance with the laws of [Insert Your Country/Region].
								Any disputes will be resolved in the courts of [Insert Jurisdiction].
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-6">12. Contact Information</h2>
							<p className="text-lg leading-relaxed mb-2">
								If you have any questions regarding these Terms and Conditions, please contact us at:
							</p>
							<p className="text-lg leading-relaxed">📧 contact@ezllmstxt.com</p>
						</section>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
};

export default Terms;
