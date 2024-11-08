import React, { useState } from "react";
import User from './perfil.png';
import { removeLocalStorage } from '../../utils/remove_localstorage';

export default function Header() {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const email = localStorage.getItem("EMAIL");

    const logout = () => {
        removeLocalStorage();
    };

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    return (
        <nav className="header-navbar">
            {/* Botón de menú lateral */}
            <div className="menu-icon">
                <a href="#/" className="menu-toggle">
                    <i className="fas fa-bars"></i>
                </a>
            </div>

            {/* Usuario y opciones */}
            <div className="user-menu">
                <a href="/" className="user-toggle" onClick={(e) => { e.preventDefault(); toggleDropdown(); }}>
                    <img src={User} alt="user" className="user-avatar" />
                    <span className="user-email">{email}</span>
                </a>
                {dropdownVisible && (
                    <div className="user-dropdown">
                        <a href="/" onClick={logout} className="user-dropdown-item">
                            <i className="fas fa-sign-out-alt"></i> Logout
                        </a>
                    </div>
                )}
            </div>
        </nav>
    );
}
