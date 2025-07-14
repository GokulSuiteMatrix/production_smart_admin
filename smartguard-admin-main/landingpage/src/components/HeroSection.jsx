import React, { useState } from 'react';
import './HeroSection.css';
import heroImage from '../assets/images/background-img-heroo.png';
import logo from '../assets/images/logo.png';
import { Smartphone, Shield, Users, Clock } from "lucide-react";
import { motion } from "framer-motion";

function HeroSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage(null);
    setError(null);

    const { error: supabaseError } = await supabase.from("waitlist").insert([{ email }]);
    
    setLoading(false);

    if (supabaseError) {
      setError("This email address is already on our waitlist. We'll keep you updated!");
    } else {
      setMessage(`Thank you for joining! You're on the waitlist.`);
      setEmail('');
    }
  };

  return (
    <section className="hero-section">
      <motion.div>
        <div className="hero-container">
          <div className="hero-content">
            <img src={logo} alt="Site Logo" className="site-logo" />
            <div className="hero-heading">
              <h1 className="hero-title">Smarter Parental Control for a  <br />  Safer digital childhood.</h1>
            </div>
            <p className="hero-subtitle">A Caring Parental Control App for All.</p>
            <form onSubmit={handleSubmit} className="hero-waitlist-form">
              <input
                type="email"
                className="waitlist-input"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
              <button type="submit" className="waitlist-button" disabled={loading}>
                {loading ? 'Joining...' : 'Join Waitlist'}
              </button>
            </form>
            <div className="hero-form-messages">
              {message && <p className="success-message">{message}</p>}
              {error && <p className="error-message">{error}</p>}
            </div>
          </div>
          <div className="hero-image-container">
            <img src={heroImage} alt="FlashGet Kids App" className="hero-image" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default HeroSection; 