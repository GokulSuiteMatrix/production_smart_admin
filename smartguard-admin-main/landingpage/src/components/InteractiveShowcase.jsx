import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { ShieldAlert, Moon, SmartphoneNfc, ShieldOff, BrainCircuit, KeyRound, UserX, GraduationCap, Gamepad2, Scale, ChevronDown } from 'lucide-react';
import './InteractiveShowcase.css';

const concerns = [
  { id: 1, icon: <ShieldAlert size={24} />, title: 'Cyberbullying', desc: 'Help your child avoid and report online bullying, and foster a safe digital environment.' },
  { id: 2, icon: <KeyRound size={24} />, title: 'Online Privacy', desc: 'Teach your child about privacy settings and how to protect their personal information online.' },
  { id: 3, icon: <Moon size={24} />, title: 'Sleep Problems', desc: 'Set healthy device limits to ensure your child gets enough rest and quality sleep.' },
  { id: 4, icon: <UserX size={24} />, title: 'Online Predators', desc: 'Monitor online interactions and educate your child about the risks of talking to strangers.' },
  { id: 5, icon: <SmartphoneNfc size={24} />, title: 'Online Addiction', desc: 'Encourage balanced device use and help your child develop healthy digital habits.' },
  { id: 6, icon: <GraduationCap size={24} />, title: 'Education Issues', desc: 'Support your child\'s learning by managing distractions and promoting educational content.' },
  { id: 7, icon: <ShieldOff size={24} />, title: 'Inappropriate Content', desc: 'Block harmful websites and apps to keep your child safe from inappropriate material.' },
  { id: 8, icon: <Gamepad2 size={24} />, title: 'Gaming Addiction', desc: 'Set time limits and monitor gaming activity to prevent excessive play.' },
  { id: 9, icon: <BrainCircuit size={24} />, title: 'Mental Health Problems', desc: 'Watch for signs of digital stress and support your child\'s emotional well-being.' },
  { id: 10, icon: <Scale size={24} />, title: 'Online | Offline Balance', desc: 'Promote a healthy balance between screen time and real-world activities.' },
];

const InteractiveShowcase = ({ gifSrc }) => {
  const [openConcernId, setOpenConcernId] = useState(null);

  const handleConcernClick = (id) => {
    setOpenConcernId(openConcernId === id ? null : id);
  };

  return (
    <section className="concerns-section">
      <Container>
        <div className="concerns-title-block">
          <h2 className="concerns-title">
            What worries you most about your child's <span className="gradientt-text">digital life ?</span>
          </h2>
          <p>
            Explore the top concerns parents face today and see how SprouNest can help you protect and empower your family online.
          </p>
        </div>
        <Row className="align-items-center mt-5">
          <Col lg={5} className="d-none d-lg-block">
            <div className="concerns-visual-wrapper">
              <img src={gifSrc} alt="SprouNest App Showcase" className="concerns-gif" />
            </div>
          </Col>
          <Col lg={7}>
            <div className="concerns-grid">
              {concerns.map((concern) => (
                <div key={concern.id} className={`concern-card${openConcernId === concern.id ? ' open' : ''}`}>
                  <button type="button" className="concern-card-content" onClick={() => handleConcernClick(concern.id)}>
                    {concern.icon}
                    <span className="concern-card-title">{concern.title}</span>
                    <ChevronDown size={20} className="concern-card-arrow" />
                  </button>
                  {openConcernId === concern.id && (
                    <div className="concern-card-desc">{concern.desc}</div>
                  )}
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default InteractiveShowcase; 