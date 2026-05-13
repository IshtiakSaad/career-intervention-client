import { ISession, SessionStatus } from "@/types/session";

export const MOCK_SESSIONS: ISession[] = [
    {
        id: "sess_1",
        startTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        endTime: new Date(Date.now() + 86400000 + 3600000).toISOString(),
        durationMinutes: 60,
        status: SessionStatus.PENDING,
        priceAtBooking: "50.00",
        currency: "USD",
        notes: "Discussing career transition to AI engineering.",
        meetingLink: null,
        mentorId: "m1",
        menteeId: "u1",
        mentor: {
            user: { name: "Dr. Aris" }
        } as any,
        mentee: {
            user: { name: "Jordan Smith" }
        } as any,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1
    },
    {
        id: "sess_2",
        startTime: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        endTime: new Date().toISOString(),
        durationMinutes: 60,
        status: SessionStatus.ONGOING,
        priceAtBooking: "75.00",
        currency: "USD",
        notes: "System Design deep dive.",
        meetingLink: "https://zoom.us/j/123456789",
        mentorId: "m2",
        menteeId: "u2",
        mentor: {
            user: { name: "Sarah Chen" }
        } as any,
        mentee: {
            user: { name: "Lila Vance" }
        } as any,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1
    }
];
