import React from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsAndConditionsPage = () => {
    return (
        <div className="bg-background text-text-primary">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="text-center mb-12">
                        <FileText className="mx-auto h-12 w-12 text-primary" />
                        <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight">Terms and Conditions</h1>
                        <p className="mt-4 text-lg text-text-secondary">Last updated: September 24, 2025</p>
                    </div>

                    <div className="prose prose-invert prose-lg max-w-none space-y-8 text-text-secondary">
                        <p>
                            Welcome to the Sijgeria Umesh Chandra Smriti Sangha website. By accessing or using our website, you agree to be bound by these Terms and Conditions and our Privacy Policy.
                        </p>

                        <section>
                            <h2 className="text-2xl font-bold text-text-primary">1. User Accounts and Conduct</h2>
                            <p>
                                To access certain features, you must register for a User (Volunteer) account. You agree to provide accurate, current, and complete information during the registration process. You are responsible for safeguarding your password and for all activities that occur under your account. You agree not to engage in any activity that is harmful, abusive, or disruptive to the community or the functioning of this website.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-text-primary">2. Member Responsibilities</h2>
                            <p>
                                Members of the club have additional privileges, including the ability to manage events, users, and other club-related content. With these privileges comes the responsibility to act in the best interest of the club and its community. Misuse of these privileges, including but not limited to unfairly blocking users, posting inappropriate content, or misrepresenting the club, may result in the revocation of your member status.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-text-primary">3. Event Participation</h2>
                            <p>
                                When you register for an event, you agree to provide accurate information for all performers. You may cancel your registration up until the day before the event. Cancellations on the day of the event or after are not permitted. The club reserves the right to cancel or reschedule events at its discretion.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-text-primary">4. Donations</h2>
                            <p>
                                All donations made through our website are processed via a UPI QR code system. We record your name, email, and the intended donation amount for our records. The transaction itself is handled by your UPI application and the banking network. We are not responsible for any transaction failures. All donations are final and non-refundable.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-text-primary">5. Intellectual Property</h2>
                            <p>
                                All content on this website, including text, graphics, logos, and images, is the property of Sijgeria Umesh Chandra Smriti Sangha or its content suppliers and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works from this content without our express written permission.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-text-primary">6. Limitation of Liability</h2>
                            <p>
                                This website and its content are provided on an "as is" basis. Sijgeria Umesh Chandra Smriti Sangha makes no warranties, expressed or implied, and hereby disclaims all other warranties. In no event shall the club be liable for any damages arising out of the use or inability to use the materials on this website.
                            </p>
                        </section>

                         <section>
                            <h2 className="text-2xl font-bold text-text-primary">7. Changes to These Terms</h2>
                            <p>
                                We reserve the right to modify these Terms and Conditions at any time. We will notify you of any changes by posting the new terms on this page and updating the "Last updated" date. Your continued use of the website after any such changes constitutes your acceptance of the new Terms and Conditions.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-text-primary">8. Contact Us</h2>
                            <p>
                                If you have any questions about these Terms and Conditions, please <Link to="/contact" className="text-primary hover:underline">contact us</Link>.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TermsAndConditionsPage;
