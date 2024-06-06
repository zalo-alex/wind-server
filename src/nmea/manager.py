from src.date import now, to_timestamp
from src.nmea.parser import get_parsed

from datetime import timedelta

class Manager:

    def __init__(self, conn):
        self.conn = conn

    def save(self, sentence):
        parsed = get_parsed(sentence)

        if parsed is None:
            return

        cursor = self.conn.cursor()

        timestamp = to_timestamp(now())

        if parsed.SENTENCE_TYPE == "IIMWV":
            cursor.execute("""
                INSERT INTO sentences (timestamp, sentence, wind_direction, wind_speed, state) VALUES (?, ?, ?, ?, ?, ?)
            """, (timestamp, sentence, parsed.wind_direction, parsed.wind_speed, parsed.state))

        self.conn.commit()

    def select_after(self, after):
        cursor = self.conn.cursor()

        cursor.execute("""
            SELECT * FROM sentences WHERE timestamp > ?
        """, (after,))

        return cursor.fetchall()
    
    def last(self):
        cursor = self.conn.cursor()

        cursor.execute("""
            SELECT * FROM sentences ORDER BY timestamp DESC LIMIT 1
        """)

        return cursor.fetchone()

    def from_delta(self, delta):
        time_now = now()

        if delta == "2h":
            before = time_now - timedelta(hours=2)
        elif delta == "6h":
            before = time_now - timedelta(hours=6)
        elif delta == "24h":
            before = time_now - timedelta(days=1)
        elif delta == "7d":
            before = time_now - timedelta(days=7)
        else:
            return []

        ts_before = to_timestamp(before)

        data = self.select_after(ts_before)

        return data
