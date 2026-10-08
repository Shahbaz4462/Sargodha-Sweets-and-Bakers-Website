"use client";

import React, { useState } from "react";
import { Phone, MessageSquare, Mail, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";

interface ContactSectionProps {
  settings?: any;
}

export function ContactSection({ settings }: ContactSectionProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const businessName = settings?.businessName || "Sargodha Sweets & Bakers";
  const address = settings?.address || "Main Bazaar, Near Clock Tower, Sargodha, Punjab, Pakistan";
  const phoneNum = settings?.phone || "+92 300 1234567";
  const whatsappNum = settings?.whatsapp || "+923001234567";
  const emailAddr = settings?.email || "info@sargodhasweets.com";
  const openingHours = settings?.openingHours || "Monday – Sunday: 7:00 AM – 11:00 PM";
  const mapEmbedUrl =
    settings?.googleMapUrl ||
    "https://maps.google.com/maps?q=Sargodha+Clock+Tower&t=&z=15&ie=UTF8&iwloc=&output=embed";

  const cleanPhone = phoneNum.replace(/[^0-9+]/g, "");
  const cleanWhatsapp = whatsappNum.replace(/[^0-9]/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/public/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          message,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setName("");
        setPhone("");
        setEmail("");
        setMessage("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-cream dark:bg-[#121013] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-gold">Get in Touch</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-custom-primary mt-2">
            Visit Our Bakery or Contact Us
          </h2>
          <p className="text-custom-secondary text-sm sm:text-base mt-2">
            We welcome you to visit our store in Sargodha or reach out for custom cake inquiries and sweet gift boxes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Contact Details Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Address */}
            <div className="p-6 rounded-2xl bg-card-custom border border-black/10 dark:border-white/10 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-burgundy/10 text-burgundy dark:bg-gold/10 dark:text-gold flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-custom-primary mb-1">Our Location</h3>
                <p className="text-xs sm:text-sm text-custom-secondary leading-relaxed">{address}</p>
              </div>
            </div>

            {/* Phone & WhatsApp */}
            <div className="p-6 rounded-2xl bg-card-custom border border-black/10 dark:border-white/10 shadow-sm space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] uppercase font-bold text-custom-muted block">Direct Phone</span>
                  <a
                    href={`tel:${cleanPhone}`}
                    className="text-sm font-bold text-custom-primary hover:text-burgundy dark:hover:text-gold transition-colors"
                  >
                    {phoneNum}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-3 border-t border-black/5 dark:border-white/5">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] uppercase font-bold text-custom-muted block">WhatsApp Inquiry</span>
                  <a
                    href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                      `Hello ${businessName}, I would like to inquire about your products.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Chat on WhatsApp ({whatsappNum})
                  </a>
                </div>
              </div>
            </div>

            {/* Hours & Email */}
            <div className="p-6 rounded-2xl bg-card-custom border border-black/10 dark:border-white/10 shadow-sm space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] uppercase font-bold text-custom-muted block">Opening Hours</span>
                  <p className="text-sm font-semibold text-custom-primary">{openingHours}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-3 border-t border-black/5 dark:border-white/5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] uppercase font-bold text-custom-muted block">Official Email</span>
                  <a href={`mailto:${emailAddr}`} className="text-sm font-semibold text-custom-primary hover:underline">
                    {emailAddr}
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Map & Inquiry Form */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Embedded Google Map */}
            <div className="rounded-2xl overflow-hidden shadow-lg border border-black/10 dark:border-white/10 h-64 sm:h-72 bg-black/5">
              <iframe
                title="Sargodha Sweets Map"
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Send Message Form */}
            <div className="p-8 rounded-2xl bg-card-custom border border-black/10 dark:border-white/10 shadow-md">
              <h3 className="font-serif text-2xl font-bold text-custom-primary mb-2">
                Send Us a Direct Message
              </h3>
              <p className="text-xs text-custom-secondary mb-6">
                Have a question about custom cakes, party orders, or seasonal sweets? Send us a message below.
              </p>

              {submitted ? (
                <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 shrink-0 text-emerald-600" />
                  <div>
                    <h4 className="font-bold text-sm">Message Sent Successfully!</h4>
                    <p className="text-xs mt-1">Thank you for reaching out to Sargodha Sweets & Bakers. We will get back to you shortly.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-custom-primary block mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Usman Ali"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-cream dark:bg-[#121013] border border-black/10 dark:border-white/10 text-xs font-medium text-custom-primary focus:outline-none focus:border-burgundy dark:focus:border-gold"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-custom-primary block mb-1">Phone Number *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 0300 1234567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-cream dark:bg-[#121013] border border-black/10 dark:border-white/10 text-xs font-medium text-custom-primary focus:outline-none focus:border-burgundy dark:focus:border-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-custom-primary block mb-1">Email Address (Optional)</label>
                    <input
                      type="email"
                      placeholder="e.g. usman@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-cream dark:bg-[#121013] border border-black/10 dark:border-white/10 text-xs font-medium text-custom-primary focus:outline-none focus:border-burgundy dark:focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-custom-primary block mb-1">Message *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="How can we help you?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-cream dark:bg-[#121013] border border-black/10 dark:border-white/10 text-xs font-medium text-custom-primary focus:outline-none focus:border-burgundy dark:focus:border-gold"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 px-6 rounded-xl bg-burgundy hover:bg-[#541625] text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? "Submitting..." : "Send Message"}</span>
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
