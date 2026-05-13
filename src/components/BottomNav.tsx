import { NavLink, useLocation } from "react-router-dom"

function BottomNav() {
    const location = useLocation();
    const pathname = location.pathname

    console.log(`Nome do caminho atual => ${pathname}`)

    const isCardsActive = 
        pathname === "/cards" ||
        /^\/decks\/[^/]+\/cards$/.test(pathname);
    
    const isNewCardActive =
        pathname === "/novo" ||
        pathname == "/cards/novo" ||
        /^\/decks\/[^/]+\/cards\/novo$/.test(pathname);

    return (

        <nav className="bottom-nav" aria-label="Menu inferior">
            <NavLink 
            to={"/"} 
            className={({isActive}) => 
            `nav-item ${isActive ? "active" : ""}`
            }  
            data-screen="screen-decks"
            >
            
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path 
                d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11Z" 
                stroke="currentColor" 
                strokeWidth={2} 
                />
                <path 
                d="M8 9h8M8 13h5" 
                stroke="currentColor" 
                strokeWidth={2} 
                strokeLinecap="round" 
                />
                </svg>
                Decks
            
            </NavLink>

            <NavLink 
            to={"/cards"}
            className={() =>
            `nav-item ${isCardsActive ? "active" : ""}`
            }  
            data-screen="screen-decks"
            >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path 
                d="M7 7.5h10M7 12h7M7 16.5h5" 
                stroke="currentColor" 
                strokeWidth={2}
                strokeLinecap="round" 
                />
                <path 
                d="M5.5 3.5h13A2.5 2.5 0 0 1 21 6v12a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18V6a2.5 2.5 0 0 1 2.5-2.5Z" 
                stroke="currentColor" 
                strokeWidth={2}
                />
                </svg>
                Cards
            </NavLink>

            <NavLink 
            to={"/novo"}
            className={() =>
            `nav-item ${isNewCardActive ? "active" : ""}`
            }  
            data-screen="screen-decks"
            >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path 
                d="M12 5v14M5 12h14" 
                stroke="currentColor" 
                strokeWidth={2.4} 
                strokeLinecap="round" 
                />
                </svg>
                Novo
            </NavLink>
        </nav>
    )
}

export default BottomNav