// import React, { useEffect, useState } from 'react';
// import { supabase } from '../Config/Config';

// const StaffDashboard = () => {
//   const [user, setUser] = useState(null);
//   const [students, setStudents] = useState([]);
//   const [selectedSubject, setSelectedSubject] = useState('');
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
//   const [attendance, setAttendance] = useState({});
//   const [subjectList, setSubjectList] = useState([]);
//   const [selectedSection, setSelectedSection] = useState('');

//   const [scheduleDate, setScheduleDate] = useState('');
// const [scheduleTime, setScheduleTime] = useState('');
// const [roomNo, setRoomNo] = useState('');
// const [block, setBlock] = useState('');

// const [studentId, setStudentId] = useState('');
// const [resultEntries, setResultEntries] = useState([]);

// const [noticeTopic, setNoticeTopic] = useState('');
// const [noticeDescription, setNoticeDescription] = useState('');

// const fetchSubjectsForResult = async (stuId) => {
//   if (!stuId) {
//     alert("Please enter a valid student ID.");
//     return;
//   }

//   // Fetch existing results for this student
//   const { data: existingResults, error: resultErr } = await supabase
//     .from('results')
//     .select('*')
//     .eq('user_id', stuId);

//   if (resultErr) {
//     console.error("Error fetching existing results:", resultErr);
//     return;
//   }

//   // Map existing results for quick access
//   const resultMap = {};
//   existingResults.forEach(res => {
//     resultMap[res.subject_id] = {
//       mid_term_score: res.mid_term_score,
//       end_term_score: res.end_term_score,
//       result_id: res.result_id,
//     };
//   });

//   // Prepare subject entries
//   const filteredSubjects = subjectList.map(subj => ({
//     ...subj,
//     mid_term_score: resultMap[subj.subject_id]?.mid_term_score ?? '',
//     end_term_score: resultMap[subj.subject_id]?.end_term_score ?? '',
//     result_id: resultMap[subj.subject_id]?.result_id || null,
//   }));

//   setResultEntries(filteredSubjects);
// };


// const handleScoreChange = (subjectId, field, value) => {
//   setResultEntries(prev =>
//     prev.map(entry =>
//       entry.subject_id === subjectId ? { ...entry, [field]: value } : entry
//     )
//   );
// };

// // Submit result
// const handleResultSubmit = async () => {
//   for (const entry of resultEntries) {
//     const { subject_id, mid_term_score, end_term_score, result_id } = entry;

//     const cleanMid = mid_term_score !== '' ? parseFloat(mid_term_score) : null;
//     const cleanEnd = end_term_score !== '' ? parseFloat(end_term_score) : null;

//     if (result_id) {
//       // Existing entry → UPDATE
//       const { error } = await supabase
//         .from('results')
//         .update({
//           ...(mid_term_score !== '' && { mid_term_score: cleanMid }),
//           ...(end_term_score !== '' && { end_term_score: cleanEnd })
//         })
//         .eq('result_id', result_id);

//       if (error) {
//         console.error("Error updating result:", error);
//         alert("Update failed for a subject.");
//         return;
//       }
//     } else {
//       // New entry → INSERT
//       const { error } = await supabase
//         .from('results')
//         .insert([{
//           user_id: studentId,
//           subject_id,
//           mid_term_score: cleanMid,
//           end_term_score: cleanEnd
//         }]);

//       if (error) {
//         console.error("Error inserting result:", error);
//         alert("Insert failed for a subject.");
//         return;
//       }
//     }
//   }

//   alert("Results saved/updated successfully!");
//   setStudentId('');
//   setResultEntries([]);
// };

// const handleScheduleSubmit = async () => {
//   if (!selectedSubject || !scheduleDate || !scheduleTime || !roomNo || !block) {
//     alert("Please fill all schedule fields.");
//     return;
//   }

//   const { error } = await supabase.from('classes_schedule').insert([{
//     subject_id: selectedSubject,
//     date: scheduleDate,
//     time: scheduleTime,
//     room_no: roomNo,
//     block: block,
//   }]);

//   if (error) {
//     console.error("Error adding schedule:", error);
//     alert("Failed to add class schedule.");
//   } else {
//     alert("Class schedule added successfully!");
//     setScheduleDate('');
//     setScheduleTime('');
//     setRoomNo('');
//     setBlock('');
//   }
// };

// const handleNoticeSubmit = async () => {
//   if (!noticeTopic.trim()) {
//     alert("Please enter a notice topic.");
//     return;
//   }

//   const now = new Date();
//   const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
//   const time = now.toTimeString().split(' ')[0]; // HH:MM:SS

