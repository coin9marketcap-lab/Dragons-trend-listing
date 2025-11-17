import { useEffect, useState } from "react";

export default function ProjectPage({ params }) {
  const id = params.id;
  const [proj, setProj] = useState(null);

  useEffect(()=> {
    fetch(`/api/project/${id}`).then(r=>r.json()).then(j=>{
      if (j.project) setProj(j.project);
    });
  }, [id]);

  if (!proj) return <div style={{maxWidth:920, margin:"24px auto"}}>Loading...</div>;

  return (
    <div style={{maxWidth:920, margin:"24px auto", padding:"0 20px"}}>
      <div style={{display:'flex',gap:16,alignItems:'center'}}>
        <img src={proj.logoBase64} style={{width:84,height:84,borderRadius:12}} />
        <div>
          <h1>{proj.name} <small style={{color:'#aaa'}}>{proj.symbol}</small></h1>
          <div style={{color:'#999'}}>{proj.chain} • {proj.contract}</div>
        </div>
      </div>

      <div style={{marginTop:16,background:'#0e0e11',padding:12,borderRadius:8}}>
        <div style={{color:'#ddd'}}>{proj.description}</div>

        <div style={{marginTop:12, display:'flex', gap:8}}>
          <a className="navBtn" href={proj.website || "#"} target="_blank" rel="noreferrer">Website</a>
          {/* embed Dexscreener if link provided */}
          {proj.chartLink && <a className="navBtn" href={proj.chartLink} target="_blank" rel="noreferrer">Chart</a>}
        </div>
      </div>

      <div style={{marginTop:18}}>
        <h3>Vote</h3>
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <div style={{fontWeight:700}}>{proj.votes || 0} votes</div>
          <button className="navBtn" onClick={async ()=>{
            const r = await fetch('/api/vote', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ projectId: id })});
            const j = await r.json();
            if (j.success) {
              setProj({...proj, votes: (proj.votes||0) + 1});
            } else alert(j.error || 'Vote failed');
          }}>▲ Upvote</button>
        </div>
      </div>
    </div>
  );
}
