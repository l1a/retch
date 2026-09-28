// SPDX-License-Identifier: GPL-3.0-or-later
// Tests for benches/dashboard/model.js. Run: node --test benches/dashboard/model.test.js
// (`just bench-check` does). Uses only Node's built-in test runner.
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");
const M = require("./model.js");

const P = "CLI execution - ";

function entry(id, benches) {
  return { commit: { id: id.padEnd(40, "0") }, date: 0, tool: "customSmallerIsBetter", benches };
}
function b(name, ms, extra) {
  const x = { name: P + name, unit: "ns", value: ms * 1e6 };
  if (extra !== undefined) x.extra = extra;
  return x;
}

test("labels by the version in extra, else the short commit", () => {
  assert.equal(M.pointLabel(entry("abc1234", [b("retch", 3, "v0.20.6")])), "v0.20.6");
  assert.equal(M.pointLabel(entry("abc1234", [b("retch", 3, "v0.20.6; battery")])), "v0.20.6");
  // Criterion entries carry no extra; any stamped bench in the run labels it.
  assert.equal(
    M.pointLabel(entry("abc1234", [{ name: "parse", unit: "ns", value: 1 }, b("retch", 3, "v1.2.3")])),
    "v1.2.3",
  );
  assert.equal(M.pointLabel(entry("abc1234", [b("retch", 3)])), "abc1234");
  // An extra that is not a version (the action allows free text) is not mistaken for one.
  assert.equal(M.pointLabel(entry("abc1234", [b("retch", 3, "hello")])), "abc1234");
});

test("power comes only from a stamped local point", () => {
  assert.equal(M.powerOf(entry("a", [b("retch", 3, "v0.20.6; AC")])), "AC");
  assert.equal(M.powerOf(entry("a", [b("retch", 3, "v0.20.6; battery")])), "battery");
  assert.equal(M.powerOf(entry("a", [b("retch", 3, "v0.20.6")])), null, "CI points have none");
  assert.equal(M.powerOf(entry("a", [b("retch", 3, "v0.20.6; weird")])), null);
});

test("values are converted from ns to ms, and only ns is trusted", () => {
  assert.equal(M.ms(entry("a", [b("retch", 3.5)]), P + "retch"), 3.5);
  assert.equal(M.ms(entry("a", [{ name: P + "retch", unit: "s", value: 1 }]), P + "retch"), null);
  assert.equal(M.ms(entry("a", []), P + "retch"), null);
});

test("ratio is retch / fastfetch from the same run, and needs both halves", () => {
  const def = M.PAIRS.find((p) => p.mode === "default");
  const entries = [
    entry("a", [b("retch", 3, "v0.20.6"), b("fastfetch (default)", 12, "v0.20.6")]),
    entry("b", [b("retch", 4, "v0.20.7")]), // fastfetch missing: no point, not a bogus one
    entry("c", [b("retch", 6, "v0.20.8"), b("fastfetch (default)", 3, "v0.20.8")]),
  ];
  const s = M.ratioSeries(entries, def);
  assert.deepEqual(s.map((p) => p.label), ["v0.20.6", "v0.20.8"]);
  assert.equal(s[0].ratio, 0.25, "retch 4x faster reads below 1.0");
  assert.equal(s[1].ratio, 2, "retch 2x slower reads above 1.0");
  assert.equal(s[0].retch, 3);
  assert.equal(s[0].fastfetch, 12);
});

test("each pair uses its own mode's series", () => {
  // A pairing mix-up (short retch against default fastfetch) would give 1/12 here.
  const short = M.PAIRS.find((p) => p.mode === "short");
  const e = [entry("a", [b("retch --short", 2, "v1.0.0"), b("fastfetch (short)", 4, "v1.0.0"),
    b("fastfetch (default)", 24, "v1.0.0")])];
  assert.equal(M.ratioSeries(e, short)[0].ratio, 0.5);
});

test("the pairs are exactly the series bench_labels pins", () => {
  // scripts/bench_labels.py is the source of truth for series names; a pair naming a series
  // it does not produce would draw an empty chart forever.
  const src = fs.readFileSync(path.join(__dirname, "..", "..", "scripts", "bench_labels.py"), "utf8");
  const block = src.split("EXPECTED_LABELS = (")[1].split(")\n")[0];
  const expected = [...block.matchAll(/CLI_PREFIX\}([^"]+)"/g)].map((m) => P + m[1]).sort();
  const paired = M.PAIRS.flatMap((p) => [p.retch, p.fastfetch]).sort();
  assert.deepEqual(paired, expected);
});

test("other series are the unpaired ones, sorted", () => {
  const e = [entry("a", [{ name: "zeta", unit: "ns", value: 1 }, b("retch", 3),
    { name: "alpha", unit: "ns", value: 1 }])];
  assert.deepEqual(M.otherSeriesNames(e), ["alpha", "zeta"]);
});

test("suites list local ones first", () => {
  const data = { entries: { "macOS Arm64 Benchmarks": [], "Local - Linux x64 (real hardware)": [],
    "Linux x64 Benchmarks": [] } };
  assert.deepEqual(M.suiteNames(data), ["Local - Linux x64 (real hardware)",
    "Linux x64 Benchmarks", "macOS Arm64 Benchmarks"]);
  assert.deepEqual(M.suiteNames({}), []);
});
