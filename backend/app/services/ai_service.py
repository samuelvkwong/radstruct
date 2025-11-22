from typing import Dict, Any
import json
from anthropic import Anthropic
from app.core.config import settings


class AIService:
    def __init__(self):
        if settings.ANTHROPIC_API_KEY:
            self.client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)
            self.provider = "anthropic"
        else:
            raise ValueError("No AI API key configured")
    
    async def structure_report(
        self, 
        report_text: str, 
        template_structure: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Use Claude to extract structured data from free-text report
        according to the provided template structure.
        """
        prompt = self._build_prompt(report_text, template_structure)
        
        try:
            if self.provider == "anthropic":
                return await self._call_anthropic(prompt)
            else:
                raise ValueError(f"Unsupported AI provider: {self.provider}")
        except Exception as e:
            raise Exception(f"AI processing failed: {str(e)}")
    
    def _build_prompt(self, report_text: str, template_structure: Dict[str, Any]) -> str:
        """Build the prompt for the AI model"""
        template_fields = json.dumps(template_structure, indent=2)
        
        prompt = f"""You are a medical AI assistant specialized in structuring radiology reports.

Given the following radiology report text and template structure, extract the relevant information and return it as a structured JSON object.

RADIOLOGY REPORT:
{report_text}

TEMPLATE STRUCTURE:
{template_fields}

INSTRUCTIONS:
1. Extract information from the report that matches the template fields
2. Use null for fields where information is not found
3. Maintain medical accuracy and terminology
4. Return ONLY a valid JSON object matching the template structure
5. Do not include any explanatory text, only the JSON

RESPONSE (JSON only):"""
        
        return prompt
    
    async def _call_anthropic(self, prompt: str) -> Dict[str, Any]:
        """Call Anthropic's Claude API"""
        message = self.client.messages.create(
            model=settings.AI_MODEL,
            max_tokens=2000,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        response_text = message.content[0].text.strip()
        
        # Remove markdown code blocks if present
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        
        response_text = response_text.strip()
        
        try:
            structured_data = json.loads(response_text)
            return {
                "structured_data": structured_data,
                "confidence_score": 85  # Could be enhanced with actual confidence scoring
            }
        except json.JSONDecodeError as e:
            raise Exception(f"Failed to parse AI response as JSON: {str(e)}")


# Singleton instance
ai_service = AIService()
