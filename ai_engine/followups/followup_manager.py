def should_followup(classification):

    followup_states = [
        "WEAK",
        "PARTIAL"
    ]

    return classification in followup_states