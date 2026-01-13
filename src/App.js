import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  Target, 
  DollarSign, 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  Search, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  LayoutDashboard,
  X,
  Save,
  Minus,
  Edit2,
  Trash2,
  HelpCircle
} from 'lucide-react';

// --- Mock Data ---

const INITIAL_SKILLS = [
  { 
    id: 's1', 
    name: 'Amazon PL Strategy', 
    function: 'Amazon PL', 
    category: 'Technical', 
    levels: {
      L1: 'Understand basic PL concepts and navigation.',
      L2: 'Execute standard PL strategies independently.',
      L3: 'Develop custom strategies for complex accounts.',
      L4: 'Thought leadership and industry innovation.'
    }
  },
  { 
    id: 's2', 
    name: 'Data Analysis (SQL/Excel)', 
    function: 'Analytics', 
    category: 'Technical', 
    levels: {
      L1: 'Basic VLOOKUP and pivot tables.',
      L2: 'Complex formulas and basic data visualization.',
      L3: 'SQL querying and automated dashboarding.',
      L4: 'Predictive modeling and data architecture.'
    }
  },
  { 
    id: 's3', 
    name: 'Client Communication', 
    function: 'Client Success', 
    category: 'Communication', 
    levels: {
      L1: 'Professional email etiquette and updates.',
      L2: 'Lead weekly calls and handle basic objections.',
      L3: 'Strategic quarterly business reviews (QBRs).',
      L4: 'Negotiate contracts and handle crisis comms.'
    }
  },
  {
    id: 's4', 
    name: 'Project Management', 
    function: 'Operations', 
    category: 'Process',
    levels: {
        L1: 'Manage own tasks in Asana/Jira.',
        L2: 'Manage small project timelines.',
        L3: 'Cross-functional project leadership.',
        L4: 'Program management across the org.'
    }
  },
  {
    id: 's5', 
    name: 'TikTok Shop Strategy', 
    function: 'TikTok Shop', 
    category: 'Technical', 
    levels: {
        L1: 'Product listing and basic shop navigation.',
        L2: 'Affiliate outreach and content planning.',
        L3: 'Viral campaign strategy and GMV optimization.',
        L4: 'Cross-platform brand dominance and studio mgmt.'
    }
  }
];

const INITIAL_ROLES = [
  {
    id: 'r_coo',
    title: 'COO',
    level: 'L4',
    requirements: [
      { skillId: 's1', requiredLevel: 4, priority: 'Must-have' },
      { skillId: 's4', requiredLevel: 4, priority: 'Must-have' },
      { skillId: 's3', requiredLevel: 4, priority: 'Strong' },
    ]
  },
  {
    id: 'r_ops',
    title: 'Operations (Amazon + TikTok)',
    level: 'L3',
    requirements: [
      { skillId: 's4', requiredLevel: 3, priority: 'Must-have' },
      { skillId: 's1', requiredLevel: 2, priority: 'Strong' },
      { skillId: 's5', requiredLevel: 2, priority: 'Strong' },
    ]
  },
  {
    id: 'r_prod',
    title: 'Product Sourcing / PM',
    level: 'L2',
    requirements: [
      { skillId: 's1', requiredLevel: 3, priority: 'Must-have' },
      { skillId: 's2', requiredLevel: 2, priority: 'Must-have' },
      { skillId: 's4', requiredLevel: 2, priority: 'Nice-to-have' },
    ]
  },
  {
    id: 'r_tiktok',
    title: 'TikTok Lead',
    level: 'L2',
    requirements: [
      { skillId: 's5', requiredLevel: 3, priority: 'Must-have' },
      { skillId: 's3', requiredLevel: 2, priority: 'Strong' },
      { skillId: 's2', requiredLevel: 1, priority: 'Nice-to-have' },
    ]
  }
];

