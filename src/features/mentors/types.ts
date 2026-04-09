export interface Specialty {
    id: string;
    name: string;
}

export interface MentorSpecialty {
    specialty: Specialty;
}

export interface User {
    name: string;
    email: string;
    profileImageUrl: string | null;
    gender: string;
}

export interface Mentor {
    id: string;
    bio: string | null;
    currentWorkingPlace: string | null;
    designation: string | null;
    experience: number;
    verificationBadge: boolean;
    ratingCount: number;
    ratingAverage: number;
    totalSessions: number;
    completedSessions: number;
    cancelRate: number;
    activeStatus: boolean;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    email: string;
    user: User;
    mentorSpecialties: MentorSpecialty[];
}

export interface ApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    meta?: {
        page: number;
        limit: number;
        total: number;
    };
    data: T;
}

export interface MentorFilters {
    searchTerm?: string;
    specialties?: string[];
    experience?: number;
    ratingAverage?: number;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
