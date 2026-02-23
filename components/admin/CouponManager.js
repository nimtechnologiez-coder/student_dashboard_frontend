'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash, Ticket, Calendar, Percent } from 'lucide-react';

const CouponManager = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        code: '',
        discountValue: '',
        discountType: 'percentage', // percentage or flat
        expiryDate: '',
        usageLimit: 0,
        minOrderAmount: 0
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/coupons');
            if (res.ok) {
                const data = await res.json();
                setCoupons(data);
            }
        } catch (error) {
            console.error("Error fetching coupons:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCoupon = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/coupons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert('Coupon created successfully!');
                setIsModalOpen(false);
                setFormData({
                    code: '',
                    discountValue: '',
                    discountType: 'percentage',
                    expiryDate: '',
                    usageLimit: 0,
                    minOrderAmount: 0
                });
                fetchCoupons();
            } else {
                const data = await res.json();
                alert(data.message || 'Failed to create coupon');
            }
        } catch (error) {
            console.error("Error creating coupon:", error);
        }
    };

    const handleDeleteCoupon = async (id) => {
        if (!confirm('Are you sure you want to delete this coupon?')) return;

        try {
            const res = await fetch(`http://localhost:5000/api/coupons/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                fetchCoupons();
            }
        } catch (error) {
            console.error("Error deleting coupon:", error);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Coupon Management</h2>
                    <p className="text-gray-400">Create and manage discount codes</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#A3D861] text-black font-bold rounded-xl hover:bg-[#A3D861]/90 transition-colors"
                >
                    <Plus size={20} /> Create Coupon
                </button>
            </div>

            {loading ? (
                <div className="text-white">Loading...</div>
            ) : (
                <div className="bg-[#0a0f1a] border border-white/10 rounded-2xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-sm uppercase">
                                <th className="p-4">Code</th>
                                <th className="p-4">Discount</th>
                                <th className="p-4">Expiry</th>
                                <th className="p-4">Usage</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-gray-300">
                            {coupons.length > 0 ? (
                                coupons.map(coupon => (
                                    <tr key={coupon._id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-mono font-bold text-white">{coupon.code}</td>
                                        <td className="p-4">
                                            {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                                        </td>
                                        <td className="p-4">{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                                        <td className="p-4">{coupon.usedCount} / {coupon.usageLimit === 0 ? '∞' : coupon.usageLimit}</td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleDeleteCoupon(coupon._id)}
                                                className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">
                                        No coupons found. Create your first one!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#0a0f1a] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-4">Create New Coupon</h3>

                        <form onSubmit={handleCreateCoupon} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Coupon Code</label>
                                <div className="relative">
                                    <Ticket size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="text"
                                        value={formData.code}
                                        onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:border-[#A3D861] uppercase placeholder-gray-600"
                                        placeholder="SUMMER2024"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Discount Type</label>
                                    <select
                                        value={formData.discountType}
                                        onChange={e => setFormData({ ...formData, discountType: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#A3D861]"
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="flat">Flat Amount (₹)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Value</label>
                                    <div className="relative">
                                        {formData.discountType === 'percentage' ?
                                            <Percent size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" /> :
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                                        }
                                        <input
                                            type="number"
                                            value={formData.discountValue}
                                            onChange={e => setFormData({ ...formData, discountValue: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-white focus:border-[#A3D861]"
                                            placeholder="20"
                                            required
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Expiry Date</label>
                                <div className="relative">
                                    <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="date"
                                        value={formData.expiryDate}
                                        onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white/50 focus:border-[#A3D861] [color-scheme:dark]"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 bg-[#A3D861] hover:bg-[#A3D861]/90 text-black rounded-lg transition-colors font-bold"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CouponManager;
