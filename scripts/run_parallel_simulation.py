#!/usr/bin/env python3
"""
Parallel Simulation Runner
Launches Twitter + Reddit simulations in parallel using multiprocessing.
"""

import json
import sys
import subprocess
import time
from pathlib import Path
from multiprocessing import Process
from datetime import datetime, timezone

IPC_DIR = Path("ipc")
COMMANDS_DIR = IPC_DIR / "commands"
RESPONSES_DIR = IPC_DIR / "responses"


def run_twitter(project_id: str):
    subprocess.run([sys.executable, "scripts/run_twitter_simulation.py", project_id], check=False)


def run_reddit(project_id: str):
    subprocess.run([sys.executable, "scripts/run_reddit_simulation.py", project_id], check=False)


def main():
    if len(sys.argv) < 2:
        print("Usage: run_parallel_simulation.py <project_id>")
        sys.exit(1)
    
    project_id = sys.argv[1]
    
    # Ensure dirs
    COMMANDS_DIR.mkdir(parents=True, exist_ok=True)
    RESPONSES_DIR.mkdir(parents=True, exist_ok=True)
    
    # Read parallel config
    config_file = COMMANDS_DIR / f"parallel_{project_id}.json"
    if not config_file.exists():
        # Generate default config
        config = {
            "project_id": project_id,
            "platforms": ["twitter", "reddit"],
            "agent_count": 100,
            "loops": 10,
            "seed_topics": ["economy", "politics", "technology"],
        }
        config_file.parent.mkdir(parents=True, exist_ok=True)
        with open(config_file, "w") as f:
            json.dump(config, f)
        
        # Write platform-specific configs
        for platform in ["twitter", "reddit"]:
            platform_config = {**config, "platform": platform}
            with open(COMMANDS_DIR / f"{platform}_{project_id}.json", "w") as f:
                json.dump(platform_config, f)
    
    with open(config_file) as f:
        config = json.load(f)
    
    platforms = config.get("platforms", ["twitter", "reddit"])
    
    print(f"[ParallelRunner] Starting parallel simulation for {project_id}")
    print(f"[ParallelRunner] Platforms: {platforms}")
    
    processes = []
    if "twitter" in platforms:
        p = Process(target=run_twitter, args=(project_id,))
        p.start()
        processes.append(("twitter", p))
    
    if "reddit" in platforms:
        p = Process(target=run_reddit, args=(project_id,))
        p.start()
        processes.append(("reddit", p))
    
    # Wait for all to complete
    for name, p in processes:
        p.join()
        print(f"[ParallelRunner] {name} simulation finished")
    
    # Merge results
    results = {"project_id": project_id, "platforms": {}}
    for platform, _ in processes:
        response_file = RESPONSES_DIR / f"{platform}_{project_id}.json"
        if response_file.exists():
            with open(response_file) as f:
                results["platforms"][platform] = json.load(f)
    
    # Calculate cross-platform sentiment
    sentiments = [r.get("sentiment_score", 0) for r in results["platforms"].values()]
    results["cross_platform_sentiment"] = round(sum(sentiments) / len(sentiments)) if sentiments else 0
    results["completed_at"] = datetime.now(timezone.utc).isoformat()
    
    merged_file = RESPONSES_DIR / f"parallel_{project_id}.json"
    with open(merged_file, "w") as f:
        json.dump(results, f, indent=2)
    
    print(f"[ParallelRunner] All done. Cross-platform sentiment: {results['cross_platform_sentiment']}")
    print(f"[ParallelRunner] Results: {merged_file}")


if __name__ == "__main__":
    main()
