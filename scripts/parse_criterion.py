#!/usr/bin/env python3
import os
import json
import sys

def main():
    criterion_dir = "target/criterion"
    if not os.path.isdir(criterion_dir):
        print(f"Error: {criterion_dir} is not a directory", file=sys.stderr)
        sys.exit(1)
        
    results = []
    
    for name in os.listdir(criterion_dir):
        if name == "report":
            continue
        estimates_path = os.path.join(criterion_dir, name, "new", "estimates.json")
        if os.path.isfile(estimates_path):
            try:
                with open(estimates_path, 'r') as f:
                    data = json.load(f)
                # Mean point estimate in nanoseconds
                val = data["mean"]["point_estimate"]
                results.append({
                    "name": name,
                    "value": val,
                    "unit": "ns"
                })
            except Exception as e:
                print(f"Warning: Failed to parse {estimates_path}: {e}", file=sys.stderr)
                
    # Sort by name for consistency
    results.sort(key=lambda x: x["name"])
    
    with open("benchmark_result.json", "w") as f:
        json.dump(results, f, indent=2)
        
    print(f"Successfully generated benchmark_result.json with {len(results)} benchmarks:")
    for r in results:
        print(f"  {r['name']}: {r['value']} {r['unit']}")

if __name__ == "__main__":
    main()
