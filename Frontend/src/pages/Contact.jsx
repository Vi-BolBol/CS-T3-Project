import { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import AnimatedBackground from '../components/layout/AnimatedBackground';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const CHANNELS = [
  { icon: 'bi-envelope', label: 'Email', value: 'support@internshipfinder.com' },
  { icon: 'bi-geo-alt', label: 'Location', value: 'Phnom Penh, Cambodia' },
  { icon: 'bi-clock', label: 'Response time', value: 'Within 2 business days' },
];

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const set = (key) => (e) => setFormData((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // No backend endpoint for this form yet — the UI state is the honest answer.
    // (Replaces the old native alert(); PROJECT_SPEC §9 forbids alert()/confirm().)
    setSent(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <AnimatedBackground />
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
                Get in touch
              </span>
              <h1 className="mt-2 text-4xl font-black tracking-tight text-content sm:text-5xl">
                Contact us
              </h1>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-subtle">
                Questions about the platform, a listing, or your application? Send us a note and
                we&apos;ll come back to you.
              </p>

              <ul className="mt-8 space-y-4">
                {CHANNELS.map((c) => (
                  <li key={c.label} className="flex items-center gap-3">
                    <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                      <i className={`bi ${c.icon}`} />
                    </span>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-faint">
                        {c.label}
                      </p>
                      <p className="text-sm font-semibold text-content">{c.value}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-line bg-raised p-6 shadow-sm sm:p-8">
              {sent ? (
                <div className="py-10 text-center">
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent-soft text-accent">
                    <i className="bi bi-check-lg text-xl" />
                  </span>
                  <h2 className="mt-4 text-lg font-black text-content">Message received</h2>
                  <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-subtle">
                    Thanks — we&apos;ll get back to you at the email you gave us.
                  </p>
                  <Button
                    variant="secondary"
                    className="mt-6"
                    onClick={() => setSent(false)}
                  >
                    Send another
                  </Button>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <Input
                    label="Your name"
                    placeholder="Sok Dara"
                    value={formData.name}
                    onChange={set('name')}
                    required
                  />
                  <Input
                    label="Email address"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={set('email')}
                    required
                  />
                  <Input
                    label="Subject"
                    placeholder="What is this about?"
                    value={formData.subject}
                    onChange={set('subject')}
                    required
                  />
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-subtle"
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      placeholder="How can we help?"
                      value={formData.message}
                      onChange={set('message')}
                      required
                      className="w-full resize-none rounded-xl border border-line bg-muted px-4 py-3 text-sm text-content outline-none transition placeholder:text-faint focus:border-accent focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Send message
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
