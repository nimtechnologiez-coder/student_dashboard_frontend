'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Play,
    Lock,
    Unlock,
    CheckCircle,
    Clock,
    Star,
    Users,
    Calendar,
    Share2,
    Heart,
    ChevronDown,
    ChevronUp,
    FileText,
    Award,
    ShieldCheck,
    Globe,
    Check,
    BookOpen,
    Filter
} from 'lucide-react';

const CoursePage = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showFilters, setShowFilters] = useState(false); // Toggle Filter Panel
    const [sortBy, setSortBy] = useState('Most Popular'); // Sort State
    const [expandedModules, setExpandedModules] = useState({ 0: true }); // Open first module by default

    const toggleModule = (index) => {
        setExpandedModules(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const [allCourses, setAllCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [user, setUser] = useState(null);
    const [heroImage, setHeroImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(''); // Added for S3 Preview

    // Effect for Preview URL
    useEffect(() => {
        const fetchPreviewUrl = async () => {
            if (!selectedCourse?.videoLink) {
                setPreviewUrl('');
                return;
            }
            if (selectedCourse.videoLink.startsWith('http')) {
                setPreviewUrl(selectedCourse.videoLink);
                return;
            }
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`process.env.NEXT_PUBLIC_API_URL/api/s3/view-url?key=${selectedCourse.videoLink}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setPreviewUrl(data.url);
                }
            } catch (e) {
                console.error('Error fetching preview URL', e);
            }
        };
        fetchPreviewUrl();
    }, [selectedCourse]); // Depend on selectedCourse

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const [coursesRes, heroRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/hero-image')
                ]);

                if (coursesRes.ok) {
                    const data = await coursesRes.json();
                    setAllCourses(Array.isArray(data) ? data : []);
                }
                if (heroRes.ok) {
                    const heroData = await heroRes.json();
                    setHeroImage(heroData.url);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchUser = async () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser); // Set immediately for UI

                // Background update for latest data (e.g. enrollments)
                try {
                    const token = localStorage.getItem('token`);
                    const res = await fetch(`process.env.NEXT_PUBLIC_API_URL/api/users/${parsedUser.id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const userData = await res.json();
                        setUser(userData);
                        localStorage.setItem('user', JSON.stringify(userData)); // Update stored data
                    }
                } catch (e) {
                    console.error("Failed to refresh user data", e);
                }
            }
        };

        fetchCourses();
        fetchUser();
    }, []);

    const searchParams = useSearchParams();

    useEffect(() => {
        const courseId = searchParams.get('courseId');
        if (courseId && allCourses.length > 0) {
            const foundCourse = allCourses.find(c => c._id === courseId);
            if (foundCourse) {
                setSelectedCourse(foundCourse);
            }
        }
    }, [allCourses, searchParams]);

    const handleCourseSelect = (course) => {
        // Update URL to reflect selection
        router.push(`/courses?courseId=${course._id}`);
        setSelectedCourse(course);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBackToCatalog = () => {
        router.push('/courses'); // Clear search params
        setSelectedCourse(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const handleEnroll = async () => {
        if (!user) {
            router.push('/register');
            return;
        }
        if (!selectedCourse) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/enroll', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization`: `Bearer ${token}`
                },
                body: JSON.stringify({ userId: user._id, courseId: selectedCourse._id })
            });
            const data = await res.json();
            if (res.ok) {
                alert('Enrollment Successful!');
                // Refresh user data to update UI
                const userRes = await fetch(`process.env.NEXT_PUBLIC_API_URL/api/users/${user._id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (userRes.ok) {
                    const userData = await userRes.json();
                    setUser(userData);
                }
            } else {
                alert(data.message);
            }
        } catch (e) {
            console.error(e);
            alert('Enrollment failed');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#02040a] flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A3D861]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#02040a] flex items-center justify-center text-white">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-[#A3D861] text-black rounded hover:bg-[#A3D861]/90">Retry</button>
                </div>
            </div>
        );
    }

    // --- CATALOG VIEW ---
    if (!selectedCourse) {
        return (
            <div className="min-h-screen bg-[#02040a] text-white font-sans selection:bg-[#A3D861] selection:text-black pb-20">
                {/* Hero Section for Catalog */}
                <div className="relative bg-[#050a14] border-b border-white/5 overflow-hidden py-16 lg:py-24">
                    {/* Header/Nav Overlay */}
                    <div className="absolute top-0 left-0 w-full p-6 flex justify-between z-50">
                        {/* Added Logo/Home Link */}
                        <div className="flex items-center">
                            <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#A3D861] to-[#0395B2]">
                                Nim Academy
                            </Link>
                        </div>
                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/dashboard"
                                    className="px-4 py-2 bg-[#A3D861] text-black text-sm font-bold rounded-lg hover:bg-[#A3D861]/90 transition-colors"
                                >
                                    My Dashboard
                                </Link>
                                <div className="flex items-center gap-2">
                                    <span className="text-white text-sm font-medium">Hello, {user.fullName}</span>
                                    <button onClick={() => { localStorage.removeItem('user'); setUser(null); }} className="text-xs text-red-400 hover:text-red-300 ml-2">Logout</button>
                                </div>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="px-6 py-2 rounded-lg border border-white/10 text-white font-medium hover:bg-white/5 transition-colors text-sm"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {/* Background Image with Blur */}
                        <div className="absolute inset-0 bg-black/40 z-[1]"></div>
                        <img
                            src={heroImage || "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2070&auto=format&fit=crop"}
                            alt="Background"
                            className="w-full h-full object-cover blur-md opacity-60 scale-110 transition-all duration-700"
                        />
                        {/* Gradient Overlays for smooth transition */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#02040a] via-transparent to-[#02040a]/80 z-[1]"></div>
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-[1] mix-blend-overlay"></div>
                    </div>

                    <div className="relative max-w-7xl mx-auto px-4 lg:px-6 text-center z-10">
                        <h1 className="text-4xl lg:text-7xl font-extrabold tracking-tight text-white mb-4 lg:mb-6">
                            Unlock Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A3D861] to-[#0395B2]">Potential</span>
                        </h1>
                        <p className="text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto">
                            Explore our premium courses designed to take your skills to the next level.
                        </p>
                    </div>
                </div >

                {/* Course Categories */}
                <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10 lg:py-16 space-y-16">
                    {/* Control Bar */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all font-bold ${showFilters ? 'bg-[#A3D861] text-black border-[#A3D861]' : 'bg-[#050a14] text-white border-white/10 hover:border-white/20'}`}
                        >
                            <Filter size={20} />
                            Filter
                        </button>

                        <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-sm">Sort by</span>
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none bg-[#050a14] border border-white/10 text-white px-4 py-2 pr-10 rounded-lg focus:outline-none focus:border-[#A3D861] cursor-pointer"
                                >
                                    <option value="Most Popular">Most Popular</option>
                                    <option value="Newest">Newest</option>
                                    <option value="Price: Low to High">Price: Low to High</option>
                                    <option value="Price: High to Low">Price: High to Low</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                        </div>
                    </div>

                    {/* Filter Panel */}
                    {showFilters && (
                        <div className="mb-12 p-6 bg-[#0a0f1a] border border-white/10 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-300">
                            <h3 className="text-white font-bold mb-4">Categories</h3>
                            <div className="flex flex-wrap gap-3">
                                {['All', 'Full Stack Development', 'Data & Analysis', 'Design And Branding', 'Cloud And Digital', 'Other'].map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-4 py-2 rounded-lg border transition-all text-sm font-medium ${selectedCategory === cat
                                            ? 'bg-[#A3D861] text-black border-[#A3D861]'
                                            : 'bg-[#050a14] text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {(() => {
                        const COURSE_CATEGORIES = [
                            { title: "Full Stack Development", keywords: ["Python Full Stack", "Java Full Stack", "MERN Full Stack"] },
                            { title: "Data & Analysis", keywords: ["Data Analyst", "Business Analyst", "Digital Marketing"] },
                            { title: "Design And Branding", keywords: ["Data Science", "UI/UX Design Masterclass", "Product Design"] },
                            { title: "Cloud And Digital", keywords: ["AI & ML Engineer", "Cybersecurity Essentials", "AWS DevOps"] }
                        ];

                        const sections = [];
                        const usedCourseIds = new Set();
                        const publishedCourses = allCourses.filter(c => c.status === 'Published');

                        // Sort Function
                        const sortCourses = (a, b) => {
                            switch (sortBy) {
                                case 'Newest':
                                    return a._id < b._id ? 1 : -1; // Newest first (descending _id)
                                case 'Price: Low to High':
                                    return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
                                case 'Price: High to Low':
                                    return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
                                default: // Most Popular
                                    return (b.students || 0) - (a.students || 0);
                            }
                        };

                        // 1. Map Categories
                        COURSE_CATEGORIES.forEach(category => {
                            const courses = publishedCourses.filter(c => {
                                // Priority 1: Explicit Category check
                                if (c.category && c.category === category.title) {
                                    return true;
                                }
                                // Priority 2: Keyword Fallback
                                if ((!c.category || c.category === 'Other') && category.keywords) {
                                    return category.keywords.some(k => c.title.toLowerCase().includes(k.toLowerCase()));
                                }
                                return false;
                            });

                            if (courses.length > 0) {
                                courses.forEach(c => usedCourseIds.add(c._id));
                                // Remove duplicates & Sort
                                const uniqueCourses = Array.from(new Set(courses.map(c => c._id)))
                                    .map(id => courses.find(c => c._id === id));

                                uniqueCourses.sort(sortCourses);
                                sections.push({ title: category.title, courses: uniqueCourses });
                            }
                        });


                        // 2. Catch-all for others ("Other" category or uncategorized)
                        const otherCourses = publishedCourses.filter(c => !usedCourseIds.has(c._id) || (c.category === 'Other' && !usedCourseIds.has(c._id)));
                        if (otherCourses.length > 0) {
                            // Remove duplicates & Sort
                            const uniqueOther = Array.from(new Set(otherCourses.map(c => c._id))).map(id => otherCourses.find(c => c._id === id));
                            uniqueOther.sort(sortCourses);
                            if (uniqueOther.length > 0) sections.push({ title: "Other Popular Courses", courses: uniqueOther });
                        }

                        // FILTERING LOGIC
                        let displaySections = sections;
                        if (selectedCategory !== 'All') {
                            if (selectedCategory === 'Other') {
                                displaySections = sections.filter(s => s.title === 'Other Popular Courses');
                            } else {
                                displaySections = sections.filter(s => s.title === selectedCategory);
                            }
                        }

                        if (publishedCourses.length === 0) {
                            return (
                                <div className="col-span-full flex flex-col items-center justify-center text-center py-20">
                                    <div className="bg-white/5 p-6 rounded-full mb-4">
                                        <BookOpen size={48} className="text-gray-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">No Courses Available Yet</h3>
                                    <p className="text-gray-400 max-w-md">
                                        Check back soon! New courses are being prepared for you.
                                    </p>
                                </div>
                            );
                        }

                        if (displaySections.length === 0) {
                            return (
                                <div className="col-span-full flex flex-col items-center justify-center text-center py-20">
                                    <div className="bg-white/5 p-6 rounded-full mb-4">
                                        <BookOpen size={48} className="text-gray-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">No Courses Found</h3>
                                    <p className="text-gray-400 max-w-md">
                                        No courses found in this category.
                                    </p>
                                </div>
                            );
                        }

                        return displaySections.map((section, idx) => (
                            <div key={idx}>
                                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-8 border-l-4 border-[#A3D861] pl-4">
                                    {section.title}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                                    {section.courses.map(course => (
                                        <CourseCard
                                            key={course._id}
                                            course={course}
                                            user={user}
                                            router={router}
                                        />
                                    ))}
                                </div>
                            </div>
                        ));
                    })()}
                </div>
            </div >
        );
    }


    // --- DETAILS VIEW ---
    const courseData = selectedCourse;

    return (
        <div className="min-h-screen bg-[#02040a] text-white font-sans selection:bg-[#A3D861] selection:text-black pb-20">

            {/* --- HERO SECTION --- */}
            <div className="relative bg-[#050a14] border-b border-white/5 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute -top-20 -right-20 w-64 h-64 lg:w-96 lg:h-96 bg-[#0395B2] opacity-10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] bg-[#A3D861] opacity-5 rounded-full blur-3xl"></div>
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 lg:px-6 py-10 lg:py-20 flex flex-col lg:flex-row gap-8 lg:gap-12">

                    {/* Left Content */}
                    <div className="flex-1 space-y-4 lg:space-y-6 z-10 text-center lg:text-left">
                        {/* Breadcrumbs */}
                        <div className="text-sm text-gray-400 flex items-center justify-center lg:justify-start gap-2 mb-2 lg:mb-4 overflow-x-auto whitespace-nowrap">
                            <Link href="/" className="hover:text-white cursor-pointer transition-colors">Home</Link>
                            <span className="text-gray-600">/</span>
                            <Link href="/courses" className="hover:text-white cursor-pointer transition-colors" onClick={handleBackToCatalog}>Courses</Link>
                            <span className="text-gray-600">/</span>
                            <span className="text-[#A3D861] truncate max-w-[150px] lg:max-w-[200px]">{courseData.title}</span>
                        </div>

                        <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
                            {courseData.title}
                        </h1>

                        <p className="text-lg lg:text-xl text-gray-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                            {courseData.subtitle}
                        </p>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 lg:gap-4 text-sm font-medium">
                            <div className="flex items-center gap-1 bg-[#A3D861]/10 px-3 py-1 rounded-full text-[#A3D861] border border-[#A3D861]/20">
                                <span className="bg-[#A3D861] text-black text-xs px-1.5 rounded font-bold mr-1">BESTSELLER</span>
                                <span>{courseData.rating} Rating</span>
                            </div>
                            <div className="flex items-center gap-1 text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill="currentColor" className={i >= Math.floor(courseData.rating) ? "opacity-50" : ""} />
                                ))}
                                <span className="text-gray-400 ml-1">({courseData.reviews} ratings)</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                                <Users size={16} />
                                <span>{courseData.students?.toLocaleString()} students</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 lg:gap-6 text-sm text-gray-400 pt-2">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500">Created by</span>
                                <a href="#" className="text-[#0395B2] hover:underline font-semibold">{courseData.instructor}</a>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                <span>Last updated {courseData.lastUpdated}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe size={16} />
                                <span>{courseData.language}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Placeholder (Desktop only - creates space for the floating card) */}
                    <div className="hidden lg:block w-[380px] shrink-0"></div>
                </div>
            </div>


            {/* --- CONTENT WRAPPER --- */}
            <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8 relative">

                <div className="flex flex-col-reverse lg:grid lg:grid-cols-3 gap-10">

                    {/* === LEFT COLUMN (MAIN CONTENT) === */}
                    <div className="lg:col-span-2 space-y-8 lg:space-y-10">

                        {/* What you'll learn (Box) */}
                        <div className="border border-white/10 rounded-2xl p-5 lg:p-6 bg-white/5">
                            <h2 className="text-xl lg:text-2xl font-bold text-white mb-4 lg:mb-6">What you'll learn</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                                {courseData.whatYouWillLearn?.map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <CheckCircle size={20} className="text-[#A3D861] shrink-0 mt-0.5" />
                                        <span className="text-gray-300 text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Course Content (Accordion) */}
                        <div>
                            <h2 className="text-xl lg:text-2xl font-bold text-white mb-4">Course Content</h2>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-400 mb-4 gap-2">
                                <span>{courseData.curriculum.length} sections â€¢ {courseData.lecturesCount} lectures â€¢ {courseData.duration} total length</span>
                                <button className="text-[#0395B2] font-semibold hover:text-[#A3D861] transition-colors text-left sm:text-right">Expand all sections</button>
                            </div>

                            <div className="border border-white/10 rounded-xl overflow-hidden divide-y divide-white/10">
                                {courseData.curriculum.length > 0 ? (
                                    courseData.curriculum.map((module, index) => (
                                        <div key={index} className="bg-[#0a0f1a]">
                                            {/* Accordion Header */}
                                            <button
                                                onClick={() => toggleModule(index)}
                                                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left"
                                            >
                                                <div className="flex items-center gap-4">
                                                    {expandedModules[index] ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                                    <span className="font-semibold text-white/90 text-sm lg:text-base">{module.title}</span>
                                                </div>
                                                <div className="text-sm text-gray-500 hidden sm:block">
                                                    {module.lectures.length} lectures â€¢ {module.duration}
                                                </div>
                                            </button>

                                            {/* Accordion Body */}
                                            {expandedModules[index] && (
                                                <div className="bg-black/20 divide-y divide-white/5">
                                                    {module.lectures.map((lecture, lIdx) => {
                                                        // Check enrollment using new schema (Array of Objects)
                                                        const enrollment = user && user.enrolledCourses ? user.enrolledCourses.find(e => e.course && (e.course._id === courseData._id || e.course === courseData._id)) : null;
                                                        const isEnrolled = !!enrollment;

                                                        // Check if lecture is completed
                                                        // lecture IDs are not unique in current schema (no _id). Using title for now or index if consistent. 
                                                        // ideally should assume titles are unique within course or add IDs.
                                                        // Let's use title for matching as per server.js assumption
                                                        const isCompleted = enrollment && enrollment.completedLectures && enrollment.completedLectures.includes(lecture.title);

                                                        // STRICT ACCESS CONTROL: Only enrolled users can access
                                                        // "there is no free courses" - User Request
                                                        const isUnlocked = isEnrolled;

                                                        const handleLectureClick = () => {
                                                            if (isUnlocked) {
                                                                if (lecture.videoUrl) {
                                                                    window.open(lecture.videoUrl, '_black');
                                                                } else {
                                                                    alert('No video available for this lecture yet.');
                                                                }
                                                            } else {
                                                                alert('This content is locked. Please Enroll to access.');
                                                            }
                                                        };

                                                        const toggleComplete = async (e) => {
                                                            e.stopPropagation(); // Prevent opening video
                                                            if (!isEnrolled) return;

                                                            try {
                                                                const token = localStorage.getItem('token');
                                                                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/progress', {
                                                                    method: 'POST',
                                                                    headers: {
                                                                        'Content-Type': 'application/json',
                                                                        'Authorization`: `Bearer ${token}`
                                                                    },
                                                                    body: JSON.stringify({
                                                                        userId: user._id,
                                                                        courseId: courseData._id,
                                                                        lectureId: lecture.title
                                                                    })
                                                                });

                                                                if (res.ok) {
                                                                    // Update local state - trigger re-fetch or manual update
                                                                    // Simple re-fetch user to get updated progress
                                                                    const updatedUserRes = await fetch(`process.env.NEXT_PUBLIC_API_URL/api/users/${user._id}`, {
                                                                        headers: { 'Authorization': `Bearer ${token}` }
                                                                    });
                                                                    const updatedUser = await updatedUserRes.json();
                                                                    setUser(updatedUser);
                                                                    localStorage.setItem('user', JSON.stringify(updatedUser)); // Keep synced
                                                                }
                                                            } catch (err) {
                                                                console.error("Error updating progress", err);
                                                            }
                                                        };

                                                        return (
                                                            <div
                                                                key={lIdx}
                                                                onClick={handleLectureClick}
                                                                className={`flex items-center justify-between p-3 lg:p-4 pl-10 lg:pl-12 hover:bg-white/5 transition-colors group cursor-pointer ${!isUnlocked ? 'opacity-70' : ''}`}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`bg-white/10 p-1.5 rounded-full ${isUnlocked ? 'text-[#A3D861]' : 'text-gray-500'} transition-colors`}>
                                                                        {isUnlocked ? <Play size={14} fill="currentColor" /> : <Lock size={14} />}
                                                                    </div>
                                                                    <div>
                                                                        <span className={`text-sm transition-colors block ${isUnlocked ? 'text-gray-300 group-hover:text-white' : 'text-gray-500'} ${isCompleted ? 'line-through opacity-70' : ''}`}>{lecture.title}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                                    {/* Completion Checkbox for Enrolled Users */}
                                                                    {isEnrolled && (
                                                                        <button
                                                                            onClick={toggleComplete}
                                                                            className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${isCompleted ? 'bg-[#A3D861] border-[#A3D861] text-black' : 'border-gray-500 hover:border-[#A3D861]'}`}
                                                                            title={isCompleted ? "Mark as incomplete" : "Mark as complete"}
                                                                        >
                                                                            {isCompleted && <Check size={12} strokeWidth={4} />}
                                                                        </button>
                                                                    )}

                                                                    {isUnlocked ?
                                                                        <span className="text-[#A3D861]">Unlocked</span> :
                                                                        <div className="flex items-center gap-1"><Lock size={14} /> <span>Locked</span></div>
                                                                    }
                                                                    <span className="hidden sm:inline">{lecture.time}</span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-gray-500">No content available yet.</div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h2 className="text-xl lg:text-2xl font-bold text-white mb-4">Description</h2>
                            <div
                                className="prose prose-invert prose-p:text-gray-300 prose-headings:text-white prose-li:text-gray-300 max-w-none text-sm lg:text-base"
                                dangerouslySetInnerHTML={{ __html: courseData.description }}
                            />
                        </div>

                        {/* Instructor */}
                        <div>
                            <h2 className="text-xl lg:text-2xl font-bold text-white mb-6">Instructor</h2>
                            <div className="flex flex-col sm:flex-row gap-6 items-start">
                                <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-[#0395B2] to-[#A3D861] p-[2px] shrink-0">
                                    <img
                                        src={courseData.instructorImage || "https://i.pravatar.cc/150?u=instructor"}
                                        alt="Instructor"
                                        className="rounded-full w-full h-full object-cover border-2 border-[#02040a]"
                                    />
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <h3 className="text-lg lg:text-xl font-bold text-[#A3D861] underline underline-offset-4 decoration-[#A3D861]/30">{courseData.instructor}</h3>
                                        <p className="text-gray-400 text-sm mt-1">
                                            {courseData.instructorId?.expertise || 'Senior Instructor & Subject Matter Expert'}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4 lg:gap-6 text-sm text-white font-medium flex-wrap">
                                        <div className="flex items-center gap-2"><Star size={16} /> <span>{courseData.rating} Rating</span></div>
                                        <div className="flex items-center gap-2"><Award size={16} /> <span>250k+ Reviews</span></div>
                                        <div className="flex items-center gap-2"><Users size={16} /> <span>1.2m Students</span></div>
                                    </div>

                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        {courseData.instructorId?.bio || `Join ${courseData.instructor} in this comprehensive course designed to master the subject. With years of industry experience, they provide deep insights and practical knowledge.`}
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* === RIGHT COLUMN (STICKY SIDEBAR) === */}
                    <div className="relative lg:col-span-1">
                        {/*
                            On Desktop: Sticky and overlaps hero (-mt-96)
                            On Mobile: Normal positioning, no overlap (mt-0)
                        */}
                        <div className="lg:sticky lg:top-8 mt-0 lg:-mt-96 pt-0 lg:pt-0 z-20">

                            {/* Floating Course Card */}
                            <div className="bg-[#0a0f1a] border border-white/10 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden backdrop-blur-md">

                                {/* Preview Video Logic */}
                                {previewUrl ? (
                                    <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="block relative aspect-video group cursor-pointer overflow-hidden">
                                        <img
                                            src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                            alt="Course Preview"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center pl-1 shadow-[0_0_30px_rgba(255,255,255,0.3)] group-hover:scale-110 transition-transform">
                                                <Play size={32} fill="black" className="text-black" />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-4 left-0 w-full text-center">
                                            <span className="text-white font-bold text-sm drop-shadow-md">Watch Preview</span>
                                        </div>
                                    </a>
                                ) : (
                                    <div className="relative aspect-video group cursor-pointer overflow-hidden">
                                        <img
                                            src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                            alt="Course Preview"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center pl-1 shadow-[0_0_30px_rgba(255,255,255,0.3)] group-hover:scale-110 transition-transform">
                                                <Play size={32} fill="black" className="text-black" />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-4 left-0 w-full text-center">
                                            <span className="text-white font-bold text-sm drop-shadow-md">Preview this course</span>
                                        </div>
                                    </div>
                                )}

                                <div className="p-5 lg:p-6 space-y-5 lg:space-y-6">
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-3xl font-black text-white">â‚¹{courseData.price.toString().replace('$', '')}</span>
                                        <span className="text-lg text-gray-500 line-through">â‚¹{courseData.originalPrice.toString().replace('$', '')}</span>
                                        <span className="text-sm font-bold text-[#A3D861]">50% OFF</span>
                                    </div>

                                    <div className="space-y-3">
                                        {/* Enroll / Already Enrolled Logic - ALWAYS VISIBLE */}
                                        {user && user.enrolledCourses && user.enrolledCourses.some(e => e.course && (e.course === courseData._id || e.course._id === courseData._id)) ? (
                                            <div className="w-full space-y-2">
                                                <button
                                                    onClick={() => router.push(`/classroom?courseId=${courseData._id}`)}
                                                    className="w-full bg-[#A3D861] hover:bg-[#A3D861]/90 text-black font-black text-lg py-3 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(163,216,97,0.39)] hover:shadow-[0_6px_20px_rgba(163,216,97,0.23)] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                                                >
                                                    Go to Classroom <Play size={20} fill="currentColor" />
                                                </button>
                                                {/* Progress Bar Display */}
                                                {(() => {
                                                    const enrollment = user.enrolledCourses.find(e => e.course && (e.course === courseData._id || e.course._id === courseData._id));
                                                    const progress = enrollment ? enrollment.progress || 0 : 0;
                                                    return (
                                                        <div className="bg-white/10 rounded-full h-2.5 overflow-hidden">
                                                            <div className="bg-[#A3D861] h-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                                                        </div>
                                                    );
                                                })()}
                                                <p className="text-center text-xs text-gray-400">
                                                    {(() => {
                                                        const enrollment = user.enrolledCourses.find(e => e.course && (e.course === courseData._id || e.course._id === courseData._id));
                                                        return enrollment ? `${enrollment.progress || 0}% Complete` : '';
                                                    })()}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="w-full space-y-3">
                                                <button
                                                    onClick={() => {
                                                        if (!user) {
                                                            router.push('/register');
                                                            return;
                                                        }
                                                        router.push(`/payment?courseId=${courseData._id}`);
                                                    }}
                                                    className="w-full bg-[#A3D861] hover:bg-[#A3D861]/90 text-black font-black text-lg py-3 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(163,216,97,0.39)] hover:shadow-[0_6px_20px_rgba(163,216,97,0.23)] active:scale-[0.98] cursor-pointer"
                                                >
                                                    Enroll Now
                                                </button>
                                            </div>
                                        )}
                                        <div className="grid grid-cols-2 gap-3">
                                            <button className="flex items-center justify-center gap-2 border border-white/10 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium">
                                                <Heart size={18} /> Wishlist
                                            </button>
                                            <button className="flex items-center justify-center gap-2 border border-white/10 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium">
                                                <Share2 size={18} /> Share
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-center text-xs text-gray-500">30-Day Money-Back Guarantee</p>

                                    <div className="space-y-3 text-sm text-gray-300">
                                        <h4 className="font-bold text-white">This course includes:</h4>
                                        <div className="flex items-center gap-3"><Clock size={16} className="text-[#0395B2]" /> {courseData.duration} on-demand video</div>
                                        <div className="flex items-center gap-3"><FileText size={16} className="text-[#0395B2]" /> 12 Articles & 5 Resources</div>
                                        <div className="flex items-center gap-3"><ShieldCheck size={16} className="text-[#0395B2]" /> Full lifetime access</div>
                                        <div className="flex items-center gap-3"><Clock size={16} className="text-[#0395B2]" /> Access on mobile and TV</div>
                                        <div className="flex items-center gap-3"><Award size={16} className="text-[#0395B2]" /> Certificate of completion</div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* --- OTHER COURSES SECTION (Link back to catalog for UX) --- */}
            <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10 lg:py-16 border-t border-white/10 text-center">
                <button onClick={handleBackToCatalog} className="text-[#A3D861] hover:text-white font-bold text-lg transition-colors border-b border-[#A3D861] pb-1 hover:border-white">
                    View All Courses
                </button>
            </div>

        </div>
    );
};


function CourseCard({ course, user, router }) {
    return (
        <div
            onClick={() => router.push(`/courses?courseId=${course._id}`)}
            className="bg-[#0a0f1a] border border-white/10 rounded-2xl overflow-hidden hover:border-[#A3D861]/50 transition-all cursor-pointer group flex flex-col h-full hover:-translate-y-2 shadow-lg hover:shadow-[#A3D861]/10"
        >
            <div className="relative aspect-video overflow-hidden bg-gray-800">
                {course.thumbnail ? (
                    <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0395B2]/20 to-[#A3D861]/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                        <Play size={40} className="text-white/20" />
                    </div>
                )}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10">
                    {course.level}
                </div>
            </div>
            <div className="p-5 lg:p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-[#A3D861] transition-colors">{course.title}</h3>
                <p className="text-gray-400 text-xs mb-4">{course.instructor}</p>

                <div className="flex items-center gap-1.5 mb-4">
                    <span className="font-bold text-[#e59819] text-sm">{course.rating}</span>
                    <div className="flex text-[#e59819]">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill="currentColor" className={i >= Math.floor(course.rating) ? "opacity-40" : ""} />
                        ))}
                    </div>
                    <span className="text-gray-500 text-xs">({course.reviews})</span>
                </div>

                <div className="mt-auto">
                    {/* Validity Display */}
                    {(() => {
                        const enrollment = user && user.enrolledCourses ? user.enrolledCourses.find(e => e.course === course._id || (e.course && e.course._id === course._id)) : null;

                        if (enrollment) {
                            // Enrolled: Show Remaining Days
                            let expiry = enrollment.expiryDate ? new Date(enrollment.expiryDate) : null;
                            if (!expiry && course.validity && enrollment.enrolledAt) {
                                expiry = new Date(new Date(enrollment.enrolledAt).getTime() + course.validity * 24 * 60 * 60 * 1000);
                            }

                            if (expiry) {
                                const now = new Date();
                                const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
                                return (
                                    <div className="mb-3 text-xs font-bold">
                                        {diffDays < 0 ? (
                                            <span className="text-red-500 bg-red-500/10 px-2 py-1 rounded">Expired</span>
                                        ) : (
                                            <span className={`${diffDays < 30 ? "text-yellow-500 bg-yellow-500/10" : "text-[#A3D861] bg-[#A3D861]/10"} px-2 py-1 rounded`}>
                                                {diffDays} Days Remaining
                                            </span>
                                        )}
                                    </div>
                                );
                            }
                        } else {
                            // Not Enrolled: Show Total Validity
                            return (
                                <div className="mb-3 text-xs font-medium text-gray-400 flex items-center gap-2">
                                    <div className="bg-white/5 px-2 py-1 rounded flex items-center gap-1.5">
                                        <Clock size={12} className="text-[#0395B2]" />
                                        <span>{course.validity || 365} Days Validity</span>
                                    </div>
                                </div>
                            );
                        }
                    })()}
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                        <span className="font-bold text-white text-lg">â‚¹{course.price.toString().replace('$', '')}</span>
                        <span className="text-gray-500 text-xs line-through">â‚¹{course.originalPrice.toString().replace('$', '')}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {course.videoLink && (
                            <a
                                href={course.videoLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#0395B2] hover:text-white transition-colors"
                                onClick={(e) => e.stopPropagation()} // Prevent card click
                                title="Watch Video"
                            >
                                <Play size={20} fill="currentColor" />
                            </a>
                        )}
                        <button onClick={(e) => { e.stopPropagation(); router.push(`/courses?courseId=${course._id}`); }} className="text-[#A3D861] text-sm font-bold group-hover:underline">View Details</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CoursePage;




