import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import { Shield, Clock, MapPin, BarChart2 } from "lucide-react";
import heroimg1 from "../assets/images/childboyphone.png";

const benefits = [
  {
    icon: <Shield size={28} />,
    title: "Safe Browsing",
    description: "Ensure your child only accesses age-appropriate websites and content."
  },
  {
    icon: <Clock size={28} />,
    title: "Screen Time Limits",
    description: "Promote a healthy digital balance by setting daily limits for apps and games."
  },
  {
    icon: <MapPin size={28} />,
    title: "Location Tracking",
    description: "Get peace of mind by knowing your child's whereabouts in real-time."
  },
  {
    icon: <BarChart2 size={28} />,
    title: "Activity Reports",
    description: "Stay informed about their online activity and start meaningful conversations."
  }
];

function ModernFamiliesSection() {
  return (
    <section className="modern-families-section-new py-5">
      <Container>
        <Row className="align-items-center justify-content-center g-5">
          <Col lg={6} md={10}>
            <motion.div
              className="modern-families-card p-4 p-md-5 mb-4 mb-lg-0"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="display-5 fw-bold mb-4">
                Designed for <span className="text-gradient">Modern Families</span>
              </h2>
              <p className="lead text-muted mb-4">
                We understand that every family is unique. SprouNest adapts to your parenting style, helping you create a digital environment that works for your family's specific needs.
              </p>
              <Row className="g-3">
                {benefits.map((benefit, index) => (
                  <Col sm={6} key={index}>
                    <div className="d-flex align-items-start gap-3 mb-3">
                      <div className="modern-families-icon d-flex align-items-center justify-content-center">
                        {benefit.icon}
                      </div>
                      <div>
                        <h5 className="fw-bold mb-1">{benefit.title}</h5>
                        <p className="text-muted mb-0 small">{benefit.description}</p>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </motion.div>
          </Col>
          <Col lg={6} md={10} className="text-center">
          <motion.div
        className="modern-families-image-wrapper"
  initial={{ opacity: 0, x: -50 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true, amount: 0.5 }}
  transition={{ duration: 0.8, delay: 0.2 }}
>
  <img
    src={heroimg1}
    alt="Family Preview"
    className="modern-families-image"
  />
</motion.div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default ModernFamiliesSection; 