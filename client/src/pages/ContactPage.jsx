import React, { useState } from 'react';
import styled from 'styled-components';
import { Container, Button, FormGroup } from '../styles/CommonStyles';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 2rem 0;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  h1 {
    font-size: 2.5rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.1rem;
    color: var(--dark-gray);
    max-width: 700px;
    margin: 0 auto;
    line-height: 1.6;
  }
`;

const ContactSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 4rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const ContactForm = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: var(--card-shadow);
  padding: 2.5rem;
  
  h2 {
    color: var(--primary-color);
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
  }
`;

const ContactInfo = styled.div`
  h2 {
    color: var(--primary-color);
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
  }
`;

const InfoItem = styled.div`
  margin-bottom: 2rem;
  
  h3 {
    font-size: 1.2rem;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
  }
  
  p, a {
    font-size: 1.1rem;
    color: var(--dark-gray);
    line-height: 1.6;
    text-decoration: none;
  }
  
  a:hover {
    color: var(--primary-color);
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const SocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: ${props => props.bg || 'var(--primary-color)'};
  color: white;
  border-radius: 50%;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const FaqSection = styled.section`
  background-color: var(--light-gray);
  padding: 4rem 0;
  margin-top: 3rem;
`;

const FaqContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const FaqItem = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: var(--card-shadow);
  
  h3 {
    font-size: 1.2rem;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    &:after {
      content: ${props => props.open ? '"−"' : '"+"'};
      font-weight: bold;
    }
  }
  
  p {
    color: var(--dark-gray);
    line-height: 1.6;
    margin-top: ${props => props.open ? '1rem' : '0'};
    max-height: ${props => props.open ? '1000px' : '0'};
    overflow: hidden;
    transition: all 0.3s ease;
  }
`;

const SuccessMessage = styled.div`
  background-color: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 1.5rem;
`;

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    console.log('Form submitted:', formData);

    // Show success message and reset form
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });

    // Hide success message after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I enroll in a course?",
      answer: "To enroll in a course, simply navigate to the course page and click the 'Enroll Now' button. If you're not already logged in, you'll be prompted to do so. Once enrolled, you'll have immediate access to the course content."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for course payments. All transactions are secure and encrypted."
    },
    {
      question: "Can I get a refund if I'm not satisfied?",
      answer: "Yes, we offer a 30-day money-back guarantee for all our courses. If you're not completely satisfied, contact our support team within 30 days of your purchase for a full refund."
    },
    {
      question: "Do I get a certificate after completing a course?",
      answer: "Yes! Upon completing all the required modules of a course, you'll receive a downloadable certificate of completion that you can add to your portfolio or LinkedIn profile."
    },
    {
      question: "How long do I have access to a course after purchasing?",
      answer: "Once you purchase a course, you have lifetime access to its content. You can revisit the materials whenever you need to refresh your knowledge."
    }
  ];

  return (
    <PageContainer>
      <Container>
        <PageHeader>
          <h1>Get In Touch</h1>
          <p>Have questions about our courses or need help with your entrepreneurial journey? We're here to help!</p>
        </PageHeader>

        <ContactSection>
          <ContactForm>
            <h2>Send Us a Message</h2>

            {submitted && (
              <SuccessMessage>
                Thank you for your message! We'll get back to you as soon as possible.
              </SuccessMessage>
            )}

            <form onSubmit={handleSubmit}>
              <FormGroup>
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </FormGroup>

              <FormGroup>
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email address"
                />
              </FormGroup>

              <FormGroup>
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="What is this regarding?"
                />
              </FormGroup>

              <FormGroup>
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="How can we help you?"
                  rows="5"
                />
              </FormGroup>

              <Button type="submit" primary fullWidth>
                Send Message
              </Button>
            </form>
          </ContactForm>

          <ContactInfo>
            <h2>Contact Information</h2>

            <InfoItem>
              <h3>Email Us</h3>
              <p><a href="mailto:info@entrepreneurhub.com">info@entrepreneurhub.com</a></p>
            </InfoItem>

            <InfoItem>
              <h3>Call Us</h3>
              <p><a href="tel:+1234567890">+1 (234) 567-890</a></p>
            </InfoItem>

            <InfoItem>
              <h3>Visit Us</h3>
              <p>123 Innovation Street<br />
                Tech District, CA 94103<br />
                United States</p>
            </InfoItem>

            <InfoItem>
              <h3>Office Hours</h3>
              <p>Monday - Friday: 9:00 AM - 6:00 PM<br />
                Saturday: 10:00 AM - 2:00 PM<br />
                Sunday: Closed</p>
            </InfoItem>

            <h3>Follow Us</h3>
            <SocialLinks>
              <SocialLink href="#" bg="#1877F2" aria-label="Facebook">f</SocialLink>
              <SocialLink href="#" bg="#1DA1F2" aria-label="Twitter">t</SocialLink>
              <SocialLink href="#" bg="#E4405F" aria-label="Instagram">i</SocialLink>
              <SocialLink href="#" bg="#0A66C2" aria-label="LinkedIn">in</SocialLink>
            </SocialLinks>
          </ContactInfo>
        </ContactSection>
      </Container>

      <FaqSection>
        <Container>
          <PageHeader>
            <h1>Frequently Asked Questions</h1>
            <p>Find quick answers to common questions about our platform and courses.</p>
          </PageHeader>

          <FaqContainer>
            {faqs.map((faq, index) => (
              <FaqItem key={index} open={activeFaq === index}>
                <h3 onClick={() => toggleFaq(index)}>{faq.question}</h3>
                <p>{faq.answer}</p>
              </FaqItem>
            ))}
          </FaqContainer>
        </Container>
      </FaqSection>
    </PageContainer>
  );
};

export default ContactPage;
