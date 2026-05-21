import { useState, useEffect } from "react";

export function useHideOnScroll(offset = 80) {
    const [visible, setVisible] = useState(true)

    useEffect(() => {
        let lastScrollY = window.scrollY;

        function handleScroll() {
        const currentScrollY = window.scrollY;

        const scrollingDown = currentScrollY > lastScrollY;
        const passedOffset = currentScrollY > offset;

        if (scrollingDown && passedOffset) {
            setVisible(false);
        } else {
            setVisible(true);
        }

        lastScrollY = currentScrollY;
        }

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [offset]);

    return visible
}