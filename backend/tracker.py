import time
import requests
import sys
import platform

# Try to import pygetwindow for OS-level activity tracking
try:
    import pygetwindow as gw
    HAS_PYGETWINDOW = True
except ImportError:
    HAS_PYGETWINDOW = False
    print("[!] pygetwindow not installed. Install with: pip install pygetwindow")
    print("[!] Falling back to manual tracking...")

# Backend API endpoint
API_URL = "http://localhost:5000/log"

# App categorization database
PRODUCTIVITY_DATABASE = {
    "productive": [
        "vs code", "visual studio", "pycharm", "intellij", "sublime",
        "figma", "adobe", "photoshop", "sketch", "notion",
        "obsidian", "evernote", "terminal", "powershell", "cmd",
        "git", "github", "gitlab", "jupyter", "anaconda"
    ],
    "neutral": [
        "mail", "outlook", "gmail", "slack", "teams", "discord",
        "calendar", "google calendar", "finder", "explorer", "file manager",
        "settings", "preferences", "system", "chrome", "firefox"
    ],
    "distraction": [
        "youtube", "twitter", "instagram", "tiktok", "facebook",
        "netflix", "twitch", "reddit", "pinterest", "snapchat",
        "whatsapp", "telegram", "messenger", "tinder", "dating"
    ]
}

def categorize_app(app_name):
    """Categorize app as Productive, Neutral, or Distraction."""
    app_lower = app_name.lower()
    
    for prod_app in PRODUCTIVITY_DATABASE["productive"]:
        if prod_app in app_lower:
            return "Productive"
    
    for dist_app in PRODUCTIVITY_DATABASE["distraction"]:
        if dist_app in app_lower:
            return "Distraction"
    
    for neut_app in PRODUCTIVITY_DATABASE["neutral"]:
        if neut_app in app_lower:
            return "Neutral"
    
    return "Neutral"

def get_active_window_title():
    """Fetches the title of the currently focused window."""
    if not HAS_PYGETWINDOW:
        return None
    
    try:
        window = gw.getActiveWindow()
        if window is not None and window.title.strip() != "":
            return window.title
    except Exception as e:
        print(f"[!] Error getting active window: {e}")
    
    return None

def run_tracker():
    """Main tracking loop - monitors active window and logs to backend."""
    print("=" * 60)
    print("WorkSense Real-Time Activity Tracker")
    print("=" * 60)
    print(f"Platform: {platform.system()}")
    print(f"Backend URL: {API_URL}")
    print(f"Tracking frequency: Every 2 seconds")
    print()
    
    if not HAS_PYGETWINDOW:
        print("[!] WARNING: pygetwindow not available!")
        print("[!] Install with: pip install pygetwindow")
        print("[!] Exiting...")
        return
    
    print("✓ Starting tracker...")
    print("✓ Press Ctrl+C to stop\n")
    
    # Debug mode - show every window detected
    DEBUG = True
    
    current_app = get_active_window_title()
    start_time = time.time()
    logged_count = 0
    iteration = 0

    try:
        while True:
            # Check the active window every 2 seconds
            time.sleep(2)
            iteration += 1
            new_app = get_active_window_title()

            # Show debug info every iteration
            if DEBUG:
                print(f"[{iteration}] Detected: {new_app}")

            # Skip if we couldn't get window info
            if new_app is None:
                continue

            # If the user switched to a different window
            if new_app != current_app and current_app is not None:
                end_time = time.time()
                duration = int(end_time - start_time)

                # Only log if spent more than 1 second on the app
                if duration > 1:
                    category = categorize_app(current_app)
                    
                    print(f"[✓] '{current_app}' ({category}) for {duration}s")
                    
                    try:
                        # Send the data to your Flask API with correct format
                        response = requests.post(API_URL, json={
                            "window_title": current_app,
                            "category": category,
                            "duration": duration
                        }, timeout=5)
                        
                        if response.status_code == 200:
                            logged_count += 1
                            print(f"    → Logged successfully (Total: {logged_count})")
                        else:
                            print(f"    ✗ API error: {response.status_code}")
                            
                    except requests.exceptions.ConnectionError:
                        print(f"    ✗ ERROR: Could not connect to backend!")
                        print(f"    Make sure 'python app.py' is running on port 5000")
                    except requests.exceptions.Timeout:
                        print(f"    ✗ ERROR: Backend timeout")
                    except Exception as e:
                        print(f"    ✗ ERROR: {e}")

                # Reset the tracker for the new window
                current_app = new_app
                start_time = time.time()

    except KeyboardInterrupt:
        print("\n")
        print("=" * 60)
        print(f"Tracker stopped. Logged {logged_count} activities.")
        print("=" * 60)

if __name__ == "__main__":
    run_tracker()