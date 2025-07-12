import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function TermsOfService() {
  return (
    <>
      <Head>
        <title>Terms of Service - PRISM USA LLC</title>
        <meta name="description" content="Terms of Service for PRISM USA LLC." />
      </Head>
      
      <Header />
      <main className="bg-gray-900 text-white">
        <div className="container-custom py-20">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          <div className="prose prose-invert max-w-none">
            <p>Last updated: July 12, 2025</p>
            <p>Please read these terms and conditions carefully before using Our Service.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Interpretation and Definitions</h2>
            <p>The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Acknowledgment</h2>
            <p>These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.</p>
            <p>Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.</p>
            <p>By accessing or using the Service You agree to be bound by these Terms and Conditions. If You disagree with any part of these Terms and Conditions then You may not access the Service.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Termination</h2>
            <p>We may terminate or suspend Your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms and Conditions.</p>
            <p>Upon termination, Your right to use the Service will cease immediately.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Governing Law</h2>
            <p>The laws of the Country, excluding its conflicts of law rules, shall govern this Terms and Your use of the Service. Your use of the Application may also be subject to other local, state, national, or international laws.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Changes to These Terms and Conditions</h2>
            <p>We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a revision is material We will make reasonable efforts to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at Our sole discretion.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
            <p>If you have any questions about these Terms and Conditions, You can contact us:</p>
            <ul>
              <li>By email: {process.env.NEXT_PUBLIC_CONTACT_EMAIL}</li>
              <li>By phone number: {process.env.NEXT_PUBLIC_PHONE_NUMBER}</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
