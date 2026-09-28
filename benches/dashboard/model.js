// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 Ken Tobias
//
// Data model for the benchmark dashboard (benches/dashboard/index.html), kept free of the
// DOM so model.test.js can run it under Node. Reads the `window.BENCHMARK_DATA` shape that
// github-action-benchmark and scripts/upload_local_bench.py write to gh-pages dev/bench/data.js.
//
// Points are labelled by the retch VERSION, which scripts/bench_meta.py stamps into each
// CLI benchmark's `extra` ("v0.20.6", or "v0.20.6; battery" for a local run). Every PR bumps
// the version, so on main one version is one merge; a commit hash told a reader nothing.
(function (root) {
  "use strict";

  var PREFIX = "CLI execution - ";

  // The four retch/fastfetch pairs scripts/cli_bench.py runs, in mode order. Series names
  // are an API (bench_labels.EXPECTED_LABELS): renaming one forks a series.
  var PAIRS = [
    { mode: "short", retch: PREFIX + "retch --short", fastfetch: PREFIX + "fastfetch (short)" },
    { mode: "default", retch: PREFIX + "retch", fastfetch: PREFIX + "fastfetch (default)" },
    { mode: "long", retch: PREFIX + "retch --long", fastfetch: PREFIX + "fastfetch (long)" },
    { mode: "full", retch: PREFIX + "retch --full", fastfetch: PREFIX + "fastfetch (full)" },
  ];

  var VERSION = /^v\d+\.\d+\.\d+/;

  function extraOf(entry) {
    var benches = entry.benches || [];
    for (var i = 0; i < benches.length; i++) {
      if (typeof benches[i].extra === "string" && VERSION.test(benches[i].extra)) {
        return benches[i].extra;
      }
    }
    return null;
  }

  // "v0.20.6" from a stamped entry; the short commit id otherwise, so an unstamped point is
  // still placed rather than dropped.
  function pointLabel(entry) {
    var extra = extraOf(entry);
    if (extra) return extra.split("; ")[0];
    var id = (entry.commit && entry.commit.id) || "";
    return id.slice(0, 7) || "?";
  }

  // "AC", "battery", or null (CI points, and anything unstamped).
  function powerOf(entry) {
    var extra = extraOf(entry);
    if (!extra) return null;
    var power = extra.split("; ")[1];
    return power === "AC" || power === "battery" ? power : null;
  }

  // A series' value in milliseconds, or null if the entry lacks it. Values are stored in ns.
  function ms(entry, name) {
    var benches = entry.benches || [];
    for (var i = 0; i < benches.length; i++) {
      var b = benches[i];
      if (b.name === name && typeof b.value === "number" && b.unit === "ns") {
        return b.value / 1e6;
      }
    }
    return null;
  }

  // One point per entry that has BOTH halves of the pair, measured in the same run -- which
  // is the point of a ratio: runner speed moves both sides together and cancels out.
  function ratioSeries(entries, pair) {
    var out = [];
    entries.forEach(function (e) {
      var r = ms(e, pair.retch);
      var f = ms(e, pair.fastfetch);
      if (r !== null && f !== null && f > 0) {
        out.push({ label: pointLabel(e), power: powerOf(e), ratio: r / f, retch: r, fastfetch: f });
      }
    });
    return out;
  }

  function absoluteSeries(entries, name) {
    var out = [];
    entries.forEach(function (e) {
      var v = ms(e, name);
      if (v !== null) out.push({ label: pointLabel(e), power: powerOf(e), ms: v });
    });
    return out;
  }

  // Every series that is not part of a retch/fastfetch pair (the criterion benchmarks),
  // sorted, so the page can list them without knowing their names.
  function otherSeriesNames(entries) {
    var paired = {};
    PAIRS.forEach(function (p) {
      paired[p.retch] = true;
      paired[p.fastfetch] = true;
    });
    var seen = {};
    entries.forEach(function (e) {
      (e.benches || []).forEach(function (b) {
        if (!paired[b.name]) seen[b.name] = true;
      });
    });
    return Object.keys(seen).sort();
  }

  // Suites in display order: local (real hardware) first, then CI, each alphabetically.
  function suiteNames(data) {
    var names = Object.keys((data && data.entries) || {});
    var local = names.filter(function (n) { return n.indexOf("Local") === 0; }).sort();
    var ci = names.filter(function (n) { return n.indexOf("Local") !== 0; }).sort();
    return local.concat(ci);
  }

  var api = {
    PAIRS: PAIRS,
    pointLabel: pointLabel,
    powerOf: powerOf,
    ms: ms,
    ratioSeries: ratioSeries,
    absoluteSeries: absoluteSeries,
    otherSeriesNames: otherSeriesNames,
    suiteNames: suiteNames,
  };
  root.RetchBench = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
