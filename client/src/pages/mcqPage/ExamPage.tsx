import React, { useState } from 'react';
import EndExamPopup from '../../components/mcqPageComponent/EndExamPopup';

// --- Types and Interfaces ---
interface OptionProps { label: string; value: string; isSelected: boolean; onSelect: (value: string) => void; }

// --- Component Styles (Inline for Simplicity) ---
const styles = {
    // --- Layout & Container Styles ---
    pageContainer: { maxWidth: '1024px', margin: '35px auto', padding: '20px', fontFamily: 'Inter, Arial, sans-serif', backgroundColor: '#f0f0f0', borderRadius: '12px', boxShadow: '0 8px 16px rgba(0,0,0,0.15)', } as React.CSSProperties,

    // Box around Question Content (Base for Options and Timer)
    questionBox: { border: '1px solid #333', padding: '30px', borderRadius: '8px', backgroundColor: '#fff', marginTop: '17px', position: 'relative', boxShadow: '2px 2px 0px 0px rgba(0,0,0,0.1)', } as React.CSSProperties,

    // --- Button & Interaction Styles ---
    button: { padding: '10px 20px', borderRadius: '8px', border: '1px solid #333', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.15s ease-in-out', } as React.CSSProperties,

    // Highlighted Yellow Button Style (Next)
    yellowButton: { backgroundColor: '#ffc107', color: '#333', boxShadow: '2px 2px 0px 0px #000', } as React.CSSProperties,

    // Yellow Button Hover Effect
    yellowButtonHover: { transform: 'translateY(-1px) translateX(-1px)', boxShadow: '3px 3px 0px 0px #000', } as React.CSSProperties,

    // Default White Button Style (Previous, Navbar)
    whiteButton: { backgroundColor: '#fff', color: '#333', boxShadow: '2px 2px 0px 0px #ccc', } as React.CSSProperties,

    // White Button Hover Effect
    whiteButtonHover: { backgroundColor: '#f0f0f0', transform: 'translateY(-1px) translateX(-1px)', boxShadow: '3px 3px 0px 0px #aaa', } as React.CSSProperties,

    // Option Hover Effect Base
    optionHover: { backgroundColor: '#fffbe6', borderColor: '#ffc107', boxBoxShadow: '0 0 5px rgba(255, 193, 7, 0.5)', } as React.CSSProperties,

    // --- Text & Misc Styles ---
    highlightText: { backgroundColor: '#ccffcc', padding: '2px 8px', borderRadius: '4px', fontWeight: 'normal', border: '1px solid #333', } as React.CSSProperties,

    // New Timer Style (Redesigned & Decreased Size)
    timerBox: { padding: '3px 10px', borderRadius: '6px', backgroundColor: '#fff', border: '2px solid #333', boxShadow: '3px 3px 0px 0px #ccc', display: 'flex', alignItems: 'center' } as React.CSSProperties,
};

// --- Single Main Component ---
const ExamPage: React.FC = () => {
    // --- State and Data ---
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

    const totalQuestions = 30, examTitle = "Harvard maths inference exam (hard)";
    // Timer state (in seconds)
    const [timeElapsed, setTimeElapsed] = useState(0);
    // Convert seconds → MM:SS
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    React.useEffect(() => {
        const timer = setInterval(() => {
            setTimeElapsed(prev => prev + 1);   // Increment time
        }, 1000);

        return () => clearInterval(timer);    // Cleanup when component unmounts
    }, []);

    const questionData = { text: 'What is the value of the hardest math question $1+1=$?', options: [{ label: 'a', value: '1' }, { label: 'b', value: '2' }, { label: 'c', value: '3' }, { label: 'd', value: 'karkuzhali only knows' }], };

    // --- Handlers ---
    const handleAnswerSelect = setSelectedAnswer;

    const handleNavigate = (q: number) => {
        if (q >= 1 && q <= totalQuestions) {
            setCurrentQuestion(q);
            setSelectedAnswer(null); // Load saved answer in a real app
        }
    };


    const [startIndex, setStartIndex] = useState(0); // window start for question numbers
    const windowSize = 10; // how many numbers to show at a time

    const handlePrevious = () => {
        if (currentQuestion > 1) {
            const newQ = currentQuestion - 1;
            setCurrentQuestion(newQ);

            // Shift window left if needed
            if (newQ - 1 < startIndex) {
                setStartIndex(startIndex - 1);
            }
        }
    };

    const handleNext = () => {
        if (currentQuestion < totalQuestions) {
            const newQ = currentQuestion + 1;
            setCurrentQuestion(newQ);

            // Shift window right if needed
            if (newQ > startIndex + windowSize) {
                setStartIndex(startIndex + 1);
            }
        }
    };




    // --- Inline Helper Functions ---

    // Renders a single answer option
    const OptionRenderer: React.FC<OptionProps> = ({ label, value, isSelected, onSelect }) => {
        const [isHovered, setIsHovered] = useState(false);
        const s = styles;
        const common = { ...s.questionBox, padding: '15px', marginBottom: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', boxShadow: 'none', transition: 'all 0.2s ease-in-out', border: '1px solid #ddd', backgroundColor: '#fff' } as React.CSSProperties;
        const selected = isSelected ? { border: '2px solid #ffc107', backgroundColor: '#fffbe6', boxShadow: '0 0 5px rgba(255, 193, 7, 0.8)', } : {};
        const hover = isHovered && !isSelected ? s.optionHover : {};

        return (
            <div
                style={{ ...common, ...selected, ...hover }}
                onClick={() => onSelect(value)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <span style={{ width: '30px', fontWeight: 'bold', color: '#555' } as React.CSSProperties}>{label})</span>
                <span>{value}</span>
            </div>
        );
    };

    // Renders the Previous/Next buttons (large style, at the bottom)
    const ControlButtonRenderer: React.FC<{ children: React.ReactNode, onClick: () => void, isYellow: boolean }> = ({ children, onClick, isYellow }) => {
        const [isHovered, setIsHovered] = useState(false);
        const { button, yellowButton, whiteButton, yellowButtonHover, whiteButtonHover } = styles;
        const base = isYellow ? yellowButton : whiteButton;
        const hover = isYellow ? yellowButtonHover : whiteButtonHover;
        return (
            <button
                style={{ ...button, ...base, ...(isHovered && hover) }}
                onClick={onClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >{children}</button>
        );
    };

    // Renders the Question Navigation buttons (small, numbered style)
    const NavButtonRenderer: React.FC<{ num: number }> = ({ num }) => {
        const [isHovered, setIsHovered] = useState(false);
        const { button, yellowButton, whiteButton, yellowButtonHover, whiteButtonHover } = styles;
        const isCurrent = num === currentQuestion;
        const base = isCurrent ? yellowButton : whiteButton;
        const hover = isCurrent ? yellowButtonHover : whiteButtonHover;

        return (
            <button
                style={{ ...button, ...base, width: '40px', height: '40px', padding: 0, ...(isHovered && hover) }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => handleNavigate(num)}
            >{num}</button>
        );
    };

    // Renders the small Previous/Next arrow buttons for the navigation bar
    const NavArrowButtonRenderer: React.FC<{ direction: 'prev' | 'next' }> = ({ direction }) => {
        const [isHovered, setIsHovered] = useState(false);
        const isPrev = direction === 'prev';
        const isDisabled = isPrev ? currentQuestion === 1 : currentQuestion === totalQuestions;
        const onClick = isPrev ? handlePrevious : handleNext;
        const { button } = styles;

        const baseStyle: React.CSSProperties = { ...button, width: '40px', height: '40px', padding: 0, border: 'none', boxShadow: 'none', backgroundColor: 'transparent', opacity: isDisabled ? 0.5 : 1, cursor: isDisabled ? 'not-allowed' : 'pointer', color: '#555' };
        const hoverStyle: React.CSSProperties = { backgroundColor: '#e0e0e0', border: 'none', boxShadow: 'none' };

        return (
            <button
                style={{ ...baseStyle, ...(isHovered && !isDisabled && hoverStyle) }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => { if (!isDisabled) onClick(); }}
                disabled={isDisabled}
            >{isPrev ? '◀' : '▶'}</button>
        );
    };


    // --- Main Render Block ---
    const questionNumbers = Array.from({ length: totalQuestions }, (_, i) => i + 1);
    const [showEndPopup, setShowEndPopup] = useState(false);

    return (
        <div style={styles.pageContainer}>

            {/* 1. Header (Left: Title, Center: Timer Nudged Right, Right: End Practice) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', marginBottom: '18px' }}>

                {/* Left: Title */}
                <h1 style={{ fontSize: 'clamp(1.2em, 4vw, 1.5em)', fontWeight: 'bold', justifySelf: 'start' }}>{examTitle}</h1>

                {/* Center: Timer Box (Nudged right via marginLeft) */}
                <div style={{ justifySelf: 'center', marginLeft: '20px' }}>
                    <div style={styles.timerBox}>
                        <span role="img" aria-label="timer" style={{ fontSize: 'clamp(0.8em, 2.5vw, 1em)' }}>⏱️</span>
                        <span style={{ fontWeight: '900', color: '#d9534f', fontSize: 'clamp(0.8em, 2.5vw, 1em)' }}>{formatTime(timeElapsed)}
                        </span>
                    </div>
                </div>


                {/* Right: End Practice Button */}
                <button
                    onClick={() => setShowEndPopup(true)}
                    className="cursor-pointer py-3 px-5 rounded-lg font-semibold text-white bg-gradient-to-br from-[#e74c3c] to-[#c0392b] transition-transform duration-300 hover:shadow-lg hover:shadow-red-400/50"
                    style={{ justifySelf: 'end' }}
                >
                    End Exam
                </button>

                {showEndPopup && (
                    <EndExamPopup
                        onClose={() => setShowEndPopup(false)}            // Continue Exam
                        onQuit={() => {
                            // Navigate to End Exam page or route
                            console.log("Exam Ended");
                            // Example: if using react-router:
                            // navigate("/end-exam");
                        }}
                    />
                )}


            </div>

            {/* 2. Question Navbar (Centered with Prev/Next arrows) */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '30px', justifyContent: 'center' }}>
                <NavArrowButtonRenderer direction="prev" />
                {questionNumbers.slice(startIndex, startIndex + windowSize).map(num => (
                    <NavButtonRenderer key={num} num={num} />
                ))}

                <NavArrowButtonRenderer direction="next" />
            </div>

            {/* 3. Question Area */}
            <div style={styles.questionBox}>
                <p style={{ fontSize: '1.2em', fontWeight: 'normal', marginBottom: '20px' }}>
                    {currentQuestion}. {questionData.text}
                </p>

                {/* Options */}
                <div style={{ marginBottom: '35px' }}>
                    {questionData.options.map(option => (
                        <OptionRenderer
                            key={option.label}
                            label={option.label}
                            value={option.value}
                            isSelected={selectedAnswer === option.value}
                            onSelect={handleAnswerSelect}
                        />
                    ))}
                </div>

                {/* Controls */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <ControlButtonRenderer onClick={handlePrevious} isYellow={false}>Previous</ControlButtonRenderer>
                    <ControlButtonRenderer onClick={handleNext} isYellow={true}>Next</ControlButtonRenderer>
                </div>

                <p style={{ textAlign: 'center', fontSize: '0.9em' }}>
                    Question {currentQuestion}/{totalQuestions}
                </p>
            </div>

        </div>
    );
};

export default ExamPage;
