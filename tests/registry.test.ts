import { describe, it, expect } from "vitest";
import { searchPackages, getPackage } from "../src/lib/registry.js";
import type { RegistryIndex } from "../src/types/index.js";

const mockIndex: RegistryIndex = {
  version: 1,
  updated: "2026-05-12",
  packages: [
    {
      name: "karpathy",
      version: "1.0.0",
      description: "Karpathy CLAUDE.md for improved coding behavior",
      author: "forrestchang",
      repository: "https://github.com/forrestchang/andrej-karpathy-skills",
      tags: ["skills", "coding", "best-practices"],
      type: "skill",
      stars: 126000,
    },
    {
      name: "caveman",
      version: "1.0.0",
      description: "Reduce token consumption by 65% through simplified communication",
      author: "JuliusBrussee",
      repository: "https://github.com/JuliusBrussee/caveman",
      tags: ["tokens", "optimization"],
      type: "skill",
      stars: 58000,
    },
    {
      name: "design-md",
      version: "1.0.0",
      description: "DESIGN.md files for coding agents to generate matching UIs",
      author: "VoltAgent",
      repository: "https://github.com/VoltAgent/awesome-design-md",
      tags: ["design", "ui", "frontend"],
      type: "skill",
      stars: 75000,
    },
    {
      name: "git-hooks",
      version: "0.2.0",
      description: "Pre-commit hooks for Claude Code workflows",
      author: "testuser",
      repository: "https://github.com/testuser/git-hooks",
      tags: ["hooks", "git", "automation"],
      type: "hook",
      stars: 500,
    },
  ],
};

describe("searchPackages", () => {
  it("finds packages by name", () => {
    const results = searchPackages(mockIndex, "karpathy");
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("karpathy");
  });

  it("finds packages by description keyword", () => {
    const results = searchPackages(mockIndex, "token");
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("caveman");
  });

  it("finds packages by tag", () => {
    const results = searchPackages(mockIndex, "design");
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("design-md");
  });

  it("returns multiple matches sorted by stars descending", () => {
    const results = searchPackages(mockIndex, "coding");
    expect(results.length).toBeGreaterThanOrEqual(2);
    for (let i = 1; i < results.length; i++) {
      expect((results[i - 1].stars ?? 0)).toBeGreaterThanOrEqual(
        results[i].stars ?? 0
      );
    }
  });

  it("returns empty array for no matches", () => {
    const results = searchPackages(mockIndex, "xyznonexistent");
    expect(results).toHaveLength(0);
  });

  it("is case-insensitive", () => {
    const results = searchPackages(mockIndex, "KARPATHY");
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("karpathy");
  });
});

describe("getPackage", () => {
  it("finds a package by exact name", () => {
    const pkg = getPackage(mockIndex, "caveman");
    expect(pkg).toBeDefined();
    expect(pkg!.name).toBe("caveman");
  });

  it("is case-insensitive", () => {
    const pkg = getPackage(mockIndex, "CAVEMAN");
    expect(pkg).toBeDefined();
  });

  it("returns undefined for missing package", () => {
    const pkg = getPackage(mockIndex, "nonexistent");
    expect(pkg).toBeUndefined();
  });
});
