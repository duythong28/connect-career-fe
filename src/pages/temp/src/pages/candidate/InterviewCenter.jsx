import React, { useState } from "react";
import { Calendar, Clock, User, Check, X } from "lucide-react";
import { mockInterviews } from "../../data/mockData";

const InterviewCenter = () => {
  const [showMockInterview, setShowMockInterview] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Interview Center</h1>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* AI Mock Interview */}
          <div
            onClick={() => setShowMockInterview(true)}
            className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg shadow-lg p-8 text-white cursor-pointer hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-4xl">🤖</span>
              </div>
              <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs font-semibold">
                BETA
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-3">AI Mock Interview</h2>
            <p className="mb-6 opacity-90">
              Practice with AI-powered interview simulation tailored to your role
            </p>
            <div className="space-y-2 mb-6 text-sm opacity-90">
              <div className="flex items-center gap-2">
                <Check size={16} />
                <span>Real-time feedback</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={16} />
                <span>Custom question sets</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={16} />
                <span>Performance analytics</span>
              </div>
            </div>
            <button className="w-full px-6 py-3 bg-white text-purple-700 rounded-lg font-semibold hover:bg-gray-100 transition">
              Start Practice Session
            </button>
          </div>

          {/* Schedule Overview */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-lg p-8 text-white">
            <div className="flex items-start justify-between mb-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Calendar size={32} />
              </div>
              <span className="text-3xl font-bold">{mockInterviews.length}</span>
            </div>
            <h2 className="text-2xl font-bold mb-3">Upcoming Interviews</h2>
            <p className="mb-6 opacity-90">
              You have {mockInterviews.length} interviews scheduled
            </p>
            <button className="w-full px-6 py-3 bg-white text-blue-700 rounded-lg font-semibold hover:bg-gray-100 transition">
              View Full Calendar
            </button>
          </div>
        </div>

        {/* Upcoming Interviews List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Scheduled Interviews</h2>
          </div>
          <div className="divide-y">
            {mockInterviews.map((interview) => (
              <div key={interview.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {interview.position}
                      </h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {interview.type}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{interview.company}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{interview.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>{interview.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        <span>{interview.interviewer}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                      Join Meeting
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
                      Reschedule
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mock Interview Modal */}
        {showMockInterview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="text-2xl font-bold">AI Mock Interview Setup</h3>
                <button
                  onClick={() => setShowMockInterview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Role
                  </label>
                  <select className="w-full border rounded-lg p-3">
                    <option>Frontend Developer</option>
                    <option>Backend Developer</option>
                    <option>Full Stack Developer</option>
                    <option>Product Manager</option>
                    <option>UX Designer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interview Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="p-4 border-2 border-blue-600 bg-blue-50 rounded-lg text-left">
                      <div className="font-semibold text-blue-900">Technical</div>
                      <div className="text-sm text-blue-700">
                        Coding & problem solving
                      </div>
                    </button>
                    <button className="p-4 border-2 border-gray-300 rounded-lg text-left hover:border-blue-300">
                      <div className="font-semibold text-gray-900">Behavioral</div>
                      <div className="text-sm text-gray-600">
                        STAR method questions
                      </div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level
                  </label>
                  <div className="flex gap-2">
                    {["Easy", "Medium", "Hard"].map((level) => (
                      <button
                        key={level}
                        className="flex-1 py-2 border-2 border-gray-300 rounded-lg hover:border-blue-300 font-medium"
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <button className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold">
                    Start Mock Interview
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewCenter;