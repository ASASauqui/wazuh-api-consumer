import './index.css';

import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

function Navbar() {
    const { user, logoutUser } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logoutUser();
    };

    const handleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            {/* <!-- Main navigation container --> */}
            <nav
                className="flex-no-wrap relative flex w-full items-center justify-between bg-zinc-50 py-2 shadow-dark-mild lg:flex-wrap lg:justify-start lg:py-4 px-4">
                <div className="flex w-full flex-wrap items-center justify-between px-3">
                    {/* <!-- Hamburger button for mobile view --> */}
                    <button
                        type="button"
                        onClick={handleMobileMenu}
                        className="block border-0 bg-transparent px-2 text-black/50 hover:no-underline hover:shadow-none focus:no-underline focus:shadow-none focus:outline-none focus:ring-0 lg:hidden">
                        {/* <!-- Hamburger icon --> */}
                        <span
                            className="[&>svg]:w-7 [&>svg]:stroke-black/50">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                                    clipRule="evenodd" />
                            </svg>
                        </span>
                    </button>

                    {/* <!-- Collapsible navigation container --> */}
                    <div
                        className={"flex-grow basis-[100%] items-center lg:!flex lg:basis-auto" + (isMobileMenuOpen ? "  visible" : " hidden")}>
                        {/* <!-- Logo --> */}
                        <a
                            className="mb-4 me-5 ms-2 mt-3 flex items-center text-neutral-900 hover:text-neutral-900 focus:text-neutral-900 lg:mb-0 lg:mt-0"
                            href="#">
                            <img
                                src="https://wazuh.com/uploads/2018/12/cropped-wazuh_blue_iso_big-1-180x180.png"
                                style={{ height: '30px' }}
                                alt="TE Logo"
                                loading="lazy" />
                        </a>
                        {/* <!-- Left navigation links --> */}
                        <ul
                            className="list-style-none me-auto flex flex-col ps-0 lg:flex-row">
                            <li className="mb-4 lg:mb-0 lg:pe-2">
                                {/* Home Link */}
                                <a
                                    className="text-black/60 transition duration-200 hover:text-black/80 hover:ease-in-out focus:text-black/80 active:text-black/80 motion-reduce:transition-none lg:px-2"
                                    href="/"
                                >
                                    Inicio
                                </a>
                            </li>
                        </ul>
                        {/* <!-- Left links --> */}
                    </div>

                    {/* <!-- Right elements --> */}
                    {user ? (
                        <div className="relative flex items-center gap-3">

                            {/* <!-- Second dropdown container --> */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="w-8 h-8 flex items-center justify-center whitespace-nowrap transition duration-150 ease-in-out motion-reduce:transition-none">
                                    {/* Red power icon */}
                                    <span className="w-full h-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor" className="w-full h-full">
                                            <path fill="none" d="M0 0h48v48H0z"></path>
                                            <path d="M20.17 31.17 23 34l10-10-10-10-2.83 2.83L25.34 22H6v4h19.34l-5.17 5.17zM38 6H10c-2.21 0-4 1.79-4 4v8h4v-8h28v28H10v-8H6v8c0 2.21 1.79 4 4 4h28c2.21 0 4-1.79 4-4V10c0-2.21-1.79-4-4-4z"></path>
                                        </svg>
                                    </span>
                                </button>
                            </div>

                        </div>
                    ) : (
                        <div className="relative flex items-center gap-2">
                            <a
                                className="text-neutral-600"
                                href="/login"
                            >
                                Iniciar Sesión
                            </a>
                        </div>
                    )}
                </div>
            </nav>
        </>
    );
}

export default Navbar;
