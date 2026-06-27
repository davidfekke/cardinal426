import { useState } from 'react';
import './ContactForm.css';

type SubmitState = 'idle' | 'sending' | 'success' | 'error';

export default function ContactForm() {
  const [submitState, setSubmitState] = useState<SubmitState>('idle');

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    setSubmitState('sending');

    const formData = new FormData(form);
    const payload = new URLSearchParams();

    formData.forEach((value, key) => {
      payload.append(key, String(value));
    });

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload.toString()
      });

      if (!response.ok) {
        throw new Error('Form submission failed');
      }

      form.reset();
      setSubmitState('success');
    } catch {
      setSubmitState('error');
    }
  };

  return (
    <section className="contact-shell" aria-label="Contact form">
      <h2 className="contact-heading">Request Partnership Details</h2>
      <p className="contact-intro">
        Tell us about your flying goals and availability. We will send details on equity share,
        operating costs, and onboarding.
      </p>

      {submitState === 'success' ? (
        <div className="contact-status is-success" role="status" aria-live="polite">
          Thanks for reaching out. Your inquiry has been sent.
        </div>
      ) : (
        <form
          name="partnership-contact"
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
          className="contact-form"
          onSubmit={onSubmit}
        >
          <input type="hidden" name="form-name" value="partnership-contact" />

          <p className="honeypot-field" hidden>
            <label>
              Do not fill this field if you are human.
              <input name="bot-field" />
            </label>
          </p>

          <label className="form-field">
            Full Name
            <input name="name" type="text" required autoComplete="name" />
          </label>

          <label className="form-field">
            Email Address
            <input name="email" type="email" required autoComplete="email" />
          </label>

          <label className="form-field">
            Phone Number
            <input name="phone" type="tel" required autoComplete="tel" />
          </label>

          <label className="form-field">
            Message
            <textarea
              name="message"
              required
              rows={6}
              placeholder="Share your mission profile, preferred airport, and timeline."
            />
          </label>

          <button className="submit-button" type="submit" disabled={submitState === 'sending'}>
            {submitState === 'sending' ? 'Sending...' : 'Send Inquiry'}
          </button>

          {submitState === 'error' ? (
            <p className="contact-status is-error" role="alert">
              Submission did not complete. Please try again.
            </p>
          ) : null}
        </form>
      )}
    </section>
  );
}
