import json
import random

try:
    from faker import Faker
except ImportError:
    print("Error! Try installing faker from the Python Packages menu (pycharm) or pip install faker")
    exit()

fake = Faker()

def generate_honey_data(number_of_entries=1000):
    honey_database = []
    print(f"Generating {number_of_entries} fake bank data...")
    for _ in range(number_of_entries):
        balance_int = random.randint(50, 15000)
        balance_cents = random.randint(10, 99)

        # Generating plausible card number data using faker
        entry = {
            "card_number": fake.credit_card_number(card_type='mastercard'),
            "balance": f"{balance_int}.{balance_cents} RON"
        }
        honey_database.append(entry)
    return honey_database


if __name__ == "__main__":
    data = generate_honey_data(1000)

    filename = "honey_data.json"
    with open(filename, "w", encoding='utf-8') as f:
        json.dump(data, f, indent=4)
    print(f"[SUCCES] Fake data file '{filename}' was created!")