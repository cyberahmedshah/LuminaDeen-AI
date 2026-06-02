import json
with open("mind.json", "r") as f:
    data = json.load(f)
    question = input("Ask Question: ").lower()
    if "name" in question:
     print(f"Answer: {data['name']}")
    if "purpose" in question:
       print(f"Answer: {data['purpose']}")