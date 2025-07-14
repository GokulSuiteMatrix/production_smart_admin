import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

function Footer() {
  return (
    <motion.footer
      className="footer-section-modern mt-5"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8 }}
    >
      <Container>
        <Row className="gy-5 align-items-start">
          {/* Brand & tagline */}
          <Col lg={4} md={6} className="mb-4 mb-lg-0">
            <div className="footer-brand-modern mb-3">SprouNest</div>
            <p className="footer-tagline mb-4">
              Modern parenting starts here. Guide your children's digital journey with confidence and connection.
            </p>
            <div className="footer-socials d-flex gap-3">
              <a href="#" aria-label="Facebook" className="footer-social-icon">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Twitter" className="footer-social-icon">
                <Twitter size={20} />
              </a>
              <a href="#" aria-label="Instagram" className="footer-social-icon">
                <Instagram size={20} />
              </a>
            </div>
          </Col>
          {/* Spacer column for layout balance */}
          <Col lg={4} className="d-none d-lg-block"></Col>
          {/* Contact Info - right aligned on large screens */}
          <Col lg={4} md={12} className="">
            <div className="footer-links-block">
              <h5 className="footer-links-title mb-3">Contact Us</h5>
              <div className="d-flex flex-column gap-3 align-items-start">
                <div className="d-flex align-items-center gap-2">
                  <Mail size={16} className="footer-contact-icon" />
                  <a href="mailto:hello@sprounest.com" className="footer-contact-link">hello@sprounest.com</a>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Phone size={16} className="footer-contact-icon" />
                  <a href="tel:+1-800-555-0123" className="footer-contact-link">+91 9597132603</a>
                </div>
                <div className="d-flex align-items-start gap-2">
                  <MapPin size={22} className="footer-contact-icon mt-1" />
                  <address className="footer-contact-link mb-0 text-break" style={{ whiteSpace: 'pre-line', textAlign: 'left' }}>
                    3rd Floor, SJ Complex, Venkatraman Iyer Layout,
                    Trichy Main Road, Sulur, Coimbatore,
                    Tamil Nadu, India - 641402
                  </address>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <div className="footer-bottom-bar-modern mt-5 pt-4 text-center">
          <small className="text-muted">
            © {new Date().getFullYear()} SprouNest. All rights reserved. &nbsp;|&nbsp;
            <a href="#" className="footer-bottom-link">Privacy Policy</a> &nbsp;|&nbsp;
            <a href="#" className="footer-bottom-link">Terms of Service</a>
          </small>
        </div>
      </Container>
    </motion.footer>
  );
}

export default Footer;
