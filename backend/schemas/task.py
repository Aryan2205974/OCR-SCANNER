from pydantic import BaseModel, Field
from typing import List, Optional

class SourceCitation(BaseModel):
    page: Optional[int] = Field(None, description="The exact page number (integer) where the requirement is located")
    section: Optional[str] = Field(None, description="The exact section name or number where the requirement is located")
    clause: Optional[str] = Field(None, description="The exact verbatim clause or snippet from the document")

class TaskItem(BaseModel):
    title: str = Field(..., description="Short, actionable title of the task")
    description: str = Field(..., description="Detailed explanation of what needs to be done and criteria for completion")
    category: str = Field(..., description="Category of the task (e.g., Procurement, Engineering, Legal, Operations, Finance, Compliance, Administrative)")
    dueDate: str = Field(..., description="Extracted deadline, target date, or relative timeline (e.g. 'Within 15 days', 'Before Phase 2', 'YYYY-MM-DD' if specified)")
    assignee: str = Field(..., description="Suggested role, department, or owner for the task (e.g. 'Project Manager', 'Procurement Specialist', 'Legal counsel')")
    priority: str = Field(..., description="Suggested priority level ('High', 'Medium', 'Low') based on severity or deadline")
    sourceText: str = Field(..., description="The exact snippet or sentence from the document that indicates this requirement or action item")
    sourcePage: Optional[str] = Field(None, description="The page number where the requirement resides")
    sourceSection: Optional[str] = Field(None, description="The section name or number where the requirement resides")
    sourceParagraph: Optional[str] = Field(None, description="The paragraph description or identifier where the requirement resides")
    citation: Optional[SourceCitation] = Field(None, description="Exact source citation coordinates")
    classification: str = Field("MANDATORY", description="Classification of the requirement: 'MANDATORY', 'CONDITIONAL', or 'INFORMATIONAL'")
    extracted_requirement: str = Field("", description="The exact verbatim requirement obligation extracted from text")
    ai_recommendation: str = Field("", description="AI suggested recommendation or advisory on how to comply")

class ComplianceChecklistItem(BaseModel):
    requirement: str = Field(..., description="The compliance requirement or checklist action (e.g., 'Submit bid before deadline', 'Meet turnover criteria')")
    status: str = Field(..., description="Verification status or explanation (e.g., 'Required', 'Exempt if MSME')")
    sourceText: str = Field(..., description="The exact clause or snippet from the document")

class CommercialSummary(BaseModel):
    emd_amount: Optional[str] = Field(None, description="Earnest Money Deposit (EMD) amount (e.g., '₹1,00,000' or 'Exempt')")
    security_deposit: Optional[str] = Field(None, description="Security Deposit percentage and timeline (e.g., '3% of PO value within 30 days')")
    payment_terms: Optional[str] = Field(None, description="Payment terms structure (e.g., '80% after invoice + GRN, 20% after performance certification')")
    liquidated_damages: Optional[str] = Field(None, description="Liquidated damages rules for delay (e.g., '0.5% per week delay, max 10%')")

class TechnicalSummary(BaseModel):
    product_specifications: Optional[str] = Field(None, description="Key technical parameters, materials, composition (e.g., 'Al2O3 >= 92%, Fe2O3 <= 0.30%')")
    quantities: Optional[str] = Field(None, description="Required supply quantities and units (e.g., '95.67 MT Alumina-Magnesia Spinel Bricks')")
    delivery_schedule: Optional[str] = Field(None, description="Delivery timelines (e.g., 'Within 45 days from PO')")

class RiskAlertItem(BaseModel):
    risk_type: str = Field(..., description="Type of risk or condition (e.g., 'Bid rejection condition', 'EMD forfeiture', 'Performance risk')")
    description: str = Field(..., description="Details of the risk rule or penalty")
    sourceText: str = Field(..., description="The exact clause from the document")

# New sub-schemas for advanced tender intelligence
class DeliverableItem(BaseModel):
    shape: str = Field(..., description="Shape description (e.g. 8/8, 8/30)")
    quantity: int = Field(..., description="Quantity required")
    weight: str = Field(..., description="Weight parameter or unit")
    quality: str = Field(..., description="Quality specification")

class OperationalAddresses(BaseModel):
    consignee_address: str = Field(..., description="Consignee address details")
    invoice_address: str = Field(..., description="Invoice billing address details")

