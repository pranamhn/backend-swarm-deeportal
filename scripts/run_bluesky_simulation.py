#!/usr/bin/env python3
"""
Bluesky Social Simulation Script (AT Protocol)
Part of Swarm Deeportal — OASIS Platform Expansion
FREE — Bluesky API is open, no API key required for public data

Communicates via filesystem IPC:
- Reads commands from: ipc/commands/bluesky_{project_id}.json
- Writes responses to: ipc/responses/bluesky_{project_id}.json
"""

import json
import os
import sys
import random
from datetime import datetime, timezone
from pathlib import Path

IPC_DIR = Path(os.environ.get("SWARM_IPC_DIR", "ipc"))
COMMANDS_DIR = IPC_DIR / "commands"
RESPONSES_DIR = IPC_DIR / "responses"

# Bluesky: 300 char posts, no algorithm, feed-based discovery, custom feeds
AGENT_ACTIONS = ["CREATE_POST", "REPOST", "LIKE", "FOLLOW", "REPLY", "QUOTE_POST"]
SENTIMENTS = ["positive", "negative", "neutral"]

FEED_TYPES = ["following", "discover", "popular_with_friends", "trending", "science", "tech"]

class BlueskyAgent:
    def __init__(self, profile: dict, index: int):
        self.id = profile.get("id", f"bluesky-agent-{index}")
        self.role = profile.get("role", "bluesky_user")
        self.handle = f"user{index}.bsky.social"
        self.display_name = profile.get("persona", f"Bluesky User {index}")
        self.followers = profile.get("followerCount", random.randint(10, 2000))
        self.following = profile.get("friendCount", random.randint(20, 300))
        self.interests = profile.get("interestedTopics", [])
        self.risk_tolerance = profile.get("riskTolerance", "medium")
        self.preferred_feed = random.choice(FEED_TYPES)

    def decide_action(self, loop: int, topics: list[str], trending: list[str]) -> dict:
        action = random.choice(AGENT_ACTIONS)
        topic = random.choice(topics) if topics else "tech"
        sentiment = self._calculate_sentiment()

        # Bluesky-style: shorter, more casual
        contents = {
            "CREATE_POST": f"hot take on {topic}: {self._hot_take(sentiment, topic)} 🦋",
            "REPOST": f"reposting this — important perspective on {topic}",
            "LIKE": f"liked post re: {topic}",
            "FOLLOW": f"followed @{topic.replace(' ', '')}.bsky.social — quality posts",
            "REPLY": f"good point! also worth considering the long-term implications for {topic}",
            "QUOTE_POST": f"adding to this discussion on {topic} — here's my take 🧵",
        }

        return {
            "agent_id": self.id, "agent_role": self.role, "loop": loop,
            "platform": "bluesky", "handle": self.handle,
            "action_type": action, "content": contents[action],
            "feed": self.preferred_feed,
            "sentiment_label": sentiment,
            "sentiment_score": self._sentiment_score(sentiment),
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }

    def _calculate_sentiment(self) -> str:
        weights = {"positive": 0.45, "neutral": 0.30, "negative": 0.25}
        return random.choices(list(weights.keys()), weights=list(weights.values()))[0]

    def _sentiment_score(self, label: str) -> float:
        base = {"positive": 0.6, "neutral": 0.0, "negative": -0.6}
        return max(-1.0, min(1.0, base[label] + random.uniform(-0.2, 0.2)))

    def _hot_take(self, sentiment: str, topic: str) -> str:
        takes = {
            "positive": f"people sleeping on {topic} fr fr. this is gonna be huge",
            "negative": f"not gonna lie, {topic} is looking rough rn. need to see real change",
            "neutral": f"interesting to see how {topic} plays out. lot of variables here"
        }
        return takes.get(sentiment, takes["neutral"])


def run_simulation(project_id: str, config: dict) -> dict:
    agents_data = config.get("agents", [])
    topics = config.get("seed_topics", ["tech", "science", "politics"])
    loops = config.get("loops", 10)
    agent_count = min(config.get("agent_count", 100), len(agents_data) or 50)

    if not agents_data:
        agents_data = [{"id": f"bluesky-agent-{i}", "role": "bluesky_user", "followerCount": random.randint(10, 2000)} for i in range(agent_count)]

    agents = [BlueskyAgent(a, i) for i, a in enumerate(agents_data[:agent_count])]
    sentiment_tracker = {"positive": 0, "negative": 0, "neutral": 0}

    for loop in range(1, loops + 1):
        trending = random.sample(topics, min(3, len(topics)))
        for agent in agents:
            action = agent.decide_action(loop, topics, trending)
            sentiment_tracker[action["sentiment_label"]] += 1

    total = sum(sentiment_tracker.values()) or 1
    sentiment_score = round(((sentiment_tracker["positive"] - sentiment_tracker["negative"]) / total) * 100)

    return {
        "project_id": project_id, "platform": "bluesky", "status": "completed",
        "total_loops": loops, "sentiment_score": sentiment_score,
        "sentiment_distribution": sentiment_tracker,
        "feed_distribution": {f: random.randint(10, 100) for f in FEED_TYPES},
    }


def main():
    if len(sys.argv) < 2:
        print("Usage: run_bluesky_simulation.py <project_id>")
        sys.exit(1)
    project_id = sys.argv[1]
    COMMANDS_DIR.mkdir(parents=True, exist_ok=True)
    RESPONSES_DIR.mkdir(parents=True, exist_ok=True)
    
    cmd_file = COMMANDS_DIR / f"bluesky_{project_id}.json"
    if not cmd_file.exists():
        with open(cmd_file, "w") as f:
            json.dump({"project_id": project_id, "agent_count": 50, "loops": 10, "seed_topics": ["tech"]}, f)
    
    with open(cmd_file) as f:
        config = json.load(f)
    
    print(f"[BlueskySim] Starting simulation for {project_id}")
    result = run_simulation(project_id, config)
    
    with open(RESPONSES_DIR / f"bluesky_{project_id}.json", "w") as f:
        json.dump(result, f, indent=2, default=str)
    print(f"[BlueskySim] Complete. Sentiment: {result['sentiment_score']}")


if __name__ == "__main__":
    main()
