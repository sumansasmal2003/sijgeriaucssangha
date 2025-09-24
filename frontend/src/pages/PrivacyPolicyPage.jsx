import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

const PrivacyPolicyPage = () => {
    return (
        <div className="bg-background text-text-primary">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="text-center mb-12">
                        <ShieldCheck className="mx-auto h-12 w-12 text-primary" />
                        <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight">Privacy Policy</h1>
                        <p className="mt-4 text-lg text-text-secondary">Last updated: September 24, 2025</p>
                    </div>

                    <div className="prose prose-invert prose-lg max-w-none space-y-8 text-text-secondary">
                        <p>
                            Sijgeria Umesh Chandra Smriti Sangha ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
                        </p>

                        <section>
                            <h2 className="text-2xl font-bold text-text-primary">1. Information We Collect</h2>
                            <p>We may collect personal information from you in a variety of ways, including:</p>
                            <ul>
                                <li>
                                    <strong>Personal Data:</strong> When you register as a User (Volunteer) or are invited as a Member, we collect personally identifiable information, such as your name, email address, and phone number, which you voluntarily give to us.
                                </li>
                                <li>
                                    <strong>Donation Information:</strong> When you make a donation, we collect your name and email to record the transaction. We do not collect or store any payment card information; this is handled securely by our payment processors.
                                </li>
                                <li>
                                    <strong>Event Participation Data:</strong> When you register for an event, we collect your contact details and the names of the performers you register. This information is used solely for organizing and managing the event.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-text-primary">2. How We Use Your Information</h2>
                            <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you to:</p>
                            <ul>
                                <li>Create and manage your account.</li>
                                <li>Email you regarding your account, event registrations, or donations.</li>
                                <li>Process donations and send you a confirmation.</li>
                                <li>Organize and manage club events.</li>
                                <li>Notify you of updates, announcements, and new events.</li>
                                <li>Monitor and analyze usage to improve our website and services.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-text-primary">3. Disclosure of Your Information</h2>
                            <p>We do not share, sell, rent, or trade your personal information with any third parties for their commercial purposes. We may share information we have collected about you in certain situations:</p>
                            <ul>
                                <li>
                                    <strong>Public Directories:</strong> If you are a club official (e.g., President, Secretary), your name, designation, and profile picture may be displayed on our "Our Team" page. If you are a registered volunteer, your name, contact details, and profile picture may be displayed on our "Volunteers" page. You can manage this from your profile settings.
                                </li>
                                <li>
                                    <strong>By Law or to Protect Rights:</strong> If release of information is necessary to respond to legal process or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-text-primary">4. Security of Your Information</h2>
                            <p>
                                We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-text-primary">5. Contact Us</h2>
                            <p>
                                If you have questions or comments about this Privacy Policy, please contact us at:
                                <br />
                                Sijgeria Umesh Chandra Smriti Sangha
                                <br />
                                Email: <a href="mailto:sijgeria@gmail.com" className="text-primary hover:underline">sijgeria@gmail.com</a>
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
