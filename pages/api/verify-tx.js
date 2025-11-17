// pages/api/verify-tx.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { txid, chain } = req.body || {};
  if (!txid || !chain) return res.status(400).json({ error: "txid and chain required" });

  // Try to find the listingId from localStorage mapping on client side (we store dt_pending_tx_<txid> locally).
  // Server cannot access client localStorage. So we accept a transaction id and return verification status.
  try{
    if(chain === "ETH"){
      const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
      if(!ETHERSCAN_API_KEY){
        // No API key -> tell client to manual verify / pending
        return res.json({ status: "pending", message: "No Etherscan API key configured on server. Set ETHERSCAN_API_KEY to enable auto verification." });
      }
      // Call Etherscan tx receipt API
      const url = `https://api.etherscan.io/api?module=transaction&action=gettxreceiptstatus&txhash=${txid}&apikey=${ETHERSCAN_API_KEY}`;
      const r = await fetch(url);
      const j = await r.json();
      if(j.status === "1" && j.result && j.result.status === "1"){
        return res.json({ status: "confirmed", message: "Transaction confirmed (etherscan)", txid });
      } else {
        return res.json({ status: "pending", message: "Transaction not confirmed or not found (etherscan)", txid, raw: j });
      }
    } else if(chain === "SOL" || chain === "SOLANA"){
      // Use Solana public RPC (getTransaction)
      const rpc = process.env.SOL_RPC || "https://api.mainnet-beta.solana.com";
      const body = {
        jsonrpc: "2.0",
        id: 1,
        method: "getTransaction",
        params: [txid, { encoding: "json" }]
      };
      const r = await fetch(rpc, { method:"POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(body) });
      const j = await r.json();
      if(j.result){
        return res.json({ status: "confirmed", message: "Transaction confirmed (solana)", txid, raw: j.result });
      } else {
        return res.json({ status: "pending", message: "Transaction not found / not confirmed (solana)", txid, raw: j });
      }
    } else {
      // unknown chain
      return res.json({ status: "pending", message: "Chain not supported by server verification. Use ETH or SOL." });
    }
  }catch(e){
    return res.json({ status: "error", message: String(e) });
  }
}