//   const { error } = await supabase.from('notice').insert([{
//     topic: noticeTopic,
//     description: noticeDescription,
//     staff_id: user.user_id,
//     date,
//     time,
//   }]);

//   if (error) {
//     console.error("Error adding notice:", error);
//     alert("Failed to post notice.");
//   } else {
//     alert("Notice posted successfully!");
//     setNoticeTopic('');
//     setNoticeDescription('');
//   }
// };


//   const fetchSubjects = async (staffId) => {
//     const { data: assigned, error: err1 } = await supabase
//       .from('staff_subjects')
//       .select('subject_id')
//       .eq('staff_id', staffId);

//     if (err1 || !assigned) {
//       console.error('Error fetching assigned subjects:', err1);
//       return;
//     }

//     const subjectIds = assigned.map(s => s.subject_id);

//     const { data: subjects, error: err2 } = await supabase
//       .from('subjects')
//       .select('subject_id, subject_name, subject_code')
//       .in('subject_id', subjectIds);

//     if (err2) {
//       console.error('Error fetching subject details:', err2);
//     } else {
//       setSubjectList(subjects);
//     }
//   };

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       const parsedUser = JSON.parse(storedUser);
//       setUser(parsedUser);
//       fetchSubjects(parsedUser.user_id);
//     } else {
//       window.location.href = "/login";
//     }
//   }, []);

//   useEffect(() => {
//     const fetchStudents = async () => {
//       if (selectedSection) {
//         const { data, error } = await supabase
//           .from('users')
//           .select('user_id, name')
//           .eq('section', selectedSection)
//           .eq('role', 'student');

//         if (!error) {
//           setStudents(data);
//           const initialAttendance = {};
//           data.forEach((stu) => {
//             initialAttendance[stu.user_id] = '';
//           });
//           setAttendance(initialAttendance);
//         } else {
//           console.error("Error fetching students:", error);
//         }
//       }
//     };

//     fetchStudents();
//   }, [selectedSection]);

//   const handleAttendanceChange = (studentId, present) => {
//     setAttendance({ ...attendance, [studentId]: present });
//   };

// const handleSubmit = async () => {
//   if (!selectedSubject || !selectedSection || !selectedDate) {
//     alert('Please select subject, section, and date.');
//     return;
//   }

//   // Fetch students from database for selected section
//   const { data: studentsInSection, error: fetchError } = await supabase
//     .from('users')
//     .select('user_id')
//     .eq('section', selectedSection)
//     .eq('role', 'student');

//   const studentIds = studentsInSection.map(s => s.user_id);

//   // Check if attendance already exists for any student on same date+subject
//   const { data: existing, error: checkError } = await supabase
//     .from('attendance')
//     .select('*')
//     .in('student_id', studentIds)
//     .eq('subject_id', selectedSubject)
//     .eq('date', selectedDate);

//   if (existing.length > 0) {
//     alert("Attendance already marked for this section and subject on selected date.");
//     return;
//   }

//   // Proceed to mark attendance
// const records = students.map((stu) => ({
//   student_id: stu.user_id,  // ✅ CORRECT
//   subject_id: selectedSubject,
//   date: selectedDate,
//   status: attendance[stu.user_id] || 'absent'  // ✅ Use the correct key
// }));


//   const { error: insertError } = await supabase
//     .from('attendance')
//     .insert(records);

//   if (insertError) {
//     console.error("Error saving attendance:", insertError);
//     alert("Failed to mark attendance.");
//   } else {
//     alert("Attendance marked successfully!");
//   }
// };


//   if (!user) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100 text-xl">
//         Loading dashboard...
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <aside className="w-64 bg-indigo-900 text-white flex flex-col p-6 space-y-6 shadow-lg">
//         <h2 className="text-2xl font-bold text-center">XYZ University</h2>
//         <nav className="flex flex-col gap-4 text-lg">
//           <a href="#profile" className="hover:text-indigo-300">My Profile</a>
//           <a href="#mark" className="hover:text-indigo-300">Mark Attendance</a>
//           <a href="#students" className="hover:text-indigo-300">View Students</a>
//           <a href="#schedule" className="hover:text-indigo-300">Schedule</a>
//           <a href="#notices" className="hover:text-indigo-300">Notices</a>
//           <a href="#results" className="hover:text-indigo-300">Result</a>
//           <button 
//             onClick={() => {
//               localStorage.removeItem('user');
//               window.location.href = '/login';
//             }}
//             className="mt-auto bg-red-600 py-2 rounded hover:bg-red-700"
//           >Logout</button>
//         </nav>
//       </aside>

