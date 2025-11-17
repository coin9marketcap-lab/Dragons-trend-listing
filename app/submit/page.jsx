'use client';
import { useState } from "react";

export default function SubmitPage(){
  const [status, setStatus] = useState("");
  const [form, setForm] = useState({
    type: "basic",
    name: "",
    symbol: "",
    chain: "SOL",
    contract: "",
    website: "",
    description: "",
    socialLinks: {}
  });
  const [logoFile, setLogoFile] = useState(null);

  function pickFile(e){
    const f = e.target.files?.[0];
    setLogoFile(f);
  }

  async function submit(e){
    e.preventDefault();
    // validate
    if(!form.name || !form.symbol || !logoFile) {
      setStatus("Please fill name, symbol and upload a logo (file only).");
      return;
    }

    // include checkboxes for basic join requirement (client side)
    if(form.type === "basic" && (!form.joined1 || !form.joined2)) {
      setStatus("You must confirm you joined both Telegram groups.");
      return;
    }

    const data = new FormData();
    data.append("name", form.name);
    data.append("symbol", form.symbol);
    data.append("type", form.type);
    data.append("chain", form.chain);
    data.append("contract", form.contract || "");
    data.append("website", form.website || "");
    data.append("description", form.description || "");
    data.append("socialLinks", JSON.stringify(form.socialLinks || {}));
    data.append("logo", logoFile);

    const res = await fetch("/api/projects", { method: "POST", body: data });
    const j = await res.json();
    if (j.success) {
      setStatus("Submitted! It will appear after review (or auto-approved for confirmed premium tx).");
      setForm({ type:"basic", name:"", symbol:"", chain:"SOL", contract:"", website:"", description:"", socialLinks:{}});
      setLogoFile(null);
    } else {
      setStatus(j.error || "Submission failed");
    }
  }

  return (
    <div style={{maxWidth:920, margin:"24px auto", padding:"0 20px"}}>
      <h2>Submit Project</h2>
      <form onSubmit={submit} style={{display:'grid',gap:10}}>
        <label>
          Listing Type
          <select value={form.type} onChange={e=> setForm({...form, type: e.target.value})}>
            <option value="basic">Basic (Free)</option>
            <option value="premium">Premium ($150)</option>
          </select>
        </label>

        <label>
          Project Name
          <input value={form.name} onChange={e=> setForm({...form, name: e.target.value})} />
        </label>

        <label>
          Symbol
          <input value={form.symbol} onChange={e=> setForm({...form, symbol: e.target.value})} />
        </label>

        <label>
          Chain
          <select value={form.chain} onChange={e=> setForm({...form, chain: e.target.value})}>
            <option>SOL</option>
            <option>ETH</option>
            <option>BSC</option>
            <option>TON</option>
          </select>
        </label>

        <label>Contract Address
          <input value={form.contract} onChange={e=> setForm({...form, contract: e.target.value})}/>
        </label>

        <label>Website
          <input value={form.website} onChange={e=> setForm({...form, website: e.target.value})}/>
        </label>

        <label>Description
          <textarea value={form.description} onChange={e=> setForm({...form, description: e.target.value})} />
        </label>

        <label>Upload Logo (PNG/JPG/WebP/SVG) — NO URL
          <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={pickFile}/>
        </label>

        {form.type === "basic" && (
          <>
            <label><input type="checkbox" checked={form.joined1||false} onChange={e=> setForm({...form, joined1: e.target.checked})}/> I joined @Dragonstrend</label>
            <label><input type="checkbox" checked={form.joined2||false} onChange={e=> setForm({...form, joined2: e.target.checked})}/> I joined @dragonstrending</label>
          </>
        )}

        <div style={{display:'flex',gap:12}}>
          <button className="navBtn" type="submit">Submit</button>
          <a className="navBtn" href="/">Back</a>
        </div>

        <div style={{color:'#f7c843', marginTop:6}}>{status}</div>
      </form>
    </div>
  );
}
