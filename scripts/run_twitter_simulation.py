#!/usr/bin/env python3
"""
OASIS-style Twitter/X Social Simulation Script
Part of Swarm Deeportal — Mode A: Social Sentiment

Runs as a subprocess, communicates via filesystem IPC:
- Reads commands from: ipc/commands/twitter_{project_id}.json
- Writes responses to: ipc/responses/twitter_{project_id}.json
- Logs agent actions to: ipc/responses/twitter_{project_id}_actions.jsonl
"""

import json
import os
import sys
import time
import random
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

# ── Config ──
IPC_DIR = Path(os.environ.get("SWARM_IPC_DIR", "ipc"))
COMMANDS_DIR = IPC_DIR / "commands"
RESPONSES_DIR = IPC_DIR / "responses"

AGENT_ACTIONS = ["CREATE_POST", "LIKE", "REPOST", "FOLLOW", "COMMENT", "QUOTE_TWEET"]
SENTIMENTS = ["positive", "negative", "neutral"]
TOPICS = [
    "economy", "technology", "politics", "healthcare", "education",
    "infrastructure", "corruption", "social welfare", "environment", "digital transformation"
]

class TwitterAgent:
    def __init__(self, profile: dict, index: int):
        self.id = profile.get("id", f"twitter-agent-{index}")
        self.role = profile.get("role", "twitter_user")
        self.bio = profile.get("bio", "")
        self.persona = profile.get("persona", "")
        self.followers = profile.get("followerCount", random.randint(50, 5000))
        self.following = profile.get("friendCount", random.randint(30, 500))
        self.interests = profile.get("interestedTopics", random.sample(TOPICS, 3))
        self.risk_tolerance = profile.get("riskTolerance", "medium")
        self.goal = profile.get("goal", "engage with trending topics")
        
    def decide_action(self, loop: int, topics: list[str], trending: list[str]) -> dict:
        action = random.choice(AGENT_ACTIONS)
        
        if action == "CREATE_POST":
            topic = random.choice(topics or TOPICS)
            sentiment = self._calculate_sentiment(topic)
            content = self._generate_post(topic, sentiment)
        elif action in ("LIKE", "REPOST"):
            content = f"Engaged with trending content about {random.choice(trending or topics)}"
            sentiment = random.choice(SENTIMENTS)
        elif action == "COMMENT":
            content = f"Commenting on {random.choice(trending or topics)}"
            sentiment = random.choice(SENTIMENTS)
        else:
            content = f"Quote-tweeted about {random.choice(topics or TOPICS)}"
            sentiment = random.choice(SENTIMENTS)
            
        return {
            "agent_id": self.id,
            "agent_role": self.role,
            "loop": loop,
            "platform": "twitter",
            "action_type": action,
            "content": content,
            "sentiment_label": sentiment,
            "sentiment_score": self._sentiment_score(sentiment),
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
    
    def _calculate_sentiment(self, topic: str) -> str:
        weights = {"positive": 0.4, "neutral": 0.35, "negative": 0.25}
        if self.risk_tolerance == "high":
            weights = {"positive": 0.5, "neutral": 0.3, "negative": 0.2}
        elif self.risk_tolerance == "low":
            weights = {"positive": 0.3, "neutral": 0.3, "negative": 0.4}
        return random.choices(list(weights.keys()), weights=list(weights.values()))[0]
    
    def _sentiment_score(self, label: str) -> float:
        base = {"positive": 0.6, "neutral": 0.0, "negative": -0.6}
        noise = random.uniform(-0.2, 0.2)
        return max(-1.0, min(1.0, base[label] + noise))
    
    def _generate_post(self, topic: str, sentiment: str) -> str:
        templates = {
            "positive": [
                f"Great progress on {topic}! The future looks bright. 🚀",
                f"Impressed by the latest developments in {topic}. Keep it up!",
                f"{topic.replace('_', ' ').title()} is really taking off. Bullish! 📈"
            ],
            "negative": [
                f"Disappointed with the direction of {topic}. Need better leadership.",
                f"{topic.replace('_', ' ').title()} situation is concerning. Time for change.",
                f"Can't believe the state of {topic}. We deserve better. 😤"
            ],
            "neutral": [
                f"Interesting developments in {topic}. Let's see how this plays out.",
                f"Following the {topic} conversation closely. Mixed signals so far.",
                f"Some good, some bad in {topic}. Balanced perspective needed."
            ]
        }
        return random.choice(templates.get(sentiment, templates["neutral"]))


def run_simulation(project_id: str, config: dict) -> dict:
    """Main simulation loop."""
    
    agents_data = config.get("agents", [])
    topics = config.get("seed_topics", TOPICS)
    loops = config.get("loops", 10)
    agent_count = min(config.get("agent_count", 100), len(agents_data) or 50)
    
    # Generate agents if not provided
    if not agents_data:
        agents_data = [
            {
                "id": f"twitter-agent-{i}",
                "role": random.choice(["twitter_user", "political_influencer", "independent_journalist", "swing_voter"]),
                "followerCount": random.randint(50, 5000),
                "friendCount": random.randint(30, 500),
                "riskTolerance": random.choice(["low", "medium", "high"]),
                "interestedTopics": random.sample(topics, min(3, len(topics))),
            }
            for i in range(agent_count)
        ]
    
    agents = [TwitterAgent(a, i) for i, a in enumerate(agents_data[:agent_count])]
    
    actions_log = []
    sentiment_tracker = {"positive": 0, "negative": 0, "neutral": 0}
    
    for loop in range(1, loops + 1):
        trending = random.sample(topics, min(3, len(topics)))
        loop_actions = []
        
        for agent in agents:
            action = agent.decide_action(loop, topics, trending)
            loop_actions.append(action)
            sentiment_tracker[action["sentiment_label"]] += 1
        
        actions_log.append({
            "loop": loop,
            "action_count": len(loop_actions),
            "sentiment_distribution": dict(sentiment_tracker),
            "trending_topics": trending,
        })
        
        # Write incremental results
        with open(RESPONSES_DIR / f"twitter_{project_id}_actions.jsonl", "a") as f:
            for a in loop_actions:
                f.write(json.dumps(a) + "\n")
    
    total = sum(sentiment_tracker.values()) or 1
    sentiment_score = round(((sentiment_tracker["positive"] - sentiment_tracker["negative"]) / total) * 100)
    
    return {
        "project_id": project_id,
        "platform": "twitter",
        "status": "completed",
        "total_loops": loops,
        "total_actions": sum(s["action_count"] for s in actions_log),
        "sentiment_score": sentiment_score,
        "sentiment_distribution": sentiment_tracker,
        "virality_probability": round(random.uniform(0.3, 0.9), 2),
        "top_influencers": sorted(agents, key=lambda a: a.followers, reverse=True)[:5],
    }


def main():
    if len(sys.argv) < 2:
        print("Usage: run_twitter_simulation.py <project_id>")
        sys.exit(1)
    
    project_id = sys.argv[1]
    
    # Ensure IPC dirs exist
    COMMANDS_DIR.mkdir(parents=True, exist_ok=True)
    RESPONSES_DIR.mkdir(parents=True, exist_ok=True)
    
    # Read config from command file
    command_file = COMMANDS_DIR / f"twitter_{project_id}.json"
    if not command_file.exists():
        print(f"No command file found: {command_file}")
        sys.exit(1)
    
    with open(command_file) as f:
        config = json.load(f)
    
    print(f"[TwitterSim] Starting simulation for project {project_id}")
    print(f"[TwitterSim] Agents: {config.get('agent_count', 'auto')}, Loops: {config.get('loops', 10)}")
    
    result = run_simulation(project_id, config)
    
    # Write results
    response_file = RESPONSES_DIR / f"twitter_{project_id}.json"
    with open(response_file, "w") as f:
        json.dump(result, f, indent=2, default=str)
    
    print(f"[TwitterSim] Complete. Sentiment: {result['sentiment_score']}, Actions: {result['total_actions']}")
    print(f"[TwitterSim] Results written to {response_file}")


if __name__ == "__main__":
    main()
