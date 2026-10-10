import { FilterState, RedeploymentMove, SchoolRecord, SubjectSummary, DistrictSummary } from '../types';

/**
 * Calculate approximate road distance between two schools within a district.
 * Uses known km to district center plus coordinate spatial approximation.
 */
export function calculateDistance(a: SchoolRecord, b: SchoolRecord): number {
  if (a.coordinates && b.coordinates) {
    // Pythagorean distance scaled to km
    const dx = a.coordinates.x - b.coordinates.x;
    const dy = a.coordinates.y - b.coordinates.y;
    const euclidean = Math.sqrt(dx * dx + dy * dy);
    // Convert relative grid distance to realistic km (1 grid unit approx 1.1 km)
    return Math.max(3, Math.round(euclidean * 1.1));
  }
  // Fallback to radial distance difference from district center
  return Math.abs(a.km - b.km) + Math.max(2, Math.round((a.km + b.km) / 8));
}

/**
 * Filters school records based on current user filters.
 */
export function filterRecords(records: SchoolRecord[], filters: FilterState): SchoolRecord[] {
  return records.filter(r => {
    if (filters.district !== 'All' && r.district !== filters.district) {
      return false;
    }
    if (filters.subject !== 'All' && r.subject !== filters.subject) {
      return false;
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchSchool = r.school.toLowerCase().includes(q);
      const matchDistrict = r.district.toLowerCase().includes(q);
      const matchSubject = r.subject.toLowerCase().includes(q);
      if (!matchSchool && !matchDistrict && !matchSubject) return false;
    }
    const gap = r.required - r.available;
    if (filters.status === 'shortage' && gap <= 0) return false;
    if (filters.status === 'surplus' && gap >= 0) return false;
    if (filters.status === 'balanced' && gap !== 0) return false;
    return true;
  });
}

/**
 * Computes feasible redeployment moves based on:
 * 1. Same subject
 * 2. Same district (or nearby cross-border if specified)
 * 3. Donor school has surplus (available > required)
 * 4. Destination school has need (required > available)
 * 5. Estimated travel distance <= maxDistance
 * 6. Protection of donor school minimum staffing (available - count >= 1)
 */
export function generateRecommendations(
  records: SchoolRecord[],
  maxDistance: number = 30
): RedeploymentMove[] {
  const moves: RedeploymentMove[] = [];
  const subjects = [...new Set(records.map(r => r.subject))];

  subjects.forEach(subject => {
    const subjectRecords = records.filter(r => r.subject === subject);
    const districts = [...new Set(subjectRecords.map(r => r.district))];

    districts.forEach(district => {
      const districtGroup = subjectRecords.filter(r => r.district === district);

      // Donors: schools with surplus
      const donors = districtGroup
        .filter(r => r.available > r.required)
        .map(r => ({
          ...r,
          surplus: r.available - r.required,
          currentAvailable: r.available,
        }))
        .sort((a, b) => b.surplus - a.surplus);

      // Recipients: schools with shortage
      const recipients = districtGroup
        .filter(r => r.required > r.available)
        .map(r => ({
          ...r,
          need: r.required - r.available,
        }))
        .sort((a, b) => b.need - a.need);

      recipients.forEach(dest => {
        donors.forEach(src => {
          if (src.surplus <= 0 || dest.need <= 0 || src.school === dest.school) return;

          // Donor protection: must retain at least 1 teacher
          if (src.currentAvailable - 1 < 1) return;

          const distance = calculateDistance(src, dest);
          if (distance > maxDistance) return;

          // Proposed transfer count
          const maxTransferAllowed = Math.min(src.surplus, src.currentAvailable - 1);
          const count = Math.min(maxTransferAllowed, dest.need);

          if (count > 0) {
            moves.push({
              id: `${src.school}-${dest.school}-${subject}`.toLowerCase().replace(/\s+/g, '-'),
              fromSchool: src.school,
              toSchool: dest.school,
              district: district,
              subject: subject,
              count,
              distance,
              status: 'recommended',
            });
            src.surplus -= count;
            src.currentAvailable -= count;
            dest.need -= count;
          }
        });
      });
    });
  });

  return moves;
}

