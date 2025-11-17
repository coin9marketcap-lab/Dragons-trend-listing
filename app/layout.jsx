import "../styles/globals.css";

export const metadata = {
  title: "Dragons Trending - Memecoin Listings",
  description: "Premium listings, voting, leaderboard, Dexscreener embeds."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="appShell">
          <header className="siteHeader">
            <div className="headerInner">
              <div className="brand">
                <img src="/logo.png" alt="Dragonstrend" className="brandLogo"/>
                <div>
                  <h1>Dragons Trending</h1>
                  <div className="brandSub">Memecoin Listings • Submit • Vote • Trending</div>
                </div>
              </div>
              <nav>
                <a className="navBtn" href="/submit">Submit</a>
                <a className="navBtn" href="/admin">Admin</a>
                <a className="navBtn" href="https://t.me/dragonstrending" target="_blank" rel="noreferrer">Channel</a>
              </nav>
            </div>
          </header>

          <main>{children}</main>

          <footer style={{marginTop:40}}>
            <div className="footerInner">
              <div>
                <img src="/logo.png" alt="logo" style={{height:44}}/>
                <div>© {new Date().getFullYear()} Dragons Trending</div>
              </div>

              <div className="footerCols">
                <div>
                  <h4>Social</h4>
                  <a href="https://t.me/dragonstrending">Telegram Channel</a>
                  <a href="https://t.me/Dragonstrend">Telegram Group</a>
                  <a href="https://x.com/Dragonstrend">Twitter / X</a>
                  <a href="https://www.youtube.com/@DragonsTrending">YouTube</a>
                  <a href="https://discord.gg/6EQ6vTT4E6">Discord</a>
                  <a href="https://linktr.ee/dragonstrend">Linktree</a>
                </div>

                <div>
                  <h4>Bots</h4>
                  <a href="https://t.me/dragonsdenvote">Dragons Den Vote</a>
                  <a href="https://t.me/DragonsRaidBot">Raid Bot</a>
                  <a href="https://t.me/DragonsVoteBuy">Vote Bot</a>
                  <a href="https://t.me/DragonsTrendBot">Trend Bot</a>
                  <a href="https://t.me/DragonsBuyBot">Buy Bot</a>
                  <a href="https://t.me/DragonsRaid">Raid Bot (alt)</a>
                  <a href="https://t.me/DragonsAI">Dragon AI</a>
                  <a href="https://t.me/DragonsRaid">Raid Lounge</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
      }
