import { Container, Row, Col } from "react-bootstrap";
import { AppWindow, BarChart3, Megaphone, ShieldCheck, BellRing, Cpu } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import React from "react";

const features = [
  {
    icon: <AppWindow size={32} />,
    title: "Easy-to-Use Interface",
    description: "Intuitive design that makes screen time management simple for the whole family.",
    color: "#3b82f6"
  },
  {
    icon: <ShieldCheck size={32} />,
    title: "Advanced Security",
    description: "Keep your children safe online with comprehensive content filtering and monitoring.",
    color: "#10b981"
  },
  {
    icon: <Megaphone size={32} />,
    title: "Family Communication",
    description: "Stay connected with your family through built-in messaging and activity sharing.",
    color: "#f59e0b"
  },
  {
    icon: <Cpu size={32} />,
    title: "Multi-Device & Multi-Child Support",
    description: "Manage all your children and their devices from one central dashboard, whether they're on Android, iOS, or tablets.",
    color: "#8b5cf6"
  }
];

const TiltCard = ({ children, index }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 100, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 100, damping: 20 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true, amount: 0.3 }}
      className="discover-feature-card h-100"
    >
      <div style={{ transform: "translateZ(40px)"}}>
        {children}
      </div>
    </motion.div>
  );
};

function DiscoverSection() {
  return (
    <section className="discover-section py-5">
      <Container>
        <motion.h2
          className="text-center display-5 fw-bold mb-5"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, type: "spring" }}
        >
          Discover Why SprouNest is Loved by Parents
        </motion.h2>
        
        <Row className="g-4">
          {features.map((feature, index) => (
            <Col lg={3} md={6} key={index}>
              <TiltCard index={index}>
                <div className="discover-icon-wrapper" style={{ backgroundColor: feature.color, transform: 'translateZ(20px)' }}>
                  {feature.icon}
                </div>
                <h5 className="fw-bold mt-4 mb-3" style={{ transform: 'translateZ(20px)' }}>{feature.title}</h5>
                <p style={{ transform: 'translateZ(20px)' }}>{feature.description}</p>
              </TiltCard>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default DiscoverSection; 