import { motion, useScroll, useSpring } from "framer-motion";
import HeroSection from "./components/HeroSection"
import InteractiveShowcase from "./components/InteractiveShowcase";
// import FeaturesSection from "./components/FeaturesSection"
import CalloutSection from "./components/CalloutSection"
import StepsSection from "./components/StepsSection"
import DiscoverSection from "./components/DiscoverSection"
import ModernFamiliesSection from "./components/ModernFamiliesSection"
import Footer from "./components/Footer"
import showcaseGif from '../src/assets/images/family.gif';
import Glance from './components/Glance';


function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <>
      <motion.div className="scroll-progress-bar" style={{ scaleX }} />
  
      <HeroSection />
      <InteractiveShowcase gifSrc={showcaseGif} />
      <ModernFamiliesSection />
      {/* <FeaturesSection /> */}
      <Glance />
      <CalloutSection />
      {/* <DiscoverSection /> */}
      
      <StepsSection />
      <Footer />
      
    </>
  )
}

export default App
