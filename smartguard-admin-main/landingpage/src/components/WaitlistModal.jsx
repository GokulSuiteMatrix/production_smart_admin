import { useState } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";
import { Mail } from "lucide-react";

function WaitlistModal({ show, onHide }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    const { data, error } = await supabase.from("waitlist").insert([{ email }]);
    if (error) {
      setError("This email address is already on our waitlist. We'll keep you updated!");
    } else {
      setMessage("Thank you for joining! You're on the waitlist.");
      setEmail("");
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <Modal
          show={show}
          onHide={onHide}
          centered
          backdrop="static"
          keyboard={false}
          dialogClassName="waitlist-modal-dialog"
          contentClassName="waitlist-modal-content"
          as={motion.div}
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.95 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Join Our Waitlist</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="mb-4 text-secondary">
              Get the latest updates and be the first to know when SprouNest launches!
            </p>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="modalEmail" className="mb-4 position-relative">
                <Mail className="waitlist-input-icon" />
                <Form.Control
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  size="lg"
                  className="waitlist-input"
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="waitlist-button w-100" disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
                Join Waitlist
              </Button>
            </Form>
            <div className="waitlist-messages mt-4">
              {message && <Alert variant="success">{message}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
            </div>
          </Modal.Body>
        </Modal>
      )}
    </AnimatePresence>
  );
}

export default WaitlistModal; 