import { getCookie } from "./cookie-utils";

/**
 * Senior Architect Note:
 * This utility centralizes all server-side fetching to the backend.
 * It automatically injects the HttpOnly 'accessToken' into the Authorization header
 * and enforces the standard 'Bearer' prefix.
 */

const BACKEND_API_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

const serverFetchHelper = async (endpoint: string, options: RequestInit): Promise<Response> => {
    const { headers, ...restOptions } = options;

    // Retrieve the accessToken on the server
    const accessToken = await getCookie("accessToken");

    // Trace log for debugging server-to-server communication
    if (process.env.NODE_ENV === "development") {
        console.log(`[SERVER_FETCH]: ${options.method || 'GET'} ${BACKEND_API_URL}${endpoint}`);
    }

    const response = await fetch(`${BACKEND_API_URL}${endpoint}`, {
        ...restOptions,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            ...headers,
            // Automatically inject the Bearer token if available
            ...(accessToken ? { "Authorization": `Bearer ${accessToken}` } : {}),
        },
    });

    return response;
};

export const serverFetch = {
    get: async (endpoint: string, options: RequestInit = {}): Promise<Response> => 
        serverFetchHelper(endpoint, { ...options, method: "GET" }),

    post: async (endpoint: string, options: RequestInit = {}): Promise<Response> => 
        serverFetchHelper(endpoint, { ...options, method: "POST" }),

    put: async (endpoint: string, options: RequestInit = {}): Promise<Response> => 
        serverFetchHelper(endpoint, { ...options, method: "PUT" }),

    patch: async (endpoint: string, options: RequestInit = {}): Promise<Response> => 
        serverFetchHelper(endpoint, { ...options, method: "PATCH" }),

    delete: async (endpoint: string, options: RequestInit = {}): Promise<Response> => 
        serverFetchHelper(endpoint, { ...options, method: "DELETE" }),
};
