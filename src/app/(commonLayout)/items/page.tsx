"use client";

import { useState, useMemo } from "react";
import { Search, Filter, BookOpen, Clock, Tag, ArrowRight } from "lucide-react";
import Link from "next/link";

// Mock data for 6+ items
const MOCK_ITEMS = [
    { id: "1", title: "FAANG Interview Masterclass", description: "Complete roadmap to cracking Tier-1 tech interviews with mock sessions.", category: "Career", price: "$49", rating: 4.8, image: "💼" },
    { id: "2", title: "React Performance Engineering", description: "Deep dive into advanced rendering patterns and optimization techniques.", category: "Technical", price: "$79", rating: 4.9, image: "⚛️" },
    { id: "3", title: "System Design for Architects", description: "Learn to build scalable distributed systems with real-world case studies.", category: "Technical", price: "$99", rating: 4.7, image: "🏗️" },
    { id: "4", title: "Executive Communication", description: "Master the art of high-stakes communication and leadership presence.", category: "Leadership", price: "$59", rating: 4.6, image: "🎙️" },
    { id: "5", title: "Data Science Specialization", description: "From statistics to machine learning models in a business context.", category: "Data", price: "$89", rating: 4.5, image: "📊" },
    { id: "6", title: "UI/UX Strategy for Leads", description: "Bridging the gap between design thinking and engineering execution.", category: "Design", price: "$69", rating: 4.8, image: "🎨" },
    { id: "7", title: "Product Management Foundations", description: "Learn the core pillars of product-led growth and strategy.", category: "Product", price: "$55", rating: 4.7, image: "🚀" },
];

export default function ItemsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");

    const filteredItems = useMemo(() => {
        return MOCK_ITEMS.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, categoryFilter]);

    return (
        <div className="pt-32 pb-24">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
                {/* Header & Search/Filter Section */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold tracking-tighter mb-8">Career Resources</h1>
                    
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-[#0a0a0a] border border-white/[0.06] p-4">
                        {/* Search bar */}
                        <div className="relative w-full lg:max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input 
                                type="text"
                                placeholder="Search resources..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#050505] border border-white/[0.1] pl-11 pr-4 py-3 text-sm focus:border-primary outline-none transition-colors"
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex gap-4 w-full lg:w-auto">
                            <div className="relative flex-1 lg:w-48">
                                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <select 
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="w-full bg-[#050505] border border-white/[0.1] pl-11 pr-4 py-3 text-sm focus:border-primary outline-none transition-colors appearance-none"
                                >
                                    <option value="All">All Categories</option>
                                    <option value="Technical">Technical</option>
                                    <option value="Career">Career</option>
                                    <option value="Leadership">Leadership</option>
                                    <option value="Data">Data</option>
                                    <option value="Design">Design</option>
                                    <option value="Product">Product</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredItems.map((item) => (
                        <div 
                            key={item.id}
                            className="group bg-[#0a0a0a] border border-white/[0.06] hover:border-primary/30 transition-all overflow-hidden flex flex-col"
                        >
                            {/* Item Image/Icon Placeholder */}
                            <div className="h-48 bg-[#050505] flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500">
                                {item.image}
                            </div>
                            
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-sm">
                                        {item.category}
                                    </span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                        ⭐ {item.rating}
                                    </span>
                                </div>
                                
                                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                                    {item.title}
                                </h3>
                                
                                <p className="text-sm text-muted-foreground mb-6 line-clamp-2 leading-relaxed">
                                    {item.description}
                                </p>
                                
                                <div className="mt-auto pt-6 border-t border-white/[0.04] flex items-center justify-between">
                                    <span className="text-lg font-bold text-foreground">{item.price}</span>
                                    <Link 
                                        href={`/items/${item.id}`}
                                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:gap-3 transition-all"
                                    >
                                        View Details
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredItems.length === 0 && (
                    <div className="py-24 text-center">
                        <p className="text-muted-foreground italic">No resources match your search criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

