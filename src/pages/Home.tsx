/**
 * Home — entry route for the public homepage.
 * Delegates to HomeContainer which orchestrates all CMS reads.
 * Keeps the route file thin and predictable for future SEO/route additions.
 */
import HomeContainer from "@/containers/HomeContainer";

export default function Home() {
  return <HomeContainer />;
}
