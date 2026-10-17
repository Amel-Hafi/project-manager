import os
import pandas as pd
import psycopg2

# Database configuration
DB_HOST = os.environ.get("DB_HOST", "localhost")
DB_NAME = os.environ.get("DB_NAME", "project_monitor")
DB_USER = os.environ.get("DB_USER", "monitor")
DB_PASS = os.environ.get("DB_PASS", "monitor")
DB_PORT = os.environ.get("DB_PORT", "5432")

EXCEL_FILE = "referentiel.xlsx"


def main():
    if not os.path.exists(EXCEL_FILE):
        print(f"FAILED Migration Verdict: File {EXCEL_FILE} not found. Aborting synchronization.")
        return

    # Read Excel - prefer 'Referentiel' sheet if it exists
    xl = pd.ExcelFile(EXCEL_FILE)
    sheet = "Referentiel" if "Referentiel" in xl.sheet_names else xl.sheet_names[0]
    df = xl.parse(sheet)

    print(f"Processing sheet: {sheet}")
    print(f"Total rows: {len(df)}")

    try:
        conn = psycopg2.connect(
            host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASS, port=DB_PORT
        )
        cursor = conn.cursor()
    except Exception as e:
        print(f"FAILED Migration Verdict: Database connectivity failed - {e}")
        return

    # Load category mapping from technology_category table
    cursor.execute("SELECT code, id FROM technology_category")
    cat_map = dict(cursor.fetchall())

    inserted = 0
    updated = 0
    skipped = 0
    skipped_details = []
    seen_names = set()

    for idx, row in df.iterrows():
        row_num = idx + 2  # Excel row number (1-indexed + header)
        category = str(row.get("Category", "")).strip() if pd.notna(row.get("Category")) else ""
        name = str(row.get("Name", "")).strip() if pd.notna(row.get("Name")) else ""
        target_version = str(row.get("Target_Version", "")).strip() if pd.notna(row.get("Target_Version")) else ""

        # Validate required fields (Category and Name are mandatory; Target_Version is optional)
        missing = []
        if not category:
            missing.append("Category")
        if not name:
            missing.append("Name")
        if missing:
            skipped += 1
            skipped_details.append(f"Row {row_num}: missing {', '.join(missing)}")
            continue

        # Duplicate check within Excel file
        key = (category, name)
        if key in seen_names:
            skipped += 1
            skipped_details.append(f"Row {row_num}: duplicate ({category}/{name})")
            continue
        seen_names.add(key)

        # Category lookup
        if category not in cat_map:
            skipped += 1
            skipped_details.append(f"Row {row_num}: category '{category}' not found in DB")
            continue

        category_id = cat_map[category]

        # Check if item already exists (by name + category)
        cursor.execute(
            "SELECT id, version FROM technology_item WHERE name = %s AND category_id = %s AND deleted = false",
            (name, category_id),
        )
        existing = cursor.fetchone()

        if existing:
            cursor.execute(
                "UPDATE technology_item SET version = %s, status = %s, updated_at = NOW() WHERE id = %s",
                (target_version, "ACTIVE", existing[0]),
            )
            updated += 1
        else:
            cursor.execute(
                "INSERT INTO technology_item (name, version, status, category_id, deleted, created_at) VALUES (%s, %s, %s, %s, false, NOW())",
                (name, target_version, "ACTIVE", category_id),
            )
            inserted += 1

    conn.commit()
    cursor.close()
    conn.close()

    # Report
    print(f"\n--- Migration Summary ---")
    print(f"Inserted: {inserted}")
    print(f"Updated: {updated}")
    print(f"Skipped: {skipped}")
    if skipped_details:
        print(f"\nSkipped details:")
        for d in skipped_details:
            print(f"  {d}")
    print(f"\nMigration Verdict: SUCCESS")


if __name__ == "__main__":
    main()

