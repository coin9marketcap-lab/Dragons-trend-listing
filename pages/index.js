import { useEffect, useState, useRef } from "react";

/*
  Dragonstrend Listing - Single-file page for main UI
  - Uses localStorage for persistence
  - Logo from https://ibb.co/3Y0wy0M3
*/

const SITE_LOGO = "https://i.ibb.co/3Y0wy0M3/logo.png"; // We'll replace actual link by using the user's provided link in the img tag below.

const FOOTER_LINKS = {
  telegramChannel: "https://t.me/dragonstrending",
  telegramGroup: "https://t.me/Dragonstrend",
  twitter: "https://x.com/Dragonstrend",
  youtube: "https://www.youtube.com/@DragonsTrending",
  discord: "https://discord.gg/6EQ6vTT4E6",
  linktree: "https://linktr.ee/dragonstrend",
  dragonsDenVote: "https://t.me/dragonsdenvote",
  raidBot: "https://t.me/DragonsRaidBot",
  voteBot: "https://t.me/DragonsVoteBuy",
  trendBot: "https://t.me/DragonsTrendBot",
  buyBot: "https://t.me/DragonsBuyBot",
  raidBotAlt: "https://t.me/DragonsRaid",
  dragonAI: "https://t.me/DragonsAI",
  raidLounge: "https://t.me/DragonsRaid"
};

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function saveListings(listings){
  localStorage.setItem("dt_listings", JSON.stringify(listings));
}
function loadListings(){
  try{
    return JSON.parse(localStorage.getItem("dt_listings") || "[]");
  }catch(e){ return [] }
}

function saveVotes(votes){
  localStorage.setItem("dt_votes", JSON.stringify(votes));
}
function loadVotes(){
  try{ return JSON.parse(localStorage.getItem("dt_votes") || "{}"); }catch(e){return {}}
}

function nowUTCSeconds(){ return Math.floor(Date.now() / 1000); }

