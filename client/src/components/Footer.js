import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-white border-t mt-auto">
            <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500">
                <p>&copy; {new Date().getFullYear()} Travel Itinerary Planner. Your adventure starts here.</p>
            </div>
        </footer>
    );
};

export default Footer;
