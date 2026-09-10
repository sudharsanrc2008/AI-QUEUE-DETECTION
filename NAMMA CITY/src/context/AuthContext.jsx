import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Role can be 'citizen' or 'admin'
  const [role, setRole] = useState(() => {
    return localStorage.getItem('namma_city_role') || 'citizen';
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('namma_city_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return {
      id: 'usr_001',
      name: 'Sundar Rajan',
      email: 'sundar.citizen@chennai.gov.in',
      phone: '+91 98401 23456',
      ward: 'Ward 102 (Anna Nagar)',
      role: 'citizen'
    };
  });

  useEffect(() => {
    localStorage.setItem('namma_city_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('namma_city_user', JSON.stringify(user));
  }, [user]);

  const switchRole = (newRole) => {
    setRole(newRole);
    if (newRole === 'admin') {
      setUser({
        id: 'adm_042',
        name: 'Er. K. Ramanathan',
        designation: 'Zonal Assistant Commissioner & Grievance Officer',
        email: 'ramanathan.ae@chennaicorporation.gov.in',
        phone: '044-25619223',
        ward: 'Zone 8 (Central Control)',
        role: 'admin'
      });
    } else {
      setUser({
        id: 'usr_001',
        name: 'Sundar Rajan',
        email: 'sundar.citizen@chennai.gov.in',
        phone: '+91 98401 23456',
        ward: 'Ward 102 (Anna Nagar)',
        role: 'citizen'
      });
    }
  };

  const loginCitizen = (userData) => {
    setRole('citizen');
    setUser({ ...userData, role: 'citizen' });
  };

  const loginAdmin = (officerData) => {
    setRole('admin');
    setUser({ ...officerData, role: 'admin' });
  };

  const logout = () => {
    switchRole('citizen');
  };

  return (
    <AuthContext.Provider value={{ role, user, switchRole, loginCitizen, loginAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
