#!/bin/bash

# GitHub API Research Script
# Investigation of hash table tutorials and related projects

GITHUB_TOKEN="${GITHUB_TOKEN}"
OUTPUT_FILE=".claude/step15_github_data.txt"

{
  echo "# GitHub API Research Results"
  echo "Date: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo ""

  # 1. Current Repository Investigation
  echo "## 1. Current Repository (Technoetic/kdt)"
  echo ""
  curl -s \
    -H "Accept: application/vnd.github.v3+json" \
    https://api.github.com/repos/Technoetic/kdt | head -100

  echo ""
  echo "---"
  echo ""

  # 2. Search for hash table visualization projects
  echo "## 2. Hash Table Related Repositories"
  echo ""
  curl -s \
    -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/search/repositories?q=hash+table+visualization&sort=stars&order=desc&per_page=10"

  echo ""
  echo "---"
  echo ""

  # 3. Algorithm visualization tools
  echo "## 3. Algorithm Visualizer Repository"
  echo ""
  curl -s \
    -H "Accept: application/vnd.github.v3+json" \
    https://api.github.com/repos/algorithm-visualizer/algorithm-visualizer

  echo ""
  echo "---"
  echo ""

  # 4. Data structure visualization
  echo "## 4. Data Structure Tutorials"
  echo ""
  curl -s \
    -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/search/repositories?q=data+structure+tutorial+JavaScript&sort=stars&order=desc&per_page=5"

} > "$OUTPUT_FILE" 2>&1

echo "GitHub research data saved to $OUTPUT_FILE"
wc -l "$OUTPUT_FILE"
