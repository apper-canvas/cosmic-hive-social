import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from '@/layouts/Root';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { cn } from '@/utils/cn';

const AuthModal = ({ isOpen, onClose, defaultTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const { user } = useSelector(state => state.user);
  const { isInitialized } = useAuth();

  // Close modal when user becomes authenticated
  useEffect(() => {
    if (user && isOpen) {
      onClose();
    }
  }, [user, isOpen, onClose]);

  // Initialize ApperUI when modal opens and SDK is ready
  useEffect(() => {
    if (isOpen && isInitialized && !user) {
      const { ApperUI } = window.ApperSDK;
      if (activeTab === 'login') {
        ApperUI.showLogin("#auth-modal-content");
      } else {
        ApperUI.showSignup("#auth-modal-content");
      }
    }
  }, [isOpen, isInitialized, activeTab, user]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (isInitialized && !user) {
      const { ApperUI } = window.ApperSDK;
      if (tab === 'login') {
        ApperUI.showLogin("#auth-modal-content");
      } else {
        ApperUI.showSignup("#auth-modal-content");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-gray-900">
              Join the Community
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Create a free account to participate in discussions
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Community Guidelines Banner */}
        <div className="bg-primary/5 border-l-4 border-primary p-4 m-6 rounded-r-lg">
          <div className="flex items-start space-x-3">
            <ApperIcon name="Users" className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-primary mb-1">
                Community Guidelines
              </h3>
              <p className="text-sm text-gray-700">
                By joining, you agree to be respectful, follow community rules, and help create a positive environment for everyone.
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6">
          <nav className="flex space-x-4 border-b border-gray-200">
            <button
              onClick={() => handleTabChange('login')}
              className={cn(
                "py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === 'login'
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              Sign In
            </button>
            <button
              onClick={() => handleTabChange('signup')}
              className={cn(
                "py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === 'signup'
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              Sign Up
            </button>
          </nav>
        </div>

        {/* Auth Content */}
        <div className="p-6">
          <div className="text-center mb-4">
            <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center bg-gradient-to-r from-primary to-primary/80 text-white text-xl font-bold mb-3">
              H
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {activeTab === 'login' ? 'Welcome back!' : 'Join Hive Social'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {activeTab === 'login' 
                ? 'Sign in to continue participating in discussions'
                : 'Create your free account to start participating'
              }
            </p>
          </div>

          {/* ApperUI will render the auth form here */}
          <div id="auth-modal-content" />
          
          {/* Additional messaging for signup */}
          {activeTab === 'signup' && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <ApperIcon name="Shield" className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">
                    Safe & Secure
                  </h4>
                  <p className="text-xs text-gray-600">
                    Your account is free and secure. We protect your privacy and never share your data without permission.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-lg border-t border-gray-200">
          <p className="text-xs text-center text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;