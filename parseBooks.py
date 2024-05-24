import requests
import json

final = {"languages": {}}

url = "https://gutendex.com/books?author_year_start=1850&copyright=false&mimetye=text%2Fplain"
n_compat = 0
n_loop = 1
while True:
    books_request = requests.get(url)
    books = books_request.json()
    pages = round(books["count"] / 32)
    print(f"Loading page {n_loop}/{pages}...")
    
    for book in books["results"]:
        if book["languages"][0] not in final["languages"].keys():
            final["languages"][book["languages"][0]] = []
        
        if book["media_type"] == "Text" and book["copyright"] == False and book["authors"] != [] and book["authors"][0]["birth_year"] != None and book["authors"][0]["birth_year"] > 1700 and "text/plain; charset=us-ascii" in book["formats"].keys():
            final["languages"][book["languages"][0]].append({
                "id": book["id"],
                "title": book["title"],
                "book_url": book["formats"]["text/plain; charset=us-ascii"],
                "author": book["authors"][0]["name"]
            })
            n_compat += 1

    n_loop += 1

    with open("books.json", "w") as f:
        f.write(json.dumps(final, indent=4))

    url = books["next"]
    if url == None:
        break

print(f"Done! {n_compat} books saved.")
