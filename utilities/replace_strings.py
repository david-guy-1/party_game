with open("base person (uncolored , unclothed).txt") as f:
    data = f.read()

data = data.replace("AAAAAA", "614821") #skin top 
data = data.replace("BBBBBB", "#80602d") #nose 1 (brighter)
data = data.replace("CCCCCC", "#4a3718") #nose 2 (darker)
data = data.replace("DDDDDD", "674a29") #hands (slightly lighter)
data = data.replace("EEEEEE", "614821") #legs (can be same or slightly lighter)
data = data.replace("FFFFFF", "694c2e") #feet (lighter)
data = data.replace("000000", "fa9c63") #mouth 1 (outer, lighter)
data = data.replace("111111", "de2a2a") #mouth 2 (inner , darker)

data = data.replace("##", "#")

print(data)
