'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Project, RiskAssessment } from '@/lib/types';
import { getProjects, getAllRiskAssessments } from '@/lib/api/projects';
import { RISK_TIER_CONFIG } from '@/lib/constants';
import { INDIA_STATE_COORDS } from '@/lib/india-state-coords';
import { Badge } from '@/components/ui/Badge';
import { RiskIndicator } from '@/components/ui/RiskIndicator';

// Jitter function to avoid marker overlap
// Uses a controlled deterministic offset to stay strictly within state borders
function getJitter(seed: string): [number, number] {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = Math.imul(31, hash) + seed.charCodeAt(i) | 0;
  }
  // Tightly bounded offset (max ±0.1° ~ 10km) to ensure points stay strictly within India
  const jitterLat = ((hash % 1000) / 1000 - 0.5) * 0.22;
  const jitterLng = (((hash >> 5) % 1000) / 1000 - 0.5) * 0.22;
  return [jitterLat, jitterLng];
}

interface MapProject extends Project {
  riskTier?: string;
  riskScore?: number;
  dominantRisk?: string;
}

interface LiveRiskMapProps {
  height?: string;
  className?: string;
  compact?: boolean;
}

export default function LiveRiskMap({ height = 'h-[800px]', className = '', compact = false }: LiveRiskMapProps) {
  const [projects, setProjects] = useState<MapProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projectsData, riskData] = await Promise.all([
          getProjects(),
          getAllRiskAssessments(),
        ]);

        const riskMap = new Map(riskData.map((r) => [r.projectId, r]));

        const joinedData = projectsData.map((p) => {
          const risk = riskMap.get(p.id);
          return {
            ...p,
            riskTier: risk?.riskTier,
            riskScore: risk?.riskScore,
            dominantRisk: risk?.dominantRisk,
          };
        });

        setProjects(joinedData);
      } catch (error) {
        console.error('Error fetching data for map:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[800px] w-full items-center justify-center bg-slate-950 rounded-xl border border-slate-800">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-400 border-t-transparent"></div>
      </div>
    );
  }

  const indiaBounds: [[number, number], [number, number]] = [
    [6.5, 68.1],
    [35.5, 97.4],
  ];

  return (
    <div className={`${height} w-full rounded-xl overflow-hidden shadow-2xl border border-slate-800 bg-[#0f172a] ${className}`}>
      <MapContainer
        center={[22.5937, 78.9629]}
        zoom={compact ? 4 : 5}
        minZoom={compact ? 3.5 : 4}
        maxBounds={indiaBounds}
        maxBoundsViscosity={1.0}
        style={{ height: '100%', width: '100%', zIndex: 0, backgroundColor: '#090d16' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=cb1_3jc9_1_f9248401647fa59c967b6b14"
        />

        {projects.map((project) => {
          const baseCoords = INDIA_STATE_COORDS[project.state];
          if (!baseCoords) return null; // Skip if state coordinates not found

          const [jitterLat, jitterLng] = getJitter(project.id);
          const position: [number, number] = [
            baseCoords[0] + jitterLat,
            baseCoords[1] + jitterLng,
          ];

          const tier = project.riskTier || 'low';
          // Type cast to ensure we index RISK_TIER_CONFIG correctly, fallback if undefined
          const riskConfig = RISK_TIER_CONFIG[tier as keyof typeof RISK_TIER_CONFIG] || RISK_TIER_CONFIG['low'];

          const markerHtml = `
            <div style="
              width: 16px; 
              height: 16px; 
              background-color: ${riskConfig.color}; 
              border: 2px solid #ffffff; 
              border-radius: 50%;
              box-shadow: 0 0 10px ${riskConfig.color}, 0 0 3px rgba(0,0,0,0.9);
            "></div>
          `;

          const customIcon = L.divIcon({
            html: markerHtml,
            className: 'custom-leaflet-marker',
            iconSize: [16, 16],
            iconAnchor: [8, 8],
            popupAnchor: [0, -10],
          });

          return (
            <Marker key={project.id} position={position} icon={customIcon}>
              <Popup className="custom-popup">
                <div className="w-64 p-1">
                  <div className="mb-2">
                    <h3 className="font-bold text-slate-900 leading-tight mb-1">{project.name}</h3>
                    <p className="text-xs text-slate-500">{project.state} • {project.sector}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant={tier === 'critical' || tier === 'high' ? 'danger' : tier === 'medium' ? 'warning' : 'success'}>
                      {project.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  {project.riskScore !== undefined && project.riskTier && (
                     <RiskIndicator 
                       score={project.riskScore} 
                       tier={project.riskTier as keyof typeof RISK_TIER_CONFIG} 
                       className="transform scale-75 origin-left"
                     />
                  )}
                  
                  <div className="mt-3 text-xs text-sky-600 font-medium hover:underline cursor-pointer">
                    <a href={`/projects/${project.id}`} target="_blank" rel="noreferrer">View Project Details &rarr;</a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
