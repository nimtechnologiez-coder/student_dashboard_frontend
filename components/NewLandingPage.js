'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "../app/styles/landing.css"; // Adjusted path
import ChatBot from "./ChatBot";

// import logo from "../images/Nim Academy.png"; // Replaced with static path
const logo = "/Nim Academy.png";

/* ================= DATA ================= */

const categories = [
    "Artificial Intelligence (AI)",
    "Python",
    "Microsoft Excel",
    "AI Agents & Agentic AI",
    "Digital Marketing",
    "Amazon AWS"
];

/* your allCourses object â€” unchanged */
const allCourses = {
    "Artificial Intelligence (AI)": [
        {
            id: 1,
            title: "Complete AI Automation Bootcamp",
            instructor: "KRISHAI Technologies",
            rating: 4.5,
            reviews: 489,
            price: 519,
            oldPrice: 799,
            image: "https://imageio.forbes.com/specials-images/imageserve/643016813686d8eafca00875/0x0.jpg?format=jpg&width=1200",
            tag: "Bestseller"
        },
        {
            id: 2,
            title: "AI Engineer Course 2026",
            instructor: "365 Careers",
            rating: 4.6,
            reviews: 16248,
            price: 519,
            oldPrice: 3009,
            image: "https://i.pinimg.com/originals/b9/6e/d1/b96ed1ed5130d9ad540e3ebdd33a5925.jpg",
            tag: "Bestseller"
        },
        {
            id: 3,
            title: "Machine Learning Aâ€“Z",
            instructor: "SuperDataScience",
            rating: 4.5,
            reviews: 33871,
            price: 519,
            oldPrice: 799,
            image: "https://www.europarl.europa.eu/resources/library/images/20230607PHT95601/20230607PHT95601_original.jpg",
            tag: "Bestseller"
        },
        {
            id: 4,
            title: "Deep Learning Masterclass",
            instructor: "AI Academy",
            rating: 4.8,
            reviews: 429,
            price: 519,
            oldPrice: 799,
            image: "https://img.freepik.com/premium-photo/futuristic-artificial-intelligence-robot-face-science-background-with-abstract-design_801714-4854.jpg",
            tag: "Bestseller"
        }
    ],

    Python: [
        {
            id: 5,
            title: "Python for Beginners",
            instructor: "Jose Portilla",
            rating: 4.6,
            reviews: 98765,
            price: 519,
            oldPrice: 1599,
            image: "https://tse4.mm.bing.net/th/id/OIP.mJcqQabclvb08Ouv8YVtfgHaFP?cb=defcache2&defcache=1&w=800&h=566&rs=1&pid=ImgDetMain&o=7&rm=3",
            tag: "Bestseller"
        },
        {
            id: 6,
            title: "Python Django Full Stack",
            instructor: "Krish Naik",
            rating: 4.7,
            reviews: 45678,
            price: 519,
            oldPrice: 1999,
            image: "https://miro.medium.com/v2/resize:fit:1358/1*GqksJG_OtyhixT84zC2ESA.png",
            tag: "Bestseller"
        },
        {
            id: 7,
            title: "Data Analysis with Python",
            instructor: "IBM",
            rating: 4.5,
            reviews: 34567,
            price: 519,
            oldPrice: 1499,
            image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd",
            tag: "Bestseller"
        },
        {
            id: 8,
            title: "Advanced Python Programming",
            instructor: "Code Academy",
            rating: 4.4,
            reviews: 23456,
            price: 519,
            oldPrice: 1299,
            image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159",
            tag: "Bestseller"
        }
    ],

    "Microsoft Excel": [
        {
            id: 9,
            title: "Excel from Beginner to Advanced",
            instructor: "Microsoft",
            rating: 4.7,
            reviews: 87654,
            price: 519,
            oldPrice: 1999,
            image: "https://images.unsplash.com/photo-1531482615713-2afd69097998",
            tag: "Bestseller"
        },
        {
            id: 10,
            title: "Excel for Data Analysis",
            instructor: "365 Careers",
            rating: 4.6,
            reviews: 65432,
            price: 519,
            oldPrice: 1799,
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
            tag: "Bestseller"
        },
        {
            id: 11,
            title: "Advanced Excel Formulas",
            instructor: "Excel Guru",
            rating: 4.5,
            reviews: 54321,
            price: 519,
            oldPrice: 1499,
            image: "https://images.unsplash.com/photo-1581090700227-1e37b190418e",
            tag: "Bestseller"
        },
        {
            id: 12,
            title: "Excel Dashboards",
            instructor: "BI Academy",
            rating: 4.4,
            reviews: 43210,
            price: 519,
            oldPrice: 1399,
            image: "https://images.unsplash.com/photo-1545235617-9465d2a55698",
            tag: "Bestseller"
        }
    ],

    "AI Agents & Agentic AI": [
        {
            id: 13,
            title: "Agentic AI with n8n",
            instructor: "KRISHAI Technologies",
            rating: 4.8,
            reviews: 1200,
            price: 519,
            oldPrice: 1999,
            image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
            tag: "Bestseller"
        },
        {
            id: 14,
            title: "AI Agents Masterclass",
            instructor: "AI Labs",
            rating: 4.7,
            reviews: 980,
            price: 519,
            oldPrice: 1799,
            image: "https://images.unsplash.com/photo-1591696331111-ef9586a5b17a",
            tag: "Bestseller"
        },
        {
            id: 15,
            title: "Multi-Agent Systems",
            instructor: "DeepLearning.AI",
            rating: 4.6,
            reviews: 2100,
            price: 519,
            oldPrice: 1899,
            image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b",
            tag: "Bestseller"
        },
        {
            id: 16,
            title: "Autonomous AI Agents",
            instructor: "Future AI",
            rating: 4.5,
            reviews: 870,
            price: 519,
            oldPrice: 1699,
            image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
            tag: "Bestseller"
        }
    ],

    "Digital Marketing": [
        {
            id: 17,
            title: "Digital Marketing Complete Course",
            instructor: "Google",
            rating: 4.7,
            reviews: 76543,
            price: 519,
            oldPrice: 1999,
            image: "https://images.unsplash.com/photo-1557838923-2985c318be48",
            tag: "Bestseller"
        },
        {
            id: 18,
            title: "SEO Mastery",
            instructor: "Ahrefs",
            rating: 4.6,
            reviews: 65432,
            price: 519,
            oldPrice: 1799,
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
            tag: "Bestseller"
        },
        {
            id: 19,
            title: "Social Media Marketing",
            instructor: "Meta",
            rating: 4.5,
            reviews: 54321,
            price: 519,
            oldPrice: 1599,
            image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
            tag: "Bestseller"
        },
        {
            id: 20,
            title: "Google Ads Bootcamp",
            instructor: "Google",
            rating: 4.4,
            reviews: 43210,
            price: 519,
            oldPrice: 1499,
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
            tag: "Bestseller"
        }
    ],

    "Amazon AWS": [
        {
            id: 21,
            title: "AWS Cloud Practitioner",
            instructor: "Amazon",
            rating: 4.7,
            reviews: 98765,
            price: 519,
            oldPrice: 1999,
            image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
            tag: "Bestseller"
        },
        {
            id: 22,
            title: "AWS Solutions Architect",
            instructor: "Stephane Maarek",
            rating: 4.8,
            reviews: 87654,
            price: 519,
            oldPrice: 2499,
            image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
            tag: "Bestseller"
        },
        {
            id: 23,
            title: "AWS DevOps Engineer",
            instructor: "AWS Academy",
            rating: 4.6,
            reviews: 65432,
            price: 519,
            oldPrice: 2199,
            image: "https://images.pexels.com/photos/11035393/pexels-photo-11035393.jpeg",
            tag: "Bestseller"
        },
        {
            id: 24,
            title: "AWS Lambda & Serverless",
            instructor: "Cloud Guru",
            rating: 4.5,
            reviews: 54321,
            price: 519,
            oldPrice: 1899,
            image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
            tag: "Bestseller"
        }
    ]
};
/* âœ… KEEP YOUR SAME DATA HERE (no change) */

