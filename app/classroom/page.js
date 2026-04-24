'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Play, CheckCircle, Lock, ChevronDown, ChevronUp, ArrowLeft, Menu, X, HelpCircle, Trophy } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import ReactPlayer to avoid SSR issues
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

const ClassroomContent = () => {
    const searchParams = useSearchParams();
    const courseId = searchParams.get('courseId');
    const router = useRouter();

    const [course, setCourse] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeModuleIndex, setActiveModuleIndex] = useState(0);
    const [activeLectureIndex, setActiveLectureIndex] = useState(0);
    const [completedLectures, setCompletedLectures] = useState([]);
    const [isTeamMember, setIsTeamMember] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // For mobile/desktop toggle
    const [videoUrlToPlay, setVideoUrlToPlay] = useState('');

    // Quiz State
    const [isQuizActive, setIsQuizActive] = useState(false);
    const [quizModuleIndex, setQuizModuleIndex] = useState(-1);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [quizAnswers, setQuizAnswers] = useState({});
    const [quizResults, setQuizResults] = useState(null);

    const isModuleFinished = (module) => {
        if (!module || !module.lectures) return false;
        return module.lectures.every(lecture => completedLectures.includes(lecture.title));
    };

    const resetQuiz = () => {
        setCurrentQuestionIndex(0);
        setQuizAnswers({});
        setQuizResults(null);
    };

    useEffect(() => {
        const currentModule = course?.curriculum?.[activeModuleIndex];
        const currentLecture = currentModule?.lectures?.[activeLectureIndex];

        const fetchVideoUrl = async () => {
            if (!currentLecture || !currentLecture.videoUrl) {
                setVideoUrlToPlay('');
                return;
            }

            // Check if it's already a full URL (YouTube or Legacy)
            if (currentLecture.videoUrl.startsWith('http')) {
                setVideoUrlToPlay(currentLecture.videoUrl);
                return;
            }

            // It's an S3 Key, fetch signed URL
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/s3/view-url?key=${currentLecture.videoUrl}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setVideoUrlToPlay(data.url);
                } else {
                    console.error('Failed to get video URL');
                }
            } catch (error) {
                console.error('Error fetching signed URL:', error);
            }
        };

        if (course) {
            fetchVideoUrl();
        }
    }, [course, activeModuleIndex, activeLectureIndex]); // Changed dependency to primitives


    // Fetch User and Course Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Get User
                const storedUser = localStorage.getItem('user');
                if (!storedUser) {
                    router.push('/login');
                    return;
                }
                const parsedUser = JSON.parse(storedUser);
                const token = localStorage.getItem('token');

                // Fetch fresh user data to get enrollment status
                const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${parsedUser.id || parsedUser._id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                let userData = parsedUser;
                if (userRes.ok) {
                    userData = await userRes.json();
                    setUser(userData);
                    setIsTeamMember(userData.enrolledCourses?.some(e => e.planType === 'Team') || false);
                }

                // 2. Check Enrollment
                const isTeam = userData.enrolledCourses?.some(e => e.planType === 'Team');
                const enrollment = userData.enrolledCourses?.find(e => {
                    const eId = e.course?._id || e.course?.id || e.course;
                    return eId === courseId;
                });

                if (!enrollment && !isTeam) {
                    alert('You are not enrolled in this course.');
                    router.push(`/courses?courseId=${courseId}`);
                    return;
                }

                setCompletedLectures(enrollment?.completedLectures || []);

                // 3. Get Course Details
                const courseRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}`);
                if (courseRes.ok) {
                    const courseData = await courseRes.json();
                    setCourse(courseData);
                } else {
                    alert('Course not found');
                    router.push('/courses');
                }
            } catch (error) {
                console.error("Error loading classroom:", error);
            } finally {
                setLoading(false);
            }
        };

        if (courseId) {
            fetchData();
        }
    }, [courseId, router]);

    const handleMarkComplete = async () => {
        if (!user || !course) return;

        const currentModule = course.curriculum[activeModuleIndex];
        const currentLecture = currentModule.lectures[activeLectureIndex];
        const lectureId = currentLecture.title; // Using title as ID for now, ideally strictly separate ID

        if (completedLectures.includes(lectureId)) return; // Already completed

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/progress`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId: user.id || user._id,
                    courseId: course.id || course._id,
                    lectureId: lectureId
                })
            });

            if (res.ok) {
                const data = await res.json();
                setCompletedLectures(data.completedLectures);

                // Auto-advance logic could go here
                // For now just celebrate
            }
        } catch (error) {
            console.error("Error marking complete:", error);
            // If it failed because of enrollment, try auto-enrolling for team member
            if (isTeamMember) {
                 try {
                     const token = localStorage.getItem('token');
                     await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/enroll`, {
                         method: 'POST',
                         headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                         body: JSON.stringify({ userId: user.id || user._id, courseId: course.id || course._id, planType: 'Team' })
                     });
                     // Retry progress update once
                     await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/progress`, {
                         method: 'POST',
                         headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                         body: JSON.stringify({ userId: user.id || user._id, courseId: course.id || course._id, lectureId: lectureId })
                     });
                 } catch (e) { console.error("Auto-enroll failed", e); }
            }
        }
    };

    const isLectureCompleted = (lectureTitle) => {
        return completedLectures.includes(lectureTitle);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#02040a] flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A3D861]"></div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-[#02040a] flex items-center justify-center text-white">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-500 mb-2">Course Not Found</h2>
                    <p className="text-gray-400 mb-4">Unable to load course details. Please try again.</p>
                    <button
                        onClick={() => router.push('/courses')}
                        className="px-6 py-2 bg-[#A3D861] text-black font-semibold rounded-lg hover:bg-[#A3D861]/90 transition-colors"
                    >
                        Back to Courses
                    </button>
                </div>
            </div>
        );
    }

    const currentModule = course.curriculum[activeModuleIndex];
    const currentLecture = currentModule?.lectures[activeLectureIndex];



    return (
        <div className="min-h-screen bg-[#02040a] text-gray-100 font-sans flex flex-col h-screen overflow-hidden">

            {/* --- Header --- */}
            <header className="h-16 border-b border-white/10 bg-[#050a14] flex items-center justify-between px-4 z-20 shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors"
                        title="Back to Dashboard"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-lg font-bold truncate max-w-[200px] md:max-w-md hidden md:block">
                        {course.title}
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    {/* Progress Bar in Header */}
                    <div className="hidden md:flex flex-col w-32 md:w-48 gap-1">
                        <div className="flex justify-between text-[10px] text-gray-400">
                            <span>Progress</span>
                            <span>{Math.round((completedLectures.length / (course.curriculum.reduce((acc, mod) => acc + mod.lectures.length, 0) || 1)) * 100)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#A3D861] transition-all duration-500"
                                style={{ width: `${Math.round((completedLectures.length / (course.curriculum.reduce((acc, mod) => acc + mod.lectures.length, 0) || 1)) * 100)}%` }}
                            ></div>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-white/5 rounded-lg md:hidden"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">

                {/* --- Main Content Area (Video) --- */}
                <main className="flex-1 flex flex-col overflow-y-auto bg-[#02040a] relative">
                    {isQuizActive ? (
                        <div className="flex-1 flex flex-col p-6 items-center">
                            <div className="max-w-3xl w-full bg-[#0a0f1a] border border-white/10 rounded-2xl overflow-hidden flex flex-col h-full max-h-[600px]">
                                {/* Quiz Header */}
                                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Module {quizModuleIndex + 1} Quiz</h2>
                                        <p className="text-sm text-gray-400">{course.curriculum[quizModuleIndex].title}</p>
                                    </div>
                                    <button
                                        onClick={() => setIsQuizActive(false)}
                                        className="text-gray-500 hover:text-white transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                {/* Quiz Body */}
                                <div className="flex-1 overflow-y-auto p-8">
                                    {quizResults ? (
                                        <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                                            <div className="w-20 h-20 bg-[#A3D861]/20 rounded-full flex items-center justify-center text-[#A3D861]">
                                                <Trophy size={40} />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-white">Quiz Completed!</h3>
                                                <p className="text-gray-400 mt-2">You scored {quizResults.score} out of {quizResults.total}</p>
                                            </div>
                                            <div className="text-5xl font-black text-[#A3D861]">{quizResults.percentage}%</div>
                                            <div className="flex gap-4 w-full max-w-sm pt-4">
                                                <button
                                                    onClick={resetQuiz}
                                                    className="flex-1 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-bold hover:bg-white/10 transition-all"
                                                >
                                                    Retake Quiz
                                                </button>
                                                <button
                                                    onClick={() => setIsQuizActive(false)}
                                                    className="flex-1 py-3 bg-[#A3D861] text-black rounded-xl font-bold hover:bg-[#A3D861]/90 transition-all"
                                                >
                                                    Back to Class
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-8">
                                            {/* Progress Indicator */}
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Question {currentQuestionIndex + 1} of {course.curriculum[quizModuleIndex].quiz.length}</span>
                                                <div className="flex-1 h-1.5 bg-white/10 rounded-full mx-4 overflow-hidden">
                                                    <div
                                                        className="h-full bg-[#A3D861] transition-all duration-300"
                                                        style={{ width: `${((currentQuestionIndex + 1) / course.curriculum[quizModuleIndex].quiz.length) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            {/* Question */}
                                            <h3 className="text-xl font-bold text-white leading-relaxed">
                                                {course.curriculum[quizModuleIndex].quiz[currentQuestionIndex].question}
                                            </h3>

                                            {/* Options */}
                                            <div className="grid grid-cols-1 gap-3">
                                                {course.curriculum[quizModuleIndex].quiz[currentQuestionIndex].options.map((option, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setQuizAnswers({ ...quizAnswers, [currentQuestionIndex]: idx })}
                                                        className={`p-4 rounded-xl text-left font-medium transition-all border-2 ${quizAnswers[currentQuestionIndex] === idx
                                                            ? 'bg-[#A3D861]/10 border-[#A3D861] text-[#A3D861]'
                                                            : 'bg-white/5 border-transparent hover:bg-white/10 text-gray-300'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs ${quizAnswers[currentQuestionIndex] === idx ? 'border-[#A3D861] bg-[#A3D861] text-black' : 'border-gray-600'
                                                                }`}>
                                                                {String.fromCharCode(65 + idx)}
                                                            </div>
                                                            {option}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Quiz Footer */}
                                {!quizResults && (
                                    <div className="p-6 border-t border-white/10 flex justify-between items-center bg-white/5">
                                        <button
                                            onClick={() => setCurrentQuestionIndex(curr => curr - 1)}
                                            disabled={currentQuestionIndex === 0}
                                            className="px-6 py-2 text-gray-400 hover:text-white disabled:opacity-0 transition-colors"
                                        >
                                            Previous
                                        </button>

                                        {currentQuestionIndex === course.curriculum[quizModuleIndex].quiz.length - 1 ? (
                                            <button
                                                onClick={async () => {
                                                    const quiz = course.curriculum[quizModuleIndex].quiz;
                                                    let score = 0;
                                                    quiz.forEach((q, idx) => {
                                                        if (quizAnswers[idx] === q.correctAnswer) score++;
                                                    });

                                                    setQuizResults({
                                                        score,
                                                        total: quiz.length,
                                                        percentage: Math.round((score / quiz.length) * 100)
                                                    });

                                                    // Log Gamification Activity
                                                    try {
                                                        const token = localStorage.getItem('token');
                                                        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gamification/log-activity`, {
                                                            method: 'POST',
                                                            headers: {
                                                                  'Content-Type': 'application/json',
                                                                  'Authorization': `Bearer ${token}`
                                                            },
                                                            body: JSON.stringify({
                                                                email: user.email,
                                                                type: 'quiz_complete',
                                                                metadata: {
                                                                    courseId: course.id || course._id,
                                                                    quizModuleIndex,
                                                                    quizScore: score
                                                                }
                                                            })
                                                        });
                                                    } catch (err) {
                                                        console.error("Failed to log gamification activity:", err);
                                                    }
                                                }}
                                                disabled={quizAnswers[currentQuestionIndex] === undefined}
                                                className="px-8 py-3 bg-[#A3D861] text-black font-bold rounded-xl hover:bg-[#A3D861]/90 disabled:opacity-50 transition-all"
                                            >
                                                Submit Quiz
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => setCurrentQuestionIndex(curr => curr + 1)}
                                                disabled={quizAnswers[currentQuestionIndex] === undefined}
                                                className="px-8 py-3 bg-[#A3D861] text-black font-bold rounded-xl hover:bg-[#A3D861]/90 disabled:opacity-50 transition-all"
                                            >
                                                Next Question
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : currentLecture ? (
                        <>
                            {/* Video Player Container */}
                            <div className="w-full aspect-video bg-black relative shadow-2xl">
                                {videoUrlToPlay ? (
                                    videoUrlToPlay.includes('youtube') || videoUrlToPlay.includes('youtu.be') ? (
                                        <ReactPlayer
                                            key={videoUrlToPlay}
                                            url={videoUrlToPlay}
                                            width="100%"
                                            height="100%"
                                            controls={true}
                                            playing={false}
                                            onEnded={handleMarkComplete}
                                            className="absolute top-0 left-0"
                                        />
                                    ) : (
                                        <video
                                            key={videoUrlToPlay}
                                            src={videoUrlToPlay}
                                            className="w-full h-full object-contain"
                                            controls
                                            onEnded={handleMarkComplete}
                                            autoPlay={false} // Ensure it doesn't auto-play if confusing
                                        >
                                            Your browser does not support the video tag.
                                        </video>
                                    )
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                                        <div className="text-center">
                                            <Play size={48} className="mx-auto mb-4 opacity-50" />
                                            <p>Loading Video...</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Lecture Info & Actions */}
                            <div className="p-6 max-w-5xl mx-auto w-full">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-2">{currentLecture.title}</h2>
                                        <p className="text-gray-400">Module {activeModuleIndex + 1}: {currentModule.title}</p>
                                    </div>

                                    <button
                                        onClick={handleMarkComplete}
                                        disabled={isLectureCompleted(currentLecture.title)}
                                        className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${isLectureCompleted(currentLecture.title)
                                            ? 'bg-green-500/20 text-green-500 cursor-default'
                                            : 'bg-[#A3D861] text-black hover:bg-[#A3D861]/90'
                                            }`}
                                    >
                                        {isLectureCompleted(currentLecture.title) ? (
                                            <>Completed <CheckCircle size={20} /></>
                                        ) : (
                                            <>Mark as Complete <CheckCircle size={20} /></>
                                        )}
                                    </button>
                                </div>

                                <div className="mt-8 space-y-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-4">About this class</h3>
                                        <p className="text-gray-400 leading-relaxed">
                                            {currentLecture.description || "No description available for this lecture."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            Select a lecture from the sidebar
                        </div>
                    )}
                </main>

                {/* --- Sidebar (Curriculum) --- */}
                <aside
                    className={`${isSidebarOpen ? 'w-full md:w-96 translate-x-0' : 'w-0 translate-x-full md:translate-x-0 md:w-0'} 
                    fixed md:relative top-[64px] md:top-0 right-0 bottom-0 bg-[#0a0f1a] border-l border-white/10 
                    transition-all duration-300 z-10 flex flex-col shrink-0`}
                >
                    <div className="p-4 border-b border-white/10 font-bold text-white flex justify-between items-center">
                        <span>Course Content</span>
                        <span className="text-xs text-gray-500 font-normal">
                            {completedLectures.length} / {course.curriculum.reduce((acc, mod) => acc + mod.lectures.length, 0)} Completed
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto overflow-x-hidden">
                        {course.curriculum.map((module, mIndex) => (
                            <div key={mIndex} className="border-b border-white/5 last:border-0">
                                <div className="p-4 bg-white/5 flex justify-between items-center cursor-pointer hover:bg-white/10 transition-colors">
                                    <h4 className="font-semibold text-sm text-gray-200">
                                        Module {mIndex + 1}: {module.title}
                                    </h4>
                                    {/* Ideally toggle module expansion, but keeping simple for now */}
                                    {/* <ChevronDown size={16} className="text-gray-500" /> */}
                                </div>
                                <div>
                                    {module.lectures.map((lecture, lIndex) => {
                                        const isActive = mIndex === activeModuleIndex && lIndex === activeLectureIndex;
                                        const isCompleted = isLectureCompleted(lecture.title);

                                        return (
                                            <div
                                                key={lIndex}
                                                onClick={() => {
                                                    setActiveModuleIndex(mIndex);
                                                    setActiveLectureIndex(lIndex);
                                                    setIsQuizActive(false);
                                                    // On mobile, close sidebar on select
                                                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                                                }}
                                                className={`p-4 pl-6 flex items-start gap-3 cursor-pointer transition-all border-l-4 ${isActive
                                                    ? 'bg-[#A3D861]/10 border-[#A3D861]'
                                                    : 'bg-transparent border-transparent hover:bg-white/5'
                                                    }`}
                                            >
                                                <div className={`mt-0.5 rounded-full p-[2px] ${isCompleted ? 'text-green-500' : (isActive ? 'text-[#A3D861]' : 'text-gray-600')
                                                    }`}>
                                                    {isCompleted ? <CheckCircle size={16} fill="currentColor" className="text-green-500 bg-black rounded-full" /> :
                                                        isActive ? <Play size={16} fill="currentColor" /> :
                                                            <div className="w-4 h-4 rounded-full border-2 border-current"></div>
                                                    }
                                                </div>
                                                <div>
                                                    <p className={`text-sm font-medium ${isActive ? 'text-[#A3D861]' : 'text-gray-300'}`}>
                                                        {lIndex + 1}. {lecture.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">{lecture.duration}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {/* Practice Quiz Link */}
                                    {module.quiz && module.quiz.length > 0 && (
                                        <div
                                            onClick={() => {
                                                if (isModuleFinished(module)) {
                                                    setQuizModuleIndex(mIndex);
                                                    setIsQuizActive(true);
                                                    resetQuiz();
                                                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                                                }
                                            }}
                                            className={`p-4 pl-6 flex items-start gap-3 transition-all border-l-4 ${isQuizActive && quizModuleIndex === mIndex
                                                ? 'bg-[#A3D861]/10 border-[#A3D861]'
                                                : isModuleFinished(module)
                                                    ? 'bg-transparent border-transparent hover:bg-white/5 cursor-pointer text-[#A3D861]'
                                                    : 'bg-transparent border-transparent opacity-50 cursor-not-allowed'
                                                }`}
                                        >
                                            <div className="mt-0.5">
                                                <HelpCircle size={16} className={isQuizActive && quizModuleIndex === mIndex ? 'text-[#A3D861]' : 'text-gray-500'} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center">
                                                    <p className={`text-sm font-bold ${isQuizActive && quizModuleIndex === mIndex ? 'text-[#A3D861]' : 'text-gray-300'}`}>
                                                        Practice Quiz
                                                    </p>
                                                    {!isModuleFinished(module) && <Lock size={12} className="text-gray-500" />}
                                                </div>
                                                <p className="text-[10px] text-gray-500 mt-0.5">
                                                    {isModuleFinished(module) ? 'Available' : 'Finish module to unlock'}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

            </div >
        </div >
    );
};

const ClassroomPage = () => {
    return (
        <React.Suspense fallback={<div className="min-h-screen bg-[#02040a] flex items-center justify-center text-white">Loading...</div>}>
            <ClassroomContent />
        </React.Suspense>
    );
};

export default ClassroomPage;




