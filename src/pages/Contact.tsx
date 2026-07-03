import { useState } from 'react'
import { Mail, MapPin, Phone, Send, CheckCircle } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSuccess(true); setLoading(false)
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="pt-20 bg-white dark:bg-sand-900 min-h-screen">
      <section className="py-20">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-sand-900 dark:text-white mb-4">Get in Touch</h1>
              <p className="text-xl text-sand-600 dark:text-sand-400 max-w-2xl mx-auto">Have questions, feedback, or just want to say hello? We'd love to hear from you.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="card p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary-100 dark:bg-primary-900 flex items-center justify-center"><Mail className="w-7 h-7 text-primary-600" /></div>
                <h3 className="font-semibold text-sand-900 dark:text-white mb-2">Email Us</h3>
                <a href="mailto:hello@wanderly.com" className="text-primary-600 hover:text-primary-700">hello@wanderly.com</a>
              </div>
              <div className="card p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-secondary-100 dark:bg-secondary-900 flex items-center justify-center"><Phone className="w-7 h-7 text-secondary-600" /></div>
                <h3 className="font-semibold text-sand-900 dark:text-white mb-2">Call Us</h3>
                <a href="tel:+1234567890" className="text-primary-600 hover:text-primary-700">+1 (234) 567-890</a>
              </div>
              <div className="card p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-amber-100 dark:bg-amber-900 flex items-center justify-center"><MapPin className="w-7 h-7 text-amber-600" /></div>
                <h3 className="font-semibold text-sand-900 dark:text-white mb-2">Visit Us</h3>
                <p className="text-sand-600 text-sm">123 Travel Street<br />San Francisco, CA 94105</p>
              </div>
            </div>

            <div className="card p-8">
              {success ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-green-600" /></div>
                  <h3 className="text-xl font-semibold text-sand-900 dark:text-white mb-2">Message Sent!</h3>
                  <p className="text-sand-600 dark:text-sand-400 mb-4">Thank you for reaching out. We'll get back to you soon.</p>
                  <button onClick={() => setSuccess(false)} className="btn-primary">Send Another Message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div><label className="label">Your Name *</label><input type="text" className="input" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div>
                    <div><label className="label">Your Email *</label><input type="email" className="input" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required /></div>
                  </div>
                  <div><label className="label">Subject *</label><select className="input" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required><option value="">Select a topic...</option><option value="general">General Inquiry</option><option value="support">Technical Support</option><option value="feedback">Feedback</option><option value="partnership">Partnership</option></select></div>
                  <div><label className="label">Your Message *</label><textarea className="input min-h-[150px]" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required /></div>
                  <button type="submit" disabled={loading} className="w-full btn-primary py-3"><Send className="w-5 h-5 mr-2" />{loading ? 'Sending...' : 'Send Message'}</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
