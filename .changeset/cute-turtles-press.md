---
"@kael/database": patch
---

refactor(database): update schema definitions and introduce pgEnum for field types

- Renamed auditTimestamps to auditTables for clarity.
- Introduced pgEnum for field types in kaelField table.
- Removed unused index definitions in kaelRecordLink table.
- Updated schema to ensure consistent use of audit tables across all relevant tables.
