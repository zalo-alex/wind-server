class ParsedSentence:
    
    SENTENCE_TYPE = None

class IIMWV(ParsedSentence):
    
    SENTENCE_TYPE = "IIMWV"
    
    def __init__(self, values):
        self.wind_direction = float(values[1])
        self.wind_speed = float(values[3])
        self.state = values[5]
    
    def __str__(self) -> str:
        return f"WD={self.wind_direction} WS={p.wind_speed} S={p.state}"
    
    @staticmethod
    def check(values):
        return not any([
            values[0] != "$IIMWV",
            values[2] != "R",
            values[4] != "N",
            values[5] not in "AV",
        ])

def get_parsed(sentence):
    values = sentence[:-3].split(",")
    sentence_type = values[0]
    
    types = {
        "$IIMWV": IIMWV
    }
    
    if sentence_type in types and types[sentence_type].check(values):
        return types[sentence_type](values)
    else:
        return None

# TESTS
if __name__ == "__main__":
    sentence = "$IIMWV,237.0,R,002.4,N,A*3D"
    print(sentence)
    p = get_parsed(sentence)
    print(p)
    sentence = "$IIMWV,053.0,$IIMWV,062.0,R,002.7,N,A*3C"
    print(sentence)
    p = get_parsed(sentence)
    print(p)