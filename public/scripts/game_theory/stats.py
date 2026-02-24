import matplotlib.pyplot as plt

# test
data = [
    {
        "name": "Tit For Tat",
        "point": 0,
        "moral": 100,
        "reputation": 100
    },
    {
        "name": "The Jugador",
        "point": 0,
        "moral": 100,
        "reputation": 100
    },
    {
        "name": "Cinnamon Roll",
        "point": 0,
        "moral": 100,
        "reputation": 100
    },
    {
        "name": "Badass",
        "point": 4,
        "moral": 100,
        "reputation": 100
    }
]

names = []
pts = []

for x in data:
    names.append(x["name"])
    pts.append(x["point"])

plt.figure()
plt.bar(names, pts)
plt.xlabel("Model")
plt.ylabel("Point")
plt.title("Model Points Comparison")
plt.xticks(rotation = 20)

plt.tight_layout()
plt.show()