import time
import requests
import sys
import platform
import subprocess
import os

# Use win32gui for reliable OS-level active window detection
try:
    import win32gui
    HAS_WIN32 = True
except ImportError:
    HAS_WIN32 = False
    print("[!] pywin32 not installed. Install with: pip install pywin32")
    print("[!] Tracker cannot run without it.")

# Backend API endpoint
API_URL = "http://localhost:5000/log"

# ── Keyword databases for window title classification ──
# IMPORTANT: Distraction is checked FIRST so that "youtube - google chrome"
# hits Distraction before "chrome" could trigger Neutral.

PRODUCTIVE_KEYWORDS = [
    # IDEs & Editors
    "code", "visual studio", "vs code", "cursor", "pycharm", "intellij",
    "sublime", "atom", "vim", "neovim", "emacs", "webstorm", "android studio",
    # Dev tools
    "github", "gitlab", "bitbucket", "stackoverflow", "stack overflow",
    "jupyter", "anaconda", "postman", "docker", "terminal", "powershell",
    "cmd.exe", "windows terminal", "git bash", "wsl",
    # Docs & Productivity
    "document", "word", "excel", "powerpoint", "google docs", "google sheets",
    "notion", "obsidian", "evernote", "onenote", "overleaf", "latex",
    # Design
    "figma", "adobe", "photoshop", "illustrator", "sketch", "canva",
    # Learning (non-video)
    "leetcode", "hackerrank", "codeforces", "geeksforgeeks", "w3schools",
    "mdn web docs", "devdocs", "coursera", "udemy", "edx",
]

DISTRACTION_KEYWORDS = [
    # Video & Streaming
    "youtube", "netflix", "prime video", "hotstar", "twitch", "hulu",
    "disney+", "crunchyroll", "jiocinema",
    # Social Media
    "instagram", "facebook", "twitter", "tiktok", "snapchat", "pinterest",
    "reddit", "tumblr", "threads",
    # Messaging (casual)
    "whatsapp", "telegram", "messenger", "discord",
    # Dating & misc
    "tinder", "bumble", "dating",
    # Gaming
    "steam", "epic games", "riot", "valorant", "minecraft",
]

NEUTRAL_KEYWORDS = [
    # Browsers (only match if no productive/distraction keyword matched first)
    "chrome", "firefox", "brave", "edge", "opera", "safari",
    # System & file management
    "explorer", "file manager", "finder", "settings", "preferences",
    "task manager", "control panel", "system",
    # Communication (work-adjacent)
    "mail", "outlook", "gmail", "slack", "teams", "zoom", "google meet",
    "calendar", "google calendar",
]


def categorize_app(window_title):
    """
    Bulletproof window title classifier.
    - Normalizes to lowercase immediately
    - Checks Distraction FIRST (so 'youtube - chrome' → Distraction, not Neutral)
    - Uses substring-in-string matching
    - Returns 'Neutral' as fallback
    """
    if not window_title:
        return "Neutral"

    title = window_title.lower()

    # 1) Check distraction FIRST (highest priority — catch it before browser name matches)
    for keyword in DISTRACTION_KEYWORDS:
        if keyword in title:
            return "Distraction"

    # 2) Check productive
    for keyword in PRODUCTIVE_KEYWORDS:
        if keyword in title:
            return "Productive"

    # 3) Check neutral
    for keyword in NEUTRAL_KEYWORDS:
        if keyword in title:
            return "Neutral"

    # 4) Fallback
    return "Neutral"


def categorize_with_debug(window_title):
    """Categorize with debug logging — prints the match result to console."""
    result = categorize_app(window_title)
    print(f"  [CLASSIFY] '{window_title}' → {result}")
    return result

def inject_test_data():
    """Run inject.py to add test data when app switches."""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    inject_script = os.path.join(script_dir, 'inject.py')
    
    try:
        result = subprocess.run(
            [sys.executable, inject_script],
            capture_output=True,
            text=True,
            timeout=5
        )
        if result.returncode == 0:
            print(f"    [📊] {result.stdout.strip()}")
        else:
            if result.stderr.strip():
                print(f"    [⚠] Inject: {result.stderr.strip()}")
    except subprocess.TimeoutExpired:
        pass
    except Exception as e:
        pass

