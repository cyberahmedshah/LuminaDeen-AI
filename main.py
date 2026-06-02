import json
with open("mind.json", "r") as f:
    data = json.load(f)
    question = input("Ask Question: ")
    if "name" in question:
     print(f"Answer: {data['name']}")