/**
 * Summarizes data by subject for intuitive charts.
 */
export function getSubjectSummaries(records: SchoolRecord[]): SubjectSummary[] {
  const subjectMap = new Map<string, { required: number; available: number; deficit: number; surplus: number }>();

  records.forEach(r => {
    const current = subjectMap.get(r.subject) || { required: 0, available: 0, deficit: 0, surplus: 0 };
    current.required += r.required;
    current.available += r.available;
    const gap = r.required - r.available;
    if (gap > 0) current.deficit += gap;
    else if (gap < 0) current.surplus += Math.abs(gap);
    subjectMap.set(r.subject, current);
  });

  return Array.from(subjectMap.entries()).map(([subject, data]) => ({
    subject,
    required: data.required,
    available: data.available,
    deficit: data.deficit,
    surplus: data.surplus,
    netGap: data.deficit - data.surplus,
    coverageRatio: data.required > 0 ? Math.round((data.available / data.required) * 100) : 100,
  })).sort((a, b) => b.deficit - a.deficit);
}

/**
 * Summarizes data by district.
 */
export function getDistrictSummaries(records: SchoolRecord[]): DistrictSummary[] {
  const districtMap = new Map<string, { schools: Set<string>; required: number; available: number; deficit: number; surplus: number }>();

  records.forEach(r => {
    const current = districtMap.get(r.district) || {
      schools: new Set<string>(),
      required: 0,
      available: 0,
      deficit: 0,
      surplus: 0,
    };
    current.schools.add(r.school);
    current.required += r.required;
    current.available += r.available;
    const gap = r.required - r.available;
    if (gap > 0) current.deficit += gap;
    else if (gap < 0) current.surplus += Math.abs(gap);
    districtMap.set(r.district, current);
  });

  return Array.from(districtMap.entries()).map(([district, data]) => {
    const parity = data.required > 0 
      ? Math.min(100, Math.round((data.available / data.required) * 100))
      : 100;
    return {
      district,
      totalSchools: data.schools.size,
      totalRequired: data.required,
      totalAvailable: data.available,
      deficit: data.deficit,
      surplus: data.surplus,
      parityScore: parity,
    };
  }).sort((a, b) => a.parityScore - b.parityScore);
}

/**
 * Calculate KPI summary statistics.
 */
export function computeMetrics(records: SchoolRecord[], moves: RedeploymentMove[]) {
  const uniqueSchools = new Set(records.map(r => r.school)).size;
  const totalRequired = records.reduce((acc, r) => acc + r.required, 0);
  const totalAvailable = records.reduce((acc, r) => acc + r.available, 0);
  const grossDeficit = records.reduce((acc, r) => acc + Math.max(0, r.required - r.available), 0);
  const grossSurplus = records.reduce((acc, r) => acc + Math.max(0, r.available - r.required), 0);
  const totalFeasibleMoves = moves.reduce((acc, m) => acc + m.count, 0);
  const postDeficit = Math.max(0, grossDeficit - totalFeasibleMoves);
  const avgDistance = moves.length > 0 
    ? Math.round(moves.reduce((acc, m) => acc + m.distance, 0) / moves.length)
    : 0;
  const parityIndex = totalRequired > 0 
    ? Math.round((totalAvailable / totalRequired) * 100)
    : 100;
  const postParityIndex = totalRequired > 0
    ? Math.round(((totalRequired - postDeficit) / totalRequired) * 100)
    : 100;

  return {
    uniqueSchools,
    totalRequired,
    totalAvailable,
    grossDeficit,
    grossSurplus,
    totalFeasibleMoves,
    postDeficit,
    avgDistance,
    parityIndex,
    postParityIndex,
    shortageSchoolsCount: records.filter(r => r.required > r.available).length,
    surplusSchoolsCount: records.filter(r => r.available > r.required).length,
    balancedSchoolsCount: records.filter(r => r.required === r.available).length,
  };
}
