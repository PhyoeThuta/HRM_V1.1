#!/usr/bin/env python3


import os
import sys
import json
import argparse
from datetime import datetime
import urllib.request
import urllib.error

# ─── Configuration ─────────────────────────────────────────────
SUPABASE_URL = "https://kcswzfrwpvioaaizfpnk.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtjc3d6ZnJ3cHZpb2FhaXpmcG5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMTI2NTUsImV4cCI6MjA5NTY4ODY1NX0.NdvQ_9odU5SS3SOGeJKLk8EBvFIFv8pbO2PanYOT4Dw"

ANNUAL_LEAVE_NAMES = ["annual", "annual leave", "yearly", "earned leave"]
# ────────────────────────────────────────────────────────────────


def supabase_request(method, table, params=None, body=None):
    """Generic Supabase REST API helper."""
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    if params:
        query = "&".join(f"{k}={v}" for k, v in params.items())
        url += f"?{query}"

    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }

    data = json.dumps(body).encode("utf-8") if body else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)

    try:
        with urllib.request.urlopen(req) as response:
            result = response.read().decode("utf-8")
            return json.loads(result) if result.strip() else []
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        print(f"  ❌ HTTP Error {e.code}: {error_body}")
        return None


def get_all_leave_types():
    """Fetch all leave types."""
    return supabase_request("GET", "Leave_type", {"select": "*"}) or []


def get_all_leave_balances():
    """Fetch all leave balances with current allocation."""
    return supabase_request("GET", "Leave_balances", {"select": "*"}) or []


def update_leave_balance(balance_id, updates):
    """Update a specific leave balance record."""
    return supabase_request("PATCH", "Leave_balances", {"id": f"eq.{balance_id}"}, updates)


def log_action(employee_id, details, dry_run=False):
    """Write to sys_audit_logs."""
    if dry_run:
        return
    supabase_request("POST", "sys_audit_logs", None, {
        "user_id": "SYSTEM",
        "user_name": "Leave Automation Engine",
        "action": "RESET",
        "module": "Leave Balances",
        "details": details,
        "created_at": datetime.utcnow().isoformat() + "Z"
    })


def run_leave_reset(dry_run=False, target_year=None):
    """Main engine: processes leave balance reset & carry forward."""
    year = target_year or datetime.now().year
    print("\n" + "═" * 60)
    print(f"  CorpHRM Leave Automation Engine")
    print(f"  Processing Year: {year}")
    print(f"  Mode: {'🔍 DRY RUN (no changes will be saved)' if dry_run else '✅ LIVE RUN'}")
    print("═" * 60 + "\n")

    # 1. Fetch reference data
    print("📂 Fetching leave types...")
    leave_types = get_all_leave_types()
    if not leave_types:
        print("  ❌ No leave types found. Aborting.")
        return

    # Build a set of annual leave type IDs
    annual_type_ids = set()
    for lt in leave_types:
        name = (lt.get("name") or lt.get("type_name") or "").lower().strip()
        if any(a in name for a in ANNUAL_LEAVE_NAMES):
            annual_type_ids.add(lt["id"])
            print(f"  📌 Annual Leave Type detected: [{lt['id']}] '{lt.get('name') or lt.get('type_name')}'")

    # 2. Fetch all balances
    print("\n📋 Fetching all leave balances...")
    balances = get_all_leave_balances()
    print(f"  Found {len(balances)} balance records to process.\n")

    if not balances:
        print("  ⚠️  No leave balance records found.")
        return

    # 3. Process each balance
    processed = 0
    carried = 0
    reset = 0

    for b in balances:
        balance_id  = b.get("id")
        employee_id = b.get("employee_id", "?")
        type_id     = b.get("leave_type_id")
        allocated   = int(b.get("allocated_days") or b.get("total_days") or 0)
        used        = int(b.get("used_days") or 0)
        old_carry   = int(b.get("carried_over") or 0)
        remaining   = max(0, allocated - used)

        is_annual = type_id in annual_type_ids

        if is_annual:
            # Carry Forward: Add remaining to carried_over, reset used_days
            new_carry = old_carry + remaining
            updates = {"used_days": 0, "carried_over": new_carry}
            action_label = f"ANNUAL — carried {remaining} day(s) forward (total carried: {new_carry})"
            carried += 1
        else:
            # Full Reset: No carry forward
            updates = {"used_days": 0}
            action_label = f"RESET — {remaining} unused day(s) forfeited"
            reset += 1

        print(f"  👤 Employee {employee_id} | Type ID: {type_id} | {action_label}")

        if not dry_run:
            result = update_leave_balance(balance_id, updates)
            if result is None:
                print(f"    ⚠️  Warning: Failed to update balance ID {balance_id}")
            else:
                log_action(employee_id, f"Year {year} leave reset: {action_label}")
        
        processed += 1

    # 4. Summary
    print("\n" + "═" * 60)
    print(f"  ✅ Processing Complete!")
    print(f"  Total Processed : {processed} records")
    print(f"  Carried Forward : {carried} (Annual Leave)")
    print(f"  Reset to Zero   : {reset} (Other Leave Types)")
    if dry_run:
        print(f"\n  ℹ️  This was a DRY RUN. No data was changed.")
        print(f"  ℹ️  Run without --dry-run to apply changes.")
    else:
        print(f"\n  📝 All actions logged to sys_audit_logs.")
    print("═" * 60 + "\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="CorpHRM Annual Leave Reset & Carry Forward Engine")
    parser.add_argument("--dry-run", action="store_true", help="Preview changes without saving to DB")
    parser.add_argument("--year", type=int, default=None, help="Target year for the reset (default: current year)")
    args = parser.parse_args()

    run_leave_reset(dry_run=args.dry_run, target_year=args.year)
