import React, { useEffect, useState } from 'react';
import { supabase } from '../Config/Config';
import { motion } from 'framer-motion';
import { FiLogOut, FiUser, FiCalendar, FiBell, FiAward, FiBook, FiHome, FiClock, FiMapPin, FiMail, FiPhone, FiMap } from 'react-icons/fi';
import { FaChalkboardTeacher } from 'react-icons/fa';

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});
  const [loadingAttendance, setLoadingAttendance] = useState(true);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [loadingSchedule, setLoadingSchedule] = useState(true);
  const [notices, setNotices] = useState([]);
  const [loadingNotices, setLoadingNotices] = useState(true);
  const [resultData, setResultData] = useState([]);
  const [loadingResults, setLoadingResults] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    const fetchNotices = async () => {
      setLoadingNotices(true);
      
      const { data, error } = await supabase
        .from('notice')
        .select(`
          topic,
          date,
          time,
          description,
          staff:staff_id (
            name
          )
        `)
        .order('date', { ascending: false })
        .order('time', { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching notices:", error);
        setNotices([]);
      } else {
        setNotices(data);
      }
      
      setLoadingNotices(false);
    };

    fetchNotices();
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!user) return;
      
      setLoadingAttendance(true);
      const { data: attendance, error } = await supabase
        .from('attendance')
        .select('student_id, subject_id, date, status')
        .eq('student_id', user.user_id);

      const { data: subjectList } = await supabase
        .from('subjects')
        .select('subject_id, subject_name, subject_code');

      if (error) {
        console.error('Error fetching attendance:', error);
        setAttendanceData({});
      } else {
        const grouped = {};
        attendance.forEach(({ subject_id, date, status }) => {
          if (!grouped[subject_id]) {
            grouped[subject_id] = { attendance: [], present: 0, total: 0 };
          }
          grouped[subject_id].attendance.push({ date, status });
          grouped[subject_id].total += 1;
          if (status === 'present' || status === 'P') grouped[subject_id].present += 1;
        });

        const result = {};
        Object.entries(grouped).forEach(([subject_id, info]) => {
          const subject = subjectList.find(s => s.subject_id == subject_id);
          result[subject_id] = {
            subject_name: subject?.subject_name || `Subject ${subject_id}`,
            subject_code: subject?.subject_code || '',
            attendance: info.attendance,
            percentage: ((info.present / info.total) * 100).toFixed(2),
            status: ((info.present / info.total) * 100) >= 75 ? 'good' : 'warning'
          };
        });

        setAttendanceData(result);
      }
      setLoadingAttendance(false);
    };

    const fetchSchedule = async () => {
      if (!user) return;
      
      setLoadingSchedule(true);
      const today = new Date().toISOString().split('T')[0];

      const { data: scheduleData, error } = await supabase
        .from('classes_schedule')
        .select('*, subjects(subject_name, subject_code)')
        
        // .eq('date', today);

        console.log("Schedule Data:", scheduleData);

      if (error) {
        console.error("Error fetching schedule:", error);
        setTodaySchedule([]);
      } else {
        const sorted = scheduleData.sort((a, b) => a.time.localeCompare(b.time));
        setTodaySchedule(sorted);
      }
      setLoadingSchedule(false);
    };

    const fetchResults = async () => {
      if (!user) return;
      
      setLoadingResults(true);
      const { data: results, error } = await supabase
        .from('results')
        .select('subject_id, mid_term_score, end_term_score')
        .eq('user_id', user.user_id);

      const { data: subjects } = await supabase
        .from('subjects')
        .select('subject_id, subject_name, subject_code');

      if (error) {
        console.error("Error fetching results:", error);
        setResultData([]);
      } else {
        const resultWithSubjects = results.map((res) => {
          const subject = subjects.find(s => s.subject_id === res.subject_id);
          const total = (res.mid_term_score ?? 0) + (res.end_term_score ?? 0);
          const percentage = res.end_term_score !== null
            ? ((total / 100) * 100).toFixed(2)
            : null;

          let grade = "-";
          let gradeColor = "text-gray-600";
          if (percentage !== null) {
            const perc = parseFloat(percentage);
            if (perc >= 90) { grade = "A+"; gradeColor = "text-green-600"; }
            else if (perc >= 80) { grade = "A"; gradeColor = "text-green-500"; }
            else if (perc >= 70) { grade = "B"; gradeColor = "text-blue-500"; }
            else if (perc >= 60) { grade = "C"; gradeColor = "text-yellow-600"; }
            else if (perc >= 50) { grade = "D"; gradeColor = "text-orange-500"; }
            else { grade = "F"; gradeColor = "text-red-600"; }
          }

          return {
            ...res,
            subject_name: subject?.subject_name || `Subject ${res.subject_id}`,
            subject_code: subject?.subject_code || '',
            percentage,
            grade,
            gradeColor
          };
        });

        setResultData(resultWithSubjects);
      }
      setLoadingResults(false);
    };

    fetchAttendance();
    fetchResults();
    fetchSchedule();
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-indigo-800">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-indigo-900 text-white flex flex-col transition-all duration-300 ease-in-out`}>
        <div className="p-4 flex items-center justify-between border-b border-indigo-800">
          {!sidebarCollapsed && (
            <h2 className="text-xl font-bold flex items-center">
              <FiHome className="mr-2" /> COSMO
            </h2>
          )}
          {sidebarCollapsed && (
            <h2 className="text-xl font-bold">C</h2>
          )}
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-white hover:text-indigo-300 p-1 rounded-full hover:bg-indigo-800"
          >
            {sidebarCollapsed ? '»' : '«'}
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center p-3 rounded-lg transition-all ${activeTab === 'dashboard' ? 'bg-indigo-700' : 'hover:bg-indigo-800'}`}
          >
            <FiHome className="text-lg" />
            {!sidebarCollapsed && <span className="ml-3">Dashboard</span>}
          </button>
          
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center p-3 rounded-lg transition-all ${activeTab === 'profile' ? 'bg-indigo-700' : 'hover:bg-indigo-800'}`}
          >
            <FiUser className="text-lg" />
            {!sidebarCollapsed && <span className="ml-3">Profile</span>}
          </button>
          
          <button
            onClick={() => setActiveTab('attendance')}
            className={`w-full flex items-center p-3 rounded-lg transition-all ${activeTab === 'attendance' ? 'bg-indigo-700' : 'hover:bg-indigo-800'}`}
          >
            <FiCalendar className="text-lg" />
            {!sidebarCollapsed && <span className="ml-3">Attendance</span>}
          </button>
          
          <button
            onClick={() => setActiveTab('timetable')}
            className={`w-full flex items-center p-3 rounded-lg transition-all ${activeTab === 'timetable' ? 'bg-indigo-700' : 'hover:bg-indigo-800'}`}
          >
            <FiClock className="text-lg" />
            {!sidebarCollapsed && <span className="ml-3">Time Table</span>}
          </button>
          
          <button
            onClick={() => setActiveTab('notices')}
            className={`w-full flex items-center p-3 rounded-lg transition-all ${activeTab === 'notices' ? 'bg-indigo-700' : 'hover:bg-indigo-800'}`}
          >
            <FiBell className="text-lg" />
            {!sidebarCollapsed && <span className="ml-3">Notices</span>}
          </button>
          
          <button
            onClick={() => setActiveTab('results')}
            className={`w-full flex items-center p-3 rounded-lg transition-all ${activeTab === 'results' ? 'bg-indigo-700' : 'hover:bg-indigo-800'}`}
          >
            <FiAward className="text-lg" />
            {!sidebarCollapsed && <span className="ml-3">Results</span>}
          </button>
        </nav>
        
        <div className="p-4 border-t border-indigo-800">
          <button 
            onClick={() => {
              localStorage.removeItem('user');
              window.location.href = '/login';
            }}
            className={`w-full flex items-center p-3 rounded-lg hover:bg-indigo-800 transition-all`}
          >
            <FiLogOut className="text-lg" />
            {!sidebarCollapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <header className="bg-white rounded-xl shadow-sm p-4 mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-900">
            {activeTab === 'dashboard' && 'Student Dashboard'}
            {activeTab === 'profile' && 'My Profile'}
            {activeTab === 'attendance' && 'Attendance Records'}
            {activeTab === 'timetable' && 'Class Schedule'}
            {activeTab === 'notices' && 'University Notices'}
            {activeTab === 'results' && 'Academic Results'}
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FiBell className="text-xl text-indigo-600 cursor-pointer" />
              {notices.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {notices.length}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              {!sidebarCollapsed && (
                <span className="font-medium text-gray-700">{user.name}</span>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Welcome Card */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl shadow-lg p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h2>
                  <p className="opacity-90">Here's what's happening with your academics today</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="bg-white/20 rounded-lg p-3 inline-block">
                    <p className="text-sm">Current Semester</p>
                    <p className="font-bold text-lg">Semester {user.semester}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div 
                variants={cardVariants}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500"
              >
                <h3 className="text-gray-500 text-sm font-medium mb-1">Today's Classes</h3>
                <p className="text-2xl font-bold text-gray-800">
                  {loadingSchedule ? (
                    <span className="inline-block h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                  ) : todaySchedule.length}
                </p>
              </motion.div>

              <motion.div 
                variants={cardVariants}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500"
              >
                <h3 className="text-gray-500 text-sm font-medium mb-1">Average Attendance</h3>
                <p className="text-2xl font-bold text-gray-800">
                  {loadingAttendance ? (
                    <span className="inline-block h-6 w-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></span>
                  ) : Object.keys(attendanceData).length > 0 ? (
                    `${(
                      Object.values(attendanceData).reduce((sum, subj) => sum + parseFloat(subj.percentage), 0) / 
                      Object.keys(attendanceData).length
                    ).toFixed(2)}%`
                  ) : 'N/A'}
                </p>
              </motion.div>

              <motion.div 
                variants={cardVariants}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500"
              >
                <h3 className="text-gray-500 text-sm font-medium mb-1">New Notices</h3>
                <p className="text-2xl font-bold text-gray-800">
                  {loadingNotices ? (
                    <span className="inline-block h-6 w-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></span>
                  ) : notices.length}
                </p>
              </motion.div>
            </div>

            {/* Today's Schedule */}
            <motion.div
              variants={cardVariants}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <FiClock className="mr-2 text-indigo-600" /> Today's Schedule
                </h3>
                <button 
                  onClick={() => setActiveTab('timetable')}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  View All
                </button>
              </div>
              
              {loadingSchedule ? (
                <div className="flex justify-center py-8">
                  <span className="inline-block h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></span>
                </div>
              ) : todaySchedule.length === 0 ? (
                <p className="text-gray-500 text-center py-6">No classes scheduled for today</p>
              ) : (
                <div className="space-y-3">
                  {todaySchedule.slice(0, 3).map((cls, index) => (
                    <div key={index} className="flex items-start p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="bg-indigo-100 text-indigo-800 p-2 rounded-lg mr-3">
                        <FiBook className="text-lg" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">
                          {cls.subjects?.subject_name || 'Subject'} ({cls.subjects?.subject_code || 'Code'})
                        </h4>
                        <div className="flex flex-wrap text-sm text-gray-500 mt-1 gap-x-4">
                          <span className="flex items-center">
                            <FiClock className="mr-1" /> {cls.time}
                          </span>
                          <span className="flex items-center">
                            <FiMapPin className="mr-1" /> {cls.room_no}, {cls.block}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Recent Notices */}
            <motion.div
              variants={cardVariants}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <FiBell className="mr-2 text-indigo-600" /> Recent Notices
                </h3>
                <button 
                  onClick={() => setActiveTab('notices')}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  View All
                </button>
              </div>
              
              {loadingNotices ? (
                <div className="flex justify-center py-8">
                  <span className="inline-block h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></span>
                </div>
              ) : notices.length === 0 ? (
                <p className="text-gray-500 text-center py-6">No notices available</p>
              ) : (
                <div className="space-y-3">
                  {notices.slice(0, 3).map((notice, index) => (
                    <div key={index} className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                      <h4 className="font-medium text-gray-800 flex items-center">
                        <span className="bg-indigo-100 text-indigo-800 p-1 rounded-full mr-2">
                          <FaChalkboardTeacher className="text-sm" />
                        </span>
                        {notice.topic}
                      </h4>
                      <div className="flex flex-wrap text-sm text-gray-500 mt-1 gap-x-4">
                        <span>{notice.date}</span>
                        <span>Posted by: {notice.staff?.name || 'Staff'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FiUser className="mr-2 text-indigo-600" /> My Profile
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                  <p className="mt-1 text-lg font-medium text-gray-900">{user.name}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Student ID</h3>
                  <p className="mt-1 text-lg font-medium text-gray-900">{user.user_id}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Academic Information</h3>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Branch</p>
                      <p className="text-sm font-medium">{user.branch}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Semester</p>
                      <p className="text-sm font-medium">{user.semester}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Section</p>
                      <p className="text-sm font-medium">{user.section}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Year</p>
                      <p className="text-sm font-medium">{user.year}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                  <div className="mt-2 space-y-3">
                    <div className="flex items-center">
                      <FiMail className="text-gray-400 mr-2" />
                      <span className="text-sm font-medium">{user.email || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center">
                      <FiPhone className="text-gray-400 mr-2" />
                      <span className="text-sm font-medium">{user.phone || 'Not provided'}</span>
                    </div>
                    <div className="flex items-start">
                      <FiMap className="text-gray-400 mr-2 mt-1" />
                      <span className="text-sm font-medium">{user.address || 'Not provided'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FiCalendar className="mr-2 text-indigo-600" /> Attendance Records
            </h2>
            
            {loadingAttendance ? (
              <div className="flex justify-center py-12">
                <span className="inline-block h-10 w-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></span>
              </div>
            ) : Object.keys(attendanceData).length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No attendance records found</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(attendanceData).map(([subjectId, info]) => (
                    <motion.div
                      key={subjectId}
                      whileHover={{ y: -5 }}
                      className="border rounded-xl overflow-hidden shadow-sm"
                    >
                      <div className={`p-4 ${info.status === 'good' ? 'bg-green-50' : 'bg-amber-50'}`}>
                        <h3 className="font-bold text-lg text-gray-800">
                          {info.subject_name} ({info.subject_code})
                        </h3>
                        <div className="flex items-center justify-between mt-2">
                          <div>
                            <span className="text-sm text-gray-500">Attendance</span>
                            <p className={`text-2xl font-bold ${info.status === 'good' ? 'text-green-600' : 'text-amber-600'}`}>
                              {info.percentage}%
                            </p>
                          </div>
                          <div className="w-16 h-16">
                            <div className="relative w-full h-full">
                              <svg className="w-full h-full" viewBox="0 0 36 36">
                                <path
                                  d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                  fill="none"
                                  stroke="#E5E7EB"
                                  strokeWidth="3"
                                />
                                <path
                                  d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                  fill="none"
                                  stroke={info.status === 'good' ? '#10B981' : '#F59E0B'}
                                  strokeWidth="3"
                                  strokeDasharray={`${info.percentage}, 100`}
                                />
                              </svg>
                              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                                <span className={`text-xs font-bold ${info.status === 'good' ? 'text-green-600' : 'text-amber-600'}`}>
                                  {info.present}/{info.total}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-white">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Recent Records</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {info.attendance.slice(0, 5).map((entry, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                              <span className="text-gray-600">
                                {new Date(entry.date).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                              <span className={`font-medium ${entry.status === 'present' || entry.status === 'P' ? 'text-green-600' : 'text-red-600'}`}>
                                {entry.status.toUpperCase()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Timetable Tab */}
        {activeTab === 'timetable' && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FiClock className="mr-2 text-indigo-600" /> Class Schedule
            </h2>
            
            {loadingSchedule ? (
              <div className="flex justify-center py-12">
                <span className="inline-block h-10 w-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></span>
              </div>
            ) : todaySchedule.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No classes scheduled for today</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {todaySchedule.map((cls, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {cls.time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {cls.subjects?.subject_name || 'Subject'} ({cls.subjects?.subject_code || 'Code'})
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {cls.room_no}, {cls.block}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {/* Notices Tab */}
        {activeTab === 'notices' && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FiBell className="mr-2 text-indigo-600" /> University Notices
            </h2>
            
            {loadingNotices ? (
              <div className="flex justify-center py-12">
                <span className="inline-block h-10 w-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></span>
              </div>
            ) : notices.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No notices available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notices.map((notice, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.01 }}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div className="bg-indigo-50 px-4 py-3">
                      <h3 className="font-bold text-lg text-indigo-800">{notice.topic}</h3>
                    </div>
                    <div className="p-4">
                      <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-4 gap-y-2 mb-3">
                        <span className="flex items-center">
                          <FiCalendar className="mr-1" /> {notice.description}
                        </span>
                        <span className="flex items-center">
                          <FiClock className="mr-1" /> {notice.time}
                        </span>
                        <span className="flex items-center">
                          <FaChalkboardTeacher className="mr-1" /> {notice.staff?.name || 'Staff'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FiAward className="mr-2 text-indigo-600" /> Academic Results
            </h2>
            
            {loadingResults ? (
              <div className="flex justify-center py-12">
                <span className="inline-block h-10 w-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></span>
              </div>
            ) : resultData.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No result data found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mid Term</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Term</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {resultData.map((res, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {res.subject_name} ({res.subject_code})
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {res.mid_term_score ?? 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {res.end_term_score ?? 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {res.percentage ? `${res.percentage}%` : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${res.gradeColor}`}>
                            {res.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;