const INITIAL_STAFF = [
  {
    id: 'st1',
    name: 'Ayman',
    roleId: 'r_coo', 
    assessments: [
      { skillId: 's1', currentLevel: 4, evidence: 'Defined 2024 strategic roadmap.' },
      { skillId: 's4', currentLevel: 4, evidence: 'Company-wide system implementation.' }, 
      { skillId: 's3', currentLevel: 4, evidence: 'Manages key investor relations.' }
    ]
  },
  {
    id: 'st2',
    name: 'Osama',
    roleId: 'r_ops', 
    assessments: [
      { skillId: 's4', currentLevel: 3, evidence: 'Managing cross-functional team workflows.' },
      { skillId: 's1', currentLevel: 2, evidence: 'Handles Amazon logistics smoothly.' },
      { skillId: 's5', currentLevel: 1, evidence: 'Learning TikTok Shop basics.' }
    ]
  },
  {
    id: 'st3',
    name: 'Shumaila',
    roleId: 'r_prod', 
    assessments: [
      { skillId: 's1', currentLevel: 2, evidence: 'Solid sourcing, needs more PL strategy.' },
      { skillId: 's2', currentLevel: 2, evidence: 'Excellent margin analysis sheets.' },
      { skillId: 's4', currentLevel: 2, evidence: 'Good timeline management.' }
    ]
  },
  {
    id: 'st4',
    name: 'Hanan',
    roleId: 'r_tiktok', 
    assessments: [
      { skillId: 's5', currentLevel: 3, evidence: 'Consistent GMV growth on TikTok.' },
      { skillId: 's3', currentLevel: 2, evidence: 'Handles creator comms well.' },
      { skillId: 's2', currentLevel: 1, evidence: 'Tracking basic metrics.' }
    ]
  }
];

const INITIAL_COMP = [
  { roleId: 'r_coo', min: 1800, max: 2500, currency: 'USD' },
  { roleId: 'r_ops', min: 750, max: 1000, currency: 'USD' },
  { roleId: 'r_prod', min: 350, max: 500, currency: 'USD' },
  { roleId: 'r_tiktok', min: 350, max: 500, currency: 'USD' },
];

// --- Helper Components ---

const LevelBadge = ({ level }) => {
  const colors = {
    0: 'bg-gray-100 text-gray-500',
    1: 'bg-blue-100 text-blue-700',
    2: 'bg-purple-100 text-purple-700',
    3: 'bg-orange-100 text-orange-700',
    4: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-bold ${colors[level] || colors[0]}`}>
      L{level}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const colors = {
    'Must-have': 'text-red-600 bg-red-50 border border-red-100',
    'Strong': 'text-blue-600 bg-blue-50 border border-blue-100',
    'Nice-to-have': 'text-gray-600 bg-gray-50 border border-gray-100',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[priority]}`}>
      {priority}
    </span>
  );
};

// Generic Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-slate-100">
          <h3 className="font-bold text-lg text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full text-slate-500">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- Main Application ---

