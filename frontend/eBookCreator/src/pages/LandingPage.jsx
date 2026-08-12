import React from "react";
import Navbar from '../components/layout/Navbar'
import Hero from '../components/landing/Hero'
import Testimonials from "../components/landing/TestimonialsSection";
import Footer from "../components/landing/Footer";
import Features from "../components/landing/FeaturesSection";
function LandingPage() {
  return (
    <div>
      <Navbar /> 
      <Hero/>
      <Testimonials/>
      <Features/>      
      <Footer/>      
    </div>
  );
}
export default LandingPage;