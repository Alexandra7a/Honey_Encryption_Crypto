import math

class SimpleDTE:
    def __init__(self, messages):
        self.messages = messages
        self.message_to_index = {m: i for i, m in enumerate(messages)}
        print(self.message_to_index)
        self.index_to_message = {i: m for i, m in enumerate(messages)}
        print(self.index_to_message)
        self.bits = math.ceil(math.log2(len(messages)))
        print(f"Bits needed: {self.bits}")

    def encode(self, message):
        return self.message_to_index[message]

    def decode(self, value):
        '''Wrong keys produce arbitrary numbers
        We force them back into the valid message space'''
        index = value % len(self.messages) # sa se incadreze in dimensiunea listei
        return self.index_to_message[index]
    


import hashlib

'''def derive_key(password, bits):
    not_digest = hashlib.sha256(password.encode())
    print(f"SHA-256 Digest: {not_digest.hexdigest()}")
    digest = not_digest.digest()
    print(f"SHA-256 Raw Digest: {digest}")
    key_int = int.from_bytes(digest, "big")
    print (f"Derived key int: {key_int}")
    # ((1 << bits) - 1) creates a mask with the lower 'bits' bits set to 1 (if bit=16 => mask=0b1111111111111111) after that AND gives only those bits (last 16 bits)
    return key_int & ((1 << bits) - 1) # returns the lower 'bits' bits of the integer using the bitwise AND operation
'''
def derive_key(password: str, salt: bytes, bits: int) -> int:
    """
    Derives a key from a password using a salt.
    Output is truncated to 'bits' to match seed space.
    """
    data = password.encode() + salt
    print(f"Data for hashing: {data}")
    digest = hashlib.sha256(data).digest()
    key_int = int.from_bytes(digest, "big")
    return key_int & ((1 << bits) - 1)

'''
def honey_encrypt(message, password, dte):
    m_encoded = dte.encode(message)
    key = derive_key(password, dte.bits)
    ciphertext = m_encoded ^ key
    return ciphertext

def honey_decrypt(ciphertext, password, dte):
    key = derive_key(password, dte.bits)
    decoded_value = ciphertext ^ key
    message = dte.decode(decoded_value)
    return message
'''
import math
import hashlib
import os
def honey_encrypt(message, password, dte):
    """
    Honey Encryption:
    C = seed ⊕ key
    """
    seed = dte.encode(message)
    salt = os.urandom(16)        # public, stored with ciphertext
    key = derive_key(password, salt, dte.bits)
    ciphertext = seed ^ key
    return ciphertext, salt

def honey_decrypt(ciphertext, password, salt, dte):
    """
    Honey Decryption:
    seed' = C ⊕ key'
    message' = DTE⁻¹(seed')
    """
    key = derive_key(password, salt, dte.bits)
    seed_prime = ciphertext ^ key
    return dte.decode(seed_prime)


import random
if __name__ == "__main__":
    messages = ['hello', 'world', 'test', 'data']
    dte = SimpleDTE(messages)

    for msg in messages:
        encoded = dte.encode(msg)
        decoded = dte.decode(encoded)
        print(f"Message: {msg}, Encoded: {encoded}, Decoded: {decoded}")

    for wrong_key in [123, 456, 789]:
        decoded = dte.decode(wrong_key)
        print(f"Wrong key: {wrong_key}, Decoded: {decoded}")
    
    print(derive_key("my_secret_password", 2))

    real_message = input("Enter message to encrypt (or 'exit' to quit): ")
  
    messages.append(real_message)
    #randomize the order of messages for better security in real applications
    random.shuffle(messages)
    dte = SimpleDTE(messages)
    password = input("Enter password: ")

    ciphertext, salt = honey_encrypt(real_message, password, dte)

    while True:
        password_attempt = input("Enter password to decrypt (or 'exit' to quit): ")
        if password_attempt == 'exit':
            break


        decrypted_message = honey_decrypt(ciphertext, password_attempt, salt, dte)

        if decrypted_message == real_message:
            
            print("Correct password! Message decrypted successfully.")
            print(f"Decoy Decrypted Message: {decrypted_message}")

        else:
            print("Incorrect password. Decrypted message may be incorrect.")
            print(f"Decoy Decrypted Message: {decrypted_message}")


