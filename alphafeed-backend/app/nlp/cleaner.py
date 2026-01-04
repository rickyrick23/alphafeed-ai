import re

def clean_text(text: str) -> str:
    if not text:
        return ""

    text = text.lower()

    # remove HTML tags
    text = re.sub(r"<.*?>", " ", text)

    # remove URLs
    text = re.sub(r"http\S+|www\.\S+", " ", text)

    # remove special symbols / emojis
    text = re.sub(r"[^a-z0-9\s.,%\-:+()$]", " ", text)

    # collapse multiple spaces
    text = re.sub(r"\s+", " ", text)

    return text.strip()
