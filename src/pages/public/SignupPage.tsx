import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { Candidate, User } from "@/lib/types";
import { mockCandidates, mockUsers } from "@/lib/mock-data";

const SignupPage = () => {
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate" as "candidate" | "employer",
  });
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if email already exists
    const existingUser = users.find((u) => u.email === signupForm.email);
    if (existingUser) {
      toast({
        title: "Registration failed",
        description: "Email already exists",
      });
      return;
    }

    // Create new user
    const newUser: User = {
      id: `user${Date.now()}`,
      name: signupForm.name,
      email: signupForm.email,
      role: signupForm.role,
      avatar: "/api/placeholder/150/150",
      privacy: { phone: true, email: true },
      subscription: { plan: "Free" },
    };

    setUsers([...users, newUser]);

    // If employer, show onboarding
    if (signupForm.role === "employer") {
      setShowOnboarding(true);
    } else {
      // For candidates, create basic profile
      const newCandidate: Candidate = {
        id: `cand${Date.now()}`,
        userId: newUser.id,
        headline: "Looking for opportunities",
        skills: [],
        experience: [],
        education: [],
        cvs: [],
        savedJobs: [],
        followedCompanies: [],
        settings: { profileVisibility: true, jobAlerts: true },
        name: "",
        email: "",
        title: "",
        location: "",
        status: "active"
      };
      setCandidates([...candidates, newCandidate]);

      toast({
        title: "Registration successful",
        description: "Welcome to our platform!",
      });
      navigate("/candidate/dashboard");
    }
  };

  if (showOnboarding && signupForm.role === "employer") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Complete Your Employer Profile</CardTitle>
            <CardDescription>
              You'll be redirected to the company onboarding flow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => {
                toast({
                  title: "Registration successful",
                  description: "Welcome! Please complete your company setup.",
                });
                navigate("/employer/company");
              }}
              className="w-full"
            >
              Continue to Company Setup
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Join our recruitment platform</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={signupForm.name}
                onChange={(e) =>
                  setSignupForm({ ...signupForm, name: e.target.value })
                }
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={signupForm.email}
                onChange={(e) =>
                  setSignupForm({ ...signupForm, email: e.target.value })
                }
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={signupForm.password}
                onChange={(e) =>
                  setSignupForm({ ...signupForm, password: e.target.value })
                }
                placeholder="Create a password"
                required
              />
            </div>
            <div>
              <Label>I am a:</Label>
              <RadioGroup
                value={signupForm.role}
                onValueChange={(value) =>
                  setSignupForm({
                    ...signupForm,
                    role: value as "candidate" | "employer",
                  })
                }
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="candidate" id="candidate" />
                  <Label htmlFor="candidate">Job Seeker / Candidate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="employer" id="employer" />
                  <Label htmlFor="employer">Employer / Recruiter</Label>
                </div>
              </RadioGroup>
            </div>
            <Button type="submit" className="w-full">
              Create Account
            </Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;
