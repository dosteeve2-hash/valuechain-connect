"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Package, Search, Plus, Tag, Scale } from "lucide-react";

const GOLD   = "#D4AF37";
const CYAN   = "#00D4FF";
const GREEN  = "#22c55e";
const ORANGE = "#fb923c";
const TEXT2  = "#94a3b8";

type Categorie = "Oléagineux" | "Céréales" | "Légumineuses" | "Fibres";

const CAT_STYLE: Record<Categorie, { bg: string; color: string }> = {
  Oléagineux:   { bg: "rgba(212,175,55,0.12)",  color: GOLD   },
  Céréales:     { bg: "rgba(0,212,255,0.12)",   color: CYAN   },
  Légumineuses: { bg: "rgba(34,197,94,0.12)",   color: GREEN  },
  Fibres:       { bg: "rgba(251,146,60,0.12)",  color: ORANGE },
};

const PRODUITS = [
  { id:"PRD01", nom:"Karité brut grade A",      cat:"Oléagineux" as Categorie,   stock:"142 t", prix:"850 000 FCFA/t", cert:["Bio", "Fairtrade"], dispo:true  },
  { id:"PRD02", nom:"Beurre de karité raffiné", cat:"Oléagineux" as Categorie,   stock:"89 t",  prix:"1 200 000 FCFA/t", cert:["Bio", "ISO 22000"], dispo:true  },
  { id:"PRD03", nom:"Sésame blanc décortiqué",  cat:"Oléagineux" as Categorie,   stock:"243 t", prix:"780 000 FCFA/t", cert:["Bio"], dispo:true  },
  { id:"PRD04", nom:"Sésame naturel brun",       cat:"Oléagineux" as Categorie,   stock:"124 t", prix:"620 000 FCFA/t", cert:["Bio"], dispo:true  },
  { id:"PRD05", nom:"Maïs jaune export",         cat:"Céréales" as Categorie,     stock:"430 t", prix:"195 000 FCFA/t", cert:["UEMOA"], dispo:true  },
  { id:"PRD06", nom:"Sorgho rouge",              cat:"Céréales" as Categorie,     stock:"185 t", prix:"155 000 FCFA/t", cert:[], dispo:true  },
  { id:"PRD07", nom:"Mil perlé",                 cat:"Céréales" as Categorie,     stock:"96 t",  prix:"170 000 FCFA/t", cert:["UEMOA"], dispo:false },
  { id:"PRD08", nom:"Soja non-OGM grade 1",      cat:"Légumineuses" as Categorie, stock:"186 t", prix:"390 000 FCFA/t", cert:["Non-OGM", "UEMOA"], dispo:true  },
  { id:"PRD09", nom:"Niébé export",              cat:"Légumineuses" as Categorie, stock:"73 t",  prix:"280 000 FCFA/t", cert:[], dispo:true  },
  { id:"PRD10", nom:"Coton fibre grade 1",       cat:"Fibres" as Categorie,       stock:"78 t",  prix:"920 000 FCFA/t", cert:["Fairtrade"], dispo:true  },
];

const CATS: Categorie[] = ["Oléagineux", "Céréales", "Légumineuses", "Fibres"];


export default function ProduitsPage() {
  const [search, setSearch] = useState("");
  const [filtreCat, setFiltreCat] = useState("Tous");
  const [filtreDispo, setFiltreDispo] = useState("Tous");

  const filtres = PRODUITS.filter(p =>
    (filtreCat === "Tous" || p.cat === filtreCat) &&
    (filtreDispo === "Tous" || (filtreDispo === "Disponible" ? p.dispo : !p.dispo)) &&
    (search === "" || p.nom.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ color:"#fff" }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-white mb-1">Produits</h1>
          <p className="text-sm" style={{ color: TEXT2 }}>Catalogue producteur · {PRODUITS.length} références</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold self-start sm:self-auto"
          style={{ background:"linear-gradient(135deg,#D4AF37,#b8962e)", color:"#0A1628", cursor:"pointer" }}>
          <Plus className="w-4 h-4" />Ajouter un produit
        </button>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)" }}>
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: TEXT2 }} />
          <input type="text" placeholder="Rechercher…" value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-sm text-white outline-none w-40 placeholder-gray-600" />
        </div>
        {(["Tous", ...CATS] as string[]).map(c => {
          const isA = filtreCat === c;
          return (
            <button key={c} onClick={() => setFiltreCat(c)}
              className="px-3 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background: isA ? "rgba(212,175,55,0.15)" : "rgba(255,255,255,0.04)",
                border: isA ? "1px solid rgba(212,175,55,0.4)" : "1px solid rgba(255,255,255,0.08)",
                color: isA ? GOLD : TEXT2, cursor:"pointer",
              }}>{c}</button>
          );
        })}
        <select value={filtreDispo} onChange={e => setFiltreDispo(e.target.value)}
          className="px-3 py-2 rounded-xl text-sm outline-none ml-auto"
          style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", color: TEXT2, cursor:"pointer" }}>
          {["Tous","Disponible","Indisponible"].map(d => <option key={d} style={{ background:"#060e1a" }}>{d}</option>)}
        </select>
      </div>

      {/* Grid cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtres.map((p, i) => {
          const cs = CAT_STYLE[p.cat];
          return (
            <motion.div key={p.id}
              initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }}
              transition={{ type:"spring" as const, stiffness:120, damping:20, delay:i*0.05 }}
              className="rounded-2xl p-5 transition-all hover:border-white/15"
              style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: cs.bg }}>
                    <Package className="w-5 h-5" style={{ color: cs.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white leading-tight">{p.nom}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full mt-0.5 inline-block"
                      style={{ background: cs.bg, color: cs.color }}>{p.cat}</span>
                  </div>
                </div>
                <span className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${p.dispo ? "bg-green-400" : "bg-gray-600"}`} />
              </div>
              <div className="flex flex-col gap-2 text-xs">
                <div className="flex items-center justify-between">
                  <span style={{ color: TEXT2 }} className="flex items-center gap-1.5"><Scale className="w-3 h-3" />Stock</span>
                  <span className="text-white font-semibold">{p.stock}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: TEXT2 }} className="flex items-center gap-1.5"><Tag className="w-3 h-3" />Prix</span>
                  <span className="font-bold" style={{ color: GOLD }}>{p.prix}</span>
                </div>
              </div>
              {p.cert.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3 pt-3" style={{ borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                  {p.cert.map(c => (
                    <span key={c} className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background:"rgba(34,197,94,0.1)", color: GREEN, border:"1px solid rgba(34,197,94,0.2)" }}>
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
        {filtres.length === 0 && (
          <div className="col-span-full py-16 text-center" style={{ color: TEXT2 }}>
            <Package className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Aucun produit ne correspond aux filtres</p>
          </div>
        )}
      </div>
    </div>
  );
}
