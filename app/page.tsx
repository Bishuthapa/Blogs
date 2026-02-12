import UnderDevelopment from "@/components/under-construction";

export default function Welcome() {

  const isLive = true;
  

  return isLive  ? <p>Landing Page</p> : <UnderDevelopment />;
}


