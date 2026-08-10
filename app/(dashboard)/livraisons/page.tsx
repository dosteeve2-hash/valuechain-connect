"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Truck, Package, CheckCircle, Clock, AlertTriangle, X,
  MapPin, Calendar, Hash, ArrowRight,
} from "lucide-react";

const GOLD   = "#D4AF37";
const CYAN   = "#00D4FF";
const GREEN  = "#22c55e";
const ORANGE = "#fb923c";
const RED    = "#ef4444";
const TEXT2  = "#94a3b8";

type StatutLivraison = "En transit" | "Livré" | "Planifié" | "Retard" | "Annulé";
type Incoterm = "FOB" | "CIF" | "EXW";

interface Livraison {
  id: string; lot: string; produit: string;
  quantite: string; acheteur: string; destination: string;
  dateExp: string; dateLiv: string; statut: StatutLivraison;
  incoterm: Incoterm; transporteur: string; valeurEur: number;
}

const STATUT_STYLE: Record<StatutLivraison, { bg: string; color: string; icon: React.ElementType }> = {
  "En transit": { bg: "rgba(0,212,255,0.12)",   color: CYAN,   icon: Truck         },
  "Livré":      { bg: "rgba(34,197,94,0.12)",   color: GREEN,  icon: CheckCircle   },
  "Planifié":   { bg: "rgba(212,175,55,0.12)",  color: GOLD,   icon: Clock         },
  "Retard":     { bg: "rgba(239,68,68,0.12)",   color: RED,    icon: AlertTriangle  },
  "Annulé":     { bg: "rgba(148,163,184,0.1)",  color: TEXT2,  icon: X             },
};


const LIVRAISONS: Livraison[] = [
  { id:"L01", lot:"VC-2026-041", produit:"Karité brut grade A",   quantite:"12,5 t", acheteur:"BIO SAVEURS",           destination:"Paris, France",   dateExp:"2026-08-05", dateLiv:"2026-08-18", statut:"En transit", incoterm:"FOB", transporteur:"Maersk Line",    valeurEur:43750 },
  { id:"L02", lot:"VC-2026-040", produit:"Sésame blanc décortiqué",quantite:"8,0 t",  acheteur:"AGRI-FRANCE IMPORT",    destination:"Lyon, France",    dateExp:"2026-07-28", dateLiv:"2026-08-12", statut:"En transit", incoterm:"CIF", transporteur:"MSC",            valeurEur:29600 },
  { id:"L03", lot:"VC-2026-039", produit:"Beurre de karité",       quantite:"5,2 t",  acheteur:"WEST AFRICA FOODS LLC", destination:"New York, USA",   dateExp:"2026-07-15", dateLiv:"2026-08-02", statut:"Livré",      incoterm:"FOB", transporteur:"CMA-CGM",        valeurEur:72800 },
  { id:"L04", lot:"VC-2026-038", produit:"Cajou première qualité", quantite:"6,0 t",  acheteur:"NUTRI-EXPORT SAS",      destination:"Madrid, Espagne", dateExp:"2026-08-20", dateLiv:"2026-09-05", statut:"Planifié",   incoterm:"EXW", transporteur:"BOLLORÉ",        valeurEur:21000 },
  { id:"L05", lot:"VC-2026-037", produit:"Sésame naturel brun",    quantite:"10,0 t", acheteur:"BIO SAVEURS",           destination:"Paris, France",   dateExp:"2026-07-10", dateLiv:"2026-07-25", statut:"Retard",     incoterm:"CIF", transporteur:"Maersk Line",    valeurEur:31000 },
  { id:"L06", lot:"VC-2026-036", produit:"Farine de maïs export",  quantite:"15,0 t", acheteur:"CÔTE D'OR COMMERCE",   destination:"Bruxelles, BE",   dateExp:"2026-07-01", dateLiv:"2026-07-15", statut:"Livré",      incoterm:"FOB", transporteur:"MSC",            valeurEur:19500 },
  { id:"L07", lot:"VC-2026-035", produit:"Huile de sésame vierge", quantite:"2,5 t",  acheteur:"NUTRI-EXPORT SAS",      destination:"Madrid, Espagne", dateExp:"2026-08-30", dateLiv:"2026-09-20", statut:"Planifié",   incoterm:"CIF", transporteur:"CMA-CGM",        valeurEur:36250 },
];

const KPIS = [
  { label:"En transit",  value:"2",  color: CYAN  },
  { label:"Livrées",     value:"2",  color: GREEN },
  { label:"Planifiées",  value:"2",  color: GOLD  },
  { label:"Retard",      value:"1",  color: RED   },
];

const STATUTS: StatutLivraison[] = ["En transit", "Livré", "Planifié", "Retard", "Annulé"];


