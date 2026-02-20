"""Google Gemini AI Service for Studio4 Chat Widgets"""
import google.generativeai as genai
from app.config import get_settings
import uuid

class GeminiService:
    def __init__(self):
        self.settings = get_settings()
        if self.settings.gemini_api_key:
            genai.configure(api_key=self.settings.gemini_api_key)
        self.model = genai.GenerativeModel('gemini-pro')
        self.chat_sessions = {}

    def get_system_context(self, is_authenticated: bool, user_data: dict = None) -> str:
        """Get context based on authentication status"""
        base_context = """You are the Studio4 Dance Co AI assistant. You help parents and visitors with questions about the dance studio.
Be friendly, professional, and helpful. Studio4 offers dance classes for all ages including ballet, jazz, tap, hip hop, contemporary, lyrical, acro, and more.

For general inquiries, you can help with:
- Class schedules and descriptions
- Registration information
- Studio location and contact info
- Upcoming events and performances"""

        if is_authenticated and user_data:
            # Authenticated context with user-specific info
            return f"""{base_context}

You are currently helping a logged-in parent. Here is their account information:
- Name: {user_data.get('name', 'Parent')}
- Children enrolled: {user_data.get('children', [])}
- Current balance: ${user_data.get('balance', 0):.2f}
- Upcoming payments: {user_data.get('upcoming_payments', [])}
- Enrolled classes: {user_data.get('classes', [])}
- Upcoming events: {user_data.get('events', [])}

You can help them with:
- Checking their account balance and payment history
- Viewing their children's class schedules
- Information about upcoming competitions and events
- Registration for new classes
- General billing questions"""

        return base_context

    async def chat(self, message: str, session_id: str = None, is_authenticated: bool = False, user_data: dict = None) -> dict:
        """Send a message and get AI response"""
        try:
            if not session_id:
                session_id = str(uuid.uuid4())

            # Get or create chat session
            if session_id not in self.chat_sessions:
                context = self.get_system_context(is_authenticated, user_data)
                self.model = genai.GenerativeModel('gemini-pro', system_instruction=context)
                self.chat_sessions[session_id] = self.model.start_chat(history=[])

            chat = self.chat_sessions[session_id]
            response = chat.send_message(message)

            return {
                "success": True,
                "response": response.text,
                "session_id": session_id
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "session_id": session_id
            }

gemini_service = GeminiService()