class EligibilityEvidence(BaseModel):
    turnover_certificate: str = Field(..., description="Requirement details for turnover certificate")
    ca_udin_certificate: str = Field(..., description="Requirement details for CA certification with UDIN")
    purchase_orders: str = Field(..., description="Requirement details for past purchase orders")
    invoices: str = Field(..., description="Requirement details for invoices matching POs")
    required_forms: List[str] = Field(..., description="List of forms required (e.g. Forms 1-4)")
    required_annexures: List[str] = Field(..., description="List of annexures required (e.g. Annexure 1.2, 1.3)")

class EvaluationSummary(BaseModel):
    technical_evaluation: str = Field(..., description="Details of the technical evaluation process")
    commercial_evaluation: str = Field(..., description="Details of the commercial terms evaluation")
    price_evaluation: str = Field(..., description="Details of the price bid opening and criteria")
    reverse_auction: str = Field(..., description="Reverse auction possibility and rules")
    l1_determination: str = Field(..., description="L1 selection and contract splitting details")

class TenderIntelligence(BaseModel):
    tender_number: Optional[str] = Field(None, description="The formal tender identifier or reference number")
    submission_date: Optional[str] = Field(None, description="The bid submission deadline date and time")
    compliance_checklist: List[ComplianceChecklistItem] = Field(..., description="List of compliance verification items")
    commercial_summary: CommercialSummary = Field(..., description="Summary of key financial and commercial parameters")
    technical_summary: TechnicalSummary = Field(..., description="Summary of products, technical specs, and schedules")
    risk_alerts: List[RiskAlertItem] = Field(..., description="Critical risk conditions, rejection triggers, or forfeitures")
    deliverables: List[DeliverableItem] = Field(..., description="Detailed deliverables table items")
    operational_addresses: OperationalAddresses = Field(..., description="Billing and consignee addresses")
    eligibility_evidence: EligibilityEvidence = Field(..., description="Required eligibility evidence documents")
    evaluation_summary: EvaluationSummary = Field(..., description="Procurement evaluation stages and L1 determination workflow")

class DeadlineExportItem(BaseModel):
    event: str = Field(..., description="The deadline event name")
    date: str = Field(..., description="The target date or timeline")
    classification: str = Field(..., description="MANDATORY, CONDITIONAL, or INFORMATIONAL")

class DeliverableExportItem(BaseModel):
    shape: str = Field(..., description="Shape designation")
    quantity: int = Field(..., description="Quantity required")
    quality: str = Field(..., description="Quality standards")

class TechSpecExportItem(BaseModel):
    parameter: str = Field(..., description="Specification parameter (e.g. Al2O3)")
    value: str = Field(..., description="Limit or value (e.g. >= 92%)")

class RiskExportItem(BaseModel):
    risk_type: str = Field(..., description="Risk type")
    description: str = Field(..., description="Risk details")

class EligibilityExportItem(BaseModel):
    requirement: str = Field(..., description="Eligibility criteria description")
    evidence_needed: str = Field(..., description="The evidence required (e.g. CA certificate)")

class StructuredProcurementData(BaseModel):
    deadlines: List[DeadlineExportItem] = Field(..., description="Tender deadlines and milestones list")
    deliverables: List[DeliverableExportItem] = Field(..., description="Deliverables shapes list")
    technical_specs: List[TechSpecExportItem] = Field(..., description="Detailed technical specification parameters list")
    risks: List[RiskExportItem] = Field(..., description="Contract risk alerts list")
    eligibility: List[EligibilityExportItem] = Field(..., description="Eligibility evidence requirements list")

class TaskExtractionResponse(BaseModel):
    document_summary: str = Field(..., description="A brief high-level summary of the PDF document, its purpose, and scope")
    ai_readiness_score: int = Field(..., description="Score from 0 to 100 indicating how action-oriented, clear, and complete the document requirements are")
    readiness_justification: str = Field(..., description="Short explanation/rationale for the AI readiness score")
    tasks: List[TaskItem] = Field(..., description="The list of tasks extracted from the document")
    tender_intelligence: Optional[TenderIntelligence] = Field(None, description="Structured tender business intelligence (Compliance, Commercial, Technical, Risks, Deliverables, Addresses, Eligibility, Evaluation)")
    structured_procurement_data: Optional[StructuredProcurementData] = Field(None, description="Structured procurement data ready for integration")