export default function LivraisonsPage() {
  const [filtreStatut, setFiltreStatut] = useState("Tous");
  const [selected, setSelected] = useState<Livraison | null>(null);

  const filtres = LIVRAISONS.filter(l =>
    filtreStatut === "Tous" || l.statut === filtreStatut
  );

  return (
    <div style={{ color: "#fff" }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-white mb-1">Livraisons</h1>
          <p className="text-sm" style={{ color: TEXT2 }}>Suivi des expéditions · Traçabilité export</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {KPIS.map((k, i) => (
          <motion.div key={k.label}
            initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }}
            transition={{ type:"spring" as const, stiffness:120, damping:20, delay:i*0.07 }}
            className="rounded-2xl p-5"
            style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-3xl font-black mb-1" style={{ color: k.color }}>{k.value}</p>
            <p className="text-sm" style={{ color: TEXT2 }}>{k.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-5">
        {(["Tous", ...STATUTS] as string[]).map(s => {
          const isActive = filtreStatut === s;
          return (
            <button key={s} onClick={() => setFiltreStatut(s)}
              className="px-3 py-1.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: isActive ? "rgba(212,175,55,0.15)" : "rgba(255,255,255,0.04)",
                border: isActive ? "1px solid rgba(212,175,55,0.4)" : "1px solid rgba(255,255,255,0.08)",
                color: isActive ? GOLD : TEXT2, cursor:"pointer",
              }}>{s}</button>
          );
        })}
        <span className="ml-auto text-xs self-center" style={{ color: TEXT2 }}>
          {filtres.length} livraison{filtres.length>1?"s":""}
        </span>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtres.map((l, i) => {
          const ss = STATUT_STYLE[l.statut]; const Icon = ss.icon;
          return (
            <motion.div key={l.id}
              initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }}
              transition={{ type:"spring" as const, stiffness:120, damping:20, delay:i*0.05 }}
              className="rounded-2xl p-5 cursor-pointer hover:border-white/15 transition-all"
              style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}
              onClick={() => setSelected(l)}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-bold text-white">{l.produit}</p>
                  <p className="text-xs mt-0.5" style={{ color: TEXT2 }}>{l.quantite} · {l.acheteur}</p>
                </div>
                <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: ss.bg, color: ss.color }}>
                  <Icon className="w-3 h-3" />{l.statut}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5" style={{ color: TEXT2 }}>
                  <Hash className="w-3 h-3" /><span className="font-mono">{l.lot}</span>
                </div>
                <div className="flex items-center gap-1.5" style={{ color: TEXT2 }}>
                  <MapPin className="w-3 h-3" />{l.destination}
                </div>
                <div className="flex items-center gap-1.5" style={{ color: TEXT2 }}>
                  <Calendar className="w-3 h-3" />Exp: <span className="text-white">{l.dateExp}</span>
                </div>
                <div className="flex items-center gap-1.5" style={{ color: TEXT2 }}>
                  <Truck className="w-3 h-3" />{l.transporteur}
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3"
                style={{ borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                <span className="text-xs px-2 py-0.5 rounded" style={{ background:"rgba(255,255,255,0.06)", color: TEXT2 }}>
                  {l.incoterm}
                </span>
                <span className="text-sm font-bold" style={{ color: GOLD }}>
                  {l.valeurEur.toLocaleString("fr-FR")} €
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background:"rgba(0,0,0,0.7)", backdropFilter:"blur(4px)" }}
            onClick={() => setSelected(null)}>
            <motion.div initial={{ opacity:0,scale:0.95,y:12 }} animate={{ opacity:1,scale:1,y:0 }}
              exit={{ opacity:0,scale:0.95,y:12 }}
              transition={{ type:"spring" as const, stiffness:200, damping:22 }}
              className="w-full max-w-md rounded-2xl p-6"
              style={{ background:"#060e1a", border:"1px solid rgba(255,255,255,0.1)", boxShadow:"0 24px 64px rgba(0,0,0,0.6)" }}
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-white">{selected.lot}</h2>
                <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background:"rgba(255,255,255,0.06)", color: TEXT2, cursor:"pointer" }}>
                  <X className="w-4 h-4" />
                </button>
              </div>
              {[
                { label:"Produit",       value: selected.produit        },
                { label:"Quantité",      value: selected.quantite       },
                { label:"Acheteur",      value: selected.acheteur       },
                { label:"Destination",   value: selected.destination    },
                { label:"Expédition",    value: selected.dateExp        },
                { label:"Livraison prév.",value: selected.dateLiv       },
                { label:"Transporteur",  value: selected.transporteur   },
                { label:"Incoterm",      value: selected.incoterm       },
                { label:"Valeur",        value: `${selected.valeurEur.toLocaleString("fr-FR")} €` },
              ].map(row => (
                <div key={row.label} className="flex justify-between py-2.5 text-sm"
                  style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ color: TEXT2 }}>{row.label}</span>
                  <span className="text-white font-medium">{row.value}</span>
                </div>
              ))}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
