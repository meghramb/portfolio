import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
# Allows your frontend domain to communicate securely with this API
CORS(app)

def send_smtp_email(name, reply_to_email, user_message):
    sender = str(os.getenv("SENDER_EMAIL"))
    receiver = str(os.getenv("RECEIVER_EMAIL"))
    password = str(os.getenv("EMAIL_PASSWORD"))
    
    # Structure the multi-part email header
    msg = MIMEMultipart()
    msg["From"] = sender
    msg["To"] = receiver
    msg["Subject"] = f"💼 New Portfolio Message from {name}"
    msg["Reply-To"] = reply_to_email

    # Compose a clean text body
    body_content = f"You received a new message from your portfolio contact form:\n\nName: {name}\nEmail: {reply_to_email}\n\nMessage:\n{user_message}"
    
    msg.attach(MIMEText(body_content, "plain", "utf-8"))

    # Establish a secure SSL connection with Google's SMTP server
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(sender, password)
        server.sendmail(sender, receiver, msg.as_string())

@app.route("/api/contact", methods=["POST"])
def handle_contact_form():
    try:
        # Extract parsing payload JSON elements from client application
        data = request.get_json()
        if not data:
            return jsonify({"error": "Missing form payload"}), 400
            
        name = data.get("name")
        email = data.get("email")
        message = data.get("message")

        # Basic server-side validation
        if not name or not email or not message:
            return jsonify({"error": "All form fields are strictly required."}), 400

        # Execute the mail dispatch routine
        send_smtp_email(name, email, message)
        
        return jsonify({"success": True, "message": "Message sent beautifully!"}), 200

    except Exception as e:
        # Log your error internally for structural debugging
        print(f"Server Error Exception: {e}")
        return jsonify({"error": "Internal server configuration failure."}), 500

if __name__ == "__main__":
    # Runs locally on port 5000
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)), debug=True)