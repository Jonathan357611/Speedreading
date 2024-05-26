import requests
import json
import os
import re

languages = ["en", "es", "pt", "fr", "de", "it"] # Define all desired languages
final = {"languages": {language: [] for language in languages}} # Create dict that will hold all book infos
book_pattern = re.compile(r'\*\*\*.*?\*\*\*(.*?)\*\*\*.*?\*\*\*', re.DOTALL) # Regex pattern to later remove Gutenberg-headers

# Create "books" folder
if not os.path.exists("books"):
    os.mkdir("books")

# Download books in each language
for language in languages:
    print(f"Parsing books in language \"{language}\"...")
    url = f"https://gutendex.com/books?author_year_start=1850&copyright=false&mimetye=text%2Fplain&languages={language}" # Url with filters to ensure correct file formats, language, etc.
    books_request = requests.get(url)
    books = books_request.json()

    for i in range(min(len(books["results"]), 15)): # Iterate maximally 15 books
        book = books["results"][i]
        if book["media_type"] == "Text" and book["copyright"] == False and book["authors"] != [] and book["authors"][0]["birth_year"] != None and book["authors"][0]["birth_year"] > 1700 and "text/plain; charset=us-ascii" in book["formats"].keys(): # Double check if all required informations are given
            # Add to "final" dictionary
            final["languages"][language].append({
                "id": book["id"],
                "title": book["title"],
                "book_url": book["formats"]["text/plain; charset=us-ascii"],
                "author": book["authors"][0]["name"]
            })

    # Download books as txt files
    for book in final["languages"][language]:
        # Create folder for language if not existant
        if not os.path.exists("books/" + language):
            os.mkdir("books/" + language)

        # Download the book and apply regex pattern
        book_text = book_pattern.search(requests.get(book["book_url"]).text).group(1).strip()
        
        # Save book in designated folder
        with open(f"books/{language}/{book['id']}.txt", "w") as f:
            f.write(book_text)

        print(f"Downloaded book \"{book['title']}\" to books/{language}/{book['id']}.txt")

    # Save each iteration
    with open("books.json", "w") as f:
        f.write(json.dumps(final, indent=4))