//       <main className="flex-1 p-10 space-y-12">
//         <section id="profile" className="bg-white p-6 rounded-xl shadow-md">
//           <h3 className="text-2xl font-semibold mb-4">My Profile</h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
//             <div><strong>Name:</strong> {user.name}</div>
//             <div><strong>User ID:</strong> {user.user_id}</div>
//             <div><strong>Department:</strong> {user.department || 'N/A'}</div>
//             <div><strong>Role:</strong> {user.role}</div>
//             <div><strong>Email:</strong> {user.email || 'N/A'}</div>
//             <div><strong>Phone:</strong> {user.phone || 'N/A'}</div>
//             <div><strong>Designation:</strong> {user.designation || 'N/A'}</div>
//             <div><strong>Experience:</strong> {user.experience_years || 'N/A'} years</div>
//           </div>
//         </section>

//         <section id="mark" className="bg-white p-6 rounded-xl shadow-md">
//           <h3 className="text-2xl font-semibold mb-4">Mark Attendance</h3>
//           <div className="mb-4">
//             <label className="block mb-1 text-gray-700">Subject:</label>
//             <select
//               className="w-full border rounded px-3 py-2"
//               value={selectedSubject}
//               onChange={(e) => setSelectedSubject(e.target.value)}
//             >
//               <option value="">Select Subject</option>
//               {subjectList.map((subj) => (
//                 <option key={subj.subject_id} value={subj.subject_id}>
//                   {subj.subject_name} ({subj.subject_code})
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="mb-4">
//             <label className="block mb-1 text-gray-700">Section:</label>
//             <select
//               className="w-full border rounded px-3 py-2"
//               value={selectedSection}
//               onChange={(e) => setSelectedSection(e.target.value)}
//             >
//               <option value="">Select Section</option>
//               <option value="1A">1A</option>
//             </select>
//           </div>

//           <div className="mb-4">
//             <label className="block mb-1 text-gray-700">Date:</label>
//             <input
//               type="date"
//               className="w-full border rounded px-3 py-2"
//               value={selectedDate}
//               onChange={(e) => setSelectedDate(e.target.value)}
//             />
//           </div>

//           <div className="flex gap-4 mb-4">
//             <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => {
//               const newAttendance = {};
//               students.forEach(stu => newAttendance[stu.user_id] = 'present');
//               setAttendance(newAttendance);
//             }}>Mark All Present</button>
//             <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => {
//               const newAttendance = {};
//               students.forEach(stu => newAttendance[stu.user_id] = 'absent');
//               setAttendance(newAttendance);
//             }}>Mark All Absent</button>
//           </div>

//           <div className="space-y-3">
//             {students.map((stu) => (
//               <div key={stu.user_id} className="flex justify-between items-center border p-3 rounded">
//                 <span>{stu.name}</span>
//                 <select
//                   className="border rounded px-2 py-1"
//                   value={attendance[stu.user_id] || ''}
//                   onChange={(e) => handleAttendanceChange(stu.user_id, e.target.value)}
//                 >
//                   <option value="">--</option>
//                   <option value="present">Present</option>
//                   <option value="absent">Absent</option>
//                 </select>
//               </div>
//             ))}
//           </div>

//           <button
//             className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
//             onClick={handleSubmit}
//           >
//             Submit Attendance
//           </button>
//         </section>

//         <section id="students" className="bg-white p-6 rounded-xl shadow-md">
//           <h3 className="text-2xl font-semibold mb-4">Students Assigned</h3>
//           <ul className="list-disc pl-6 text-gray-700">
//             {students.map((stu) => (
//               <li key={stu.user_id}>{stu.name}</li>
//             ))}
//           </ul>
//         </section>

//         <section id="schedule" className="bg-white p-6 rounded-xl shadow-md">
//           <h3 className="text-2xl font-semibold mb-4">Class Schedule</h3>
//           <div className="space-y-4">
//   <div>
//     <label className="block text-gray-700">Subject:</label>
//     <select
//       className="w-full border px-3 py-2 rounded"
//       value={selectedSubject}
//       onChange={(e) => setSelectedSubject(e.target.value)}
//     >
//       <option value="">Select Subject</option>
//       {subjectList.map((subj) => (
//         <option key={subj.subject_id} value={subj.subject_id}>
//           {subj.subject_name} ({subj.subject_code})
//         </option>
//       ))}
//     </select>
//   </div>

//   <div>
//     <label className="block text-gray-700">Date:</label>
//     <input
//       type="date"
//       className="w-full border px-3 py-2 rounded"
//       value={scheduleDate}
//       onChange={(e) => setScheduleDate(e.target.value)}
//     />
//   </div>

//   <div>
//     <label className="block text-gray-700">Time:</label>
//     <input
//       type="time"
//       className="w-full border px-3 py-2 rounded"
//       value={scheduleTime}
//       onChange={(e) => setScheduleTime(e.target.value)}
//     />
//   </div>

