import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  MapContainer, GeoJSON, useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  fetchHeatmap, getCategory, getHeatmapColor, normalizeStateName, getStateDetails,
  HEATMAP_CATEGORIES, type HeatmapCategory, type StateHeatmapData, type StateDetail,
} from '../services/heatmapApi';
import indiaStatesRaw from '../data/india-states.geojson?raw';

/* Parsed once at module scope — the geographic dataset is loaded exactly
   one time for the lifetime of the app and reused by every render. */
const indiaStates = JSON.parse(indiaStatesRaw) as GeoJSON.FeatureCollection;

interface IndiaHeatmapProps {
  /** Height of the map area, e.g. "420px". */
  height?: string;
  /** Show the built-in category selector + legend chrome. */
  showChrome?: boolean;
  /** Show the dropdown selector (defaults to true; hide when the host page provides its own). */
  showSelector?: boolean;
  /** Controlled category id (when provided the host drives category state). */
  categoryId?: string;
  /** Called when a state is clicked. */
  onStateSelect?: (detail: StateDetail | null) => void;
  /** Called when the selected category changes. */
  onCategoryChange?: (id: string) => void;
  /** Optional state subset to emphasize for a selected dashboard lens. */
  highlightStates?: string[];
}

interface HoverInfo {
  state: string;
  value: number;
}

/** Colors the base map chrome: no tiles, just a neutral canvas. */
const MAP_BG = '#F8FAFC';

const indiaBounds: L.LatLngBoundsExpression = [
  [6.4, 68.1],   // southwest (Kanyakumari / west coast)
  [37.1, 97.4],  // northeast (Kashmir / Arunachal)
];

/** Fits India once on load; never re-fits on data/category changes. */
function FitIndia() {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(indiaBounds, { padding: [4, 4] });
    /* If the flex/grid container settles after mount, re-measure and
       re-fit so India always exactly fills the box. */
    const settle = setTimeout(() => {
      map.invalidateSize();
      map.fitBounds(indiaBounds, { padding: [4, 4] });
    }, 200);
    const zoomCtrl = L.control.zoom({ position: 'bottomright' });
    zoomCtrl.addTo(map);
    return () => { clearTimeout(settle); zoomCtrl.remove(); };
  }, [map]);
  return null;
}

