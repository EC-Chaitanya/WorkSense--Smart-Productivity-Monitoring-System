"""
WorkSense - Meme Intervention Popup
Always-on-top native Windows popup that shames you back to productivity.
Spawned as a detached subprocess by tracker.py — never blocks the main loop.
"""

import tkinter as tk
from tkinter import font as tkfont
import os
import sys

def show_popup():
    root = tk.Tk()
    root.title("🚨 WorkSense Intervention")
    root.configure(bg="#0f0f0f")
    root.attributes("-topmost", True)       # Always on top of every window
    root.overrideredirect(False)            # Keep title bar for dragging
    root.resizable(False, False)

    # ── Center the window on screen ──
    popup_w, popup_h = 520, 620
    screen_w = root.winfo_screenwidth()
    screen_h = root.winfo_screenheight()
    x = (screen_w // 2) - (popup_w // 2)
    y = (screen_h // 2) - (popup_h // 2)
    root.geometry(f"{popup_w}x{popup_h}+{x}+{y}")

    # ── Load the meme image ──
    script_dir = os.path.dirname(os.path.abspath(__file__))
    meme_path = os.path.join(script_dir, "meme.png")

    try:
        from PIL import Image, ImageTk
        img = Image.open(meme_path)
        img = img.resize((480, 380), Image.LANCZOS)
        photo = ImageTk.PhotoImage(img)
    except ImportError:
        # Fallback: try tkinter's native PhotoImage (supports PNG only)
        try:
            photo = tk.PhotoImage(file=meme_path)
            # Scale down if too large
            w, h = photo.width(), photo.height()
            if w > 480:
                factor = w // 480
                photo = photo.subsample(factor, factor)
        except Exception:
            photo = None
    except Exception:
        photo = None

    # ── Header label ──
    header = tk.Label(
        root,
        text="⚠️  DISTRACTION DETECTED  ⚠️",
        bg="#0f0f0f",
        fg="#ff4444",
        font=("Segoe UI", 16, "bold"),
        pady=12,
    )
    header.pack(fill="x")

    # ── Meme image ──
    if photo:
        img_label = tk.Label(root, image=photo, bg="#0f0f0f", bd=0)
        img_label.image = photo  # prevent garbage collection
        img_label.pack(pady=(0, 8))
    else:
        fallback = tk.Label(
            root,
            text="😡  GET BACK TO DSA  😡",
            bg="#0f0f0f",
            fg="#ffffff",
            font=("Segoe UI", 28, "bold"),
            pady=40,
        )
        fallback.pack()

    # ── Shame message ──
    msg = tk.Label(
        root,
        text="You've been distracted for over 5 minutes.\nClose YouTube. Open LeetCode. NOW.",
        bg="#0f0f0f",
        fg="#cccccc",
        font=("Segoe UI", 11),
        justify="center",
        wraplength=460,
        pady=8,
    )
    msg.pack()

    # ── Countdown label ──
    countdown_var = tk.StringVar(value="Auto-closing in 30s...")
    countdown_label = tk.Label(
        root,
        textvariable=countdown_var,
        bg="#0f0f0f",
        fg="#666666",
        font=("Segoe UI", 9),
    )
    countdown_label.pack()

    # ── Dismiss button ──
    dismiss_btn = tk.Button(
        root,
        text="😤  Fine, I'll study  😤",
        command=root.destroy,
        bg="#ff4444",
        fg="#ffffff",
        activebackground="#cc0000",
        activeforeground="#ffffff",
        font=("Segoe UI", 13, "bold"),
        relief="flat",
        cursor="hand2",
        padx=30,
        pady=10,
        bd=0,
    )
    dismiss_btn.pack(pady=(12, 16))

    # ── Auto-close after 30 seconds ──
    remaining = [30]

    def tick():
        remaining[0] -= 1
        if remaining[0] <= 0:
            root.destroy()
            return
        countdown_var.set(f"Auto-closing in {remaining[0]}s...")
        root.after(1000, tick)

    root.after(1000, tick)

    # ── Play system alert sound ──
    try:
        import winsound
        winsound.MessageBeep(winsound.MB_ICONEXCLAMATION)
    except Exception:
        root.bell()

    root.mainloop()


if __name__ == "__main__":
    show_popup()