//   <div>
//     <label className="block text-gray-700">Room Number:</label>
//     <input
//       type="text"
//       className="w-full border px-3 py-2 rounded"
//       placeholder="E.g. 204"
//       value={roomNo}
//       onChange={(e) => setRoomNo(e.target.value)}
//     />
//   </div>

//   <div>
//     <label className="block text-gray-700">Block:</label>
//     <input
//       type="text"
//       className="w-full border px-3 py-2 rounded"
//       placeholder="E.g. C Block"
//       value={block}
//       onChange={(e) => setBlock(e.target.value)}
//     />
//   </div>

//   <button
//     className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
//     onClick={handleScheduleSubmit}
//   >
//     Submit Schedule
//   </button>
// </div>

//         </section>

//         <section id="notices" className="bg-white p-6 rounded-xl shadow-md">
//           <h3 className="text-2xl font-semibold mb-4">Notices</h3>
//           <section id="notices" className="bg-white p-6 rounded-xl shadow-md">
//   <h3 className="text-2xl font-semibold mb-4">📢 Post Notice</h3>
  
//   <div className="mb-4">
//     <label className="block text-gray-700 mb-1">Notice Topic:</label>
//     <input
//       type="text"
//       className="w-full border px-3 py-2 rounded"
//       placeholder="Enter notice topic"
//       value={noticeTopic}
//       onChange={(e) => setNoticeTopic(e.target.value)}
//     />
//   </div>

//   <div className="mb-4">
//     <label className="block text-gray-700 mb-1">Description:</label>
//     <textarea
//       className="w-full border px-3 py-2 rounded"
//       rows={4}
//       placeholder="Enter notice description"
//       value={noticeDescription}
//       onChange={(e) => setNoticeDescription(e.target.value)}
//     />
//   </div>

//   <button
//     className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
//     onClick={handleNoticeSubmit}
//   >
//     Submit Notice
//   </button>
// </section>
// <section id="results" className="bg-white p-6 rounded-xl shadow-md">
//   <h3 className="text-2xl font-semibold mb-4">📈 Enter Student Results</h3>

//   <div className="mb-4">
//     <label className="block text-gray-700 mb-1">Student User ID (Roll No):</label>
//     <input
//       type="text"
//       className="w-full border px-3 py-2 rounded"
//       placeholder="Enter student user_id"
//       value={studentId}
//       onChange={(e) => setStudentId(e.target.value)}
//     />
//     <button
//       className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
//       onClick={() => fetchSubjectsForResult(studentId)}
//     >
//       Load Subjects
//     </button>
//   </div>

//   {resultEntries.length > 0 && (
//     <div className="space-y-4">
//       {resultEntries.map((subj) => (
//         <div key={subj.subject_id} className="p-4 bg-indigo-50 rounded-lg shadow">
//           <h4 className="text-lg font-bold text-indigo-800 mb-2">
//             {subj.subject_name} ({subj.subject_code})
//           </h4>
//           <div className="grid grid-cols-2 gap-4">
//             <input
//               type="number"
//               placeholder="Mid Term Score"
//               className="border px-3 py-2 rounded"
//               value={subj.mid_term_score}
//               onChange={(e) => handleScoreChange(subj.subject_id, 'mid_term_score', e.target.value)}
//             />
//             <input
//               type="number"
//               placeholder="End Term Score"
//               className="border px-3 py-2 rounded"
//               value={subj.end_term_score}
//               onChange={(e) => handleScoreChange(subj.subject_id, 'end_term_score', e.target.value)}
//             />
//           </div>
//         </div>
//       ))}

//       <button
//         className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
//         onClick={handleResultSubmit}
//       >
//         Submit Results
//       </button>
//     </div>
//   )}
// </section>

//         </section>
//       </main>
//     </div>
//   );
// };

