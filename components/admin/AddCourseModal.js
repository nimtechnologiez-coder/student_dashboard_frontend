'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Star, Users, BookOpen, Clock, Video, Plus, Trash2 } from 'lucide-react';

const AddCourseModal = ({ isOpen, onClose, onCourseAdded, courseToEdit }) => {
    const initialFormState = {
        title: '',
        subtitle: '',
        thumbnail: '', // Course Thumbnail
        instructor: 'Dr. Sarah Mitchell',
        price: '',
        originalPrice: '',
        rating: 4.5,
        students: 0,
        level: 'Beginner',
        description: '',
        language: 'English',
        duration: '10h 30m',
        lecturesCount: 0,
        videoLink: '',
        curriculum: [], // Array for interactive editor
        status: 'Draft',
        validity: '365', // Default 1 year
        curriculumJson: '[]' // Keep for JSON editor consistency if needed
    };

    const [formData, setFormData] = useState(initialFormState);
    const [loading, setLoading] = useState(false);

    const [instructors, setInstructors] = useState([]);

    useEffect(() => {
        if (isOpen) {
            // Fetch instructors
            const fetchInstructors = async () => {
                try {
                    const res = await fetch('http://localhost:5000/api/instructors');
                    if (res.ok) {
                        const data = await res.json();
                        setInstructors(data);
                    }
                } catch (error) {
                    console.error("Error fetching instructors:", error);
                }
            };
            fetchInstructors();

            if (courseToEdit) {
                setFormData({
                    ...initialFormState,
                    ...courseToEdit,
                    instructor: courseToEdit.instructor || '',
                    instructorId: courseToEdit.instructorId || '',
                    instructorImage: courseToEdit.instructorImage || '',
                    thumbnail: courseToEdit.thumbnail || '',
                    videoLink: courseToEdit.videoLink || '',
                    curriculum: courseToEdit.curriculum || [], // Direct array usage
                    status: courseToEdit.status || 'Draft',
                    validity: courseToEdit.validity || '365',
                    curriculumJson: courseToEdit.curriculum ? JSON.stringify(courseToEdit.curriculum, null, 2) : '[]'
                });
            } else {
                setFormData(initialFormState);
            }
        }
    }, [isOpen, courseToEdit]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileUpload = async (file) => {
        // ALWAYS use local upload for now (User Request)
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                const data = await response.json();
                return data.url;
            } else {
                console.error('Upload failed');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
        return null;
    };

    const onImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Simple loading indicator for image
        const originalText = e.target.nextElementSibling?.innerText;
        if (e.target.nextElementSibling) e.target.nextElementSibling.innerText = "Uploading...";

        const url = await handleFileUpload(file);
        if (url) {
            setFormData(prev => ({ ...prev, thumbnail: url }));
        } else {
            alert("Image upload failed");
        }

        if (e.target.nextElementSibling && originalText) e.target.nextElementSibling.innerText = originalText;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Use the structured curriculum array directly from formData
            const payload = {
                ...formData,
                curriculum: formData.curriculum // Logic updated to use array
            };
            // Remove helper fields
            delete payload.curriculumJson;

            // Determine URL and Method based on edit mode
            const url = courseToEdit
                ? `http://localhost:5000/api/courses/${courseToEdit._id}`
                : 'http://localhost:5000/api/courses';

            const method = courseToEdit ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const savedCourse = await response.json();
                onCourseAdded(savedCourse); // This name might be misleading now, but it handles both add/update in parent
                onClose();
            } else {
                alert('Failed to save course');
            }
        } catch (error) {
            console.error('Error saving course:', error);
            alert('Error saving course');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-[#0a0f1a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="sticky top-0 bg-[#0a0f1a] border-b border-white/10 p-6 flex justify-between items-center z-10">
                    <h2 className="text-xl font-bold text-white">
                        {courseToEdit ? 'Edit Course' : 'Add New Course'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-4">
                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Course Thumbnail</label>
                            <div className="flex items-start gap-4">
                                <div className="relative w-32 h-20 bg-white/5 border border-white/10 rounded-lg overflow-hidden flex items-center justify-center">
                                    {formData.thumbnail ? (
                                        <img src={formData.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <Video className="text-gray-600" size={24} />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        id="courseImage"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={onImageUpload}
                                    />
                                    <label
                                        htmlFor="courseImage"
                                        className="inline-flex items-center gap-2 bg-[#050a14] border border-white/10 hover:border-[#A3D861] text-white px-4 py-2 rounded-lg cursor-pointer transition-colors text-sm font-medium"
                                    >
                                        <Plus size={16} /> Upload Image
                                    </label>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Recommended size: 1280x720 (16:9 aspect ratio). Max 2MB.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Course Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#A3D861]"
                                placeholder="e.g. Advanced React Patterns"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Instructor</label>
                                <div className="flex items-center gap-3">
                                    {formData.instructorImage && (
                                        <img
                                            src={formData.instructorImage}
                                            alt="Instructor"
                                            className="w-10 h-10 rounded-full object-cover border border-white/10"
                                        />
                                    )}
                                    <select
                                        name="instructorId"
                                        value={formData.instructorId || ''}
                                        onChange={(e) => {
                                            const selectedId = e.target.value;
                                            const selectedInstructor = instructors.find(i => i._id === selectedId);
                                            setFormData(prev => ({
                                                ...prev,
                                                instructorId: selectedId,
                                                instructor: selectedInstructor ? selectedInstructor.name : '',
                                                instructorImage: selectedInstructor ? selectedInstructor.image : ''
                                            }));
                                        }}
                                        className="w-full bg-[#050a14] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#A3D861]"
                                    >
                                        <option value="">Select Instructor</option>
                                        {instructors.map(inst => (
                                            <option key={inst._id} value={inst._id}>{inst.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Subtitle</label>
                                <input
                                    type="text"
                                    name="subtitle"
                                    value={formData.subtitle}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#A3D861]"
                                    placeholder="Short description..."
                                />
                            </div>
                            <div className="col-span-full md:col-span-1">
                                <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                                <select
                                    name="category"
                                    value={formData.category || 'Other'}
                                    onChange={handleChange}
                                    className="w-full bg-[#050a14] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#A3D861]"
                                >
                                    <option value="Full Stack Development">Full Stack Development</option>
                                    <option value="Data & Analysis">Data & Analysis</option>
                                    <option value="Design And Branding">Design And Branding</option>
                                    <option value="Cloud And Digital">Cloud And Digital</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full bg-[#050a14] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#A3D861]"
                                >
                                    <option value="Draft">Draft</option>
                                    <option value="Published">Published</option>
                                    <option value="Archived">Archived</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Validity (Days)</label>
                                <input
                                    type="number"
                                    name="validity"
                                    value={formData.validity}
                                    onChange={handleChange}
                                    className="w-full bg-[#050a14] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#A3D861]"
                                    placeholder="e.g. 365"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Price</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                    <input
                                        type="text"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none focus:border-[#A3D861]"
                                        placeholder="49.99"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Original Price</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                    <input
                                        type="text"
                                        name="originalPrice"
                                        value={formData.originalPrice}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none focus:border-[#A3D861]"
                                        placeholder="99.99"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Level</label>
                                <select
                                    name="level"
                                    value={formData.level}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#A3D861]"
                                >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                    <option value="All Levels">All Levels</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Language</label>
                                <input
                                    type="text"
                                    name="language"
                                    value={formData.language}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#A3D861]"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Rating</label>
                                <div className="relative">
                                    <Star size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500" />
                                    <input
                                        type="number"
                                        step="0.1"
                                        name="rating"
                                        value={formData.rating}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#A3D861]"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Students</label>
                                <div className="relative">
                                    <Users size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" />
                                    <input
                                        type="number"
                                        name="students"
                                        value={formData.students}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#A3D861]"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Duration</label>
                                <div className="relative">
                                    <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="text"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#A3D861]"
                                        placeholder="e.g. 10h 30m"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Video Preview (Upload)</label>
                            <div className="relative">
                                <Video size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                {formData.videoLink ? (
                                    <div className="relative group">
                                        <video
                                            src={formData.videoLink}
                                            controls
                                            className="w-full h-48 bg-black rounded-xl object-cover border border-white/10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, videoLink: '' }))}
                                            className="absolute top-2 right-2 bg-red-500/80 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                                            title="Remove Video"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="video/*"
                                            className="hidden"
                                            id="preview-video-upload"
                                            onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const url = await handleFileUpload(file);
                                                    if (url) {
                                                        setFormData(prev => ({ ...prev, videoLink: url }));
                                                    } else {
                                                        alert('Preview video upload failed');
                                                    }
                                                }
                                            }}
                                        />
                                        <label
                                            htmlFor="preview-video-upload"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer block transition-colors"
                                        >
                                            Click to upload video file...
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#A3D861]"
                                placeholder="HTML description of the course..."
                            />
                        </div>

                        {/* Interactive Curriculum Editor */}
                        <div className="border-t border-white/10 pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-white">Course Modules & Lectures</h3>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData(prev => ({
                                            ...prev,
                                            curriculum: [...(prev.curriculum || []), {
                                                title: 'New Module',
                                                duration: '0m',
                                                lectures: []
                                            }]
                                        }));
                                    }}
                                    className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-3 py-1.5 rounded-lg hover:bg-white/10 text-sm font-bold transition-colors"
                                >
                                    <Plus size={16} /> Add Module
                                </button>
                            </div>

                            <div className="space-y-4">
                                {formData.curriculum && formData.curriculum.length > 0 ? (
                                    formData.curriculum.map((module, mIdx) => (
                                        <div key={mIdx} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                                            <div className="p-4 bg-white/5 border-b border-white/5 flex justify-between items-center gap-4">
                                                <input
                                                    type="text"
                                                    value={module.title}
                                                    onChange={(e) => {
                                                        const newCurriculum = [...formData.curriculum];
                                                        newCurriculum[mIdx].title = e.target.value;
                                                        setFormData(prev => ({ ...prev, curriculum: newCurriculum }));
                                                    }}
                                                    className="bg-transparent text-white font-bold focus:outline-none border-b border-transparent focus:border-[#A3D861] flex-1"
                                                    placeholder="Module Title"
                                                />
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-gray-500">{module.duration}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (confirm('Delete this module?')) {
                                                                const newCurriculum = formData.curriculum.filter((_, i) => i !== mIdx);
                                                                setFormData(prev => ({ ...prev, curriculum: newCurriculum }));
                                                            }
                                                        }}
                                                        className="text-gray-500 hover:text-red-400"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="p-4 space-y-4">
                                                {module.lectures && module.lectures.length > 0 ? (
                                                    module.lectures.map((lecture, lIdx) => (
                                                        <div key={lIdx} className="bg-[#0a0f1a] border border-white/10 rounded-lg p-3">
                                                            <div className="flex items-center justify-between mb-2 gap-3">
                                                                <div className="flex items-center gap-2 flex-1">
                                                                    <div className="bg-[#0395B2]/20 p-1 rounded text-[#0395B2]">
                                                                        <Video size={14} />
                                                                    </div>
                                                                    <input
                                                                        type="text"
                                                                        value={lecture.title}
                                                                        onChange={(e) => {
                                                                            const newCurriculum = [...formData.curriculum];
                                                                            newCurriculum[mIdx].lectures[lIdx].title = e.target.value;
                                                                            setFormData(prev => ({ ...prev, curriculum: newCurriculum }));
                                                                        }}
                                                                        className="bg-transparent text-sm font-medium text-gray-200 focus:outline-none w-full"
                                                                        placeholder="Lecture Title"
                                                                    />
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const newCurriculum = [...formData.curriculum];
                                                                            const lecture = newCurriculum[mIdx].lectures[lIdx];
                                                                            lecture.free = !lecture.free;
                                                                            setFormData(prev => ({ ...prev, curriculum: newCurriculum }));
                                                                        }}
                                                                        className={`px-1.5 py-0.5 rounded text-xs cursor-pointer ${lecture.free ? 'bg-[#A3D861]/20 text-[#A3D861]' : 'bg-gray-700 text-gray-400'}`}
                                                                    >
                                                                        {lecture.free ? 'Free' : 'Locked'}
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const newCurriculum = [...formData.curriculum];
                                                                            newCurriculum[mIdx].lectures = newCurriculum[mIdx].lectures.filter((_, i) => i !== lIdx);
                                                                            setFormData(prev => ({ ...prev, curriculum: newCurriculum }));
                                                                        }}
                                                                        className="text-gray-500 hover:text-red-400"
                                                                    >
                                                                        <Trash2 size={14} />
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                <div className="flex-1">
                                                                    {lecture.uploading ? (
                                                                        <div className="text-xs text-[#A3D861] animate-pulse">Uploading video...</div>
                                                                    ) : lecture.videoUrl ? (
                                                                        <div className="relative group mt-2">
                                                                            <video
                                                                                src={lecture.videoUrl}
                                                                                controls
                                                                                className="w-full h-32 bg-black rounded-lg object-cover border border-white/10"
                                                                            />
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    const newCurriculum = [...formData.curriculum];
                                                                                    newCurriculum[mIdx].lectures[lIdx].videoUrl = '';
                                                                                    setFormData(prev => ({ ...prev, curriculum: newCurriculum }));
                                                                                }}
                                                                                className="absolute top-2 right-2 bg-red-500/80 text-white p-1 rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                                                                                title="Remove Video"
                                                                            >
                                                                                <X size={14} />
                                                                            </button>
                                                                        </div>
                                                                    ) : (
                                                                        <label className="flex items-center gap-2 bg-white/5 border border-white/10 rounded px-3 py-1.5 text-sm text-gray-300 hover:bg-white/10 cursor-pointer transition-colors">
                                                                            <Video size={14} />
                                                                            <span>Upload Video</span>
                                                                            <input
                                                                                type="file"
                                                                                accept="video/*"
                                                                                className="hidden"
                                                                                onChange={async (e) => {
                                                                                    const file = e.target.files[0];
                                                                                    if (!file) return;

                                                                                    // Set uploading state
                                                                                    const newCurriculum = [...formData.curriculum];
                                                                                    newCurriculum[mIdx].lectures[lIdx].uploading = true;
                                                                                    setFormData(prev => ({ ...prev, curriculum: newCurriculum }));

                                                                                    // Upload
                                                                                    const url = await handleFileUpload(file);

                                                                                    // Update URL and remove uploading state
                                                                                    const updatedCurriculum = [...formData.curriculum];
                                                                                    updatedCurriculum[mIdx].lectures[lIdx].uploading = false;
                                                                                    if (url) {
                                                                                        updatedCurriculum[mIdx].lectures[lIdx].videoUrl = url;
                                                                                    } else {
                                                                                        alert('Video upload failed');
                                                                                    }
                                                                                    setFormData(prev => ({ ...prev, curriculum: updatedCurriculum }));
                                                                                }}
                                                                            />
                                                                        </label>
                                                                    )}
                                                                </div>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Duration"
                                                                    className="w-20 bg-white/5 border border-white/10 rounded px-2 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-[#A3D861]"
                                                                    value={lecture.time || ''}
                                                                    onChange={(e) => {
                                                                        const newCurriculum = [...formData.curriculum];
                                                                        newCurriculum[mIdx].lectures[lIdx].time = e.target.value;
                                                                        setFormData(prev => ({ ...prev, curriculum: newCurriculum }));
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-gray-500 italic">No lectures in this module.</p>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newCurriculum = [...formData.curriculum];
                                                        newCurriculum[mIdx].lectures.push({
                                                            title: 'New Lecture',
                                                            time: '5m',
                                                            type: 'video',
                                                            free: false,
                                                            videoUrl: ''
                                                        });
                                                        setFormData(prev => ({ ...prev, curriculum: newCurriculum }));
                                                    }}
                                                    className="w-full py-2 border border-dashed border-white/10 rounded-lg text-gray-400 text-sm hover:text-white hover:border-white/20 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <Plus size={14} /> Add Lecture
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center p-6 border border-dashed border-white/10 rounded-xl text-gray-500">
                                        No curriculum data available. Click "Add Module" to start.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 rounded-xl bg-[#A3D861] text-black font-bold hover:bg-[#A3D861]/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : <><Save size={18} /> {courseToEdit ? 'Update Course' : 'Save Course'}</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCourseModal;