export default function Home() {
  // app state
  const [listings, setListings] = useState([]);
  const [votes, setVotes] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    type: "basic",
    name: "",
    symbol: "",
    chain: "SOL",
    contract: "",
    description: "",
    website: "",
    logoBase64: "",
    socialLinks: {}
  });
  const [statusMsg, setStatusMsg] = useState("");
  const [txCheckLoading, setTxCheckLoading] = useState(false);
  const [txCheckResult, setTxCheckResult] = useState(null);
  const [countdownStart, setCountdownStart] = useState(() => {
    const t = localStorage.getItem("dt_countdown_start");
    return t ? parseInt(t, 10) : nowUTCSeconds();
  });

  const marqueeRef = useRef();

  useEffect(() => {
    const ls = loadListings();
    setListings(ls);
    const vs = loadVotes();
    setVotes(vs);

    // ensure countdownStart saved
    localStorage.setItem("dt_countdown_start", String(countdownStart));
  }, []);

  useEffect(() => {
    saveListings(listings);
  }, [listings]);

  useEffect(() => {
    saveVotes(votes);
  }, [votes]);

  // --- listing operations ---
  function handleUploadLogo(e){
    const file = e.target.files?.[0];
    if(!file) return;
    const allowed = ["image/png","image/jpeg","image/webp","image/svg+xml"];
    if(!allowed.includes(file.type)) {
      alert("Allowed: PNG/JPG/WebP/SVG");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setForm({...form, logoBase64: reader.result});
    };
    reader.readAsDataURL(file);
  }

  function submitListing(e){
    e.preventDefault();
    // validation
    if(!form.name || !form.symbol || !form.logoBase64){
      setStatusMsg("Please provide name, symbol and upload a logo (no URL).");
      return;
    }
    if(form.type === "basic"){
      if(!form.joined1 || !form.joined2){
        setStatusMsg("You must confirm joining both Telegram groups before submitting a Basic listing.");
        return;
      }
    }

    const newL = {
      id: uid(),
      ...form,
      createdAt: nowUTCSeconds(),
      status: form.type === "premium" ? "pending_payment" : "pending_admin",
      votes: 0,
      premium: form.type === "premium"
    };
    const next = [newL, ...listings];
    setListings(next);
    setStatusMsg("Listing submitted. If premium, please submit your TXID to verify payment.");
    setForm({
      type: "basic",
      name: "",
      symbol: "",
      chain: "SOL",
      contract: "",
      description: "",
      website: "",
      logoBase64: "",
      socialLinks: {}
    });
    setShowForm(false);
  }

  // admin functions simple in-UI (no auth)
  function approveListing(id){
    setListings(listings.map(l => l.id === id ? {...l, status: "approved"} : l));
  }
  function rejectListing(id){
    setListings(listings.map(l => l.id === id ? {...l, status: "rejected"} : l));
  }
  function markPremium(id){
    setListings(listings.map(l => l.id === id ? {...l, premium: true} : l));
  }

  // Tx check route
  async function verifyTx(txid, chain){
    setTxCheckLoading(true);
    setTxCheckResult(null);
    try{
      const res = await fetch("/api/verify-tx", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({txid, chain})
      });
      const payload = await res.json();
      setTxCheckResult(payload);
      if(payload?.status === "confirmed" && payload?.listingId){
        // auto approve that listing
        setListings(listings.map(l => l.id === payload.listingId ? {...l, status:"approved", premium:true} : l));
      }
    }catch(e){
      setTxCheckResult({status:"error", message: String(e)});
    }finally{
      setTxCheckLoading(false);
    }
  }

  // allow user to attach tx to a premium listing
  function submitTxForListing(listingId, txid, chain){
    // call verify
    verifyTx(txid, chain);
    // store mapping locally so verify endpoint can optionally use it
    localStorage.setItem("dt_pending_tx_"+txid, listingId);
    setStatusMsg("Submitted TXID for verification. If you have ETHERSCAN_API_KEY it will be checked automatically.");
  }

  // voting
  function upvote(listingId){
    // prevent double vote from same browser within 24h
    const key = `dt_voted_${listingId}`;
    const prev = parseInt(localStorage.getItem(key) || "0", 10);
    const now = Date.now();
    if(prev && now - prev < 24 * 3600 * 1000){
      alert("You already voted for this project in the last 24 hours from this browser.");
      return;
    }
    localStorage.setItem(key, String(now));
    // increment displayed vote (local)
    setListings(listings.map(l => l.id === listingId ? {...l, votes: (l.votes||0) + 1} : l));
    // update global votes store for leaderboard
    const nextVotes = {...votes};
    nextVotes[listingId] = (nextVotes[listingId] || 0) + 1;
    setVotes(nextVotes);
    setStatusMsg("Vote recorded (client-side).");
  }

  // leaderboard selection - top 2 by votes
  function topTwo(){
    const approved = listings.filter(l => l.status === "approved");
    const sorted = [...approved].sort((a,b) => (b.votes || 0) - (a.votes || 0));
    return sorted.slice(0,2);
  }

  // countdown
  const [nowTick, setNowTick] = useState(Date.now());
  useEffect(()=>{
    const t = setInterval(()=> setNowTick(Date.now()), 1000);
    return ()=> clearInterval(t);
  },[]);

  function secondsUntilNextReset(){
    // resets every 24 hours relative to countdownStart
    const start = countdownStart * 1000;
    const elapsed = (Date.now() - start) % (24*3600*1000);
    const remain = 24*3600*1000 - elapsed;
    return Math.floor(remain / 1000);
  }

  function formatTime(sec){
    const h = Math.floor(sec/3600).toString().padStart(2,"0");
    const m = Math.floor((sec%3600)/60).toString().padStart(2,"0");
    const s = (sec%60).toString().padStart(2,"0");
    return `${h}:${m}:${s}`;
  }

  // convenience lists
  const premiumList = listings.filter(l => l.premium && l.status === "approved");
  const basicList = listings.filter(l => !l.premium && l.status === "approved");
  const pendingList = listings.filter(l => l.status !== "approved");

  // Dexscreener embed - placeholder: allow user to input chart link in a modal? For now show a sample iframe area that can host dexscreener
  const dexscreenerSample = "https://dexscreener.com/solana/..."

  return (
    <div className="page">
      <header className="header">
        <div className="brand">
          <img src="https://ibb.co/3Y0wy0M3" alt="Dragonstrend logo" className="logo" />
          <div>
            <h1>Dragons Trending</h1>
            <div className="tag">Memecoin Listings • Submit • Vote • Trending</div>
          </div>
        </div>

        <nav className="nav">
          <button onClick={()=> setShowForm(true)} className="btn">Submit Listing</button>
          <a className="btn ghost" href={FOOTER_LINKS.telegramChannel} target="_blank" rel="noreferrer">Join Channel</a>
        </nav>
      </header>

      <main className="main">
        {/* HERO */}
        <section className="hero">
          <div className="hero-left">
            <h2>Memecoin Listings — Dragonstrend</h2>
            <p className="lead">Discover memecoins, promote your project, and vote. Premium listing auto-approved after payment verification.</p>
            <div className="actions">
              <button className="btn primary" onClick={()=> setShowForm(true)}>Submit Project</button>
              <a className="btn ghost" href={FOOTER_LINKS.linktree} target="_blank" rel="noreferrer">Linktree</a>
            </div>
            <div className="dexpanel">
              <strong>Live Dexscreener Board</strong>
              <iframe title="dexscreener" src="https://dexscreener.com/embed/solana" style={{width:"100%",height:220,border:"none",marginTop:10}}/>
            </div>
          </div>

          <div className="hero-right">
            <div className="leaderboard">
              <h3>Top Coin Leaderboard</h3>
              <div className="sub">Today's Top Coins • Reset in <strong>{formatTime(secondsUntilNextReset())}</strong></div>

              <div className="tops">
                {(() => {
                  const top = topTwo();
                  if(top.length === 0){
                    return <div className="empty">No approved coins yet</div>;
                  }
                  return top.map((t, idx) => (
                    <div key={t.id} className="topcard">
                      <div className="left">
                        <img src={t.logoBase64} alt={t.name} className="coinlogo" />
                        <div>
                          <div className="coinname">{t.name} <small className="symbol">{t.symbol}</small></div>
                          <div className="votes">Votes: <strong>{t.votes || 0}</strong></div>
                        </div>
                      </div>
                      <div className="right">
                        <button className="btn upvote" onClick={()=> upvote(t.id)}>▲ Upvote</button>
                      </div>
                    </div>
                  ))
                })()}
              </div>

            </div>
          </div>
        </section>

        {/* Scrolling Marquee for Premium */}
        <section className="marqueeWrap">
          <div className="marquee" ref={marqueeRef}>
            <div className="marqueeInner">
              {premiumList.length === 0 ? (
                <div className="marqueeItem">No premium projects yet</div>
              ) : premiumList.map(p => (
                <div key={p.id} className="marqueeItem" onClick={()=> window.scrollTo({top:0,behavior:"smooth"})}>
                  <img src={p.logoBase64} alt={p.symbol} />
                  <span className="sym">{p.symbol}</span>
                  <span className="crown">👑</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Premium Board */}
        <section className="board">
          <h3>Premium Listings</h3>
          <div className="grid">
            {premiumList.length === 0 && <div>No premium listings</div>}
            {premiumList.map(l => (
              <div key={l.id} className="card premium">
                <div className="cardHead">
                  <div className="left">
                    <img src={l.logoBase64} alt={l.name} className="logoSmall"/>
                    <div>
                      <div className="title">{l.name} <small className="symbol">{l.symbol}</small></div>
                      <div className="chain">{l.chain}</div>
                    </div>
                  </div>
                  <div className="right">
                    <div className="crown">👑</div>
                  </div>
                </div>

                <div className="desc">{l.description}</div>
                <div className="cardFooter">
                  <a className="btn ghost" href={l.website || "#"} target="_blank" rel="noreferrer">Website</a>
                  <button className="btn" onClick={()=> upvote(l.id)}>Vote</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Basic Board */}
        <section className="board">
          <h3>Basic Listings</h3>
          <div className="grid">
            {basicList.length === 0 && <div>No basic listings</div>}
            {basicList.map(l => (
              <div key={l.id} className="card">
                <div className="cardHead">
                  <div className="left">
                    <img src={l.logoBase64} alt={l.name} className="logoSmall"/>
                    <div>
                      <div className="title">{l.name} <small className="symbol">{l.symbol}</small></div>
                      <div className="chain">{l.chain}</div>
                    </div>
                  </div>
                  <div className="right">
                    <div>{l.votes || 0} votes</div>
                  </div>
                </div>

                <div className="desc">{l.description}</div>
                <div className="cardFooter">
                  <a className="btn ghost" href={l.website || "#"} target="_blank" rel="noreferrer">Website</a>
                  <button className="btn" onClick={()=> upvote(l.id)}>Vote</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pending / Admin panel */}
        <section className="board">
          <h3>Pending Listings (Admin Panel)</h3>
          <div className="grid">
            {pendingList.length === 0 && <div>No pending items</div>}
            {pendingList.map(l => (
              <div key={l.id} className="card pending">
                <div className="cardHead">
                  <div className="left">
                    <img src={l.logoBase64} alt={l.name} className="logoSmall"/>
                    <div>
                      <div className="title">{l.name} <small className="symbol">{l.symbol}</small></div>
                      <div className="chain">{l.chain}</div>
                      <div className="muted">Status: {l.status}</div>
                    </div>
                  </div>
                </div>

                <div className="desc">{l.description}</div>

                <div style={{display:"flex",gap:10,marginTop:8}}>
                  <button className="btn" onClick={()=> approveListing(l.id)}>Approve</button>
                  <button className="btn ghost" onClick={()=> rejectListing(l.id)}>Reject</button>
                  <button className="btn ghost" onClick={()=> markPremium(l.id)}>Mark Premium</button>
                  {l.status === "pending_payment" && (
                    <div style={{marginLeft:8}}>
                      <input id={`tx-${l.id}`} placeholder="Enter TXID" style={{padding:"8px"}}/>
                      <button className="btn small" onClick={()=>{
                        const tx = document.getElementById(`tx-${l.id}`).value.trim();
                        if(tx) submitTxForListing(l.id, tx, l.chain);
                      }}>Submit TX</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footInner">
          <div className="left">
            <img src="https://ibb.co/3Y0wy0M3" alt="logo" className="logoSmall" />
            <div>© {new Date().getFullYear()} Dragons Trending</div>
          </div>

          <div className="cols">
            <div>
              <h4>Social</h4>
              <ul>
                <li><a href={FOOTER_LINKS.telegramChannel}>Telegram Channel</a></li>
                <li><a href={FOOTER_LINKS.telegramGroup}>Telegram Group</a></li>
                <li><a href={FOOTER_LINKS.twitter}>X / Twitter</a></li>
                <li><a href={FOOTER_LINKS.youtube}>YouTube</a></li>
                <li><a href={FOOTER_LINKS.discord}>Discord</a></li>
                <li><a href={FOOTER_LINKS.linktree}>Linktree</a></li>
              </ul>
            </div>
            <div>
              <h4>Bots</h4>
              <ul>
                <li><a href={FOOTER_LINKS.dragonsDenVote}>Dragons Den Vote</a></li>
                <li><a href={FOOTER_LINKS.raidBot}>Raid Bot</a></li>
                <li><a href={FOOTER_LINKS.voteBot}>Vote Bot</a></li>
                <li><a href={FOOTER_LINKS.trendBot}>Trend Bot</a></li>
                <li><a href={FOOTER_LINKS.buyBot}>Buy Bot</a></li>
                <li><a href={FOOTER_LINKS.raidBotAlt}>Raid Bot (alt)</a></li>
                <li><a href={FOOTER_LINKS.dragonAI}>Dragon AI</a></li>
                <li><a href={FOOTER_LINKS.raidLounge}>Raid Lounge</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Submission Modal */}
      {showForm && (
        <div className="modal">
          <form className="modalCard" onSubmit={submitListing}>
            <h3>Submit Listing</h3>
            <label>Type
              <select value={form.type} onChange={e=> setForm({...form, type: e.target.value})}>
                <option value="basic">Basic (Free)</option>
                <option value="premium">Premium ($150)</option>
              </select>
            </label>

            <label>Project Name
              <input value={form.name} onChange={e=> setForm({...form, name: e.target.value})} />
            </label>

            <label>Symbol
              <input value={form.symbol} onChange={e=> setForm({...form, symbol: e.target.value})} />
            </label>

            <label>Chain
              <select value={form.chain} onChange={e=> setForm({...form, chain: e.target.value})}>
                <option>SOL</option>
                <option>ETH</option>
                <option>BSC</option>
                <option>TON</option>
              </select>
            </label>

            <label>Contract Address
              <input value={form.contract} onChange={e=> setForm({...form, contract: e.target.value})} />
            </label>

            <label>Website
              <input value={form.website} onChange={e=> setForm({...form, website: e.target.value})} />
            </label>

            <label>Description
              <textarea value={form.description} onChange={e=> setForm({...form, description: e.target.value})} />
            </label>

            <label>Upload Logo (PNG/JPG/WebP/SVG) — NO URL
              <input type="file" accept="image/*" onChange={handleUploadLogo} />
              {form.logoBase64 && <img src={form.logoBase64} style={{height:60,marginTop:6}}/>}
            </label>

            {form.type === "basic" && (
              <>
                <label><input type="checkbox" checked={form.joined1||false} onChange={e=> setForm({...form, joined1: e.target.checked})} /> I joined @Dragonstrend</label>
                <label><input type="checkbox" checked={form.joined2||false} onChange={e=> setForm({...form, joined2: e.target.checked})} /> I joined @dragonstrending</label>
              </>
            )}

            {form.type === "premium" && (
              <>
                <div className="note">Premium listing costs $150. Available wallets shown after submission. After paying, submit TXID on the pending item. Auto-approved when tx confirmed.</div>
              </>
            )}

            <div style={{display:"flex",gap:10,marginTop:10}}>
              <button type="submit" className="btn">Submit</button>
              <button type="button" onClick={()=> setShowForm(false)} className="btn ghost">Cancel</button>
            </div>

            <div className="muted" style={{marginTop:8}}>{statusMsg}</div>
          </form>
        </div>
      )}

      <style jsx>{`
        /* basic layout + styling — keep this simple & modern */
        :root{
          --bg:#0b0b0f;
          --card:#0f1116;
          --muted:#9aa0a6;
          --accent:#ff6a4d;
          --glass: rgba(255,255,255,0.04);
        }
        .page{ min-height:100vh; background: radial-gradient(ellipse at top left, rgba(255,106,77,0.07), transparent 20%), linear-gradient(180deg,#040406 0%, #071018 100%); color:#e6eef8; font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
        .header{ display:flex; justify-content:space-between; align-items:center; padding:18px 36px; backdrop-filter: blur(6px); }
        .brand{ display:flex; gap:14px; align-items:center; }
        .logo{ width:64px; height:64px; border-radius:12px; object-fit:cover; border:2px solid rgba(255,255,255,0.06); }
        .nav{ display:flex; gap:10px; align-items:center; }
        .btn{ background:linear-gradient(90deg, rgba(255,106,77,0.12), rgba(255,106,77,0.06)); border:1px solid rgba(255,255,255,0.04); padding:8px 12px; border-radius:10px; color:inherit; cursor:pointer; }
        .btn.primary{ background: linear-gradient(90deg,#ff8f6c,#ff5f3a); color:#08111a; font-weight:700; }
        .btn.ghost{ background:transparent; border:1px dashed rgba(255,255,255,0.04); }
        .main{ padding:20px 36px 80px; display:flex; flex-direction:column; gap:22px; }
        .hero{ display:flex; gap:20px; align-items:flex-start; }
        .hero-left{ flex:1; }
        .hero-right{ width:420px; }
        .lead{ color:var(--muted); margin-top:6px; }
        .dexpanel{ margin-top:12px; background:var(--card); padding:10px; border-radius:10px; box-shadow:0 6px 20px rgba(0,0,0,0.6); }
        .leaderboard{ background: linear-gradient(180deg, rgba(255,255,255,0.02), transparent); padding:12px; border-radius:12px; }
        .tops{ margin-top:8px; display:flex; flex-direction:column; gap:8px; }
        .topcard{ display:flex; justify-content:space-between; align-items:center; background:var(--card); padding:10px; border-radius:10px; box-shadow:0 6px 18px rgba(0,0,0,0.6); }
        .coinlogo{ width:40px; height:40px; border-radius:50%; object-fit:cover; margin-right:10px; }
        .marqueeWrap{ padding:8px 0; }
        .marquee{ overflow:hidden; background: rgba(255,255,255,0.02); border-radius:10px; padding:8px; }
        .marqueeInner{ display:flex; gap:16px; animation: marquee 18s linear infinite; align-items:center; }
        .marquee:hover .marqueeInner{ animationPlayState: paused; }
        .marqueeItem{ display:flex; gap:8px; align-items:center; padding:6px 10px; background:rgba(255,255,255,0.02); border-radius:10px; cursor:pointer; }
        .marqueeItem img{ width:28px; height:28px; border-radius:50%; object-fit:cover; }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        .board{ background:transparent; }
        .grid{ display:grid; grid-template-columns: repeat(auto-fill,minmax(260px,1fr)); gap:12px; margin-top:10px; }
        .card{ background:var(--card); padding:10px; border-radius:12px; box-shadow: 0 8px 26px rgba(4,6,10,0.6); }
        .card.premium{ border: 1px solid rgba(255,200,50,0.18); box-shadow:0 10px 30px rgba(255,140,70,0.06); }
        .cardHead{ display:flex; justify-content:space-between; }
        .logoSmall{ width:48px; height:48px; border-radius:10px; object-fit:cover; }
        .title{ font-weight:700; }
        .symbol{ color:var(--muted); margin-left:6px; font-size:12px; }
        .desc{ margin-top:8px; color:var(--muted); min-height:48px; }
        .cardFooter{ display:flex; gap:8px; margin-top:10px; }

        .footer{ position:fixed; left:0; right:0; bottom:0; background: linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0.85)); padding:12px 20px; border-top:1px solid rgba(255,255,255,0.02); }
        .footInner{ display:flex; justify-content:space-between; align-items:flex-start; gap:20px; max-width:1200px; margin:0 auto; }
        .cols{ display:flex; gap:20px; }
        .cols h4{ margin-bottom:6px; }
        .cols ul{ list-style:none; padding:0; margin:0; color:var(--muted); }
        .cols li{ margin-bottom:6px; }

        .modal{ position:fixed; inset:0; background: rgba(2,2,6,0.6); display:flex; align-items:center; justify-content:center; z-index:40; }
        .modalCard{ background: linear-gradient(180deg, #0f1116, #0b0b0f); padding:18px; border-radius:12px; width:680px; max-width:96%; color:inherit; }
        label{ display:block; margin-top:8px; font-size:14px; color:var(--muted); }
        input, textarea, select{ width:100%; padding:8px; margin-top:6px; border-radius:8px; background:transparent; border:1px solid rgba(255,255,255,0.04); color:inherit; }
        .muted{ color:var(--muted); margin-top:6px; font-size:13px; }
        .note{ background: rgba(255,255,255,0.02); padding:8px; border-radius:8px; margin-top:6px; color:var(--muted); }

        .small{ padding:6px 8px; font-size:13px; }
      `}</style>
    </div>
  );
  }
