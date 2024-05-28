from datetime import datetime
import pytz

def now():
    return datetime.now(pytz.timezone("Europe/Paris"))

def to_timestamp(date):
    return int(date.timestamp())