import io
from pypdf import PdfReader

class PDFService:
    @staticmethod
    def extract_text(file_bytes: bytes) -> str:
        """
        Extract text content from uploaded PDF bytes.
        """
        try:
            # Load PDF from memory bytes
            pdf_file = io.BytesIO(file_bytes)
            reader = PdfReader(pdf_file)
            
            full_text = []
            for page_num, page in enumerate(reader.pages):
                text = page.extract_text()
                if text:
                    full_text.append(text)
            
            extracted_text = "\n".join(full_text)
            
            # Clean up redundant spaces or empty lines
            lines = [line.strip() for line in extracted_text.splitlines() if line.strip()]
            return "\n".join(lines)
            
        except Exception as e:
            raise ValueError(f"Failed to parse PDF document: {str(e)}")
