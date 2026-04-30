export enum SessionStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    ONGOING = "ONGOING",
    COMPLETED = "COMPLETED",
    SETTLED = "SETTLED",
    CANCELLED_BY_MENTEE = "CANCELLED_BY_MENTEE",
    CANCELLED_BY_MENTOR = "CANCELLED_BY_MENTOR",
    EXPIRED = "EXPIRED",
    NO_SHOW = "NO_SHOW",
    DISPUTED = "DISPUTED",
    REFUNDED = "REFUNDED",
    REJECTED = "REJECTED",
}

export interface ISession {
    id: string;
    mentorId: string;
    menteeId: string;
    availabilitySlotId: string;
    serviceId: string;
    sessionType?: string;
    startTime: string; // ISO String
    durationMinutes: number;
    priceAtBooking: number;
    status: SessionStatus;
    notes?: string;
    meetingLink?: string;
    version: number;
    idempotencyKey?: string;
    
    // Population
    mentor?: {
        id: string;
        user: {
            name: string;
            email: string;
            profileImageUrl: string | null;
        }
    };
    mentee?: {
        id: string;
        user: {
            name: string;
            email: string;
            profileImageUrl: string | null;
        }
    };
    service?: {
        id: string;
        title: string;
        price: number;
    };
    actionPlan?: IActionPlan;
    createdAt: string;
}

export enum ActionPlanStatus {
    DRAFT = "DRAFT",
    SUBMITTED = "SUBMITTED",
    REVISED = "REVISED",
}

export interface IActionPlan {
    id: string;
    sessionId: string;
    summary: string;
    tasks: Array<{
        title: string;
        deadline?: string;
        isDone: boolean;
    }>;
    resources?: Array<{
        label: string;
        url: string;
    }>;
    notes?: string;
    status: ActionPlanStatus;
    version: number;
    createdAt: string;
}

export interface IAvailabilitySlot {
    id: string;
    mentorId: string;
    startTime: string;
    endTime: string;
    status: "AVAILABLE" | "BOOKED" | "BLOCKED";
    description?: string;
    version: number;
}
