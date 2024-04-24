from app import app  # Import the Flask app instance
from database import init_db

# Set up the application context
app.app_context().push()

# Initialize the database
init_db()
