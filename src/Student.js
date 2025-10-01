// // src/Student.js
// import React, {useState, useEffect} from 'react';
// import socket from './socket';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LabelList, Cell } from 'recharts';


// export default function Student(){
//   const [name, setName] = useState(() => sessionStorage.getItem('poll_name') || '');
//   const [pollId, setPollId] = useState('');
//   const [joined, setJoined] = useState(false);
//   const [current, setCurrent] = useState(null);
//   const [answered, setAnswered] = useState(false);
//   const [results, setResults] = useState(null);

//   useEffect(()=>{
//   socket.on('question:start', (q)=> {
//     setCurrent(q);
//     setAnswered(false);
//     setResults(null);
//   });

//   socket.on('question:partial', ({partial})=>{
//     setResults(prev => ({...prev, partial}));
//   });

//   socket.on('question:end', ({results, correctIndex, options})=>{
//     setResults({ ...results, correctIndex, options });
//     setCurrent(null);
//   });

//   return ()=> {
//     socket.off('question:start');
//     socket.off('question:partial');
//     socket.off('question:end');
//   }
// },[]);




//   function saveName(){
//     sessionStorage.setItem('poll_name', name);
//     alert('Name saved for this tab as: '+name);
//   }

//   function join(){
//     if(!name) return alert('Enter name first');
//     socket.emit('student:join', {pollId, name}, (res)=>{
//       if(res.ok){ setJoined(true); } else alert(res.error || 'Error joining');
//     });
//   }

//   function answer(idx){
//     if(answered) return;
//     socket.emit('student:answer', {pollId, optionIndex: idx}, (res)=>{
//       if(res.ok) setAnswered(true);
//       else alert(res.error || 'Error sending answer');
//     });
//   }

//   return (
//     <div>
//       <h2>Student panel</h2>
//       <div>
//         <input placeholder="Your name (per-tab)" value={name} onChange={e=>setName(e.target.value)} />
//         <button onClick={saveName}>Save name for this tab</button>
//       </div>
//       <div style={{marginTop:10}}>
//         <input placeholder="Poll ID" value={pollId} onChange={e=>setPollId(e.target.value)} />
//         <button onClick={join}>Join Poll</button>
//       </div>

//       {joined && <>
//         <div style={{marginTop:20}}>
//           <h3>Current question</h3>
//           {current ? (
//             <div>
//               <div><b>{current.question}</b></div>
//               <div>
//                 {current.options.map((opt,i)=>(
//                   <button key={i} onClick={()=>answer(i)} disabled={answered} style={{display:'block', margin:'6px 0'}}>
//                     {opt}
//                   </button>
//                 ))}
//               </div>
//               <div>Ends at: {new Date(current.endsAt).toLocaleTimeString()}</div>
//             </div>
//           ) : <div>No active question right now. Wait for teacher.</div>}
//         </div>

//         <div style={{marginTop:20}}>
//   <h3>Results</h3>
//   {results && results.options ? (
//     <BarChart width={400} height={300} data={results.options.map((opt, i) => ({
//       option: opt,
//       votes: results.counts[i],
//       correct: i === results.correctIndex
//     }))}>
//       <CartesianGrid strokeDasharray="3 3" />
//       <XAxis dataKey="option" />
//       <YAxis allowDecimals={false} />
//       <Tooltip />
//       <Bar dataKey="votes">
//         {results.options.map((entry, index) => (
//           <Cell key={`cell-${index}`} fill={index === results.correctIndex ? "green" : "#8884d8"} />
//         ))}
//         <LabelList dataKey="votes" position="top" />
//       </Bar>
//     </BarChart>
//   ) : (
//     <div>Results will show after you answer or when time ends.</div>
//   )}
// </div>


//       </>}
//     </div>
//   );
// }



// src/Student.js
import React, { useState, useEffect } from 'react';
import socket from './socket';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LabelList, Cell } from 'recharts';

export default function Student() {
  const [name, setName] = useState(() => sessionStorage.getItem('poll_name') || '');
  const [pollId, setPollId] = useState('');
  const [joined, setJoined] = useState(false);
  const [current, setCurrent] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    socket.on('question:start', q => {
      setCurrent(q);
      setAnswered(false);
      setResults(null);
    });
    socket.on('question:end', ({ results, correctIndex, options }) => {
      setResults({ ...results, correctIndex, options });
      setCurrent(null);
    });
    return () => {
      socket.off('question:start');
      socket.off('question:end');
    };
  }, []);

  function saveName() {
    sessionStorage.setItem('poll_name', name);
    alert(`Name saved: ${name}`);
  }

  function join() {
    if (!name) return alert('Enter name first');
    socket.emit('student:join', { pollId, name }, res => {
      if (res.ok) setJoined(true);
      else alert(res.error || 'Error joining poll');
    });
  }

  function answer(idx) {
    if (answered) return;
    socket.emit('student:answer', { pollId, optionIndex: idx }, res => {
      if (res.ok) setAnswered(true);
      else alert(res.error || 'Error answering');
    });
  }

  return (
    <div>
      <h2>Student Panel</h2>
      <div>
        <input placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
        <button onClick={saveName}>Save name</button>
      </div>
      <div style={{ marginTop: 10 }}>
        <input placeholder="Poll ID" value={pollId} onChange={e => setPollId(e.target.value)} />
        <button onClick={join}>Join Poll</button>
      </div>

      {joined && (
        <>
          <div style={{ marginTop: 20 }}>
            <h3>Current Question</h3>
            {current ? (
              <div>
                <div><b>{current.question}</b></div>
                {current.options.map((opt, i) => (
                  <button key={i} onClick={() => answer(i)} disabled={answered} style={{ display: 'block', margin: '6px 0' }}>
                    {opt}
                  </button>
                ))}
                <div>Ends at: {new Date(current.endsAt).toLocaleTimeString()}</div>
              </div>
            ) : <div>No active question</div>}
          </div>

          <div style={{ marginTop: 20 }}>
            <h3>Results</h3>
            {results && results.options ? (
              <BarChart width={400} height={300} data={results.options.map((opt, idx) => ({
                option: opt,
                votes: results.counts[idx],
                correct: idx === results.correctIndex
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="option" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="votes">
                  {results.options.map((entry, index) => (
                    <Cell key={index} fill={index === results.correctIndex ? "green" : "#8884d8"} />
                  ))}
                  <LabelList dataKey="votes" position="top" />
                </Bar>
              </BarChart>
            ) : (
              <div>Results will show after you answer or when time ends.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
