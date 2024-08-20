import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { TrackingProvider } from "@/contexts/Tracking";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <TrackingProvider>
        <NavBar />
        <Component {...pageProps} />
      </TrackingProvider>
      <Footer />
    </>
  );
}
