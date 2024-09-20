import React from 'react';
import { SignIn } from '@clerk/clerk-react'; // Import the SignIn component
import './signInPage.css';

const SignInPage = () => {
  return (
    <div className='signInPage'>
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" forceRedirectUrl="/dashboard" />
    </div>
  );
};

export default SignInPage;
