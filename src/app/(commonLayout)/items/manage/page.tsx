"use client";

import { useState } from "react";
import { 
    Settings, 
    Eye, 
    Trash2, 
    Plus, 
    Search,
    AlertCircle
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

// Reusing mock data structure
const INITIAL_MOCK_ITEMS = [
    { id: "1", title: "FAANG Interview Masterclass", category: "Career", price: "$49", rating: 4.8 },
    { id: "2", title: "React Performance Engineering", category: "Technical", price: "$79", rating: 4.9 },
    { id: "3", title: "System Design for Architects", category: "Technical", price: "$99", rating: 4.7 },
    { id: "4", title: "Executive Communication", category: "Leadership", price: "$59", rating: 4.6 },
    { id: "5", title: "Data Science Specialization", category: "Data", price: "$89", rating: 4.5 },
    { id: "6", title: "UI/UX Strategy for Leads", category: "Design", price: "$69", rating: 4.8 },
];

export default function ManageItemsPage() {
    const [items, setItems] = useState(INITIAL_MOCK_ITEMS);
    const [searchTerm, setSearchTerm] = useState("");

    const handleDelete = (id: string, title: string) => {
        if (confirm(`Are you sure you want to decommission ${title}?`)) {
            setItems(items.filter(item => item.id !== id));
            toast.error("Resource decommissioned", {
                description: `${title} has been removed from the platform.`,
            });
        }
    };

    const filteredItems = items.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="py-24 max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <Settings className="w-8 h-8 text-primary" />
                        Resource Management
                    </h1>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mt-2">Central Authority for Platform Assets</p>
                </div>

                <Link 
                    href="/items/add"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-sm text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    New Resource
                </Link>
            </div>

            {/* Controls */}
            <div className="mb-8 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                        type="text"
                        placeholder="Filter by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#0a0a0a] border border-white/[0.06] pl-11 pr-4 py-3 text-sm focus:border-primary outline-none transition-colors"
                    />
                </div>
            </div>

            {/* Management Table */}
            <div className="overflow-x-auto border border-white/[0.06] bg-[#0a0a0a]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Resource</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Category</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Price</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Rating</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06]">
                        {filteredItems.map((item) => (
                            <tr key={item.id} className="hover:bg-white/[0.01] transition-colors">
                                <td className="px-6 py-4">
                                    <span className="font-bold text-sm">{item.title}</span>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-tighter mt-0.5">ID: {item.id}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-sm">
                                        {item.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium">{item.price}</td>
                                <td className="px-6 py-4 text-sm font-medium text-muted-foreground">{item.rating}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link 
                                            href={`/items/${item.id}`}
                                            className="p-2 hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                        <button 
                                            onClick={() => handleDelete(item.id, item.title)}
                                            className="p-2 hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"
                                            title="Delete Resource"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredItems.length === 0 && (
                    <div className="py-20 flex flex-col items-center justify-center gap-4 text-muted-foreground">
                        <AlertCircle className="w-12 h-12 opacity-20" />
                        <p className="italic text-sm">No resources found in current inventory.</p>
                    </div>
                )}
            </div>

            <div className="mt-8 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Inventory System Online • {items.length} records active
            </div>
        </div>
    );
}
