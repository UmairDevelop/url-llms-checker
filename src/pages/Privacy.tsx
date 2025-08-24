import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RedditBar } from "@/components/RedditBar";
import { updateSEO } from "@/utils/seo";

const Privacy = () => {
	useEffect(() => {
		updateSEO({
			title: "Privacy Policy – ezllmstxt.com",
			description: "Learn how ezllmstxt.com collects, uses, and protects your information when using our LLMs.txt tools.",
			keywords: ["privacy policy", "ezllmstxt", "llms.txt", "generator", "validator"],
		});
	}, []);

	return (
		<div className="min-h-screen bg-background">
			<RedditBar />
			<Header />
			<main className="container mx-auto px-4 py-12">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-4xl font-bold text-center mb-8">Privacy Policy – ezllmstxt.com</h1>

					<div className="max-w-none">
						<section className="mb-12">
							<p className="text-lg leading-relaxed mb-6">
								At ezllmstxt.com, we value your privacy and are committed to protecting your personal information. This Privacy
								Policy explains how we collect, use, and safeguard information when you use our website and tools, including the
								LLMs.txt generator and LLMs.txt validator.
							</p>
						</section>

						<section className="mb-12">
							<h2 className="text-2xl font-semibold mb-6">1. Information We Collect</h2>
							<p className="text-lg leading-relaxed mb-6">We may collect the following types of information when you use our website:</p>
							<ul className="list-disc pl-6 mb-6 space-y-2">
								<li>Non-personal information (such as browser type, device information, and general site usage statistics).</li>
								<li>Log data (such as IP address, pages visited, and time spent on the site).</li>
								<li>Voluntary information you provide (such as your email if you contact us directly or subscribe to updates).</li>
							</ul>
							<p className="text-lg leading-relaxed mb-6">We do not require you to create an account to use our tools, and we do not collect sensitive personal data.</p>
						</section>

						<section className="mb-12">
							<h2 className="text-2xl font-semibold mb-6">2. How We Use Your Information</h2>
							<p className="text-lg leading-relaxed mb-6">The information we collect may be used to:</p>
							<ul className="list-disc pl-6 mb-6 space-y-2">
								<li>Provide and improve our services (e.g., LLMs.txt validator and generator).</li>
								<li>Monitor website performance and fix technical issues.</li>
								<li>Understand how visitors interact with our website.</li>
								<li>Communicate with you if you reach out to us directly.</li>
								<li>Comply with legal obligations.</li>
							</ul>
							<p className="text-lg leading-relaxed mb-6">We will never sell, rent, or trade your information to third parties.</p>
						</section>

						<section className="mb-12">
							<h2 className="text-2xl font-semibold mb-6">3. Cookies & Analytics</h2>
							<p className="text-lg leading-relaxed mb-4">
								<strong>Cookies:</strong> We may use cookies to enhance user experience, remember preferences, and analyze traffic. You can
								disable cookies in your browser settings.
							</p>
							<p className="text-lg leading-relaxed mb-6">
								<strong>Analytics:</strong> We may use third-party analytics tools (such as Google Analytics) to understand how visitors use the
								site. These tools collect anonymized information and do not identify individual users.
							</p>
						</section>

						<section className="mb-12">
							<h2 className="text-2xl font-semibold mb-6">4. Third-Party Links</h2>
							<p className="text-lg leading-relaxed mb-6">
								ezllmstxt.com may contain links to third-party websites. We are not responsible for the privacy practices or content of those
								sites. Please review their policies before providing personal data.
							</p>
						</section>

						<section className="mb-12">
							<h2 className="text-2xl font-semibold mb-6">5. Data Security</h2>
							<p className="text-lg leading-relaxed mb-6">
								We take reasonable steps to protect your information against unauthorized access, alteration, or disclosure. However, no
								online system is 100% secure, and we cannot guarantee absolute security.
							</p>
						</section>

						<section className="mb-12">
							<h2 className="text-2xl font-semibold mb-6">6. Your Rights</h2>
							<p className="text-lg leading-relaxed mb-6">Depending on your location, you may have rights under data protection laws, including:</p>
							<ul className="list-disc pl-6 mb-6 space-y-2">
								<li>The right to access the data we collect about you.</li>
								<li>The right to request corrections or deletion.</li>
								<li>The right to opt out of cookies or analytics tracking.</li>
							</ul>
							<p className="text-lg leading-relaxed mb-6">To exercise your rights, please contact us using the details below.</p>
						</section>

						<section className="mb-12">
							<h2 className="text-2xl font-semibold mb-6">7. Children’s Privacy</h2>
							<p className="text-lg leading-relaxed mb-6">
								ezllmstxt.com is not directed toward children under the age of 13 (or the age required by local law). We do not knowingly collect
								personal information from children.
							</p>
						</section>

						<section className="mb-12">
							<h2 className="text-2xl font-semibold mb-6">8. Changes to This Privacy Policy</h2>
							<p className="text-lg leading-relaxed mb-6">
								We may update this Privacy Policy from time to time. The updated version will be posted on this page with a new Effective
								Date.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold mb-6">9. Contact Us</h2>
							<p className="text-lg leading-relaxed mb-2">If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
							<p className="text-lg leading-relaxed">📧 contact@ezllmstxt.com</p>
						</section>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
};

export default Privacy;
