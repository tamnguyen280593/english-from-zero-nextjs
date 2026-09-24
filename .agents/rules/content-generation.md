# Content Generation Rules

Strict constraints for data integrity and educational quality:

1. **Volume Constraints**:
   - Each topic MUST contain **at least 10 lessons**.
   - Each lesson MUST contain **at least 10 vocabulary words** and **at least 10 phrases**.
   - The practice section for each lesson MUST generate **at least 15 quiz questions** via the `quizGenerator`.

2. **Quality & Authenticity**:
   - Data must NOT be duplicated. Each lesson must have unique, curated content.
   - All sentences and vocabulary must be grammatically correct and authentic to natural English usage.

3. **Data Pipeline**:
   - Do NOT edit JSON files directly. All content must be written to `scratch/*.txt` files.
   - Use the `build-json-data` skill to compile the text files into the final `src/data/*.json` format.