def get_active_window_title():
    """Fetches the title of the currently focused window via win32gui."""
    if not HAS_WIN32:
        return None
    try:
        hwnd = win32gui.GetForegroundWindow()
        if hwnd:
            title = win32gui.GetWindowText(hwnd).strip()
            if title:
                return title
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
    print(f"Poll interval: 1 second")
    print()

    if not HAS_WIN32:
        print("[!] FATAL: pywin32 not available!")
        print("[!] Install with: pip install pywin32")
        print("[!] Exiting...")
        return

    print("✓ Using win32gui for window detection")
    print("✓ Starting tracker...")
    print("✓ Press Ctrl+C to stop\n")

    POLL_INTERVAL = 1                       # poll every 1 second for snappier detection
    MIN_DURATION  = 2                       # spam filter: ignore < 2s switches
    DEBUG = True

    # ── State: stamp the focus_start the moment a window gains focus ──
    current_app  = get_active_window_title()
    focus_start  = time.time()              # exact timestamp when current_app gained focus
    logged_count = 0
    iteration    = 0

    # ── Meme intervention state ──
    distraction_seconds = 0
    popup_already_fired = False

    try:
        while True:
            time.sleep(POLL_INTERVAL)
            iteration += 1
            new_app = get_active_window_title()

            # Skip unreadable / minimized windows — keep tracking the previous app
            if new_app is None:
                continue

            if DEBUG:
                elapsed = round(time.time() - focus_start, 1)
                print(f"[{iteration}] Active: {new_app}  (on current for {elapsed}s)")

            # ── Meme Intervention: track continuous distraction time ──
            if categorize_app(new_app) == "Distraction":
                distraction_seconds += POLL_INTERVAL
            else:
                distraction_seconds = 0
                popup_already_fired = False

            if distraction_seconds >= 300 and not popup_already_fired:
                print(f"    [🚨] 5 min distraction! Spawning meme popup...")
                popup_script = os.path.join(os.path.dirname(os.path.abspath(__file__)), "popup.py")
                subprocess.Popen([sys.executable, popup_script], creationflags=subprocess.CREATE_NEW_PROCESS_GROUP)
                popup_already_fired = True

            # ── Core: detect a REAL window switch ──
            if new_app != current_app:
                # Calculate true time delta from the exact moment the old window gained focus
                now = time.time()
                duration = round(now - focus_start)

                # Spam filter: skip accidental Alt-Tabs (< 2 seconds)
                if duration >= MIN_DURATION and current_app is not None:
                    category = categorize_with_debug(current_app)

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
                            inject_test_data()
                        else:
                            print(f"    ✗ API error: {response.status_code}")

                    except requests.exceptions.ConnectionError:
                        print(f"    ✗ ERROR: Could not connect to backend!")
                        print(f"    Make sure 'python app.py' is running on port 5000")
                    except requests.exceptions.Timeout:
                        print(f"    ✗ ERROR: Backend timeout")
                    except Exception as e:
                        print(f"    ✗ ERROR: {e}")
                else:
                    if duration < MIN_DURATION:
                        print(f"    [skip] '{current_app}' only {duration}s — Alt-Tab filtered")

                # ── Stamp the NEW window's focus start time ──
                current_app = new_app
                focus_start = time.time()

    except KeyboardInterrupt:
        # Log the final window that was active when Ctrl+C was pressed
        if current_app:
            final_duration = round(time.time() - focus_start)
            if final_duration >= MIN_DURATION:
                category = categorize_app(current_app)
                try:
                    requests.post(API_URL, json={
                        "window_title": current_app,
                        "category": category,
                        "duration": final_duration
                    }, timeout=3)
                    logged_count += 1
                except Exception:
                    pass
        print("\n")
        print("=" * 60)
        print(f"Tracker stopped. Logged {logged_count} activities.")
        print("=" * 60)

if __name__ == "__main__":
    run_tracker()