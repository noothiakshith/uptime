import Image from "next/image";
import AppBar from "./components/AppBar";
import WebsiteMonitor from "@/lib/WebsiteMonitor";

export default function Home() {
  return (
  <>
  <AppBar/>
  <WebsiteMonitor/>
  </>
  );
}
