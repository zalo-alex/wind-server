class ParsedSentence:
    
    SENTENCE_TYPE = None

class IIMWV(ParsedSentence):
    
    SENTENCE_TYPE = "IIMWV"
    
    def __init__(self, values):
        self.wind_direction = float(values[1])
        self.wind_speed = float(values[3])
        self.state = values[5]

class WIXDR(ParsedSentence):
    
    SENTENCE_TYPE = "WIXDR"
    
    def __init__(self, values):
        self.temp = float(values[2])

def get_parsed(sentence):
    values = sentence[:-3].split(",")
    sentence_type = values[0]
    
    types = {
        "$IIMWV": IIMWV,
        "$WIXDR": WIXDR
    }
    
    if sentence_type in types:
        return types[sentence_type](values)
    else:
        return None