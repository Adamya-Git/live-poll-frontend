// // src/Teacher.js
// import React, {useState, useEffect} from 'react';
// import socket from './socket';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LabelList, Cell } from 'recharts';


// export default function Teacher(){
//   const [pollId, setPollId] = useState('');
//   const [title, setTitle] = useState('');
//   const [current, setCurrent] = useState(null);
//   const [students, setStudents] = useState([]);
//   const [history, setHistory] = useState([]);

//   useEffect(() => {
//     socket.on('student:list', (list) => setStudents(list));
//     socket.on('question:start', (q) => {
//       setCurrent({question: q.question, options: q.options, endsAt: q.endsAt});
//     });
//     socket.on('question:partial', ({partial}) => {
//       setCurrent(c => ({...c, partial}));
//     });
//     socket.on('question:end', ({results}) => {
//       setHistory(h => [...h, {results}]);
//       setCurrent(null);
//     });
//     return () => {
//       socket.off('student:list');
//       socket.off('question:start');
//       socket.off('question:partial');
//       socket.off('question:end');
//     }
//   }, []);

//   function createPoll(){
//     socket.emit('teacher:create-poll', {title}, (res) => {
//       if (res?.pollId) {
//         setPollId(res.pollId);
//         alert('Created poll: ' + res.pollId);
//       } else alert('Error creating poll');
//     });
//   }

//   function startQuestion(){
//   const q = prompt('Enter question text');
//   if(!q) return;
//   const ops = prompt('Options (comma separated)').split(',').map(s=>s.trim());
//   const correctStr = prompt('Which option number is correct? (1-based index)');
//   const correctIndex = parseInt(correctStr) - 1;
//   const durationStr = prompt('Duration seconds (default 60)', '60');
//   const duration = parseInt(durationStr) || 60;
//   socket.emit('teacher:start-question', {pollId, question: q, options: ops, duration, correctIndex}, (res)=>{
//     if(!res.ok) alert('Error: ' + res.error);
//   });
// }


//   return (
//     <div>
//       <h2>Teacher panel</h2>
//       <div>
//         <input placeholder="Poll title" value={title} onChange={e=>setTitle(e.target.value)} />
//         <button onClick={createPoll}>Create Poll</button>
//       </div>
//       <div style={{marginTop:10}}>
//         <strong>Poll ID:</strong> {pollId || '— create a poll'}
//         {pollId && <>
//           <div>Share this poll ID with students: <code>{pollId}</code></div>
//           <button style={{marginTop:8}} onClick={startQuestion}>Start Question</button>
//         </>}
//       </div>

//       <div style={{marginTop:20}}>
//         <h3>Students ({students.length})</h3>
//         <ul>{students.map((s,i)=><li key={i}>{s}</li>)}</ul>
//       </div>

//       <div style={{marginTop:20}}>
//         <h3>Current Question</h3>
//         {current ? (
//           <div>
//             <div><b>{current.question}</b></div>
//             <div>Options: {current.options.join(' | ')}</div>
//             <div>Ends at: {new Date(current.endsAt).toLocaleTimeString()}</div>
//             <div>Partial: {current.partial ? JSON.stringify(current.partial) : '—'}</div>
//           </div>
//         ) : <div>No active question</div>}
//       </div>

//       <div style={{marginTop:20}}>
//         <h3>History</h3>
//         {history.length === 0 && <div>No history yet</div>}
//         {history.map((h,i)=>(
//           <div key={i} style={{marginBottom:20}}>
//             <div><b>Question {i+1}</b></div>
//             <BarChart width={400} height={300} data={h.options.map((opt, idx) => ({
//               option: opt,
//               votes: h.results.counts[idx],
//               correct: idx === h.correctIndex
//             }))}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="option" />
//               <YAxis allowDecimals={false} />
//               <Tooltip />
//               <Bar dataKey="votes">
//                 {h.options.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={index === h.correctIndex ? "green" : "#8884d8"} />
//                 ))}
//                 <LabelList dataKey="votes" position="top" />
//               </Bar>
//             </BarChart>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


// src/Teacher.js
import React, { useState, useEffect } from 'react';
import socket from './socket';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LabelList, Cell } from 'recharts';

export default function Teacher() {
  const [pollId, setPollId] = useState('');
  const [title, setTitle] = useState('');
  const [current, setCurrent] = useState(null);
  const [students, setStudents] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    socket.on('student:list', list => setStudents(list));
    socket.on('question:start', q => setCurrent(q));
    socket.on('question:end', ({ results, correctIndex, options }) => {
      setHistory(h => [...h, { results, correctIndex, options }]);
      setCurrent(null);
    });
    return () => {
      socket.off('student:list');
      socket.off('question:start');
      socket.off('question:end');
    };
  }, []);

  function createPoll() {
    socket.emit('teacher:create-poll', { title }, res => {
      if (res?.pollId) setPollId(res.pollId);
      else alert(res.error || 'Error creating poll');
    });
  }

  function startQuestion() {
    const q = prompt('Enter question text');
    if (!q) return;
    const ops = prompt('Options (comma separated)').split(',').map(s => s.trim());
    const correctStr = prompt('Which option number is correct? (1-based)');
    const correctIndex = parseInt(correctStr) - 1;
    const duration = parseInt(prompt('Duration seconds (default 60)', '60')) || 60;
    socket.emit('teacher:start-question', { pollId, question: q, options: ops, duration, correctIndex }, res => {
      if (!res.ok) alert(res.error || 'Error starting question');
    });
  }

  return (
    <div>
      <h2>Teacher Panel</h2>
      <div>
        <input placeholder="Poll title" value={title} onChange={e => setTitle(e.target.value)} />
        <button onClick={createPoll}>Create Poll</button>
      </div>

      <div style={{ marginTop: 10 }}>
        <strong>Poll ID:</strong> {pollId || '—'}
        {pollId && (
          <>
            <div>Share this Poll ID with students: <code>{pollId}</code></div>
            <button style={{ marginTop: 8 }} onClick={startQuestion}>Start Question</button>
          </>
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Students ({students.length})</h3>
        <ul>{students.map((s, i) => <li key={i}>{s}</li>)}</ul>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Current Question</h3>
        {current ? (
          <div>
            <div><b>{current.question}</b></div>
            <div>Options: {current.options.join(' | ')}</div>
            <div>Ends at: {new Date(current.endsAt).toLocaleTimeString()}</div>
          </div>
        ) : <div>No active question</div>}
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>History</h3>
        {history.length === 0 && <div>No history yet</div>}
        {history.map((h, i) => (
          <div key={i} style={{ marginBottom: 20 }}>
            <b>Question {i + 1}</b>
            <BarChart width={400} height={300} data={h.options.map((opt, idx) => ({
              option: opt,
              votes: h.results.counts[idx],
              correct: idx === h.correctIndex
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="option" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="votes">
                {h.options.map((entry, index) => (
                  <Cell key={index} fill={index === h.correctIndex ? "green" : "#8884d8"} />
                ))}
                <LabelList dataKey="votes" position="top" />
              </Bar>
            </BarChart>
          </div>
        ))}
      </div>
    </div>
  );
}