// export default StaffDashboard;
import React, { useEffect, useState } from 'react';
import { supabase } from '../Config/Config';
import { FiLogOut, FiUser, FiCalendar, FiUsers, FiClock, FiBook, FiBell, FiAward } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StaffDashboard = () => {
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [subjectList, setSubjectList] = useState([]);
  const [selectedSection, setSelectedSection] = useState('1A'); // Default section
  const [activeTab, setActiveTab] = useState('profile'); // For tab navigation
  const [loading, setLoading] = useState(false);

  // Schedule state
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [roomNo, setRoomNo] = useState('');
  const [block, setBlock] = useState('');

  // Results state
  const [studentId, setStudentId] = useState('');
  const [resultEntries, setResultEntries] = useState([]);
  const [studentDetails, setStudentDetails] = useState(null);

  // Notice state
  const [noticeTopic, setNoticeTopic] = useState('');
  const [noticeDescription, setNoticeDescription] = useState('');
  const [notices, setNotices] = useState([]);

  // Fetch all data on component mount
  useEffect(() => {
    const initDashboard = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        await fetchSubjects(parsedUser.user_id);
        await fetchNotices(parsedUser.user_id);
        await fetchStudents('1A'); // Fetch students for default section
      } else {
        window.location.href = "/login";
      }
    };

    initDashboard();
  }, []);

  // Fetch notices
  const fetchNotices = async (staffId) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('notice')
      .select('*')
      .eq('staff_id', staffId)
      .order('date', { ascending: false })
      .order('time', { ascending: false });

    if (!error) {
      setNotices(data);
    } else {
      toast.error("Failed to fetch notices");
    }
    setLoading(false);
  };

  // Fetch student details
  const fetchStudentDetails = async (stuId) => {
    if (!stuId) return;
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', stuId)
      .single();

    if (!error) {
      setStudentDetails(data);
    } else {
      setStudentDetails(null);
      toast.error("Student not found");
    }
  };

  // Fetch subjects for result entry
  const fetchSubjectsForResult = async (stuId) => {
    if (!stuId) {
      toast.warn("Please enter a valid student ID");
      return;
    }

    await fetchStudentDetails(stuId);
    setLoading(true);

    // Fetch existing results
    const { data: existingResults, error: resultErr } = await supabase
      .from('results')
      .select('*')
      .eq('user_id', stuId);

    if (resultErr) {
      toast.error("Error fetching existing results");
      setLoading(false);
      return;
    }

    // Map existing results
    const resultMap = {};
    existingResults.forEach(res => {
      resultMap[res.subject_id] = {
        mid_term_score: res.mid_term_score,
        end_term_score: res.end_term_score,
        result_id: res.result_id,
      };
    });

    // Prepare subject entries
    const filteredSubjects = subjectList.map(subj => ({
      ...subj,
      mid_term_score: resultMap[subj.subject_id]?.mid_term_score ?? '',
      end_term_score: resultMap[subj.subject_id]?.end_term_score ?? '',
      result_id: resultMap[subj.subject_id]?.result_id || null,
    }));

    setResultEntries(filteredSubjects);
    setLoading(false);
  };

  // Handle score changes
  const handleScoreChange = (subjectId, field, value) => {
    // Validate score range (0-100)
    if (value !== '' && (parseFloat(value) < 0 || parseFloat(value) > 100)) {
      toast.warn("Score must be between 0 and 100");
      return;
    }
    
    setResultEntries(prev =>
      prev.map(entry =>
        entry.subject_id === subjectId ? { ...entry, [field]: value } : entry
      )
    );
  };

  // Submit results
  const handleResultSubmit = async () => {
    if (!studentId) {
      toast.warn("Please enter a student ID first");
      return;
    }

    setLoading(true);
    let hasError = false;

    for (const entry of resultEntries) {
      const { subject_id, mid_term_score, end_term_score, result_id } = entry;

      const cleanMid = mid_term_score !== '' ? parseFloat(mid_term_score) : null;
      const cleanEnd = end_term_score !== '' ? parseFloat(end_term_score) : null;

      try {
        if (result_id) {
          // Update existing
          const { error } = await supabase
            .from('results')
            .update({
              mid_term_score: cleanMid,
              end_term_score: cleanEnd
            })
            .eq('result_id', result_id);

          if (error) throw error;
        } else {
          // Insert new
          const { error } = await supabase
            .from('results')
            .insert([{
              user_id: studentId,
              subject_id,
              mid_term_score: cleanMid,
              end_term_score: cleanEnd
            }]);

          if (error) throw error;
        }
      } catch (error) {
        console.error("Error saving result:", error);
        hasError = true;
        toast.error(`Failed to save result for subject ID: ${subject_id}`);
      }
    }

    setLoading(false);
    if (!hasError) {
      toast.success("Results saved successfully!");
      }
  };

  // Handle schedule submission
  const handleScheduleSubmit = async () => {
    if (!selectedSubject || !scheduleDate || !scheduleTime || !roomNo || !block) {
      toast.warn("Please fill all schedule fields");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from('classes_schedule').insert([{
      subject_id: selectedSubject,
      date: scheduleDate,
      time: scheduleTime,
      room_no: roomNo,
      block: block,
      staff_id: user.user_id
    }]);

    setLoading(false);
    if (error) {
      toast.error("Failed to add schedule");
      console.error(error);
    } else {
      toast.success("Schedule added successfully!");
      setScheduleDate('');
      setScheduleTime('');
      setRoomNo('');
      setBlock('');
    }
  };

  // Handle notice submission
  const handleNoticeSubmit = async () => {
    if (!noticeTopic.trim()) {
      toast.warn("Please enter a notice topic");
      return;
    }

    setLoading(true);
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0];

    const { error } = await supabase.from('notice').insert([{
      topic: noticeTopic,
      description: noticeDescription,
      staff_id: user.user_id,
      date,
      time,
    }]);

    setLoading(false);
    if (error) {
      toast.error("Failed to post notice");
      console.error(error);
    } else {
      toast.success("Notice posted successfully!");
      setNoticeTopic('');
      setNoticeDescription('');
      fetchNotices(user.user_id);
    }
  };

  // Fetch subjects assigned to staff
  const fetchSubjects = async (staffId) => {
    setLoading(true);
    const { data: assigned, error: err1 } = await supabase
      .from('staff_subjects')
      .select('subject_id')
      .eq('staff_id', staffId);

    if (err1 || !assigned) {
      toast.error("Error fetching assigned subjects");
      setLoading(false);
      return;
    }

    const subjectIds = assigned.map(s => s.subject_id);

    const { data: subjects, error: err2 } = await supabase
      .from('subjects')
      .select('subject_id, subject_name, subject_code')
      .in('subject_id', subjectIds);

    if (err2) {
      toast.error("Error fetching subject details");
    } else {
      setSubjectList(subjects);
      if (subjects.length > 0) {
        setSelectedSubject(subjects[0].subject_id); // Set first subject as default
      }
    }
    setLoading(false);
  };

  // Fetch students by section
  const fetchStudents = async (section) => {
    if (!section) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('users')
      .select('user_id, name, email')
      .eq('section', section)
      .eq('role', 'student')
      .order('name', { ascending: true });

    if (!error) {
      setStudents(data);
      // Initialize attendance state
      const initialAttendance = {};
      data.forEach((stu) => {
        initialAttendance[stu.user_id] = '';
      });
      setAttendance(initialAttendance);
    } else {
      toast.error("Error fetching students");
    }
    setLoading(false);
  };

  // Handle section change
  useEffect(() => {
    if (selectedSection) {
      fetchStudents(selectedSection);
    }
  }, [selectedSection]);

  // Handle attendance change
  const handleAttendanceChange = (studentId, present) => {
    setAttendance({ ...attendance, [studentId]: present });
  };

  // Submit attendance
  const handleSubmit = async () => {
    if (!selectedSubject || !selectedSection || !selectedDate) {
      toast.warn('Please select subject, section, and date');
      return;
    }

    setLoading(true);
    // Check for existing attendance
    const studentIds = students.map(s => s.user_id);
    const { data: existing, error: checkError } = await supabase
      .from('attendance')
      .select('*')
      .in('student_id', studentIds)
      .eq('subject_id', selectedSubject)
      .eq('date', selectedDate);

    if (existing?.length > 0) {
      toast.warn("Attendance already marked for this date");
      setLoading(false);
      return;
    }

    // Prepare records
    const records = students.map((stu) => ({
      student_id: stu.user_id,
      subject_id: selectedSubject,
      date: selectedDate,
      status: attendance[stu.user_id] || 'absent',
      marked_by: user.user_id
    }));

    // Insert records
    const { error: insertError } = await supabase
      .from('attendance')
      .insert(records);

    setLoading(false);
    if (insertError) {
      toast.error("Failed to mark attendance");
      console.error(insertError);
    } else {
      toast.success("Attendance marked successfully!");
    }
  };

  // Loading state
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Toast notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-800 text-white flex flex-col p-4 space-y-6 shadow-lg sticky top-0 h-screen">
        <h2 className="text-2xl font-bold text-center py-4 border-b border-indigo-700">
          {user.department || 'Faculty'} Dashboard
        </h2>
        
        <nav className="flex flex-col gap-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'profile' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
          >
            <FiUser className="text-lg" />
            <span>My Profile</span>
          </button>
          
          <button
            onClick={() => setActiveTab('attendance')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'attendance' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
          >
            <FiCalendar className="text-lg" />
            <span>Attendance</span>
          </button>
          
          <button
            onClick={() => setActiveTab('students')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'students' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
          >
            <FiUsers className="text-lg" />
            <span>Students</span>
          </button>
          
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'schedule' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
          >
            <FiClock className="text-lg" />
            <span>Schedule</span>
          </button>
          
          <button
            onClick={() => setActiveTab('notices')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'notices' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
          >
            <FiBell className="text-lg" />
            <span>Notices</span>
          </button>
          
          <button
            onClick={() => setActiveTab('results')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'results' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
          >
            <FiAward className="text-lg" />
            <span>Results</span>
          </button>
        </nav>
        
        <button 
          onClick={() => {
            localStorage.removeItem('user');
            window.location.href = '/login';
          }}
          className="mt-auto flex items-center gap-3 px-4 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition"
        >
          <FiLogOut className="text-lg" />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl flex items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
              <span>Processing...</span>
            </div>
          </div>
        )}

        {/* Profile Section */}
        {activeTab === 'profile' && (
          <section className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-2xl font-semibold mb-6 text-indigo-800 flex items-center gap-2">
              <FiUser /> My Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="font-medium text-indigo-700 mb-2">Personal Information</h4>
                  <div className="space-y-2">
                    <div><strong>Name:</strong> {user.name}</div>
                    <div><strong>User ID:</strong> {user.user_id}</div>
                    <div><strong>Email:</strong> {user.email || 'N/A'}</div>
                    <div><strong>Phone:</strong> {user.phone || 'N/A'}</div>
                  </div>
                </div>
                
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="font-medium text-indigo-700 mb-2">Professional Information</h4>
                  <div className="space-y-2">
                    <div><strong>Department:</strong> {user.department || 'N/A'}</div>
                    <div><strong>Designation:</strong> {user.designation || 'N/A'}</div>
                    <div><strong>Experience:</strong> {user.experience_years || '0'} years</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-medium text-indigo-700 mb-2">Assigned Subjects</h4>
                {subjectList.length > 0 ? (
                  <ul className="space-y-2">
                    {subjectList.map(subj => (
                      <li key={subj.subject_id} className="flex justify-between items-center bg-white p-3 rounded shadow-sm">
                        <span>{subj.subject_name}</span>
                        <span className="text-sm bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                          {subj.subject_code}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No subjects assigned</p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Attendance Section */}
        {activeTab === 'attendance' && (
          <section className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-2xl font-semibold mb-6 text-indigo-800 flex items-center gap-2">
              <FiCalendar /> Mark Attendance
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block mb-2 text-gray-700 font-medium">Subject</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  <option value="">Select Subject</option>
                  {subjectList.map((subj) => (
                    <option key={subj.subject_id} value={subj.subject_id}>
                      {subj.subject_name} ({subj.subject_code})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block mb-2 text-gray-700 font-medium">Section</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                >
                  <option value="1A">1A</option>
                  <option value="1B">1B</option>
                  <option value="2A">2A</option>
                  <option value="2B">2B</option>
                </select>
              </div>
              
              <div>
                <label className="block mb-2 text-gray-700 font-medium">Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-4 mb-6">
              <button 
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center gap-2"
                onClick={() => {
                  const newAttendance = {};
                  students.forEach(stu => newAttendance[stu.user_id] = 'present');
                  setAttendance(newAttendance);
                }}
              >
                <span>Mark All Present</span>
              </button>
              
              <button 
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center gap-2"
                onClick={() => {
                  const newAttendance = {};
                  students.forEach(stu => newAttendance[stu.user_id] = 'absent');
                  setAttendance(newAttendance);
                }}
              >
                <span>Mark All Absent</span>
              </button>
            </div>
            
            <div className="space-y-3 mb-6">
              {students.length > 0 ? (
                students.map((stu) => (
                  <div key={stu.user_id} className="flex justify-between items-center border border-gray-200 p-4 rounded-lg hover:bg-gray-50">
                    <div>
                      <span className="font-medium">{stu.name}</span>
                      <span className="text-sm text-gray-500 block">{stu.email}</span>
                    </div>
                    
                    <select
                      className="border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-indigo-500"
                      value={attendance[stu.user_id] || ''}
                      onChange={(e) => handleAttendanceChange(stu.user_id, e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                    </select>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No students found in selected section
                </div>
              )}
            </div>
            
            <button
              className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
              onClick={handleSubmit}
              disabled={loading}
            >
              Submit Attendance
            </button>
          </section>
        )}

        {/* Students Section */}
        {activeTab === 'students' && (
          <section className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-2xl font-semibold mb-6 text-indigo-800 flex items-center gap-2">
              <FiUsers /> Students in Section {selectedSection}
            </h3>
            
            <div className="mb-6">
              <label className="block mb-2 text-gray-700 font-medium">Select Section</label>
              <select
                className="w-full md:w-1/3 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                <option value="1A">1A</option>
                <option value="1B">1B</option>
                <option value="2A">2A</option>
                <option value="2B">2B</option>
              </select>
            </div>
            
            {students.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {students.map((stu) => (
                  <div key={stu.user_id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="font-medium text-lg">{stu.name}</div>
                    <div className="text-sm text-gray-600 mt-1">ID: {stu.user_id}</div>
                    <div className="text-sm text-gray-600">Email: {stu.email}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                No students found in selected section
              </div>
            )}
          </section>
        )}

        {/* Schedule Section */}
        {activeTab === 'schedule' && (
          <section className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-2xl font-semibold mb-6 text-indigo-800 flex items-center gap-2">
              <FiClock /> Class Schedule
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block mb-2 text-gray-700 font-medium">Subject</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  <option value="">Select Subject</option>
                  {subjectList.map((subj) => (
                    <option key={subj.subject_id} value={subj.subject_id}>
                      {subj.subject_name} ({subj.subject_code})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block mb-2 text-gray-700 font-medium">Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div>
                <label className="block mb-2 text-gray-700 font-medium">Time</label>
                <input
                  type="time"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block mb-2 text-gray-700 font-medium">Room Number</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="E.g. 204"
                  value={roomNo}
                  onChange={(e) => setRoomNo(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block mb-2 text-gray-700 font-medium">Block</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="E.g. C Block"
                  value={block}
                  onChange={(e) => setBlock(e.target.value)}
                />
              </div>
            </div>
            
            <button
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
              onClick={handleScheduleSubmit}
              disabled={loading}
            >
              Submit Schedule
            </button>
          </section>
        )}

        {/* Notices Section */}
        {activeTab === 'notices' && (
          <section className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-2xl font-semibold mb-6 text-indigo-800 flex items-center gap-2">
                <FiBell /> Post Notice
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-gray-700 font-medium">Notice Topic</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter notice topic"
                    value={noticeTopic}
                    onChange={(e) => setNoticeTopic(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block mb-2 text-gray-700 font-medium">Description</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows={4}
                    placeholder="Enter notice description"
                    value={noticeDescription}
                    onChange={(e) => setNoticeDescription(e.target.value)}
                  />
                </div>
                
                <button
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
                  onClick={handleNoticeSubmit}
                  disabled={loading}
                >
                  Post Notice
                </button>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-2xl font-semibold mb-6 text-indigo-800 flex items-center gap-2">
                <FiBell /> Previous Notices
              </h3>
              
              {notices.length > 0 ? (
                <div className="space-y-4">
                  {notices.map((notice) => (
                    <div key={notice.notice_id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-lg">{notice.topic}</h4>
                        <span className="text-sm text-gray-500">
                          {notice.date} at {notice.time.split(':').slice(0, 2).join(':')}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-700">{notice.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                  No notices posted yet
                </div>
              )}
            </div>
          </section>
        )}

        {/* Results Section */}
        {activeTab === 'results' && (
          <section className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-2xl font-semibold mb-6 text-indigo-800 flex items-center gap-2">
              <FiAward /> Enter Student Results
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block mb-2 text-gray-700 font-medium">Student ID (Roll No)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter student user_id"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                  />
                  <button
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                    onClick={() => fetchSubjectsForResult(studentId)}
                    disabled={loading}
                  >
                    Load
                  </button>
                </div>
              </div>
              
              {studentDetails && (
                <div className="md:col-span-2 bg-indigo-50 p-4 rounded-lg">
                  <h4 className="font-medium text-indigo-700 mb-2">Student Details</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div><strong>Name:</strong> {studentDetails.name}</div>
                    <div><strong>Section:</strong> {studentDetails.section}</div>
                    <div><strong>Email:</strong> {studentDetails.email}</div>
                    <div><strong>Phone:</strong> {studentDetails.phone || 'N/A'}</div>
                  </div>
                </div>
              )}
            </div>
            
            {resultEntries.length > 0 && (
              <div className="space-y-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-indigo-50">
                      <tr>
                        <th className="py-3 px-4 text-left font-medium text-indigo-700">Subject</th>
                        <th className="py-3 px-4 text-left font-medium text-indigo-700">Code</th>
                        <th className="py-3 px-4 text-left font-medium text-indigo-700">Mid Term (0-100)</th>
                        <th className="py-3 px-4 text-left font-medium text-indigo-700">End Term (0-100)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {resultEntries.map((subj) => (
                        <tr key={subj.subject_id} className="hover:bg-gray-50">
                          <td className="py-3 px-4">{subj.subject_name}</td>
                          <td className="py-3 px-4">{subj.subject_code}</td>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              className="w-24 border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-indigo-500"
                              value={subj.mid_term_score}
                              onChange={(e) => handleScoreChange(subj.subject_id, 'mid_term_score', e.target.value)}
                            />
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              className="w-24 border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-indigo-500"
                              value={subj.end_term_score}
                              onChange={(e) => handleScoreChange(subj.subject_id, 'end_term_score', e.target.value)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <button
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium"
                  onClick={handleResultSubmit}
                  disabled={loading}
                >
                  Submit Results
                </button>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default StaffDashboard;