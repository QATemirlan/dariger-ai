import AnnouncementBar from "@/components/landing/AnnouncementBar";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import TrustStrip from "@/components/landing/TrustStrip";
import Problem from "@/components/landing/Problem";
import PlatformLayers from "@/components/landing/PlatformLayers";
import ScrollStory from "@/components/landing/ScrollStory";
import ConsultAssistant from "@/components/landing/ConsultAssistant";
import Deployment from "@/components/landing/Deployment";
import Products from "@/components/landing/Products";
import BigNumber from "@/components/landing/BigNumber";
import RevenueCalculator from "@/components/landing/RevenueCalculator";
import CommunicationQuality from "@/components/landing/CommunicationQuality";
import InsuranceOsms from "@/components/landing/InsuranceOsms";
import KzSpecifics from "@/components/landing/KzSpecifics";
import Personas from "@/components/landing/Personas";
import Security from "@/components/landing/Security";
import FaqCta from "@/components/landing/FaqCta";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="overflow-x-clip bg-paper text-ink">
      <AnnouncementBar />
      <Header />
      <Hero />
      <TrustStrip />
      <Problem />
      <PlatformLayers />
      <ScrollStory />
      <ConsultAssistant />
      <Deployment />
      <Products />
      <BigNumber />
      <RevenueCalculator />
      <CommunicationQuality />
      <InsuranceOsms />
      <KzSpecifics />
      <Personas />
      <Security />
      <FaqCta />
      <Footer />
    </main>
  );
}
