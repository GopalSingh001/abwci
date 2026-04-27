import Layout from '../components/Layout';
import Image from 'next/image';

export default function Contact() {
  return (
    <Layout>
      <div className="p-8">
        {/* Hero Image */}
        <div className="mb-8">
          <div className="relative w-full h-48 rounded-2xl overflow-hidden">
            <Image
              src="/assets/aboutus.png"
              alt="Contact Us"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Introduction section */}
          <div className="bg-white rounded-2xl border border-gray-300 p-8">
            <h2 className="text-4xl font-serif text-[#653a96] mb-6">Get in Touch</h2>
            <p className="text-gray-800 text-lg leading-relaxed">
              We'd love to hear from you! Whether you have questions about our programs, want to become a member, or are interested in partnering with us, our team is here to help. Reach out to us through any of the channels below.
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl border border-gray-300 p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#653a96] rounded-full flex items-center justify-center">
                <Image
                  src="/assets/ic_baseline-whatsapp.png"
                  alt="WhatsApp"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
              </div>
              <h3 className="text-xl font-semibold text-[#653a96] mb-3">WhatsApp Us</h3>
              <p className="text-gray-600 mb-4">Quick responses for urgent queries</p>
              <a href="https://wa.me/1234567890" className="text-[#653a96] font-medium hover:underline">
                +1 (234) 567-890
              </a>
            </div>

            <div className="bg-white rounded-2xl border border-gray-300 p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#653a96] rounded-full flex items-center justify-center">
                <Image
                  src="/assets/material-symbols_call.svg"
                  alt="Call"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
              </div>
              <h3 className="text-xl font-semibold text-[#653a96] mb-3">Call Us</h3>
              <p className="text-gray-600 mb-4">Speak directly with our team</p>
              <a href="tel:+1234567890" className="text-[#653a96] font-medium hover:underline">
                +1 (234) 567-890
              </a>
            </div>

            <div className="bg-white rounded-2xl border border-gray-300 p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#653a96] rounded-full flex items-center justify-center">
                <Image
                  src="/assets/material-symbols_mail.svg"
                  alt="Mail"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
              </div>
              <h3 className="text-xl font-semibold text-[#653a96] mb-3">Mail Us</h3>
              <p className="text-gray-600 mb-4">Send us detailed inquiries</p>
              <a href="mailto:info@abwci.org" className="text-[#653a96] font-medium hover:underline">
                info@abwci.org
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl border border-gray-300 p-8">
            <h2 className="text-3xl font-serif text-[#653a96] mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#653a96] focus:border-transparent"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#653a96] focus:border-transparent"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#653a96] focus:border-transparent"
                  placeholder="Enter your email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#653a96] focus:border-transparent"
                  placeholder="What is this about?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#653a96] focus:border-transparent"
                  placeholder="Tell us more about your inquiry..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-[#653a96] text-white py-3 rounded-lg font-medium hover:bg-[#4f287b] transition-colors duration-200"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Office Information */}
          <div className="bg-gradient-to-r from-[#653a96] to-[#4f287b] rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-serif mb-6">Visit Our Office</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Headquarters</h3>
                <p className="mb-2">123 Business District</p>
                <p className="mb-2">Suite 456, Floor 7</p>
                <p className="mb-2">New York, NY 10001</p>
                <p>United States</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Office Hours</h3>
                <p className="mb-2">Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p className="mb-2">Saturday: 10:00 AM - 4:00 PM</p>
                <p className="mb-2">Sunday: Closed</p>
                <p>Emergency: 24/7 WhatsApp Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}