export default function SkillsOS() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Data State
  const [skills, setSkills] = useState(INITIAL_SKILLS);
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [staff, setStaff] = useState(INITIAL_STAFF);
  const [comp, setComp] = useState(INITIAL_COMP);

  // UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null); // If set, modal is for editing this role
  const [notification, setNotification] = useState(null);

  // Helper Functions
  const getRoleById = (id) => roles.find(r => r.id === id);
  const getSkillById = (id) => skills.find(s => s.id === id);
  const getCompByRoleId = (id) => comp.find(c => c.roleId === id);

  const showNotification = (msg) => {
      setNotification(msg);
      setTimeout(() => setNotification(null), 3000);
  };

  // --- Actions ---

  const handleAddSkill = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newSkill = {
      id: `s${Date.now()}`,
      name: formData.get('name'),
      function: formData.get('function'),
      category: formData.get('category'),
      levels: {
        L1: formData.get('l1'),
        L2: formData.get('l2'),
        L3: formData.get('l3'),
        L4: formData.get('l4'),
      }
    };
    setSkills([...skills, newSkill]);
    setIsSkillModalOpen(false);
    showNotification(`Skill "${newSkill.name}" added to library.`);
  };

  const handleUpdateAssessment = (staffId, skillId, newLevel) => {
    setStaff(prevStaff => prevStaff.map(person => {
      if (person.id !== staffId) return person;
      
      const exists = person.assessments.find(a => a.skillId === skillId);
      let newAssessments;
      
      if (exists) {
        newAssessments = person.assessments.map(a => 
          a.skillId === skillId ? { ...a, currentLevel: newLevel } : a
        );
      } else {
        newAssessments = [...person.assessments, { skillId, currentLevel: newLevel, evidence: 'Manual update' }];
      }
      
      return { ...person, assessments: newAssessments };
    }));
  };

  const handleSaveRole = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Update Compensation Logic
    if (editingRole) {
        const newMin = parseFloat(formData.get('compMin'));
        const newMax = parseFloat(formData.get('compMax'));
        const newCurrency = formData.get('compCurrency');

        // Update comp state
        setComp(prevComp => {
            const exists = prevComp.find(c => c.roleId === editingRole.id);
            if (exists) {
                return prevComp.map(c => 
                    c.roleId === editingRole.id ? { ...c, min: newMin, max: newMax, currency: newCurrency } : c
                );
            } else {
                return [...prevComp, { roleId: editingRole.id, min: newMin, max: newMax, currency: newCurrency }];
            }
        });
        
        // Note: Logic to update requirements array would go here in a full DB implementation
        // For this UI demo, we focus on the compensation update as requested
    }

    showNotification("Role & Compensation updated successfully.");
    setIsRoleModalOpen(false);
    setEditingRole(null);
  };

  // --- Views ---

  const GuidelinesView = () => (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">📘 Skills OS: User Manual</h1>
        <p className="text-slate-600 text-lg leading-relaxed">
          **Skills OS** is your organization's single source of truth for talent management. It replaces static spreadsheets with a dynamic system that links four critical databases: Skills, Roles, Staff Assessments, and Compensation.
        </p>
      </div>

      {/* Quick Dashboard Guide */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200">
           <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
             <LayoutDashboard size={18} className="text-blue-500" /> Reading the Dashboard
           </h3>
           <ul className="space-y-3 text-sm text-slate-600">
             <li className="flex items-start gap-2">
               <span className="font-bold text-slate-700 whitespace-nowrap">Skills Library:</span>
               <span>Total unique competencies. Keep this lean to avoid duplicates.</span>
             </li>
             <li className="flex items-start gap-2">
               <span className="font-bold text-slate-700 whitespace-nowrap">Role Matrix:</span>
               <span>Distinct roles defined (Position + Level).</span>
             </li>
             <li className="flex items-start gap-2">
               <span className="font-bold text-slate-700 whitespace-nowrap">Data Points:</span>
               <span>Total individual skill ratings. Low numbers indicate "blind spots."</span>
             </li>
           </ul>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h3 className="font-bold text-blue-900 mb-3">Operating Standard Status</h3>
            <p className="text-sm text-blue-800 mb-4">
                The blue section on the dashboard alerts you to overdue tasks (Action Items) and reminds you of core principles (e.g., "Review compensation within 7 days of changing role requirements").
            </p>
        </div>
      </div>

      {/* Step by Step */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">How to Use the System (Step-by-Step)</h2>
        <div className="grid md:grid-cols-2 gap-6">
            
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5"><BookOpen size={100} /></div>
                <div className="relative z-10">
                    <div className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">Step 1</div>
                    <h3 className="font-bold text-lg text-slate-800 mb-2">Define Your Skills</h3>
                    <p className="text-sm text-slate-600 mb-4">Use the <strong>Skills Matrix</strong> tab to maintain definitions.</p>
                    <div className="bg-slate-50 p-3 rounded text-xs text-slate-500 space-y-1">
                        <p><strong>L1 (Novice):</strong> Needs supervision.</p>
                        <p><strong>L2 (Competent):</strong> Independent execution.</p>
                        <p><strong>L3 (Advanced):</strong> Troubleshoots & teaches.</p>
                        <p><strong>L4 (Expert):</strong> Strategic innovation.</p>
                    </div>
                </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5"><Target size={100} /></div>
                <div className="relative z-10">
                    <div className="text-xs font-bold text-purple-600 uppercase tracking-wide mb-1">Step 2</div>
                    <h3 className="font-bold text-lg text-slate-800 mb-2">Set Role Expectations</h3>
                    <p className="text-sm text-slate-600 mb-4">Use the <strong>Position Req</strong> tab to create target profiles.</p>
                    <ul className="text-xs text-slate-600 space-y-2">
                        <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-400"></div> <strong>Must-have:</strong> Non-negotiable.</li>
                        <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-400"></div> <strong>Strong:</strong> Highly desired.</li>
                        <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-300"></div> <strong>Nice-to-have:</strong> Useful bonus.</li>
                    </ul>
                </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5"><Users size={100} /></div>
                <div className="relative z-10">
                    <div className="text-xs font-bold text-green-600 uppercase tracking-wide mb-1">Step 3</div>
                    <h3 className="font-bold text-lg text-slate-800 mb-2">Assess Your Team</h3>
                    <p className="text-sm text-slate-600 mb-4">Use <strong>Staff Assessments</strong> to find the gaps.</p>
                    <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                            <span className="text-green-600 font-bold flex items-center"><CheckCircle size={14} className="mr-1"/> Ready:</span>
                            Current Level ≥ Required.
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-red-600 font-bold flex items-center"><TrendingUp size={14} className="mr-1"/> Gap:</span>
                            Current Level is lower than Required. Focus training here.
                        </div>
                    </div>
                </div>
            </div>

             {/* Step 4 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5"><DollarSign size={100} /></div>
                <div className="relative z-10">
                    <div className="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-1">Step 4</div>
                    <h3 className="font-bold text-lg text-slate-800 mb-2">Compensation & Pathing</h3>
                    <p className="text-sm text-slate-600 mb-3">
                        Compensation bands are visible on Role cards and Assessment headers.
                    </p>
                    <div className="bg-yellow-50 border border-yellow-100 p-3 rounded text-xs text-yellow-800">
                        <strong>Rule:</strong> If you increase a "Must-have" requirement from L2 to L3, you are raising the bar. You must review the Compensation Band.
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Cadence */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
         <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-700">Maintenance Cadence</div>
         <table className="w-full text-sm text-left">
            <thead className="text-slate-500 font-medium border-b border-slate-100">
                <tr>
                    <th className="p-4">Frequency</th>
                    <th className="p-4">Action</th>
                    <th className="p-4">Owner</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                <tr>
                    <td className="p-4 font-bold text-slate-700">Monthly</td>
                    <td className="p-4 text-slate-600">Update staff assessments (focus on Must-haves).</td>
                    <td className="p-4 text-slate-500">Manager</td>
                </tr>
                <tr>
                    <td className="p-4 font-bold text-slate-700">Quarterly</td>
                    <td className="p-4 text-slate-600">Full Audit of Role Requirements. Have market demands changed?</td>
                    <td className="p-4 text-slate-500">COO / HR</td>
                </tr>
                 <tr>
                    <td className="p-4 font-bold text-slate-700">Ad-Hoc</td>
                    <td className="p-4 text-slate-600">Comp Review immediately upon changing Role Requirements.</td>
                    <td className="p-4 text-slate-500">COO</td>
                </tr>
            </tbody>
         </table>
      </div>
    </div>
  );

  const DashboardView = () => {
    const totalSkills = skills.length;
    const totalRoles = roles.length;
    const totalStaff = staff.length;
    const skillsTracked = staff.reduce((acc, curr) => acc + curr.assessments.length, 0);

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 transition hover:shadow-md cursor-default">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-slate-500 text-sm font-medium">Skills Library</h3>
              <BookOpen size={18} className="text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{totalSkills}</p>
            <p className="text-xs text-slate-400 mt-1">Defined competencies</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 transition hover:shadow-md cursor-default">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-slate-500 text-sm font-medium">Role Matrix</h3>
              <Target size={18} className="text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{totalRoles}</p>
            <p className="text-xs text-slate-400 mt-1">Position + Level combos</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 transition hover:shadow-md cursor-default">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-slate-500 text-sm font-medium">Staff</h3>
              <Users size={18} className="text-green-500" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{totalStaff}</p>
            <p className="text-xs text-slate-400 mt-1">Active employees</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 transition hover:shadow-md cursor-default">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-slate-500 text-sm font-medium">Data Points</h3>
              <TrendingUp size={18} className="text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{skillsTracked}</p>
            <p className="text-xs text-slate-400 mt-1">Individual assessments</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-6 rounded-xl">
          <h2 className="text-lg font-bold text-blue-900 mb-2">Operating Standard Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-800 mb-2 text-sm uppercase tracking-wide">Action Items</h4>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-blue-800">
                  <CheckCircle size={14} className="mr-2 text-blue-500" />
                  Monthly skill audit due in 5 days
                </li>
                <li className="flex items-center text-sm text-blue-800">
                  <AlertCircle size={14} className="mr-2 text-red-500" />
                  3 Roles missing updated comp bands
                </li>
              </ul>
            </div>
            <div>
               <p className="text-sm text-blue-700 leading-relaxed italic">
                "Keep a single source of truth for skill definitions, role expectations, and compensation transparency."
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SkillsLibraryView = () => {
    const filteredSkills = skills.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.function.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-bold text-slate-800">🧠 Skills Matrix Library</h2>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search skills..." 
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setIsSkillModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-blue-700 transition shadow-sm active:scale-95"
            >
              <Plus size={16} className="mr-2" /> Add Skill
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredSkills.map(skill => (
            <div key={skill.id} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition group">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors">{skill.name}</h3>
                    <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">{skill.function}</span>
                  </div>
                  <p className="text-sm text-slate-500">{skill.category}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                {Object.entries(skill.levels).map(([lvl, desc]) => (
                  <div key={lvl} className="bg-slate-50 p-2 rounded border border-slate-100 hover:border-blue-100 hover:bg-blue-50 transition">
                    <span className="font-bold text-slate-700 block mb-1">{lvl}</span>
                    <p className="text-slate-500 line-clamp-3">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {filteredSkills.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              No skills found matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>
    );
  };

  const StaffAssessmentView = () => {
    const [selectedStaffId, setSelectedStaffId] = useState(staff[0]?.id);
    const person = staff.find(s => s.id === selectedStaffId);
    const role = getRoleById(person?.roleId);
    
    const assessmentData = useMemo(() => {
        if (!person || !role) return [];
        return role.requirements.map(req => {
            const skill = getSkillById(req.skillId);
            const assessment = person.assessments.find(a => a.skillId === req.skillId);
            const currentLevel = assessment ? assessment.currentLevel : 0;
            const gap = currentLevel - req.requiredLevel;
            
            return {
                id: req.skillId,
                skillName: skill?.name,
                priority: req.priority,
                required: req.requiredLevel,
                current: currentLevel,
                gap: gap,
                evidence: assessment?.evidence || '',
            };
        });
    }, [person, role, skills]); // Added skills dependency

    return (
      <div className="h-full flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 bg-white border border-slate-200 rounded-lg overflow-hidden flex-shrink-0 h-fit">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
             <h3 className="font-bold text-slate-700">Team Members</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {staff.map(s => {
                const sRole = getRoleById(s.roleId);
                return (
                    <button
                        key={s.id}
                        onClick={() => setSelectedStaffId(s.id)}
                        className={`w-full text-left p-4 hover:bg-blue-50 transition ${selectedStaffId === s.id ? 'bg-blue-50 border-l-4 border-blue-500' : 'border-l-4 border-transparent'}`}
                    >
                        <div className="font-medium text-slate-800">{s.name}</div>
                        <div className="text-xs text-slate-500">{sRole?.title} {sRole?.level}</div>
                    </button>
                )
            })}
          </div>
        </div>

        <div className="flex-1 space-y-6">
            {person && role ? (
                <>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">{person.name}</h2>
                            <p className="text-slate-500 flex items-center gap-2 mt-1">
                                {role.title} <LevelBadge level={role.level.replace('L','')} />
                            </p>
                        </div>
                        <div className="bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100">
                             <p className="text-[10px] text-emerald-600 uppercase tracking-wider font-bold mb-1">Target Compensation</p>
                            {(() => {
                                const c = getCompByRoleId(role.id);
                                if (!c) return <span className="text-sm text-red-400">Band missing</span>;
                                return <p className="font-mono font-bold text-emerald-800 text-lg">{c.currency} {c.min.toLocaleString()} - {c.max.toLocaleString()}</p>
                            })()}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                            <h3 className="font-bold text-slate-700">📊 Skills Gap Analysis</h3>
                        </div>
                        <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                <tr>
                                    <th className="p-4">Skill</th>
                                    <th className="p-4 w-24 text-center">Required</th>
                                    <th className="p-4 w-32 text-center">Current</th>
                                    <th className="p-4 w-32">Gap Status</th>
                                    <th className="p-4">Evidence / Notes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {assessmentData.map((row) => (
                                    <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-medium text-slate-800">{row.skillName}</div>
                                            <div className="mt-1"><PriorityBadge priority={row.priority} /></div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold border border-slate-200">
                                                {row.required}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button 
                                                    onClick={() => handleUpdateAssessment(person.id, row.id, Math.max(0, row.current - 1))}
                                                    className="w-6 h-6 flex items-center justify-center rounded bg-slate-100 hover:bg-slate-200 text-slate-500"
                                                    disabled={row.current === 0}
                                                >
                                                    <Minus size={12} />
                                                </button>
                                                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold border ${row.current >= row.required ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-white text-slate-700 border-slate-300'}`}>
                                                    {row.current}
                                                </span>
                                                <button 
                                                    onClick={() => handleUpdateAssessment(person.id, row.id, Math.min(4, row.current + 1))}
                                                    className="w-6 h-6 flex items-center justify-center rounded bg-slate-100 hover:bg-slate-200 text-slate-500"
                                                    disabled={row.current === 4}
                                                >
                                                    <Plus size={12} />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {row.gap < 0 ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded bg-red-50 text-red-600 font-medium text-xs border border-red-100">
                                                    <TrendingUp size={12} className="mr-1" />
                                                    Gap ({row.gap})
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 rounded bg-emerald-50 text-emerald-600 font-medium text-xs border border-emerald-100">
                                                    <CheckCircle size={12} className="mr-1" />
                                                    Ready
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <input 
                                                type="text" 
                                                placeholder="Add evidence link..." 
                                                className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none text-slate-600 text-sm py-1 transition-colors truncate"
                                                defaultValue={row.evidence}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex h-64 items-center justify-center text-slate-400">Select a staff member</div>
            )}
        </div>
      </div>
    );
  };

  const RoleMatrixView = () => (
      <div className="space-y-6">
           <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">🧭 Position Skill Requirements</h2>
            <button 
                onClick={() => { setEditingRole(null); setIsRoleModalOpen(true); }}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-purple-700 transition shadow-sm active:scale-95"
            >
              <Plus size={16} className="mr-2" /> Add Role
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roles.map(role => {
                  const compBand = getCompByRoleId(role.id);
                  return (
                    <div key={role.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg transition flex flex-col group relative">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => { setEditingRole(role); setIsRoleModalOpen(true); }}
                                className="p-2 bg-slate-100 hover:bg-blue-100 hover:text-blue-600 rounded-full text-slate-500"
                                title="Edit Requirements"
                            >
                                <Edit2 size={14} />
                            </button>
                        </div>

                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">{role.title}</h3>
                                <div className="mt-1"><LevelBadge level={role.level.replace('L','')} /></div>
                            </div>
                        </div>
                        
                        <div className="flex-1">
                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Requirements</h4>
                            <ul className="space-y-3">
                                {role.requirements.map((req, i) => {
                                    const skill = getSkillById(req.skillId);
                                    return (
                                        <li key={i} className="flex justify-between text-sm items-center">
                                            <span className="text-slate-600 truncate mr-2 flex-1">{skill?.name}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold bg-slate-100 px-1.5 rounded text-slate-600">L{req.requiredLevel}</span>
                                                <div className={`w-2 h-2 rounded-full ${req.priority === 'Must-have' ? 'bg-red-400' : req.priority === 'Strong' ? 'bg-blue-400' : 'bg-gray-300'}`} title={req.priority}></div>
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
                             <span className="text-slate-400 font-medium">Monthly Base</span>
                             {compBand ? (
                                <span className="font-mono font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded">
                                    {compBand.min/1000}k - {compBand.max/1000}k
                                </span>
                            ) : (
                                <span className="text-red-400">Not set</span>
                            )}
                        </div>
                    </div>
                  )
              })}
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col md:flex-row">
      {/* Toast Notification */}
      {notification && (
          <div className="fixed top-4 right-4 z-50 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center animate-in fade-in slide-in-from-top-2">
              <CheckCircle size={16} className="mr-2 text-green-400" />
              {notification}
          </div>
      )}

      {/* Add Skill Modal */}
      <Modal isOpen={isSkillModalOpen} onClose={() => setIsSkillModalOpen(false)} title="Add New Skill">
        <form onSubmit={handleAddSkill} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Skill Name</label>
                <input required name="name" type="text" className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Tiktok Shop Ads" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Function</label>
                    <select name="function" className="w-full border border-slate-300 rounded-lg p-2">
                        <option>Amazon PL</option>
                        <option>Analytics</option>
                        <option>Client Success</option>
                        <option>Operations</option>
                        <option>Systems</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <select name="category" className="w-full border border-slate-300 rounded-lg p-2">
                        <option>Technical</option>
                        <option>Process</option>
                        <option>Communication</option>
                        <option>Leadership</option>
                    </select>
                </div>
            </div>
            <div className="space-y-2 border-t border-slate-100 pt-4">
                <p className="text-xs font-bold text-slate-400 uppercase">Level Definitions (Brief)</p>
                {[1,2,3,4].map(l => (
                    <div key={l} className="flex gap-2 items-center">
                        <span className="text-xs font-bold text-slate-500 w-6">L{l}</span>
                        <input required name={`l${l}`} type="text" className="flex-1 border border-slate-200 rounded p-1.5 text-sm" placeholder={`Definition for level ${l}...`} />
                    </div>
                ))}
            </div>
            <div className="pt-2 flex justify-end">
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition">Save Skill</button>
            </div>
        </form>
      </Modal>

      {/* Edit Role Modal (Updated with Compensation) */}
      <Modal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)} title={editingRole ? `Edit: ${editingRole.title} ${editingRole.level}` : "Create New Role"}>
        <form onSubmit={handleSaveRole} className="space-y-6">
            {!editingRole && (
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Role Title" className="border p-2 rounded" />
                    <select className="border p-2 rounded"><option>L1</option><option>L2</option><option>L3</option></select>
                </div>
            )}
            
            {editingRole && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-4">
                    <h4 className="font-bold text-slate-700 mb-3 text-sm flex items-center gap-2">
                        <DollarSign size={14} className="text-emerald-600"/> Compensation Band (Monthly)
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Currency</label>
                            <select name="compCurrency" defaultValue={getCompByRoleId(editingRole.id)?.currency || 'USD'} className="w-full border rounded p-2 text-sm bg-white">
                                <option>USD</option>
                                <option>EUR</option>
                                <option>GBP</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Min</label>
                            <input name="compMin" type="number" defaultValue={getCompByRoleId(editingRole.id)?.min || 0} className="w-full border rounded p-2 text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Max</label>
                            <input name="compMax" type="number" defaultValue={getCompByRoleId(editingRole.id)?.max || 0} className="w-full border rounded p-2 text-sm" />
                        </div>
                    </div>
                </div>
            )}

            <div>
                <h4 className="font-bold text-slate-700 mb-3 text-sm">Competency Requirements</h4>
                <div className="max-h-[40vh] overflow-y-auto space-y-2 pr-2">
                    {skills.map(skill => {
                        const req = editingRole?.requirements.find(r => r.skillId === skill.id);
                        return (
                            <div key={skill.id} className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                                <span className="text-sm font-medium text-slate-700 w-1/3 truncate">{skill.name}</span>
                                <div className="flex gap-2 items-center">
                                    <select defaultValue={req?.priority || 'Nice-to-have'} className="text-xs border rounded p-1">
                                        <option>Must-have</option>
                                        <option>Strong</option>
                                        <option>Nice-to-have</option>
                                    </select>
                                    <div className="flex items-center bg-white border rounded px-1">
                                        <span className="text-xs text-slate-400 mr-2">Req:</span>
                                        <input type="number" min="0" max="4" defaultValue={req?.requiredLevel || 0} className="w-10 text-center text-sm p-1 outline-none" />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
                 <button type="button" onClick={() => setIsRoleModalOpen(false)} className="text-slate-500 px-4 py-2 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition">
                    {editingRole ? 'Save Changes' : 'Create Role'}
                </button>
            </div>
        </form>
      </Modal>

      {/* Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-slate-800">
          <img 
             src="https://envisionecom.com/wp-content/uploads/2024/08/Envision-Ecom.png" 
             alt="Envision Ecom" 
             className="w-auto h-12 mb-4 object-contain bg-white rounded-lg p-2"
          />
          <h1 className="text-white font-bold text-xl flex items-center gap-2">
            <LayoutDashboard className="text-blue-500" />
            Skills OS
          </h1>
          <p className="text-xs text-slate-500 mt-1">HR Operating Standard</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
            <button 
                onClick={() => setActiveTab('dashboard')} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}
            >
                <LayoutDashboard size={18} /> Dashboard
            </button>
            <button 
                onClick={() => setActiveTab('guidelines')} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'guidelines' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}
            >
                <HelpCircle size={18} /> Guidelines
            </button>
            <button 
                onClick={() => setActiveTab('skills')} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'skills' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}
            >
                <BookOpen size={18} /> Skills Matrix
            </button>
            <button 
                onClick={() => setActiveTab('roles')} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'roles' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}
            >
                <Target size={18} /> Position Req.
            </button>
            <button 
                onClick={() => setActiveTab('assessments')} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'assessments' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}
            >
                <Users size={18} /> Staff Assessments
            </button>
        </nav>

        <div className="p-6 border-t border-slate-800">
            <div className="bg-slate-800 rounded p-4 border border-slate-700">
                <p className="text-xs text-slate-400 mb-2 font-bold uppercase">System Health</p>
                <div className="flex items-center gap-2 text-sm text-green-400">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    All Systems Live
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-slate-50/50">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'guidelines' && <GuidelinesView />}
        {activeTab === 'skills' && <SkillsLibraryView />}
        {activeTab === 'roles' && <RoleMatrixView />}
        {activeTab === 'assessments' && <StaffAssessmentView />}
      </main>
    </div>
  );
}