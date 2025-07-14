import React from 'react';
import './StepsSection.css';

import step1 from '../assets/images/image1.jpg'; 
import step2 from '../assets/images/image2.jpg';
import step3 from '../assets/images/image3.jpg';

const steps = [
  {
    id: 1,
    title: 'Download and Install',
    description: 'Get started by downloading the SpourNest Parental Control app directly onto your own device.',
    linkText: 'SpourNest Parental Control',
    image: step1,
  },
  {
    id: 2,
    title: 'Sign Up and Sign In',
    description: 'Create your secure SpourNest account and log in to unlock all parental features.',
    linkText: null,
    image: step2,
  },
  {
    id: 3,
    title: 'Bind Child\'s Device',
    description: 'On your child\'s phone, install SpourNest Kids and simply enter the unique code to link both devices for seamless monitoring.',
    linkText: 'SpourNest Kids',
    image: step3,
  },
];

function StepsSection() {
  return (
    <section className="steps-section">
      <h2 className="steps-title">Complete Family Protection in 3 Easy Steps</h2>
      <div className="steps-grid">
        {steps.map((step) => (
          <div className="step-card" key={step.id}>
            <div className="step-number">{step.id}</div>
            <img src={step.image} alt={`Step ${step.id}`} className="step-image" />
            <h3 className="step-heading">{step.title}</h3>
            <p className="step-description">
              {step.linkText ? (
                <>
                  Download <a href="#">{step.linkText}</a> on the parent's phone.
                </>
              ) : (
                step.description
              )}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default StepsSection;
