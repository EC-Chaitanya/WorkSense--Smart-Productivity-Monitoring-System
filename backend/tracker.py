import time
import pygetwindow as gw
import requests

# This must match the port where your Flask app is running
API_URL = "http://localhost:5000/log"

def get_active_window_title():
    """Fetches the title of the currently focused window."""
    try:
        window = gw.getActiveWindow()
        if window is not None and window.title.strip() != "":
            return window.title
    except Exception:
        pass
    return "Unknown/Idle"

def run_tracker():
    print("Starting WorkSense Background Tracker...")
    print("Press Ctrl+C to stop.")
    
    current_app = get_active_window_title()
    start_time = time.time()

    while True:
        # Check the active window every 2 seconds. 
        # Checking too fast will eat up your CPU.
        time.sleep(2) 
        new_app = get_active_window_title()

        # If the user switched to a different window
        if new_app != current_app:
            end_time = time.time()
            duration = int(end_time - start_time)

            # Only log if you spent more than 1 second on the window
            if duration > 1 and current_app != "Unknown/Idle":
                print(f"[*] Logging: '{current_app}' for {duration} seconds.")
                
                try:
                    # Send the data to your Flask API
                    requests.post(API_URL, json={
                        "app_name": current_app,
                        "duration_seconds": duration
                    })
                except requests.exceptions.ConnectionError:
                    print("[!] ERROR: Could not connect to API. Make sure app.py is running!")

            # Reset the tracker for the new window
            current_app = new_app
            start_time = time.time()

if __name__ == "__main__":
    run_tracker()