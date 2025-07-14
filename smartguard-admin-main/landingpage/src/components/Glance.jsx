import React from "react";
import "./glance.css";
import Glancevideo from '../assets/images/Glance.mp4'; 

const Glance = () => {
  return (
    <div className="glance-wrapper">
      <div className="glance-left">
        <div className="glance-freeform-bg"></div>
        <h3 className="glance-left-title">Experience Parental Control in Real Time</h3>
        <video className="glance-video" src={Glancevideo} autoPlay loop muted />
      </div>
      <div className="glance-right glance-right-alt">
        <h2 className="glance-title-alt">Smart Parental Controls for Peace of Mind</h2>
        <p className="glance-desc-alt">
          Take charge of your child's digital world with intuitive tools that help you set healthy boundaries, monitor activity, and encourage safe, balanced screen time—all from one easy dashboard.
        </p>
        <ul className="glance-feature-list">
          <li>
            <span className="glance-feature-icon" role="img" aria-label="Live Monitoring">👀</span>
            <div>
              <strong>Live Activity Monitoring</strong><br />
              Instantly view your child's device usage and online activity in real time.
            </div>
          </li>
          <li>
            <span className="glance-feature-icon" role="img" aria-label="Time Limits">⏳</span>
            <div>
              <strong>Custom Time Limits</strong><br />
              Set daily or weekly screen time limits to promote healthy digital habits.
            </div>
          </li>
          <li>
            <span className="glance-feature-icon" role="img" aria-label="Safe Browsing">🛡️</span>
            <div>
              <strong>Safe Browsing Filters</strong><br />
              Automatically block inappropriate websites and content for safer browsing.
            </div>
          </li>
          <li>
            <span className="glance-feature-icon" role="img" aria-label="App Management">📱</span>
            <div>
              <strong>App & Game Management</strong><br />
              Approve, block, or set limits on specific apps and games with a single tap.
            </div>
          </li>
          <li>
            <span className="glance-feature-icon" role="img" aria-label="Instant Alerts">🔔</span>
            <div>
              <strong>Instant Alerts & Reports</strong><br />
              Receive notifications and detailed reports about your child's digital activity.
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Glance;
