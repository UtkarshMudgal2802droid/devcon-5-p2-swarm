export interface SightingRecord {
    _format: 'deccan-birders-sighting';
    _version: '1.0.0';
    date: string;
    species: string;
    location: string;
    notes?: string;
}

export function createSightingRecord(species: string, location: string, notes?: string): SightingRecord {
    return {
        _format: 'deccan-birders-sighting',
        _version: '1.0.0',
        date: new Date().toISOString(),
        species,
        location,
        notes
    };
}
