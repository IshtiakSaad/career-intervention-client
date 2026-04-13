/**
 * formatFilterParams
 * Transforms Next.js searchParams (URLSearchParams) into a query string compatible 
 * with the backend's pagination and filtering logic.
 */
export function formatFilterParams(params: URLSearchParams): string {
    const formatted = new URLSearchParams();

    // Standard mapping
    params.forEach((value, key) => {
        if (!value) return;

        // Custom handling for specific keys if needed
        if (key === "page" || key === "limit" || key === "searchTerm" || key === "sortBy" || key === "sortOrder") {
            formatted.set(key, value);
        } else {
            // Treat others as direct filters
            formatted.set(key, value);
        }
    });

    // Defaults if missing
    if (!formatted.has("page")) formatted.set("page", "1");
    if (!formatted.has("limit")) formatted.set("limit", "10");

    return formatted.toString();
}
