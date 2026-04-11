def classify_activity(app_name):
    """
    Simulates the AI classification logic. 
    In the final version, this uses your Naive Bayes model.
    """
    app_name = app_name.lower()

    # Define categories
    productive_keywords = ['vs code', 'pycharm', 'terminal', 'stackoverflow', 'github', 'docs', 'excel']
    distraction_keywords = ['youtube', 'facebook', 'instagram', 'netflix', 'twitter', 'games']

    if any(word in app_name for word in productive_keywords):
        return "Productive"
    elif any(word in app_name for word in distraction_keywords):
        return "Distraction"
    else:
        return "Neutral"

# Quick Test
if __name__ == "__main__":
    test_app = "Visual Studio Code"
    print(f"App: {test_app} | Category: {classify_activity(test_app)}")