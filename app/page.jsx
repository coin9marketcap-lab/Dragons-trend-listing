import PremiumTicker from "./components/PremiumTicker";
import Leaderboard from "./components/Leaderboard";
import ProjectsBoard from "./components/ProjectsBoard";

export default async function Page() {
  return (
    <>
      <PremiumTicker />
      <div style={{maxWidth:1200, margin:"24px auto 0", padding:"0 20px"}}>
        <Leaderboard />
        <ProjectsBoard />
      </div>
    </>
  );
}
