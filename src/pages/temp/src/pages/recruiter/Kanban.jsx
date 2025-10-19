import React, { useState } from "react";
import { Search, Filter, FileText } from "lucide-react";
import { mockCandidates, mockJobs, mockPipelines } from "../../data/mockData";

const Kanban = ({ onSelectCandidate }) => {
  const [selectedJob] = useState(mockJobs[0]);
  const [filterText, setFilterText] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterScore, setFilterScore] = useState("all");
  const [draggedCandidate, setDraggedCandidate] = useState(null);

  const stages = ["Screening", "Technical Interview", "Team Interview", "Offer"];

  const getCandidatesByStage = (stageIdx) => {
    let filtered = mockCandidates.filter((c) => c.stage === stageIdx);

    if (filterText) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(filterText.toLowerCase()) ||
          c.email.toLowerCase().includes(filterText.toLowerCase())
      );
    }

    if (filterScore !== "all") {
      if (filterScore === "90+")
        filtered = filtered.filter((c) => c.matchScore >= 90);
      else if (filterScore === "80-89")
        filtered = filtered.filter(
          (c) => c.matchScore >= 80 && c.matchScore < 90
        );
      else if (filterScore === "<80")
        filtered = filtered.filter((c) => c.matchScore < 80);
    }

    return filtered;
  };

  const handleDragStart = (candidate) => {
    setDraggedCandidate(candidate);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (stageIdx) => {
    if (draggedCandidate) {
      console.log(`Moving ${draggedCandidate.name} to stage ${stageIdx}`);
      setDraggedCandidate(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {selectedJob.title}
              </h1>
              <p className="text-gray-600">
                Pipeline:{" "}
                {mockPipelines.find((p) => p.id === selectedJob.pipelineId)?.name} •{" "}
                {mockCandidates.length} total candidates
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <FileText size={18} />
                Export
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Search candidates by name or email..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50"
            >
              <Filter size={20} />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-white rounded-lg border">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Match Score
                  </label>
                  <select
                    value={filterScore}
                    onChange={(e) => setFilterScore(e.target.value)}
                    className="w-full border rounded p-2"
                  >
                    <option value="all">All scores</option>
                    <option value="90+">90% and above</option>
                    <option value="80-89">80-89%</option>
                    <option value="<80">Below 80%</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Experience Level
                  </label>
                  <select className="w-full border rounded p-2">
                    <option>All levels</option>
                    <option>Entry Level</option>
                    <option>Mid Level</option>
                    <option>Senior</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Applied Date
                  </label>
                  <select className="w-full border rounded p-2">
                    <option>All time</option>
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map((stage, stageIdx) => (
            <div
              key={stageIdx}
              className="flex-shrink-0 w-80"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(stageIdx)}
            >
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-lg p-4 text-white">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{stage}</span>
                  <span className="bg-white bg-opacity-30 px-2 py-1 rounded text-sm">
                    {getCandidatesByStage(stageIdx).length}
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-b-lg p-4 space-y-3 min-h-96">
                {getCandidatesByStage(stageIdx).map((candidate) => (
                  <div
                    key={candidate.id}
                    draggable
                    onDragStart={() => handleDragStart(candidate)}
                    onClick={() => onSelectCandidate(candidate)}
                    className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-lg transition transform hover:-translate-y-1"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-semibold">
                        {candidate.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {candidate.name}
                        </h4>
                        <p className="text-sm text-gray-600 truncate">
                          {candidate.email}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600 font-medium">
                          Match Score
                        </span>
                        <span
                          className={`text-sm font-bold ${
                            candidate.matchScore >= 90
                              ? "text-green-600"
                              : candidate.matchScore >= 80
                              ? "text-blue-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {candidate.matchScore}%
                        </span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            candidate.matchScore >= 90
                              ? "bg-green-600"
                              : candidate.matchScore >= 80
                              ? "bg-blue-600"
                              : "bg-yellow-600"
                          }`}
                          style={{ width: `${candidate.matchScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {getCandidatesByStage(stageIdx).length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <p className="text-sm">No candidates in this stage</p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Terminal Stages */}
          <div className="flex-shrink-0 w-80">
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-t-lg p-4 text-white">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Hired</span>
                <span className="bg-white bg-opacity-30 px-2 py-1 rounded text-sm">
                  0
                </span>
              </div>
            </div>
            <div className="bg-green-50 rounded-b-lg p-4 min-h-96">
              <div className="text-center py-8 text-gray-400">
                <p className="text-sm">No hired candidates yet</p>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 w-80">
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-t-lg p-4 text-white">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Rejected</span>
                <span className="bg-white bg-opacity-30 px-2 py-1 rounded text-sm">
                  0
                </span>
              </div>
            </div>
            <div className="bg-red-50 rounded-b-lg p-4 min-h-96">
              <div className="text-center py-8 text-gray-400">
                <p className="text-sm">No rejected candidates</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kanban;