const IndiaHeatmap: React.FC<IndiaHeatmapProps> = ({
  height = '420px',
  showChrome = true,
  showSelector = true,
  categoryId: controlledCategory,
  onStateSelect,
  onCategoryChange,
  highlightStates,
}) => {
  const [internalCategory, setInternalCategory] = useState<string>(HEATMAP_CATEGORIES[0].id);
  const categoryId = controlledCategory ?? internalCategory;
  const isControlled = controlledCategory != null;
  const [data, setData] = useState<Map<string, StateHeatmapData>>(new Map());
  const [loading, setLoading] = useState(true);
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const [detail, setDetail] = useState<StateDetail | null>(null);
  const geoJsonRef = useRef<L.GeoJSON | null>(null);
  const hoverLayerRef = useRef<L.GeoJSON | null>(null);

  const category: HeatmapCategory = useMemo(() => getCategory(categoryId), [categoryId]);

  /* Load values for the category — data layer only, map instance untouched. */
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchHeatmap(categoryId).then((res) => {
      if (cancelled) return;
      const m = new Map<string, StateHeatmapData>();
      res.data.forEach((d) => m.set(normalizeStateName(d.state), d));
      setData(m);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [categoryId]);

  /* Shared style function: reads current data via closure-safe ref. */
  const dataRef = useRef(data);
  dataRef.current = data;
  const categoryRef = useRef(category);
  categoryRef.current = category;

  const styleFeature = (feature?: GeoJSON.Feature): L.PathOptions => {
    const name = normalizeStateName(feature?.properties?.st_nm ?? '');
    const d = dataRef.current.get(name);
    const value = d?.value;
    const fill = value == null ? '#E2E8F0' : getHeatmapColor(value, categoryRef.current);
    const isOutsideFocus = Boolean(highlightStates?.length && !highlightStates.some((state) => normalizeStateName(state) === name));
    return {
      fillColor: fill,
      fillOpacity: isOutsideFocus ? 0.2 : 0.92,
      color: '#FFFFFF',
      weight: 1,
      opacity: 1,
    };
  };

  const eachFeature = (feature: GeoJSON.Feature, layer: L.Layer) => {
    const layerPath = layer as L.Path;
    const name = normalizeStateName(feature.properties?.st_nm ?? '');

    /* Tooltip content is a function — re-evaluated on every open so it
       always reflects the current category's data. */
    layerPath.bindTooltip(
      () => {
        const dNow = dataRef.current.get(name);
        return `<span class="hm-tip-state">${feature.properties?.st_nm}</span>` +
          `<span class="hm-tip-value">${categoryRef.current.label}: <b>${dNow ? dNow.value.toLocaleString('en-IN') + categoryRef.current.unit : '—'}</b></span>`;
      },
      { sticky: true, direction: 'top', className: 'hm-tooltip', opacity: 1 },
    );

    layerPath.on({
      mouseover: () => {
        layerPath.setStyle({ weight: 2.2, color: '#0F172A', fillOpacity: 1 });
        layerPath.bringToFront();
        hoverLayerRef.current = layerPath;
        const dNow = dataRef.current.get(name);
        if (dNow) setHover({ state: feature.properties?.st_nm ?? '', value: dNow.value });
      },
      mouseout: () => {
        layerPath.setStyle(styleFeature(feature));
        if (hoverLayerRef.current === layerPath) {
          hoverLayerRef.current = null;
          setHover(null);
        }
      },
      click: async () => {
        setDetail(null);
        const det = await getStateDetails(name, categoryRef.current.id);
        setDetail(det);
        onStateSelect?.(det);
      },
    });
  };

  /* Re-apply styles once data for a category has loaded (the GeoJSON layer
     itself is created once and never re-instantiated). */
  useEffect(() => {
    const gj = geoJsonRef.current;
    if (gj && !loading) {
      gj.eachLayer((l) => gj.resetStyle(l));
    }
  }, [data, loading, highlightStates?.join('|')]);

  return (
    <div className="hm-wrap" style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>
      <style>{`
        .hm-tooltip{background:#FFFFFF!important;border:1px solid #E2E8F0!important;border-radius:8px!important;
          box-shadow:0 4px 14px rgba(15,23,42,.12)!important;padding:7px 11px!important;font-family:inherit;}
        .hm-tooltip::before{display:none!important;}
        .hm-tip-state{display:block;font-size:12.5px;font-weight:700;color:#0F172A;}
        .hm-tip-value{display:block;font-size:11px;color:#334155;margin-top:2px;}
      `}</style>
      <div style={{ position: 'relative', height, borderRadius: 10, overflow: 'hidden', border: '1px solid #E2E8F0', background: MAP_BG }}>
        <MapContainer
          center={[22.8, 82.0]}
          zoom={4}
          minZoom={4}
          maxZoom={7}
          zoomControl={false}
          scrollWheelZoom={false}
          attributionControl={false}
          style={{ height: '100%', width: '100%', background: MAP_BG }}
        >
          <FitIndia />
          <GeoJSON
            ref={geoJsonRef}
            key={categoryId}
            data={indiaStates as GeoJSON.FeatureCollection}
            style={styleFeature}
            onEachFeature={eachFeature}
          />
        </MapContainer>

        {loading && (
          <div className="hm-loading" style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(248,250,252,0.72)', zIndex: 500, fontSize: 12, color: '#64748B',
          }}>
            Loading heatmap…
          </div>
        )}

        {/* Category selector floats over the map (top-left) so the map
            itself gets the full container height. */}
        {showChrome && showSelector && (
          <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 800, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span className="hm-label" style={{ fontSize: 10.5, color: '#64748B', letterSpacing: '0.02em' }}>Heatmap Category</span>
            <div className="hm-select-wrap" style={{ position: 'relative' }}>
              <select
                aria-label="Heatmap Category"
                value={categoryId}
                onChange={(e) => { const v = e.target.value; if (!isControlled) setInternalCategory(v); onCategoryChange?.(v); }}
                style={{
                  appearance: 'none', WebkitAppearance: 'none', border: '1px solid #E2E8F0', background: '#FFFFFF',
                  borderRadius: 6, padding: '6px 30px 6px 10px', fontSize: 12.5, fontWeight: 500, color: '#0F172A',
                  cursor: 'pointer', outline: 'none', minWidth: 208, boxShadow: '0 1px 2px rgba(15,23,42,0.04)',
                }}
              >
                {HEATMAP_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
              <svg
                viewBox="0 0 10 6" width={10} height={6} aria-hidden="true"
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fill: '#64748B' }}
              >
                <path d="M0 0h10L5 6z" />
              </svg>
            </div>
          </div>
        )}

        {/* Legend floats over the map (bottom-left), compact and on a
            white chip so it reads cleanly over any state color. */}
        {showChrome && (
          <div className="hm-legend" style={{
            position: 'absolute', bottom: 10, left: 10, zIndex: 800,
            background: 'rgba(255,255,255,0.94)', border: '1px solid #E2E8F0', borderRadius: 8,
            padding: '6px 10px', display: 'flex', flexDirection: 'column', gap: 3,
          }}>
            <span style={{ fontSize: 10, color: '#64748B' }}>
              {loading ? 'Loading…' : `${data.size} states / UTs`}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 10, color: '#64748B' }}>Low</span>
              <div style={{ display: 'flex', borderRadius: 4, overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                {category.stops.map(([v, color]) => (
                  <span key={v + color} title={String(v)} style={{ width: 18, height: 9, background: color, display: 'block' }} />
                ))}
              </div>
              <span style={{ fontSize: 10, color: '#64748B' }}>High</span>
            </div>
            <span style={{ fontSize: 9.5, color: '#94A3B8' }}>
              {category.stops.map(([v]) => v).join(' · ')} {category.unit || ''}
            </span>
          </div>
        )}

        {/* Hover summary (mirrors the Leaflet tooltip, styled for the dashboard) */}
        {hover && (
          <div className="hm-hover-card" style={{
            position: 'absolute', top: 62, left: 10, zIndex: 600, background: '#FFFFFF',
            border: '1px solid #E2E8F0', borderRadius: 8, padding: '8px 12px', minWidth: 168,
            boxShadow: '0 4px 14px rgba(15,23,42,0.10)', pointerEvents: 'none',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{hover.state}</div>
            <div style={{ fontSize: 11.5, color: '#334155', marginTop: 2 }}>
              {category.label}: <b style={{ color: getHeatmapColor(hover.value, category) }}>{hover.value.toLocaleString('en-IN')}{category.unit}</b>
            </div>
          </div>
        )}

        {/* Selected-state detail panel */}
        {detail && (
          <div className="hm-detail" style={{
            position: 'absolute', top: 10, right: 10, zIndex: 600, background: '#FFFFFF',
            border: '1px solid #E2E8F0', borderRadius: 10, padding: 12, width: 226,
            boxShadow: '0 6px 20px rgba(15,23,42,0.14)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9', paddingBottom: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>{detail.state}</span>
              <button
                onClick={() => { setDetail(null); onStateSelect?.(null); }}
                aria-label="Close state details"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', fontSize: 14, lineHeight: 1, padding: 2 }}
              >✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 11.5, color: '#334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{detail.categoryLabel}</span>
                <b style={{ color: getHeatmapColor(detail.value, category) }}>{detail.value.toLocaleString('en-IN')}{detail.unit}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total Projects</span><b>{detail.activeProjects}</b></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Delayed Projects</span><b>{detail.delayedProjects}</b></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Completion Rate</span><b>{detail.completionRate}%</b></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Portfolio</span><b>₹ {detail.portfolioValueCr.toLocaleString('en-IN')} Cr</b></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndiaHeatmap;
