"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PackagePlus, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AddItemPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            title: formData.get("title"),
            shortDescription: formData.get("shortDescription"),
            fullDescription: formData.get("fullDescription"),
            price: formData.get("price"),
            imageUrl: formData.get("imageUrl"),
        };

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        toast.success("Resource deployed successfully!", {
            description: `${data.title} has been added to the catalog.`,
        });

        setLoading(false);
        router.push("/items");
    };

    return (
        <div className="py-24 max-w-2xl mx-auto px-6">
            <Link 
                href="/items" 
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary mb-8 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Catalog
            </Link>

            <div className="bg-[#0a0a0a] border border-white/[0.06] p-8 md:p-12">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-sm">
                        <PackagePlus className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Add New Resource</h1>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Provisioning system v1.0</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Title</label>
                        <input 
                            name="title"
                            required
                            placeholder="e.g. Advanced Architecture Patterns"
                            className="w-full bg-[#050505] border border-white/[0.1] px-4 py-3 text-sm focus:border-primary outline-none transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Short Description</label>
                        <input 
                            name="shortDescription"
                            required
                            placeholder="1-2 line summary for the card"
                            className="w-full bg-[#050505] border border-white/[0.1] px-4 py-3 text-sm focus:border-primary outline-none transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Full Description</label>
                        <textarea 
                            name="fullDescription"
                            required
                            rows={4}
                            placeholder="Detailed breakdown of the resource..."
                            className="w-full bg-[#050505] border border-white/[0.1] px-4 py-3 text-sm focus:border-primary outline-none transition-colors resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Price ($)</label>
                            <input 
                                name="price"
                                required
                                type="number"
                                placeholder="49"
                                className="w-full bg-[#050505] border border-white/[0.1] px-4 py-3 text-sm focus:border-primary outline-none transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Image URL (Optional)</label>
                            <input 
                                name="imageUrl"
                                placeholder="https://..."
                                className="w-full bg-[#050505] border border-white/[0.1] px-4 py-3 text-sm focus:border-primary outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-primary-foreground py-4 rounded-sm text-sm font-bold uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-8"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Deploying...
                            </>
                        ) : (
                            "Submit Resource"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
