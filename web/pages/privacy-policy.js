import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - PRISM USA LLC</title>
        <meta name="description" content="Privacy Policy for PRISM USA LLC." />
      </Head>
      
      <Header />
      <main className="bg-gray-900 text-white">
        <div className="container-custom py-20">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          <div className="prose prose-invert max-w-none">
            <p>Last updated: July 12, 2025</p>
            <p>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Collecting and Using Your Personal Data</h2>
            <p>While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:</p>
            <ul>
              <li>Email address</li>
              <li>First name and last name</li>
              <li>Phone number</li>
              <li>Usage Data</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Use of Your Personal Data</h2>
            <p>The Company may use Personal Data for the following purposes:</p>
            <ul>
              <li>To provide and maintain our Service, including to monitor the usage of our Service.</li>
              <li>To manage Your Account: to manage Your registration as a user of the Service.</li>
              <li>For the performance of a contract: the development, compliance and undertaking of the purchase contract for the products, items or services You have purchased or of any other contract with Us through the Service.</li>
              <li>To contact You: To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication.</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Security of Your Personal Data</h2>
            <p>The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially acceptable means to protect Your Personal Data, We cannot guarantee its absolute security.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Changes to this Privacy Policy</h2>
            <p>We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, You can contact us:</p>
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
