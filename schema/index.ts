/**
 * The standard definition for a Deccan Birder sighting.
 * Following Test Case 3: Each record must be self-describing.
 */
export interface SightingRecord {
    _format: 'deccan-birders-sighting';
    _version: '1.0.0';
    date: string;         // ISO String
    species: string;      // Name of the bird species
    location: string;     // Text description of location
    notes?: string;       // Optional observations
}

/**
 * Validates whether an unknown object strictly conforms to the SightingRecord format.
 */
export function isSightingRecord(obj: any): obj is SightingRecord {
    return (
        obj &&
        typeof obj === 'object' &&
        obj._format === 'deccan-birders-sighting' &&
        obj._version === '1.0.0' &&
        typeof obj.date === 'string' &&
        typeof obj.species === 'string' &&
        typeof obj.location === 'string'
    );
}

/**
 * Utility to instantiate a new, self-describing record.
 */
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
