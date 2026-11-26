import { useEffect, useState } from "react";

const roles = [
    "Full Stack Web Developer",
    "Competitive Programmer",
    "Tech Consultant",
    "Web Designer",
];

export default function TypingEffect() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentText, setCurrentText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const typingSpeed = 100;
    const deletingSpeed = 60;
    const pauseBeforeDelete = 3000;
    const pauseBeforeNext = 1500;

    useEffect(() => {
        const fullText = roles[currentIndex];
        let timeout: NodeJS.Timeout;

        if (isDeleting) {
            timeout = setTimeout(() => {
                setCurrentText((prev) => prev.substring(0, prev.length - 1));
            }, deletingSpeed);
        } else {
            timeout = setTimeout(() => {
                setCurrentText((prev) => fullText.substring(0, prev.length + 1));
            }, typingSpeed);
        }

        if (!isDeleting && currentText === fullText) {
            timeout = setTimeout(() => setIsDeleting(true), pauseBeforeDelete);
        }

        if (isDeleting && currentText === "") {
            setIsDeleting(false);
            setCurrentIndex((prev) => (prev + 1) % roles.length);
            timeout = setTimeout(() => { }, pauseBeforeNext);
        }

        return () => clearTimeout(timeout);
    }, [currentText, isDeleting, currentIndex]);

    return (
        <div className="text-2xl font-medium !text-rose-500 dark:text-gray-400">
            <p>
                {currentText.split("").map((char, index) => (
                    <span
                        key={index}
                        className="fade-letter"
                        style={{
                            animationDelay: `${index * typingSpeed}ms`,
                            animationDuration: `${typingSpeed + 80}ms`,
                        }}
                    >
                        {char === " " ? '\u00A0' : char} {/* Non-breaking space */}
                    </span>
                ))}
                {isDeleting && <span className="blinking-cursor">|</span>}
            </p>
        </div>
    );
}
