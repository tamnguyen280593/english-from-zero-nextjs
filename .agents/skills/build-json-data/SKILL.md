---
name: build-json-data
description: Compiles raw text files into final JSON data for topics and lessons.
---

# Build JSON Data

## Purpose
This skill compiles `.txt` files containing curated topic, lesson, vocabulary, and phrase data into the structured JSON format required by the Next.js application in `src/data/`.

## Usage
1. Ensure your curated text files are placed in `scratch/*.txt`.
2. Format must follow the established `TOPIC:`, `L:`, `V:`, `P:` convention.
3. Run `node scratch/build_json.js`.
4. Verify that the output files in `src/data/*.json` conform to the 10-10-15 volume constraints defined in `.agents/rules/content-generation.md`.
