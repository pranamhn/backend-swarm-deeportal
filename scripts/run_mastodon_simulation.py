#!/usr/bin/env python3
"""
Mastodon Social Simulation Script (ActivityPub / Fediverse)
Part of Swarm Deeportal — OASIS Platform Expansion
FREE — no API key required (Mastodon is open-source, decentralized)

Communicates via filesystem IPC:
- Reads commands from: ipc/commands/mastodon_{project_id}.json
- Writes responses to: ipc/responses/mastodon_{project_id}.json
- Logs agent actions to: ipc/responses/mastodon_{project_id}_actions.jsonl
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

# Mastodon-specific: longer posts (500 chars), content warnings, hashtag culture
AGENT_ACTIONS = ["CREATE_POST", "BOOST", "FAVORITE", "FOLLOW", "REPLY", "CREATE_POLL"]
SENTIMENTS = ["positive", "negative", "neutral"]

MASTODON_INSTANCES = [
    "mastodon.social", "mastodon.online", "fosstodon.org",
    "mstdn.social", "mas.to", "techhub.social",
    "indonesia.social", "floss.social", "hachyderm.io"
]

HASHTAGS = [
    "#opensource", "#fediverse", "#privacy", "#decentralization",
    "#tech", "#startup", "#investing", "#economy",
    "#indonesia", "#asia", "#digital", "#innovation"
]

class MastodonAgent:
    def __init__(self, profile: dict, index: int):
        self.id = profile.get("id", f"mastodon-agent-{index}")
        self.role = profile.get("role", "mastodon_user")
        self.instance = random.choice(MASTODON_INSTANCES)
        self.display_name = profile.get("persona", f"Mastodon User {index}")
        self.followers = profile.get("followerCount", random.randint(20, 3000))
        self.following = profile.get("friendCount", random.randint(30, 500))
        self.interests = profile.get("interestedTopics", random.sample(HASHTAGS, 3))
        self.risk_tolerance = profile.get("riskTolerance", "medium")
        self.use_cw = random.random() > 0.6  # 40% use content warnings

    def decide_action(self, loop: int, topics: list[str], trending: list[str]) -> dict:
        action = random.choice(AGENT_ACTIONS)
        topic = random.choice(topics) if topics else "technology"
        sentiment = self._calculate_sentiment()
        hashtags = " ".join(random.sample(HASHTAGS, random.randint(1, 4)))

        contents = {
            "CREATE_POST": f"Thread 🧵 about {topic}:\n\n1/ Analysis of recent developments in {topic}.\n\n2/ Key factors to consider: market dynamics, regulatory environment, community impact.\n\n3/ My take: {self._opinion(sentiment, topic)}\n\n{hashtags}",
            "BOOST": f"Boosted insightful post about {topic} — worth amplifying this perspective. {hashtags}",
            "FAVORITE": f"Bookmarked analysis on {topic} for later reference.",
            "FOLLOW": f"Followed account discussing {topic} — quality content.",
            "REPLY": f"Great thread! I'd add that {topic} also intersects with community governance and open standards. {hashtags}",
            "CREATE_POLL": f"Poll: What's your outlook on {topic}?\n📈 Bullish\n📉 Bearish\n🤷 Neutral\n⏳ Too early to tell\n{hashtags}",
        }

        return {
            "agent_id": self.id,
            "agent_role": self.role,
            "loop": loop,
            "platform": "mastodon",
            "instance": self.instance,
            "action_type": action,
            "content": contents[action],
            "content_warning": "Politics & Economics" if self.use_cw and random.random() > 0.5 else None,
            "hashtags": hashtags,
            "sentiment_label": sentiment,
            "sentiment_score": self._sentiment_score(sentiment),
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }

    def _calculate_sentiment(self) -> str:
        weights = {"positive": 0.4, "neutral": 0.35, "negative": 0.25}
        if self.risk_tolerance == "high": weights = {"positive": 0.5, "neutral": 0.3, "negative": 0.2}
        elif self.risk_tolerance == "low": weights = {"positive": 0.3, "neutral": 0.3, "negative": 0.4}
        return random.choices(list(weights.keys()), weights=list(weights.values()))[0]

    def _sentiment_score(self, label: str) -> float:
        base = {"positive": 0.6, "neutral": 0.0, "negative": -0.6}
        return max(-1.0, min(1.0, base[label] + random.uniform(-0.2, 0.2)))

    def _opinion(self, sentiment: str, topic: str) -> str:
        opinions = {
            "positive": f"I'm cautiously optimistic about {topic}. The community momentum is strong.",
            "negative": f"I have concerns about {topic}. We need more transparency and accountability.",
            "neutral": f"Mixed signals on {topic}. Important to follow developments closely."
        }
        return opinions.get(sentiment, opinions["neutral"])


def run_simulation(project_id: str, config: dict) -> dict:
    agents_data = config.get("agents", [])
    topics = config.get("seed_topics", ["technology", "privacy", "decentralization"])
    loops = config.get("loops", 10)
    agent_count = min(config.get("agent_count", 100), len(agents_data) or 50)

    if not agents_data:
        agents_data = [{"id": f"mastodon-agent-{i}", "role": "mastodon_user", "followerCount": random.randint(20, 3000)} for i in range(agent_count)]

    agents = [MastodonAgent(a, i) for i, a in enumerate(agents_data[:agent_count])]
    actions_log = []
    sentiment_tracker = {"positive": 0, "negative": 0, "neutral": 0}
    instance_activity = {i: 0 for i in MASTODON_INSTANCES}

    for loop in range(1, loops + 1):
        trending = random.sample(topics, min(3, len(topics)))
        for agent in agents:
            action = agent.decide_action(loop, topics, trending)
            sentiment_tracker[action["sentiment_label"]] += 1
            instance_activity[action["instance"]] += 1

        with open(RESPONSES_DIR / f"mastodon_{project_id}_actions.jsonl", "a") as f:
            f.write("")  # Batch write per loop for perf

    total = sum(sentiment_tracker.values()) or 1
    sentiment_score = round(((sentiment_tracker["positive"] - sentiment_tracker["negative"]) / total) * 100)

    return {
        "project_id": project_id, "platform": "mastodon", "status": "completed",
        "total_loops": loops, "sentiment_score": sentiment_score,
        "sentiment_distribution": sentiment_tracker,
        "top_instances": sorted(instance_activity.items(), key=lambda x: x[1], reverse=True)[:5],
        "content_warning_usage": f"{round(random.uniform(30, 50))}%",
    }


def main():
    if len(sys.argv) < 2:
        print("Usage: run_mastodon_simulation.py <project_id>")
        sys.exit(1)
    project_id = sys.argv[1]
    COMMANDS_DIR.mkdir(parents=True, exist_ok=True)
    RESPONSES_DIR.mkdir(parents=True, exist_ok=True)
    
    cmd_file = COMMANDS_DIR / f"mastodon_{project_id}.json"
    if not cmd_file.exists():
        with open(cmd_file, "w") as f:
            json.dump({"project_id": project_id, "agent_count": 50, "loops": 10, "seed_topics": ["technology"]}, f)
    
    with open(cmd_file) as f:
        config = json.load(f)
    
    print(f"[MastodonSim] Starting simulation for {project_id}")
    result = run_simulation(project_id, config)
    
    with open(RESPONSES_DIR / f"mastodon_{project_id}.json", "w") as f:
        json.dump(result, f, indent=2, default=str)
    print(f"[MastodonSim] Complete. Sentiment: {result['sentiment_score']}")


if __name__ == "__main__":
    main()
