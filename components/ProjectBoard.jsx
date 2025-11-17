'use client';
import { useEffect, useState } from "react";

export default function ProjectsBoard(){
  const [projects, setProjects] = useState([]);
  useEffect(()=> {
    fetch('/api/projects').then(r=>r.json()).then(j=> {
      if (j.projects) setProjects(j.projects);
    });
  }, []);

  const premium = projects.filter(p => p.premium && p.status === "approved");
  const basic = projects.filter(p => !p.premium && p.status === "approved");
  const pending = projects.filter(p => p.status !== "approved");

  return (
    <section style={{marginTop:20}}>
      <div style={{marginBottom:12}}>
        <h3>Premium Listings</h3>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:12}}>
          {premium.length === 0 && <div style={{padding:12,background:'#111',borderRadius:8}}>No premium listings</div>}
          {premium.map(p => (
            <div key={p._id} style={{background:'#121216',padding:12,borderRadius:10,border:'1px solid rgba(255,200,50,0.08)'}}>
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <div style={{display:'flex',gap:10}}>
                  <img src={p.logoBase64} style={{width:48,height:48,borderRadius:10}}/>
                  <div>
                    <div style={{fontWeight:800}}>{p.name} <small style={{color:'#aaa'}}>{p.symbol}</small></div>
                    <div style={{color:'#999'}}>{p.chain}</div>
                  </div>
                </div>
                <div>👑</div>
              </div>
              <div style={{color:'#aaa',marginTop:8}}>{p.description?.slice(0,160)}</div>
              <div style={{marginTop:12,display:'flex',gap:8}}>
                <a className="navBtn" href={p.website || "#"} target="_blank" rel="noreferrer">Website</a>
                <a className="navBtn" href={`/project/${p._id}`}>Details</a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{marginTop:24}}>
        <h3>Basic Listings</h3>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:12,marginTop:8}}>
          {basic.length === 0 && <div style={{padding:12,background:'#111',borderRadius:8}}>No basic listings</div>}
          {basic.map(p => (
            <div key={p._id} style={{background:'#121216',padding:12,borderRadius:10,border:'1px solid rgba(255,255,255,0.03)'}}>
              <div style={{display:'flex',gap:10}}>
                <img src={p.logoBase64} style={{width:48,height:48,borderRadius:10}}/>
                <div>
                  <div style={{fontWeight:700}}>{p.name} <small style={{color:'#aaa'}}>{p.symbol}</small></div>
                  <div style={{color:'#999'}}>{p.chain}</div>
                </div>
              </div>
              <div style={{color:'#aaa',marginTop:8}}>{p.description?.slice(0,140)}</div>
              <div style={{marginTop:12,display:'flex',gap:8}}>
                <a className="navBtn" href={p.website || "#"} target="_blank" rel="noreferrer">Website</a>
                <a className="navBtn" href={`/project/${p._id}`}>Details</a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{marginTop:24}}>
        <h3>Admin / Pending</h3>
        <div style={{display:'grid',gap:8}}>
          {pending.map(p => (
            <div key={p._id} style={{background:'#0f0f12',padding:10,borderRadius:8}}>
              <div style={{display:'flex',gap:10,alignItems:'center'}}>
                <img src={p.logoBase64} style={{width:44,height:44,borderRadius:8}}/>
                <div>
                  <div style={{fontWeight:700}}>{p.name} <small style={{color:'#999'}}>{p.status}</small></div>
                  <div style={{color:'#999'}}>{p.description?.slice(0,120)}</div>
                </div>
              </div>
            </div>
          ))}
          {pending.length === 0 && <div style={{padding:12,background:'#111',borderRadius:8}}>No pending items</div>}
        </div>
      </div>
    </section>
  );
}
