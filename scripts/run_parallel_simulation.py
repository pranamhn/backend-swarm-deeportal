#!/usr/bin/env python3
"""
Parallel Social Simulation Runner
Launches up to 4 platforms in parallel using multiprocessing:
  - Twitter/X  (run_twitter_simulation.py)
  - Reddit     (run_reddit_simulation.py)
  - Mastodon   (run_mastodon_simulation.py) 🆕 FREE
  - Bluesky    (run_bluesky_simulation.py)  🆕 FREE

All platforms are FREE — no paid API keys required.
"""

import json
import sys
import subprocess
from pathlib import Path
from multiprocessing import Process
from datetime import datetime, timezone

IPC_DIR = Path("ipc")
COMMANDS_DIR = IPC_DIR / "commands"
RESPONSES_DIR = IPC_DIR / "responses"

PLATFORM_SCRIPTS = {
    "twitter": "scripts/run_twitter_simulation.py",
    "reddit": "scripts/run_reddit_simulation.py",
    "mastodon": "scripts/run_mastodon_simulation.py",
    "bluesky": "scripts/run_bluesky_simulation.py",
}

def run_platform(platform: str, project_id: str):
    script = PLATFORM_SCRIPTS.get(platform)
    if script:
        subprocess.run([sys.executable, script, project_id], check=False)

def main():
    if len(sys.argv) < 2:
        print("Usage: run_parallel_simulation.py <project_id> [platforms]")
        print("  platforms: comma-separated (twitter,reddit,mastodon,bluesky)")
        print("  default: all 4 platforms")
        sys.exit(1)
    
    project_id = sys.argv[1]
    requested = sys.argv[2].split(",") if len(sys.argv) > 2 else list(PLATFORM_SCRIPTS.keys())
    platforms = [p for p in requested if p in PLATFORM_SCRIPTS]
    
    COMMANDS_DIR.mkdir(parents=True, exist_ok=True)
    RESPONSES_DIR.mkdir(parents=True, exist_ok=True)
    
    print(f"[ParallelRunner] Starting simulation for {project_id}")
    print(f"[ParallelRunner] Platforms: {platforms}")
    print(f"[ParallelRunner] 💰 Cost: FREE (all platforms)")
    
    processes = []
    for platform in platforms:
        p = Process(target=run_platform, args=(platform, project_id))
        p.start()
        processes.append((platform, p))
    
    for name, p in processes:
        p.join()
        print(f"[ParallelRunner] {name} ✅")
    
    # Merge results
    results = {"project_id": project_id, "platforms": {}}
    for platform, _ in processes:
        resp = RESPONSES_DIR / f"{platform}_{project_id}.json"
        if resp.exists():
            with open(resp) as f:
                results["platforms"][platform] = json.load(f)
    
    sentiments = [r.get("sentiment_score", 0) for r in results["platforms"].values()]
    results["cross_platform_sentiment"] = round(sum(sentiments) / len(sentiments)) if sentiments else 0
    results["completed_at"] = datetime.now(timezone.utc).isoformat()
    
    merged = RESPONSES_DIR / f"parallel_{project_id}.json"
    with open(merged, "w") as f:
        json.dump(results, f, indent=2)
    
    print(f"[ParallelRunner] Cross-platform sentiment: {results['cross_platform_sentiment']}")
    print(f"[ParallelRunner] Results: {merged}")

if __name__ == "__main__":
    main()
