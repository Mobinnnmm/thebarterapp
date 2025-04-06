"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../../../context/AuthContext"
import React from "react";

export default function VerifyEmail() {
    const router = useRouter();
    const { tempUserInfo, register, clearTempUserInfo } = useAuth();
    
    const [initialEmailSent, setInitialEmailSent] = useState(false);
    
    const [generatedCode, setGeneratedCode] = useState('');
    const [inputCode, setInputCode] = useState('');
    const [verificationResult, setVerificationResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [emailStatus, setEmailStatus] = useState(null);
    const [resendDisabled, setResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(0);


    // Countdown timer for resend button
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0 && resendDisabled) {
            setResendDisabled(false);
        }
    }, [countdown, resendDisabled]);

    const generateAndSendCode = async () => {
        if (!tempUserInfo?.email) {
            setEmailStatus({
                success: false,
                message: "Email address is missing"
            });
            return;
        }

        setIsLoading(true);
        setEmailStatus(null);
        setResendDisabled(true);
        setCountdown(60); // 60 second cooldown

        try {
            // Generate a random code
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
            let result = '';
            for (let i = 0; i < 6; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            
            // Format as XX000-XX0
            const formattedCode = `${result.substring(0, 2)}${result.substring(2, 5)}-${result.substring(5, 7)}`;
            setGeneratedCode(formattedCode);
            setVerificationResult(null);

            // Send the email with verification code
            const response = await fetch('/api/email/email-verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: tempUserInfo.email,
                    code: formattedCode,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setEmailStatus({
                    success: true,
                    message: "Verification code sent to your email!"
                });
            } else {
                throw new Error(data.error || 'Failed to send email');
            }

        } catch (error) {
            console.error('Error sending verification email:', error);
            setEmailStatus({
                success: false,
                message: `Failed to send email: ${error.message}`
            });
            setResendDisabled(false);
            setCountdown(0);
        } finally {
            setIsLoading(false);
        }
    }

    const verifyCode = () => {
        if (!generatedCode) {
            setVerificationResult({
                success: false,
                message: "No verification code has been generated."
            });
            return;
        }

        const isMatch = inputCode.trim() === generatedCode;
        setVerificationResult({
            success: isMatch,
            message: isMatch ? "Success! Code Verified!" : "Verification failed, code doesn't match"
        });
    }

    const handleSendEmail = async () => {
        generateAndSendCode();
        setInitialEmailSent(true);

    }

    const handleRegister = async (e) => {
        e.preventDefault();
        
        if (!verificationResult?.success) {
            setVerificationResult({
                success: false,
                message: "Please verify your email first"
            });
            return;
        }
        
        setIsLoading(true);
        
        try {
            const { username, email, password } = tempUserInfo;
            await register(username, email, password);
            
            // Clear the pending registration data after successful registration
            clearTempUserInfo();
            
            router.push("/profile/setup");
        } catch (err) {
            setVerificationResult({
                success: false,
                message: err.message || "Registration failed"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleError = async () => {
        router.push("/auth/register")
    }

    // If no email is loaded yet, show a loading state
    if (!tempUserInfo?.email) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                    <p className="text-gray-700 dark:text-gray-300">There is a problem with email verification</p>
                    <button 
                    className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition-colors"
                    onClick={handleError}>Go back to register</button>
                </div>
            </div>
        );
    }

    return (
            <div>
        { !initialEmailSent ? (
            <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                    <button
                    className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition-colors"
                    onClick={handleSendEmail}>Receive Verification Email</button>
                </div>
            </div>
        ) : (

            <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Email Verification</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    We&apos;ve sent a verification code to <span className="font-medium">{tempUserInfo.email}</span>
                </p>
                {/* Email status message */}
                {emailStatus && (
                    <div className={`p-3 rounded-lg mb-4 ${
                        emailStatus.success 
                            ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400" 
                            : "bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400"
                    }`}>
                        {emailStatus.message}
                    </div>
                )}


                <div className="space-y-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Enter Verification Code
                        </label>
                        <input
                            type="text"
                            className="w-full rounded-lg px-4 py-3 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 dark:bg-gray-700 transition-all"
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value)}
                            placeholder="XX000-XX0"
                        />
                    </div>

                    <button
                        onClick={verifyCode}
                        className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition-colors"
                        disabled={isLoading}
                    >
                        Verify Code
                    </button>

                    {/* Verification result message */}
                    {verificationResult && (
                        <div className={`p-3 rounded-lg ${
                            verificationResult.success 
                                ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400" 
                                : "bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400"
                        }`}>
                            {verificationResult.message}
                        </div>
                    )}
                </div>

                <div className="flex flex-col space-y-4">
                    <button
                        onClick={handleRegister}
                        className={`w-full py-3 rounded-lg transition-colors ${
                            verificationResult?.success
                                ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                                : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                        disabled={!verificationResult?.success || isLoading}
                    >
                        {isLoading ? "Creating Account..." : "Complete Registration"}
                    </button>

                    <div className="text-center">
                        <button
                            onClick={generateAndSendCode}
                            disabled={resendDisabled || isLoading}
                            className="text-purple-500 hover:text-purple-600 dark:text-purple-400 text-sm font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                            {resendDisabled 
                                ? `Resend code in ${countdown}s` 
                                : "Didn't receive the code? Resend"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        )}
        </div>
       
    );
}