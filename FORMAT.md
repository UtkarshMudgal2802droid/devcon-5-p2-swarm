# Deccan Birders Sighting Format

This document defines the JSON structure of a Deccan Birders sighting record on the Swarm network. Any software that reads this JSON object can understand and display the sighting without importing any code from the original Sighting App.

## Schema Versioning
Every record must contain a format identifier (`_format`) and a semantic version (`_version`).

```json
{
  "_format": "deccan-birders-sighting",
  "_version": "1.0.0",
  "date": "2026-09-20T10:00:00.000Z",
  "species": "Great Indian Bustard",
  "location": "Desert National Park, Rajasthan",
  "notes": "Spotted near the watering hole."
}
```

## Fields

| Field | Type | Description | Required |
| --- | --- | --- | --- |
| `_format` | String | Must always strictly equal `"deccan-birders-sighting"` | Yes |
| `_version` | String | Current semantic version is `"1.0.0"` | Yes |
| `date` | String | ISO 8601 formatted datetime string of when the record was created | Yes |
| `species` | String | The common or scientific name of the bird sighted | Yes |
| `location` | String | Human-readable text description of the location | Yes |
| `notes` | String | Optional observations, conditions, or participant names | No |

## Parsing Strategy
An independent reader should:
1. Fetch the bytes from the Swarm network (`GET /bytes/<reference>`).
2. Parse the bytes as UTF-8 JSON.
3. Validate that `_format === 'deccan-birders-sighting'`.
4. Handle the schema mapping based on `_version`.
