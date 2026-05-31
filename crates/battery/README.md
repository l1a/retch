# retch-battery

A lightweight, zero-dependency, cross-platform battery querying library written in Rust.

This library was extracted from the core of `retch` (`retch-cli`) to serve as a clean, dependency-free alternative to other unmaintained Rust battery libraries.

## Features

- **Zero dependencies**: Does not transitively compile Nix, Libc, or other heavy dependencies.
- **Cross-platform support**:
  - **Linux**: Reads information directly from `/sys/class/power_supply/`.
  - **macOS**: Queries Apple's IOPS APIs (`IOPowerSources`).
  - **Windows**: Queries battery status via PowerShell and WMI commands.
- **Detailed statistics**:
  - Battery capacity percentage (0–100%)
  - Power/charging state (`Charging`, `Discharging`, `Full`, `Unknown`)
  - Battery health (percentage of design capacity)
  - Estimated time remaining (to empty or full charge)
  - Battery hardware details (vendor/manufacturer and model name)

## API Usage

Add `retch-battery` to your workspace or dependencies.

```rust
use retch_battery::{get_battery_info, BatteryState};

fn main() {
    if let Some(info) = get_battery_info() {
        println!("Battery Percentage: {}%", info.percentage);
        println!("Battery State: {:?}", info.state);
        
        if let Some(health) = info.health {
            println!("Battery Health: {:.1}%", health);
        }
        
        if let Some(time) = info.time_remaining {
            let mins = time.as_secs() / 60;
            println!("Time Remaining: {}h {}m", mins / 60, mins % 60);
        }
        
        if let Some(vendor) = info.vendor {
            println!("Manufacturer: {}", vendor);
        }
        
        if let Some(model) = info.model {
            println!("Model: {}", model);
        }
    } else {
        println!("No battery detected or unsupported platform.");
    }
}
```

## Structure

- `BatteryInfo` (struct):
  - `percentage: f32`
  - `health: Option<f32>`
  - `state: BatteryState`
  - `time_remaining: Option<std::time::Duration>`
  - `vendor: Option<String>`
  - `model: Option<String>`
- `BatteryState` (enum):
  - `Charging`
  - `Discharging`
  - `Full`
  - `Unknown`

## License

This library is licensed under the GPL-3.0 or later license.
