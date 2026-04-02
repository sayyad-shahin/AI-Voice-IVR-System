def rephrase_text(text):

    replacements={

    "i want":"I would like",
    "give me":"Please provide",
    "tell me":"Could you tell me",
    "send me":"Kindly send",
    "show me":"Please show"

    }

    for k,v in replacements.items():
        text=text.replace(k,v)

    return text.capitalize()