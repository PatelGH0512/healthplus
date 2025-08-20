"use client";

import { useState } from "react";

import {
  Navbar,
  NavbarButton,
  NavbarLogo,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
} from "@/components/ui/resizable-navbar";

interface NavigationProps {
  userId?: string;
}

export const Navigation = ({ userId }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", link: "/" },
    {
      name: "Appointments",
      link: userId ? `/patients/${userId}/new-appointment` : "/appointments",
    },
    {
      name: "Profile",
      link: userId ? `/patients/${userId}/profile` : "/profile",
    },
  ];

  return (
    <div className="shrink-0 pt-6">
      {/* Desktop Navigation */}
      <Navbar>
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <NavbarButton>Login</NavbarButton>
        </NavBody>
      </Navbar>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>
        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          <NavItems
            items={navItems}
            onItemClick={() => setIsMobileMenuOpen(false)}
          />
          <NavbarButton>Login</NavbarButton>
        </MobileNavMenu>
      </MobileNav>
    </div>
  );
};
