import { useState } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import WaitlistModal from "./WaitlistModal";
import familyimg from "../assets/images/familyimg.png";

function CalloutSection() {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");

  // Placeholder submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  return (
    <section className="callout-section-cta position-relative overflow-hidden">
      {/* Top Left Small Blob */}
      <motion.div
        className="cta-blob cta-blob-topleft"
        aria-hidden="true"
        initial={{ x: '-10%', y: '-10%', scale: 0.7 }}
        animate={{ x: ['-10%', '-13%', '-10%'], y: ['-10%', '-7%', '-10%'], scale: [0.7, 0.9, 0.7] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Top Right Small Blob */}
      <motion.div
        className="cta-blob cta-blob-topright"
        aria-hidden="true"
        initial={{ x: '80%', y: '-8%', scale: 0.8 }}
        animate={{ x: ['80%', '83%', '80%'], y: ['-8%', '-5%', '-8%'], scale: [0.8, 1, 0.8] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Bottom Left Small Blob */}
      <motion.div
        className="cta-blob cta-blob-bottomleft"
        aria-hidden="true"
        initial={{ x: '-8%', y: '80%', scale: 0.7 }}
        animate={{ x: ['-8%', '-5%', '-8%'], y: ['80%', '83%', '80%'], scale: [0.7, 0.9, 0.7] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Bottom Right Small Blob */}
      <motion.div
        className="cta-blob cta-blob-bottomright"
        aria-hidden="true"
        initial={{ x: '85%', y: '85%', scale: 0.8 }}
        animate={{ x: ['85%', '88%', '85%'], y: ['85%', '82%', '85%'], scale: [0.8, 1, 0.8] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Mid Left Small Blob */}
      <motion.div
        className="cta-blob cta-blob-midleft"
        aria-hidden="true"
        initial={{ x: '5%', y: '39', scale: 0.6 }}
        animate={{ x: ['5%', '2%', '5%'], y: ['40%', '43%', '40%'], scale: [0.6, 0.8, 0.6] }}
        transition={{ duration: 21, repeat: Infinity, ease: "easeInOut" }}
      />
      <Container>
        <Row className="align-items-center justify-content-center">
          <Col lg={6} md={10} className="mb-5 mb-lg-0">
            <motion.div
              className="cta-card text-start"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8 }}
            >
              <div className="cta-badge mb-3">
                {/* <Sparkles size={28} /> */}
                {/* <span className="ms-2">New for 2024</span> */}
              </div>
              <h2 className="cta-title mb-3">
                Ready to Take Control of Your Family's Digital Life?
              </h2>
              <p className="cta-desc mb-4">
                Start  SprouNest and experience effortless screen time management, real-time monitoring, and peace of mind all in one app.
              </p>
              <Form className="cta-form d-flex flex-column flex-sm-row mb-1" onSubmit={handleSubmit}>
                {/* <Form.Control
                  type="email"
                  placeholder="Write your email"
                  className="cta-input"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  size="lg"
                /> */}
                <Button 
                  variant="primary" 
                  size="lg"
                  className="cta-btn fw-semibold"
                  type="submit"
                >
                Join Waitlist
                  {/* <ArrowRight size={20} className="ms-2" /> */}
                </Button>
              </Form>
              <p className="cta-note small mt-2 mb-0 opacity-75">
                No credit card required • Cancel anytime
              </p>
            </motion.div>
          </Col>
          <Col lg={6} md={10} className="text-center">
            {/* Replace src with your image when provided */}
            <img 
              src={familyimg}
              alt="CTA Visual" 
              className="cta-image img-fluid rounded-4 shadow-sm"
              style={{ maxWidth: '400px', width: '100%', objectFit: 'cover' }}
            />
          </Col>
        </Row>
        <WaitlistModal show={showModal} onHide={() => setShowModal(false)} />
      </Container>
    </section>
  );
}

export default CalloutSection; 