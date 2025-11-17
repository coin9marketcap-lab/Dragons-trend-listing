'use client';
import useSWR from 'swr';
import { useEffect, useState } from 'react';

const fetcher = (url) => fetch(url).then(r => r.json());

export default function PremiumTicker(){
  const [items, setItems] = useState([]);
  useEffect(()=> {
    // fetch projects and select premium approved
    fetch('/api/projects').then(r=>r.json()).then(j=>{
      if(j.projects) {
        const premium = j.projects.filter(p => p.premium && p.status === "approved");
        setItems(premium);
      }
    });
  }, []);

  return (
    <div className="premium-ticker">
      <div className="premium-ticker-inner" style={{display:'flex', gap:20}}>
        {items.length === 0 && <div style={{padding: "0 12px"}}>No premium projects yet</div>}
        {items.map(p => (
          <div key={p._id} className="tickerItem" style={{display:'flex',alignItems:'center',gap:8, padding:"6px 12px", cursor:"pointer"}} onClick={()=> window.location.href=`/project/${p._id}`}>
            <img src={p.logoBase64} style={{width:28,height:28,borderRadius:8}} />
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <strong>{p.symbol}</strong>
              <span style={{fontSize:12}}>👑</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
