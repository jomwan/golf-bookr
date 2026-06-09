import { useNavigate } from 'react-router-dom';
import styles from '../styles/Home.module.css';

const Home = () => {
    const navigate = useNavigate();
    
    const handleBookNow = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            navigate('/booking');
        }
    };

    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroOverlay} />
                <div className={styles.heroContent}>
                    <span className={styles.heroTagline}>THE ULTIMATE GOLFING CONCIERGE</span>
                    <h1 className={styles.heroTitle}>
                        Elevate Your Game
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Discover and reserve the finest championship golf courses tailored for you in Bangkok, guided by CawFee AI.
                    </p>
                    <button onClick={handleBookNow} className={styles.heroBtn}>
                        Book A Tee Time
                    </button>
                </div>
            </section>

            {/* Running Logo Runner */}
            <div className={styles.logoRunnerSection}>
                <p className={styles.runnerTitle}>TRUSTED BY LEADING CLUBS & ASSOCIATIONS</p>
                <div className={styles.logoContainer}>
                    {[1, 2, 3, 4, 5].map((index) => (
                        <img 
                            key={index}
                            src={`/images/logo${index}.png`}
                            alt={`Club Logo ${index}`}
                            className={`${styles.runningLogo} ${styles[`logo${index}`]}`}
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Featured Courses Section */}
            <section className={styles.featuredCourses}>
                <div className={styles.sectionHeader}>
                    <h2>Featured Championship Courses</h2>
                    <div className={styles.goldDivider} />
                    <p>Experience world-class fairways and immaculate greens at our handpicked locations.</p>
                </div>

                <div className={styles.courseGrid}>
                    {/* Alpine Golf Club Card */}
                    <div className={styles.courseCard}>
                        <div className={styles.courseImage}>
                            <a href='https://www.alpinegolfclub.com/' target="_blank" rel="noreferrer"> 
                                <img 
                                    src="/images/alpine.jpg" 
                                    alt="Alpine Golf & Sports Club"
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=800';
                                    }}
                                />
                            </a>
                            <span className={styles.difficultyBadge}>Championship</span>
                        </div>
                        <div className={styles.courseInfo}>
                            <h3>Alpine Golf & Sports Club</h3>
                            <span className={styles.locationLabel}>Bangkok, Thailand</span>
                            <p>
                                A championship course designed by Ron Garl, known for its challenging 
                                layout with rolling fairways and fast greens. Tee times are limited 
                                due to its private membership; advance booking is essential.
                            </p>
                            <div className={styles.courseFeatures}>
                                <ul>
                                    <li>Championship Layout</li>
                                    <li>Rolling Fairways</li>
                                    <li>Fast Greens</li>
                                    <li>Private Membership</li>
                                </ul>
                                <button 
                                    className={styles.courseBtn}
                                    onClick={handleBookNow}
                                >
                                    Book This Course
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Thai Country Club Card */}
                    <div className={styles.courseCard}>
                        <div className={styles.courseImage}>
                            <a href='https://www.thaicountryclub.com/' target="_blank" rel="noreferrer">  
                                <img 
                                    src="/images/thai-country-club.jpg" 
                                    alt="Thai Country Club"
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=800';
                                    }}
                                />
                            </a>
                            <span className={styles.difficultyBadge}>Exclusive</span>
                        </div>
                        <div className={styles.courseInfo}>
                            <h3>Thai Country Club</h3>
                            <span className={styles.locationLabel}>Bangkok, Thailand</span>
                            <p>
                                An exclusive club that has hosted international tournaments, offering 
                                meticulously maintained fairways and top-notch facilities. Visitor 
                                tee times are restricted; booking through authorized agents is recommended.
                            </p>
                            <div className={styles.courseFeatures}>
                                <ul>
                                    <li>International Tournaments</li>
                                    <li>Meticulously Maintained</li>
                                    <li>Top-notch Facilities</li>
                                    <li>Exclusive Access</li>
                                </ul>
                                <button 
                                    className={styles.courseBtn}
                                    onClick={handleBookNow}
                                >
                                    Book This Course
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Nikanti Golf Club Card */}
                    <div className={styles.courseCard}>
                        <div className={styles.courseImage}>
                            <a href='https://www.nikantigolfclub.com/' target="_blank" rel="noreferrer"> 
                                <img 
                                    src="/images/nikanti-golf.jpg" 
                                    alt="Nikanti Golf Club"
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?q=80&w=800';
                                    }}
                                />
                            </a>
                            <span className={styles.difficultyBadge}>Innovative 6-6-6</span>
                        </div>
                        <div className={styles.courseInfo}>
                            <h3>Nikanti Golf Club</h3>
                            <span className={styles.locationLabel}>Nakhon Pathom, Thailand</span>
                            <p>
                                A unique 18-hole course comprising three six-hole layouts, each with 
                                two par-3s, two par-4s, and two par-5s, providing a distinctive 
                                golfing experience. Tee times are generally available; inclusive 
                                packages cover green fees, caddie fees, and meals.
                            </p>
                            <div className={styles.courseFeatures}>
                                <ul>
                                    <li>Unique 6-6-6 Layout</li>
                                    <li>All-Inclusive Packages</li>
                                    <li>Modern Facilities</li>
                                    <li>Excellent Value</li>
                                </ul>
                                <button 
                                    className={styles.courseBtn}
                                    onClick={handleBookNow}
                                >
                                    Book This Course
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Us Section */}
            <section className={styles.whyUs}>
                <div className={styles.sectionHeader}>
                    <h2>Why Book With Us</h2>
                    <div className={styles.goldDivider} />
                </div>
                <div className={styles.featuresGrid}>
                    {[
                        {
                            title: "Seamless Online Booking",
                            description: "Select your preferred date, course, and customize players in seconds."
                        },
                        {
                            title: "Personalized Recommendations",
                            description: "AI-driven matchmaking matching course layouts to your specific handicap."
                        },
                        {
                            title: "CawFee AI Assistant",
                            description: "Chat dynamically to inquire about course conditions, local weather, and slot availability."
                        },
                        {
                            title: "Premium Concierge",
                            description: "Pre-book custom caddies, golf carts, and elite club rentals directly from the app."
                        }
                    ].map((feature, index) => (
                        <div key={index} className={styles.featureCard}>
                            <div className={styles.featureIcon}>⛳</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Partner Promotions */}
            <section className={styles.partnersPromotion}>
                <div className={styles.sectionHeader}>
                    <h2>Partners & Promotion</h2>
                    <div className={styles.goldDivider} />
                </div>
                <div className={styles.promotions}>
                    {/* First Banner */}
                    <div className={styles.banner}>
                        <div className={styles.bannerOverlay} />
                        <div className={styles.bannerContent}>
                            <h3>Partner Discount</h3>
                            <p>Exclusive offer for our partners: 10% off on all bookings.</p>
                            <div className={styles.partnerLogos}>
                                <a href="https://www.cimso.com" target="_blank" rel="noreferrer">
                                    <img src="/images/Cimso Logo.png" alt="Cimso Logo" className={styles.partnerLogo} />
                                </a>
                                <a href="https://www.rsu.ac.th" target="_blank" rel="noreferrer">
                                    <img src="/images/logo2.png" alt="Partner Logo 2" className={styles.partnerLogo} />
                                </a>
                                <a href="https://www.rsuip.org/programmes/undergraduate/ict/" target="_blank" rel="noreferrer">
                                    <img src="/images/logo4.png" alt="Partner Logo 3" className={styles.partnerLogo} />
                                </a>
                            </div>
                            <button onClick={() => navigate('/about')} className={styles.bannerBtn}>
                                Learn More
                            </button>
                        </div>
                    </div>
                    
                    {/* Second Banner */}
                    <div className={styles.banner}>
                        <div className={styles.bannerOverlay} />
                        <div className={styles.bannerContent}>
                            <h3>Download Our App</h3>
                            <p>Get a special discount when you download our mobile application.</p>
                            <div className={styles.storeLogos}>
                                <a href="https://apps.apple.com" target="_blank" rel="noreferrer">
                                    <img src="/images/Applelogo.png" alt="App Store" />
                                </a>
                                <a href="https://play.google.com" target="_blank" rel="noreferrer">
                                    <img src="/images/Googlelogo.png" alt="Google Play" />
                                </a>
                            </div>
                            <a href="https://play.google.com" target="_blank" rel="noreferrer" className={styles.bannerBtnLink}>
                                Download Now
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