const NewLandingPage = () => {
    const router = useRouter(); // Changed from navigate to router


    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState(categories[0]);
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(null);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);


    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        router.push('/login');
    };

    return (
        <div className="landing">

            {/* ================= NAVBAR ================= */}
            <nav className="udemy-navbar">

                <div className="udemy-left">
                    <img src={logo} alt="Nim Academy" className="udemy-logo" />
                    {/* <span className="udemy-explore">Explore</span> */}
                </div>

                <div className="udemy-search">
                    <span>ðŸ”</span>
                    <input
                        type="text"
                        placeholder="Search for anything"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* DESKTOP RIGHT */}
                <div className="udemy-right desktop-only">
                    {user ? (
                        <>
                            <span style={{ color: 'black', fontWeight: '500', marginRight: '10px' }}>
                                Welcome, {user.fullName ? user.fullName.split(' ')[0] : 'User'}
                            </span>
                            <button className="signup-btn" onClick={() => router.push('/dashboard')}>
                                My Dashboard
                            </button>
                            <button className="login-btn" onClick={handleLogout} style={{ marginLeft: '10px' }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="login-btn" onClick={() => router.push('/login')}>Log in</button>
                            <button className="signup-btn" onClick={() => router.push('/register')}>Sign up</button>
                        </>
                    )}
                </div>

                {/* HAMBURGER */}
                <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                    â˜°
                </div>

                {/* MOBILE MENU */}
                <div className={`mobile-menu ${menuOpen ? "active" : ""}`}>
                    {user ? (
                        <>
                            <div style={{ padding: '10px', color: 'black', fontWeight: 'bold' }}>
                                Welcome, {user.fullName ? user.fullName.split(' ')[0] : 'User'}
                            </div>
                            <button className="signup-btn" onClick={() => router.push('/dashboard')}>
                                My Dashboard
                            </button>
                            <button className="login-btn" onClick={handleLogout} style={{ width: '90%' }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="login-btn" onClick={() => router.push('/login')}>Log in</button>
                            <button className="signup-btn" onClick={() => router.push('/register')}>Sign up</button>
                        </>
                    )}
                    <button className="globe">ðŸŒ</button>
                </div>

            </nav>




            {/* ================= HERO SECTION ================= */}
            <section className="hero">
                <div className="hero-content">
                    <h1>
                        Learn Skills for Your <span>Future Career</span>
                    </h1>

                    <p>
                        NIM Academy helps you master industry-ready skills through
                        expert-led courses and hands-on training.
                    </p>

                    <div className="hero-actions">
                        <button
                            className="btn primary"
                            onClick={() => router.push("/courses")}
                        >
                            Explore Courses
                        </button>

                        <button
                            className="btn secondary"
                            onClick={() => user ? router.push("/Learnmores") : router.push("/register")}
                        >
                            Start Learning
                        </button>
                    </div>

                    <div className="hero-stats">
                        <div>
                            <h3>10K+</h3>
                            <p>Students Trained</p>
                        </div>
                        <div>
                            <h3>200+</h3>
                            <p>Courses</p>
                        </div>
                        <div>
                            <h3>50+</h3>
                            <p>Expert Trainers</p>
                        </div>
                    </div>
                </div>

                <div className="hero-image">
                    {/* <img
            src="https://img-c.udemycdn.com/notices/home_carousel_slide/image/e0f761de-869e-4ede-8077-f4c6f92f6f83.jpg"
            alt="NIM Academy Learning"
          /> */}
                </div>
            </section>
            <section className="skills-courses">

                <h1>Skills to transform your career and life</h1>
                <p>
                    Learn AI, Cloud, Full Stack, Data Science & more from industry experts.
                </p>

                {/* CATEGORY TABS */}
                <div className="category-tabs">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={activeCategory === cat ? "active" : ""}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* COURSE CARDS */}
                <div className="courses-row">
                    {allCourses[activeCategory]?.map((course) => (
                        <div
                            className="course-card"
                            key={course.id}
                            onClick={() => router.push("/courses")}
                        >
                            <img src={course.image} alt={course.title} />

                            <div className="card-body">
                                <h3>{course.title}</h3>

                                <p className="instructor">{course.instructor}</p>

                                <div className="rating">
                                    â­ {course.rating}
                                    <span> ({course.reviews})</span>
                                </div>

                                {course.tag && <span className="tag">{course.tag}</span>}

                                <div className="price">
                                    â‚¹{course.price}
                                    <span>â‚¹{course.oldPrice}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>



                {/* SHOW ALL */}
                <span
                    className="show-all"
                    onClick={() => router.push("/courses")}
                >
                    Show all {activeCategory} courses â†’
                </span>

            </section>




            {/* ================= COURSES ================= */}

            <section className="nim-learning-format">

                <h2>Find your perfect learning format</h2>

                <p className="subtitle">
                    NIM Academy offers flexible learning paths in AI, Full Stack, Cloud and Data Science.
                    Choose the format that fits your career goals.
                </p>

                <div className="format-grid">

                    {/* CARD 1 */}
                    <div className="format-card">
                        <div className="card-top beige">
                            <span className="icon">ðŸ“˜</span>
                            <h3>Individual Courses</h3>
                            <p>Learn job-ready skills anytime, anywhere.</p>
                        </div>

                        <div className="card-bottom">
                            <p>â± 4-8 weeks</p>
                            <p>ðŸŽ“ Industry-recognized certificate</p>
                            <p>ðŸ›  Hands-on projects</p>

                            <button onClick={() => router.push("/courses")}>
                                Explore courses
                            </button>
                        </div>
                    </div>

                    {/* CARD 2 */}
                    <div className="format-card">
                        <div className="card-top beige">
                            <span className="icon">ðŸ“œ</span>
                            <h3>Certificate Programs</h3>
                            <p>Build expertise with structured learning paths.</p>
                        </div>

                        <div className="card-bottom">
                            <p>â± 8-12 weeks</p>
                            <p>ðŸŽ“ Multiple certifications</p>
                            <p>ðŸ“Š Portfolio development</p>

                            <button onClick={() => router.push("/courses")}>
                                Explore programs
                            </button>
                        </div>
                    </div>

                    {/* CARD 3 */}
                    <div className="format-card">
                        <div className="card-top green">
                            <span className="icon">ðŸŒ</span>
                            <h3>Career Tracks</h3>
                            <p>Master in-demand technologies with mentorship.</p>
                        </div>

                        <div className="card-bottom">
                            <p>â± 12-24 weeks</p>
                            <p>ðŸ’¼ Placement support</p>
                            <p>ðŸš€ Real-world projects</p>

                            <button onClick={() => router.push("/courses")}>
                                Explore tracks
                            </button>
                        </div>
                    </div>

                    {/* CARD 4 */}
                    <div className="format-card">
                        <div className="card-top light">
                            <span className="icon">ðŸŽ“</span>
                            <h3>Advanced Programs</h3>
                            <p>Become a domain expert with real experience.</p>
                        </div>

                        <div className="card-bottom">
                            <p>â± 3-6 months</p>
                            <p>ðŸ† Capstone projects</p>
                            <p>ðŸ¤ Internship opportunities</p>

                            <button onClick={() => router.push("/courses")}>
                                Explore training
                            </button>
                        </div>
                    </div>

                </div>
            </section>




            {/* ================= WHY NIMACADEMY WORKS ================= */}
            <section className="why-nim">

                <h2 className="why-title">Why NimAcademy works</h2>

                <div className="why-grid">

                    <div className="why-card">
                        <div className="why-icon">ðŸŽ¯</div>
                        <h3>Personalized learning</h3>
                        <p>
                            Learn at your own pace with structured paths, smart recommendations,
                            and hands-on projects that help you master real-world skills.
                        </p>
                    </div>

                    <div className="why-card">
                        <div className="why-icon">ðŸ“š</div>
                        <h3>Industry-ready content</h3>
                        <p>
                            Courses designed by experts covering Full Stack, AI, Data Science,
                            and emerging technologies aligned with current job demands.
                        </p>
                    </div>

                    <div className="why-card">
                        <div className="why-icon">ðŸš€</div>
                        <h3>Career acceleration</h3>
                        <p>
                            Get certification, build portfolio projects, and prepare for
                            interviews with guided learning and mentorship support.
                        </p>
                    </div>

                </div>

            </section>



            {/* ================= AI HERO ================= */}
            <section className="ai-hero">
                <div className="ai-hero-content">
                    <div className="ai-hero-left">
                        <h1>Reimagine your career in the AI era</h1>
                        <p>
                            Future-proof your skills with Personal Plan.
                            Learn directly from industry experts.
                        </p>

                        <div className="ai-features">
                            <div>âœ¨ Learn AI and more</div>
                            <div>ðŸ† Prep for certification</div>
                            <div>ðŸ¤– Practice with AI coaching</div>
                            <div>ðŸ’¡ Advance your career</div>
                        </div>

                        <button
                            className="ai-btn"
                            onClick={() => router.push("/Learnmores")}
                        >
                            Learn more
                        </button>

                        {/* <p className="ai-price">Starting at â‚¹500/month</p> */}
                    </div>

                    <div className="ai-hero-right">
                        {/* <img
              src="https://img.freepik.com/premium-photo/photo-portrait-tech-professional-people-working-laptop-futuristic-digital-environment_763111-328482.jpg"
              className="ai-img large"
              alt="AI learning"
            /> */}
                    </div>
                </div>
            </section>
            {/* ================= EXPERIENCE SECTION ================= */}
            <section className="experience">
                <h2 className="experience-title">
                    Experience why learners <br /> and leaders love us
                </h2>

                <div className="experience-grid">

                    <div className="experience-col">
                        <div className="experience-item">
                            <span className="check">âœ”</span>
                            <div>
                                <h4>We just keep growing. Come and grow too.</h4>
                                <p>
                                    Choose a learning partner who can work with you to build a
                                    skills-based organization thatâ€™s prepared for now and for the future.
                                </p>
                            </div>
                        </div>

                        <div className="experience-item">
                            <span className="check">âœ”</span>
                            <div>
                                <h4>Skills for everyone â€” from tech to exec teams.</h4>
                                <p>
                                    Help teams across your entire organization expand their potential
                                    with courses in tech, business, leadership, wellness, and more.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="experience-col">
                        <div className="experience-item">
                            <span className="check">âœ”</span>
                            <div>
                                <h4>Donâ€™t just keep up â€” set the pace with NimAcademy.</h4>
                                <p>
                                    Outdated training holding you back? We deliver content on the latest
                                    skills as they emerge, including new offerings in GenAI.
                                </p>
                            </div>
                        </div>

                        <div className="experience-item">
                            <span className="check">âœ”</span>
                            <div>
                                <h4>Learning that fits your needs (and your budget).</h4>
                                <p>
                                    Create a plan that supports goals across your organization while
                                    increasing retention and optimizing your workforce.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* ================= BUSINESS PLANS INTRO ================= */}
            <section className="business-intro">
                <h2>Grow your team's skills and your business</h2>
                <p>
                    Reach goals faster with one of our plans or programs. Try one free today
                    or contact sales to learn more.
                </p>
            </section>

            {/* ================= BUSINESS PLANS ================= */}
            <section className="business-plans">
                <div className="plans-container">

                    {/* TEAM PLAN */}
                    <div className="business-card">
                        <div className="card-top purple"></div>
                        <div className="card-body">
                            <h3>Team Plan</h3>
                            <p className="sub-text">ðŸ‘¥ 2 to 50 people â€“ For your team</p>

                            <button className="outline-btn" onClick={() => router.push('/subscription')}>Start subscription</button>

                            <div className="divider"></div>

                            <h4>â‚¹2,000 a month per user</h4>
                            <p className="billing">Billed annually. Cancel anytime.</p>

                            <ul>
                                <li>Access to 13,000+ top courses</li>
                                <li>Certification prep</li>
                                <li>Goal-focused recommendations</li>
                                <li>AI-powered coaching</li>
                                <li>Analytics and adoption reports</li>
                            </ul>
                        </div>
                    </div>

                    {/* ENTERPRISE PLAN */}
                    <div className="business-card">
                        <div className="card-top blue"></div>
                        <div className="card-body">
                            <h3>Enterprise Plan</h3>
                            <p className="sub-text">
                                ðŸ‘¥ More than 20 people â€“ For your whole organization
                            </p>

                            <button className="outline-btn" onClick={() => router.push('/demo')}>Request a demo</button>

                            <div className="divider"></div>

                            <h4>Contact sales for pricing</h4>

                            <ul>
                                <li>Access to 30,000+ top courses</li>
                                <li>Certification prep</li>
                                <li>Goal-focused recommendations</li>
                                <li>AI-powered coaching</li>
                                <li>Advanced analytics and insights</li>
                                <li>Dedicated customer success team</li>
                                <li>International course collection (15 languages)</li>
                                <li>Customizable content</li>
                                <li>Hands-on tech training with add-on</li>
                                <li>Strategic implementation services</li>
                            </ul>
                        </div>
                    </div>

                    {/* AI FLUENCY */}
                    <div className="business-card">
                        <div className="card-top dark"></div>
                        <div className="card-body">
                            <h3>AI Fluency</h3>
                            <p className="sub-text">
                                âœ¨ From AI foundations to Enterprise transformation
                            </p>

                            <button className="outline-btn">Contact Us</button>

                            <div className="divider"></div>

                            <h4>AI Readiness Collection</h4>
                            <p className="sub-text">ðŸ‘¥ More than 100 people</p>
                            <p>
                                Build org-wide AI fluency fast with 50 curated courses + AI Assistant
                                to accelerate learning.
                            </p>

                            <br />

                            <h4>AI Growth Collection</h4>
                            <p className="sub-text">ðŸ‘¥ More than 20 people</p>
                            <p>
                                Scale AI and technical expertise with 800+ specialized courses and
                                30+ role-specific learning paths in multiple languages.
                            </p>
                        </div>
                    </div>

                </div>
            </section>



            {/* ================= REVIEWS ================= */}
            <section className="skillshare-reviews">
                <h2>Why Students Love NimAcademy</h2>

                <div className="reviews-wrapper">

                    {/* REVIEW 1 */}
                    <div className="review-box">
                        <div className="review-user">
                            <img src="https://static.vecteezy.com/system/resources/previews/029/891/975/non_2x/business-american-man-in-light-cream-ai-generative-free-photo.jpg" alt="" />
                            <h4>Arjun R</h4>
                        </div>
                        <div className="line"></div>
                        <p>
                            â€œNimAcademy was the best learning decision Iâ€™ve ever made.
                            Real-world projects helped me gain confidence and land my first job.â€
                        </p>
                    </div>

                    {/* REVIEW 2 */}
                    <div className="review-box">
                        <div className="review-user">
                            <img src="https://img.freepik.com/premium-photo/headshot-photos-indian-women-dynamic-professions-occassions-indian-girl_978786-295.jpg?w=740" alt="" />
                            <h4>Katrina S</h4>
                        </div>
                        <div className="line"></div>
                        <p>
                            â€œItâ€™s rare that I stick to one platform,
                            but this is one learning journey I canâ€™t imagine without.â€
                        </p>
                    </div>

                    {/* REVIEW 3 */}
                    <div className="review-box">
                        <div className="review-user">
                            <img src="https://static.vecteezy.com/system/resources/previews/024/354/252/non_2x/businessman-isolated-illustration-ai-generative-free-photo.jpg" alt="" />
                            <h4>Elli V</h4>
                        </div>
                        <div className="line"></div>
                        <p>
                            â€œI love that NimAcademy connects learners where we grow together
                            and support each other in our career journey.â€
                        </p>
                    </div>

                    {/* REVIEW 4 */}
                    <div className="review-box">
                        <div className="review-user">
                            <img src="https://tse1.mm.bing.net/th/id/OIP.Q0Y0H664sGbrOJp0SilHNwHaHa?cb=defcache2&defcache=1&w=626&h=626&rs=1&pid=ImgDetMain&o=7&rm=3" alt="" />
                            <h4>Savonne M</h4>
                        </div>
                        <div className="line"></div>
                        <p>
                            â€œNimAcademy helped me level up my skills while exploring
                            industry-ready learning paths and expert mentorship.â€
                        </p>
                    </div>

                </div>
            </section>


            {/* ================= CAREER OUTCOME CTA ================= */}
            <section className="career-cta">

                <div className="career-cta-content">

                    {/* LEFT */}
                    <div className="career-cta-left">
                        <h2>
                            Join the 91% of learners who achieved a positive career outcome,
                            like new job opportunities, increased knowledge, and improved
                            performance at work.
                        </h2>

                        <button className="career-cta-btn">
                            Start 1-day Free Trial
                        </button>
                    </div>

                    {/* RIGHT IMAGE */}
                    <div className="career-cta-right">
                        <img
                            src="https://www.bing.com/th/id/OIP.rMcBg3w2WTvxy57T1rmn1AHaE7?w=259&h=211&c=8&rs=1&qlt=90&o=6&cb=defcache1&dpr=1.4&pid=3.1&rm=2&defcache=1"
                            alt="career outcome"
                        />
                    </div>

                </div>

            </section>
            <section className="join-section">
                <div className="join-content">
                    <h1>Join NimAcademy today</h1>
                    {/* <p className="subtitle">
      Learn new skills, grow your career, and achieve your goals with expert guidance
    </p> */}

                    <div className="join-card">
                        <button
                            className="join-btn secondary"
                            onClick={() => router.push("/register")}
                        >
                            Learners
                        </button>

                        <button
                            className="join-btn secondary"
                            onClick={() => router.push("/register")}
                        >
                            Instructors
                        </button>

                        <button
                            className="join-btn secondary"
                            onClick={() => router.push("/register")}
                        >
                            Teams
                        </button>

                        <button
                            className="join-btn primary"
                            onClick={() => router.push("/register")}
                        >
                            Get Started
                        </button>

                        <div className="trust">
                            â­ 10,000+ Learners â€¢ ðŸŽ“ Expert Mentors â€¢ ðŸ’¼ Job-Ready Skills
                        </div>
                    </div>
                </div>
                <div className="image-wrappers">
                    {/* <img
          src="https://images.pexels.com/photos/3201694/pexels-photo-3201694.jpeg"
          alt="Instructor"
          className="hero-images"
        /> */}

                </div>
            </section>
            <section className="skills-section">

                <h2 className="skills-title">
                    Skill development that drives results
                </h2>

                <p className="skills-subtitle">
                    Master today's most in-demand skills in AI, Data, Programming and beyond through
                    nim academy hands-on projects, expert mentorship, and flexible programs built with
                    the world's leading tech companies.
                </p>

                <div className="skills-cards">

                    {/* CARD 1 */}
                    <div className="skill-card">
                        <div className="skill-card-top gradient-1">
                            Hands-on<br />learning
                        </div>

                        <h4>Learn by building</h4>
                        <hr />

                        <p>
                            Gain job-ready skills through real projects, created with top tech
                            companies to reflect what the industry actually needs.
                        </p>
                    </div>

                    {/* CARD 2 */}
                    <div className="skill-card">
                        <div className="skill-card-top gradient-2">
                            Personalized<br />support
                        </div>

                        <h4>Support, anytime you need it</h4>
                        <hr />

                        <p>
                            Get personalized support and feedback from industry professionals
                            who've done the work and know what it takes.
                        </p>
                    </div>

                    {/* CARD 3 */}
                    <div className="skill-card">
                        <div className="skill-card-top gradient-3">
                            Measurable<br />outcomes
                        </div>

                        <h4>Progress you can see</h4>
                        <hr />

                        <p>
                            Start applying your skills from day one, build your portfolio,
                            and achieve your career goals.
                        </p>
                    </div>

                </div>
            </section>
            <section className="byjus-advantage">

                <h2 className="byjus-title">The Nim Academy advantage</h2>

                <div className="byjus-container">

                    <div className="byjus-card">
                        <img
                            src="https://images.pexels.com/photos/5896694/pexels-photo-5896694.jpeg"
                            alt="Hands-on learning"
                        />
                        <p>Hands-on learning<br />with real-world projects</p>
                    </div>

                    <div className="byjus-card">
                        <img
                            src="https://images.pexels.com/photos/7731366/pexels-photo-7731366.jpeg"
                            alt="Expert mentors"
                        />
                        <p>Learn from industry experts<br />with mentor support</p>
                    </div>

                    <div className="byjus-card">
                        <img
                            src="https://images.pexels.com/photos/761993/pexels-photo-761993.jpeg"
                            alt="Career growth"
                        />
                        <p>Career-focused training<br />with placement guidance</p>
                    </div>

                </div>

            </section>
            <section className="guided-section">

                <div className="guided-container">

                    {/* LEFT IMAGE */}
                    {/* <div className="guided-image">
      <img
        src="https://images.pexels.com/photos/8998289/pexels-photo-8998289.jpeg"
        alt="Guided learning"
      />
    </div> */}

                    {/* RIGHT CONTENT */}
                    <div className="guided-content">
                        <h2>Guided Learning</h2>

                        <p>
                            Follow structured paths designed by industry experts. Track your
                            progress, complete real-world projects, and master skills step by step
                            with NIM Academy.
                        </p>
                    </div>

                </div>

            </section>






            {/* #footer section */}


            <footer className="footer">
                <div className="footer-container">

                    {/* LEFT LOGO AREA */}
                    <div className="footer-logos">
                        <img
                            src="data:image/png;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCABSAKADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWFlcZGVnZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/9oADAMBAAIRAxAPwD3aSQscA8Ko6KKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKkjkKnBOQajooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiijBPQUAFFFFABRRRQAVBeXS2Vo9y8csipyViXc2PX6DvU9ZXiC2vrvS2hsGO9jteMbRvU8EEnp+HNZVpSjTlKKu7GlGMZVIxk7K5kW/ia/k+wo1oxkmkLPsgY7ou2znk+p6Vqz63L/aM9jY6fJdy24HmnzVjAz6Z61T0/RtQh1tZ5rk+RaxrFC3lp+8THK4H3R79TTdW0+e5v5Xk0GC8Q8RTR3PlOOP4uRk15sZYqNK7bvftrZLyUt35HpSjhpVbJK1u+l2/Nx2XmP17V7630iGuaC2ntXlwWkcKfK5+6Rzyf84q1Nr32SySW6sZ4p5JPLit8hmkOBzx25qnJomoTeERp8swe7VxIoZsgAHhM/T8O3SnXlpq9/HZ3v2SK3vrKXKQmUMsi4HcdDkdD+dNzxKbkr6pWVr+vzW9upKjh2lF20b1vb0+T28iSTxHLbSwQ3mlT28k0gRMyAqQTjOcdRkcUN4jle4uYLXSbi5kt5GR9jcYBxnp1OOlVr+31vVpbJ5dPjtore4VynnqzHnls9MAduvNaOi2NxZ3GqPOgVbi6MkfzA5Xnnjp+NOE8TOpypvl7uNunp38hShh4U+Zpc3ZSv19e3mUtZ1fULe809IbaaJZHUsvynzc4Jj9iOmavnWWS70+2mspIpbzd8rOMx49fWo9esbq6+w3FmqSS2k/m+Wzbd447/hUGoWmp3f9nanFbRx31qzFrZpAQQT2bp0/n7VUnXp1JtNvZrTppe2m++hMVQnCCaS3vrrfW19dttfkX7zVVtNÑÑ‚Ñ€IwszTxu4cNgLtBOMfhWbB4oku7fzrXR7qZFH7wq3C+w4+Y45qOW01a71e21C7tYoYYYpFKLKGKDaep75J7VT8Oza1b6JGLKyhuYZCxjcyBTG2cHIJGRkZ/rWU8TWdXl1Sd7e7d2SjbS3dv+ttI4eiqV9G1a/vaXvLrfsl/W9+81Ky1E6LcRtc7ZLraojk2bW4yHHOfw/PmpI/Er3HnC10q5naF2WQIwwAO+cdT6YqrF4fvLaHSlG2V47w3FwQwAXOOmcZ4HatPw7Y3Gnw3a3KBDJdNIuGBypxzxVUnipVLP3b7u3kv1/yFV+rRp6e9bZX83+gx/EtkNJiv1WR/Nfy0hA+cv3H/ANf3FZGu6rczwWkE9hcWMpuEdSzyZDr0IyMc4inw+H9RTTY2URx3lteNcRI7Aq6nHcfT/wDVTNTk1HWFt/MjsreOGZXKC7jZmPc5zjAHbrz3rCvWxEqTVS6bSsrb979vw+ZrShhqdROLVk3q3t2t3/H5GoNRtLPVdZllM6iAKZCz7lOegVex/GmP4lmitftc2j3MdswzHJvBznpkfwg+tVp9JfVLrXFSWHZc+W0LrIGyV9QCSB26U66XxBfaTJp76dDGdgV5vPU+YB2Udicd/wNK78ZKVOdsPfltdWV7ye997a+n6HmZbGNSleta/M07u1o30a2vp6nQWk4urOC5ClRLGHCk5xkZxU1VtOhe30y0hlG2SOFVYZzggc1ZrrptuCctzOaSk0tgoooqyQooooAKKKKACiiigAooooARgGUqwyCMEe1RWtrBZW629tGI4VztUEnGfrU1FLlV721HzO1ugUUVFc20d3bvBMCY3xkA475oleztuIlwcHg9K57QdOs7rSVlntkkkLsNxz0Bq3/dem/885P+/hq/aWkNjbiCAERgluTk5NcTpVKtWMqsVZJ9b728l2EJb2NraMzW8CRlhhiverFFFdkYxirRVkMKKKKoAopzqUbH5U2gAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACrcYAQYFFFAH//2Q=="
                            alt="startup"
                        />

                        <img
                            src="https://nimtechnologies.in/static/media/Footer1.147bf340c174f14fdcf9.png"
                            alt="msme"
                        />
                    </div>

                    {/* CENTER CONTENT */}
                    <div className="footer-about">
                        <h2>
                            NIM <span>Academy</span>
                        </h2>

                        <p>
                            Empowering learners with industry-ready courses in AI, Cloud,
                            Full Stack Development and Data Analytics.
                        </p>

                        {/* âœ… SOCIAL ICON IMAGES */}
                        <div className="footer-socials">

                            <a href="https://www.linkedin.com/company/nim-technologies/posts/?feedView=all" target="_blank" rel="noreferrer">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/145/145807.png"
                                    alt="LinkedIn"
                                />
                            </a>

                            <a href="https://twitter.com" target="_blank" rel="noreferrer">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/733/733579.png"
                                    alt="Twitter"
                                />
                            </a>

                            <a href="https://www.instagram.com/nimtechnologies/" target="_blank" rel="noreferrer">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
                                    alt="Instagram"
                                />
                            </a>

                        </div>
                    </div>

                    {/* RIGHT CONTACT */}
                    <div className="footer-contact">
                        <h3>Get in Touch</h3>

                        <p>ðŸ“§ contactnimacademy@gmail.com</p>
                        <p>ðŸ“ž +91 7418855108</p>
                        <p>ðŸ“ Nagercoil, Tamil Nadu 629170</p>
                    </div>
                </div>

                {/* BOTTOM BAR */}
                <div className="footer-bottom">
                    <p>Â© 2026 NimAcademy. All rights reserved.</p>

                    <div className="footer-links">
                        <span>Privacy Policy</span>
                        <span>Terms of Service</span>
                        <span>Cookie Policy</span>
                    </div>
                </div>
            </footer>

            {/* AI Chatbot */}
            <ChatBot />
        </div>

    );
};

export default NewLandingPage;




