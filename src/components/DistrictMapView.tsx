import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import React, { useMemo, useState } from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import { ArrowRight, MapPin } from 'lucide-react';
import { RedeploymentMove, SchoolRecord } from '../types';

interface DistrictMapViewProps {
  records: SchoolRecord[];
  moves: RedeploymentMove[];
  onSelectSchool: (school: SchoolRecord) => void;
  selectedDistrict: string;
  onDistrictSelect: (district: string) => void;
}

const mapBounds: [[number, number], [number, number]] = [[0.05, 32.05], [0.65, 33.35]];
const defaultCenter: [number, number] = [0.35, 32.65];

const markerIcon = (status: 'shortage' | 'surplus' | 'balanced') => L.divIcon({
  className: 'bg-transparent border-0',
  html: `<div class="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white shadow-lg ${
    status === 'shortage' ? 'bg-amber-500' : status === 'surplus' ? 'bg-emerald-600' : 'bg-teal-600'
  }"><span class="text-[10px] font-black text-white">●</span></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

function MapViewport({ records }: { records: SchoolRecord[] }) {
  const map = useMap();
  React.useEffect(() => {
    if (records.length) map.fitBounds(records.map((record) => toLatLng(record)), { padding: [35, 35], maxZoom: 12 });
  }, [map, records]);
  return null;
}

function toLatLng(record: SchoolRecord): [number, number] {
  const x = record.coordinates?.x ?? 50;
  const y = record.coordinates?.y ?? 50;
  return [mapBounds[1][0] - (y / 100) * (mapBounds[1][0] - mapBounds[0][0]), mapBounds[0][1] + (x / 100) * (mapBounds[1][1] - mapBounds[0][1])];
}

export const DistrictMapView: React.FC<DistrictMapViewProps> = ({ records, moves, onSelectSchool, selectedDistrict, onDistrictSelect }) => {
  const [showTransitLines, setShowTransitLines] = useState(true);
  const uniqueSchools = useMemo(() => Array.from(new Map(records.map((record) => [record.school, record])).values()), [records]);
  const schoolByName = useMemo(() => new Map(uniqueSchools.map((school) => [school.school, school])), [uniqueSchools]);
  const visibleMoves = moves.filter((move) => schoolByName.has(move.fromSchool) && schoolByName.has(move.toSchool));

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white"><MapPin className="h-4 w-4 text-teal-600" />Live district map</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">OpenStreetMap tiles with school staffing status and proposed transfer routes.</p>
        </div>
        <label className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300"><input type="checkbox" checked={showTransitLines} onChange={(event) => setShowTransitLines(event.target.checked)} className="rounded-sm text-teal-600 focus:ring-teal-500" /> Show transfer routes</label>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200/90 shadow-sm dark:border-slate-800">
        <MapContainer center={defaultCenter} zoom={9} minZoom={8} maxZoom={15} maxBounds={mapBounds} className="h-[560px] w-full" scrollWheelZoom>
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapViewport records={uniqueSchools} />
          {showTransitLines && visibleMoves.map((move) => {
            const from = schoolByName.get(move.fromSchool);
            const to = schoolByName.get(move.toSchool);
            if (!from || !to) return null;
            return <Polyline key={move.id} positions={[toLatLng(from), toLatLng(to)]} pathOptions={{ color: '#0d9488', weight: 3, dashArray: '8 8', opacity: 0.8 }} />;
          })}
          {uniqueSchools.map((school) => {
            const gap = records.filter((record) => record.school === school.school).reduce((total, record) => total + record.required - record.available, 0);
            const status = gap > 0 ? 'shortage' : gap < 0 ? 'surplus' : 'balanced';
            return <Marker key={school.school} position={toLatLng(school)} icon={markerIcon(status)}><Popup><div className="min-w-52 space-y-2"><strong>{school.school}</strong><div className="text-xs text-slate-500">{school.district} District · {school.km} km to center</div><div className="text-xs font-semibold">{status === 'shortage' ? `Needs ${gap} teacher${gap === 1 ? '' : 's'}` : status === 'surplus' ? `Surplus of ${Math.abs(gap)} teacher${Math.abs(gap) === 1 ? '' : 's'}` : 'Balanced staffing'}</div><button className="flex items-center gap-1 rounded-md bg-teal-600 px-2 py-1 text-xs font-semibold text-white" onClick={() => onSelectSchool(school)}>Inspect profile <ArrowRight className="h-3 w-3" /></button></div></Popup></Marker>;
          })}
        </MapContainer>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300"><span className="font-semibold">District focus:</span>{['All', ...Array.from(new Set(records.map((record) => record.district)))].map((district) => <button key={district} onClick={() => onDistrictSelect(district === 'All' ? 'All Districts' : district)} className={`rounded-full border px-3 py-1 ${selectedDistrict === district || (district === 'All' && selectedDistrict === 'All Districts') ? 'border-teal-600 bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300' : 'border-slate-200 dark:border-slate-700'}`}>{district}</button>)}</div>
    </div>
  );
};

export default DistrictMapView;
