#!/usr/bin/env python3
import os
import json
import sys

def main():
    criterion_dir = "target/criterion"
    results = []
    
    # 1. Parse Criterion benchmarks if directory exists
    if os.path.isdir(criterion_dir):
        for name in os.listdir(criterion_dir):
            if name == "report":
                continue
            estimates_path = os.path.join(criterion_dir, name, "new", "estimates.json")
            if os.path.isfile(estimates_path):
                try:
                    with open(estimates_path, 'r') as f:
                        data = json.load(f)
                    val = data["mean"]["point_estimate"]
                    results.append({
                        "name": name,
                        "value": val,
                        "unit": "ns"
                    })
                except Exception as e:
                    print(f"Warning: Failed to parse {estimates_path}: {e}", file=sys.stderr)
    else:
        print("Warning: target/criterion directory not found.", file=sys.stderr)

    # 2. Parse Hyperfine CLI benchmarks if file exists
    hyperfine_path = "hyperfine_result.json"
    if os.path.isfile(hyperfine_path):
        try:
            with open(hyperfine_path, 'r') as f:
                hp_data = json.load(f)
            for res in hp_data.get("results", []):
                cmd = res.get("command")
                # Map command name to a cleaner label
                if "retch" in cmd:
                    if "--short" in cmd:
                        name = "CLI execution - retch --short"
                    elif "--long" in cmd:
                        name = "CLI execution - retch --long"
                    else:
                        name = "CLI execution - retch"
                elif "fastfetch" in cmd:
                    if "-c none" in cmd:
                        name = "CLI execution - fastfetch -c none"
                    elif "-c all" in cmd:
                        name = "CLI execution - fastfetch -c all"
                    else:
                        name = "CLI execution - fastfetch"
                else:
                    name = f"CLI execution - {cmd}"
                
                # mean is in seconds, convert to nanoseconds
                val_ns = res.get("mean") * 1_000_000_000
                results.append({
                    "name": name,
                    "value": val_ns,
                    "unit": "ns"
                })
        except Exception as e:
            print(f"Warning: Failed to parse {hyperfine_path}: {e}", file=sys.stderr)
    else:
        print("Warning: hyperfine_result.json not found.", file=sys.stderr)

    if not results:
        print("Error: No benchmark results collected.", file=sys.stderr)
        sys.exit(1)
        
    # Sort by name for consistency
    results.sort(key=lambda x: x["name"])
    
    with open("benchmark_result.json", "w") as f:
        json.dump(results, f, indent=2)
        
    print(f"Successfully generated benchmark_result.json with {len(results)} benchmarks:")
    for r in results:
        print(f"  {r['name']}: {r['value']} {r['unit']}")

if __name__ == "__main__":
    main()
