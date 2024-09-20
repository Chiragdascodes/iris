import React from 'react';
import { SignUp } from '@clerk/clerk-react'; // Import the SignUp component
import './signUpPage.css';

const SignUpPage = () => {
  return (
    <div className='signUpPage'>
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" /> {/* Configure routing */}
    </div>
  );
};

export default SignUpPage;
