import { createContext, useContext, useState } from 'react'

const ScrollContext = createContext({ scrolled: false, setScrolled: () => { } })

export function ScrollProvider({ children }) {
    const [scrolled, setScrolled] = useState(false)
    return (
        <ScrollContext.Provider value={{ scrolled, setScrolled }}>
            {children}
        </ScrollContext.Provider>
    )
}

export function useScroll() {
    return useContext(ScrollContext)
}