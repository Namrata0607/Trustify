import React, { useState, useRef, useEffect } from 'react';

const AutocompleteInput = ({ 
  users, 
  selectedUser, 
  onUserSelect, 
  onNewUserRequest,
  placeholder = "Select a user",
  label = "Assigned to"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users || []);
  const [dropdownPosition, setDropdownPosition] = useState('below');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Filter users based on search term
  useEffect(() => {
    if (!users) return;
    
    // Filter to show only normal users (exclude admins) who can own stores
   const normalUsers = users.filter(user => user.role === 'USER' || !user.role);
    const filtered = normalUsers.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Check dropdown position when opening
  useEffect(() => {
    if (isOpen && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      // If there's not enough space below but enough above, show dropdown above
      if (spaceBelow < 200 && spaceAbove > 200) {
        setDropdownPosition('above');
      } else {
        setDropdownPosition('below');
      }
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpen(true);
    
    // If user clears the input, clear selection
    if (value === '') {
      onUserSelect(null);
    }
  };

  const handleUserSelect = (user) => {
    setSearchTerm(user.name);
    onUserSelect(user);
    setIsOpen(false);
  };

  const handleAddNewUser = () => {
    onNewUserRequest(searchTerm);
    setIsOpen(false);
  };

  const handleInputClick = () => {
    setIsOpen(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onClick={handleInputClick}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
        />
        
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-400 hover:text-gray-600"
        >
          <svg 
            className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Selected User Display */}
      {selectedUser && !isOpen && (
        <div className="mt-2 flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
            {selectedUser.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{selectedUser.name}</p>
            <p className="text-xs text-gray-600">{selectedUser.email}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              onUserSelect(null);
              setSearchTerm('');
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className={`absolute z-[9999] w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto ${
          dropdownPosition === 'above' ? 'bottom-full mb-1' : 'top-full mt-1'
        }`}>
          {filteredUsers.length > 0 ? (
            <>
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleUserSelect(user)}
                  className="w-full flex items-center p-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-600">{user.email}</p>
                  </div>
                </button>
              ))}
            </>
          ) : (
            <div className="p-4 text-center">
              <div className="text-gray-500 mb-3">
                <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="text-sm">No users found</p>
              </div>
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleAddNewUser}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm"
                >
                  Add "{searchTerm}" as new user
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AutocompleteInput;