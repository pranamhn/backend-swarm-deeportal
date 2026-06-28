#!/usr/bin/env python3
"""
OASIS-style Reddit Social Simulation Script
Part of Swarm Deeportal — Mode A: Social Sentiment

Communicates via filesystem IPC same as Twitter script.
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

SUBREDDITS = [
    "r/indonesia", "r/politics", "r/economics", "r/technology",
    "r/worldnews", "r/investing", "r/startups", "r/cryptocurrency",
    "r/indonesiapolitics", "r/finansial"
]

class RedditAgent:
    def __init__(self, profile: dict, index: int):
        self.id = profile.get("id", f"reddit-agent-{index}")
        self.role = profile.get("role", "reddit_user")
        self.karma = profile.get("karma", random.randint(100, 50000))
        self.subreddits = profile.get("subreddits", random.sample(SUBREDDITS, 3))
        self.posting_style = profile.get("postingStyle", random.choice(["analytical", "emotional", "humorous", "neutral"]))
        self.interests = profile.get("interestedTopics", [])
        
    def decide_action(self, loop: int, topics: list[str]) -> dict:
        action = random.choice(["CREATE_POST", "COMMENT", "UPVOTE", "DOWNVOTE", "REPLY"])
        subreddit = random.choice(self.subreddits)
        topic = random.choice(topics) if topics else "general discussion"
        
        contents = {
            "CREATE_POST": f"[{subreddit}] Discussion: What are your thoughts on {topic}? Let's analyze this.",
            "COMMENT": f"Great analysis. I think {topic} will be a key factor going forward.",
            "UPVOTE": f"Upvoted post about {topic} in {subreddit}",
            "DOWNVOTE": f"Downvoted misleading post about {topic}",
            "REPLY": f"Replying to discussion on {topic} — here's my detailed take...",
        }
        
        sentiment = random.choice(["positive", "negative", "neutral"])
        
        return {
            "agent_id": self.id,
            "agent_role": self.role,
            "loop": loop,
            "platform": "reddit",
            "action_type": action,
            "content": contents[action],
            "subreddit": subreddit,
            "sentiment_label": sentiment,
            "sentiment_score": random.uniform(-1.0, 1.0),
            "karma_impact": random.randint(-5, 20),
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }


def run_simulation(project_id: str, config: dict) -> dict:
    agents_data = config.get("agents", [])
    topics = config.get("seed_topics", ["general"])
    loops = config.get("loops", 10)
    agent_count = min(config.get("agent_count", 100), len(agents_data) or 50)
    
    if not agents_data:
        agents_data = [
            {
                "id": f"reddit-agent-{i}",
                "role": random.choice(["reddit_user", "political_influencer", "swing_voter"]),
                "karma": random.randint(100, 50000),
                "subreddits": random.sample(SUBREDDITS, 3),
                "postingStyle": random.choice(["analytical", "emotional", "humorous", "neutral"]),
            }
            for i in range(agent_count)
        ]
    
    agents = [RedditAgent(a, i) for i, a in enumerate(agents_data[:agent_count])]
    
    actions_log = []
    sentiment_tracker = {"positive": 0, "negative": 0, "neutral": 0}
    subreddit_activity = {s: 0 for s in SUBREDDITS}
    
    for loop in range(1, loops + 1):
        loop_actions = []
        for agent in agents:
            action = agent.decide_action(loop, topics)
            loop_actions.append(action)
            sentiment_tracker[action["sentiment_label"]] += 1
            if action.get("subreddit") in subreddit_activity:
                subreddit_activity[action["subreddit"]] += 1
        
        actions_log.append({
            "loop": loop,
            "action_count": len(loop_actions),
            "sentiment_distribution": dict(sentiment_tracker),
            "top_subreddits": sorted(subreddit_activity.items(), key=lambda x: x[1], reverse=True)[:3],
        })
        
        with open(RESPONSES_DIR / f"reddit_{project_id}_actions.jsonl", "a") as f:
            for a in loop_actions:
                f.write(json.dumps(a) + "\n")
    
    total = sum(sentiment_tracker.values()) or 1
    sentiment_score = round(((sentiment_tracker["positive"] - sentiment_tracker["negative"]) / total) * 100)
    
    return {
        "project_id": project_id,
        "platform": "reddit",
        "status": "completed",
        "total_loops": loops,
        "total_actions": sum(s["action_count"] for s in actions_log),
        "sentiment_score": sentiment_score,
        "sentiment_distribution": sentiment_tracker,
        "top_subreddits": sorted(subreddit_activity.items(), key=lambda x: x[1], reverse=True)[:5],
        "avg_thread_depth": round(random.uniform(3.0, 12.0), 1),
    }


def main():
    if len(sys.argv) < 2:
        print("Usage: run_reddit_simulation.py <project_id>")
        sys.exit(1)
    
    project_id = sys.argv[1]
    
    COMMANDS_DIR.mkdir(parents=True, exist_ok=True)
    RESPONSES_DIR.mkdir(parents=True, exist_ok=True)
    
    command_file = COMMANDS_DIR / f"reddit_{project_id}.json"
    if not command_file.exists():
        print(f"No command file: {command_file}")
        sys.exit(1)
    
    with open(command_file) as f:
        config = json.load(f)
    
    print(f"[RedditSim] Starting simulation for project {project_id}")
    
    result = run_simulation(project_id, config)
    
    response_file = RESPONSES_DIR / f"reddit_{project_id}.json"
    with open(response_file, "w") as f:
        json.dump(result, f, indent=2, default=str)
    
    print(f"[RedditSim] Complete. Sentiment: {result['sentiment_score']}")


if __name__ == "__main__":
    main()
