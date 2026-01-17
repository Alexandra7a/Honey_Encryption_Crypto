import json
import random
from pydantic_extra_types.payment import PaymentCardNumber, PaymentCardBrand
try:
    from faker import Faker
except ImportError:
    print("Error! Try installing faker from the Python Packages menu (pycharm) or pip install faker")
    exit()

fake = Faker()
import datetime
def generate_honey_data(number_of_entries=1000,real_data=None):
    honey_database = []
    ALLOWED_FAKER_BRANDS = ['visa', 'mastercard', 'amex', 'discover']
    print(f"Generating {number_of_entries} fake bank data...")
    for _ in range(number_of_entries):
        balance_int = random.randint(50, 15000)
        balance_cents = random.randint(10, 99)
        brand='mastercard'
        if real_data and "card_number" in real_data:
            detected_brand = PaymentCardNumber(real_data["card_number"]).brand.value
            if detected_brand in ALLOWED_FAKER_BRANDS:
                brand = detected_brand
            else:
                brand = random.choice(ALLOWED_FAKER_BRANDS)
   
        if real_data:
            real_data_exp=real_data.get("expiration_date")
            if real_data_exp:
                real_year = int(real_data_exp.split('/')[1])
                # Add random variance of -3 to +3 years
                variance = random.randint(-2, 2)
                end_year = real_year + variance
            else:
                end_year = datetime.datetime.now().year + 10
            if len(end_year.__str__())==2:
                end_year = 2000 + end_year
            
            # Slightly modify real data to create plausible honey entries
            entry = {
                "account_ID": fake.uuid4(),
                "full_name": real_data.get("full_name",'').split()[0] + " " + fake.last_name(),
                "email": fake.email(),
                "card_number": fake.credit_card_number(card_type=brand),
                "balance": f"{balance_int}.{balance_cents} RON",
                "ccv": fake.credit_card_security_code(card_type=brand),
                "expiration_date": fake.credit_card_expire(end=datetime.date(end_year, 12, 31)),
                "brand": brand
                
            }
            # de vazut daca are acelasi numar ca si cel real (daca da, il sarim sau il lasam ca e mai confuzant?)
            honey_database.append(entry)
            continue
        # Generating plausible card number data using faker
        entry = {
            "account_ID": fake.uuid4(),
            "full_name": fake.name(),
            "email": fake.email(),
            "card_number": fake.credit_card_number(card_type=brand),
            "balance": f"{balance_int}.{balance_cents} RON",
            "ccv": fake.credit_card_security_code(card_type=brand),
            "expiration_date": fake.credit_card_expire(),
            "brand": brand
        }
        honey_database.append(entry)
    return honey_database


if __name__ == "__main__":
    number_of_entries = input("How many fake bank entries would you like to generate?\n")
    data = generate_honey_data(int(number_of_entries))

    filename = "honey_data.json"
    with open(filename, "w", encoding='utf-8') as f:
        json.dump(data, f, indent=4)
    print(f"[SUCCES] Fake data file '{filename}' was created!")