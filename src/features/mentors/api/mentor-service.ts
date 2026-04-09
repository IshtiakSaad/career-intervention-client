import { ApiResponse, Mentor, MentorFilters } from "../types";

const IS_SERVER = typeof window === "undefined";
const API_BASE_URL = IS_SERVER 
    ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1")
    : "/api/v1"; // Use relative path for client-side proxying

export const MentorService = {
    getAllMentors: async (filters: MentorFilters = {}): Promise<ApiResponse<Mentor[]>> => {
        const queryParams = new URLSearchParams();
        
        if (filters.searchTerm) queryParams.append("searchTerm", filters.searchTerm);
        if (filters.specialties && filters.specialties.length > 0) {
            filters.specialties.forEach(s => queryParams.append("specialties", s));
        }
        if (filters.experience) queryParams.append("experience", filters.experience.toString());
        if (filters.ratingAverage) queryParams.append("ratingAverage", filters.ratingAverage.toString());
        if (filters.page) queryParams.append("page", filters.page.toString());
        if (filters.limit) queryParams.append("limit", filters.limit.toString());
        if (filters.sortBy) queryParams.append("sortBy", filters.sortBy);
        if (filters.sortOrder) queryParams.append("sortOrder", filters.sortOrder);

        const response = await fetch(`${API_BASE_URL}/mentors?${queryParams.toString()}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            next: { revalidate: 60 }, // Cache for 60 seconds
        });

        console.log(response);

        if (!response.ok) {
            throw new Error(`Failed to fetch mentors: ${response.statusText}`);
        }

        return response.json();
    },

    getSingleMentor: async (id: string): Promise<ApiResponse<Mentor>> => {
        const response = await fetch(`${API_BASE_URL}/mentors/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch mentor: ${response.statusText}`);
        }

        return response.json();
    },
};
