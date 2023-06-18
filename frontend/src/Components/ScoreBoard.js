import React, { useState } from 'react'
import axios from 'axios';
import { useEffect } from 'react';
import ScoreBoardTable from './ScoreBoardTable';
const URLcontest = "https://seceleaderboard.onrender.com/contests";
const URLuser = "https://seceleaderboard.onrender.com/users";

export default function Contests() {
  const fetchHandlerC = async () => {
    let data = await axios.get(URLcontest).then((res) => res.data);
    return data;
  }
  const fetchHandlerU = async () => {
    let data = await axios.get(URLuser).then((res) => res.data);
    return data;
  }

  const [contest, setcontest] = useState([])
  const [user, setuser] = useState([])
  useEffect(() => {
    fetchHandlerC().then(data => {
      setcontest(data.contests);
    });

  }, [])
  useEffect(() => {
    fetchHandlerU().then(data => {
      setuser(data.users);
    });
  }, [])
 

  let rank;
  let point = 0;
  const getpoints = ((rank) => {

    if (rank <= 1000)
      point = 10;
    else if (rank <= 2000)
      point = 9;
    else if (rank <= 3000)
      point = 8;
    else if (rank <= 5000)
      point = 7;
    else if (rank <= 7500)
      point = 6;
    else if (rank <= 10000)
      point = 5;
    else
      point = 3;
  })
  const data = new Map();
  for (let i = 0; i < contest.length; i++) {
    let temp = [];
    for (let j = 0; j < contest[i].details[0].length; j++) {
      rank = (contest[i].details[0][j].rank);
      getpoints(rank);

      let name = (contest[i].details[0][j].party.members[0].handle);
      temp.push({ name, point });

    }
    data.set(contest[i].contestNumber, temp);
  }
  const table=[];
  for (let i = 0; i < user.length; i++) {
    let name = (user[i].CFid);
    let temp = [];
    let TotalScore=0;
    data.forEach(function (value, key) {
      let flag = 0;
      for (let j = 0; j < value.length; j++) {
        if (value[j].name === name) {
          flag = 1;
          temp.push(value[j].point);
          TotalScore+=value[j].point;
          break;
        }
      }
      if (flag === 0)
        temp.push(0);
    })
    table.push({name,TotalScore, temp});
  }
  
  function compare( a, b ) {
    if ( a.TotalScore<b.TotalScore ){
      return 1;
    }
    if ( a.TotalScore> b.TotalScore ){
      return -1;
    }
    return 0;
  }
  
  table.sort( compare );

  let a=1;

  return (
    <div className="m-4 scrollmenu">
      <table className="table">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Codeforces ID</th>
            <th>Total Score</th>
            {
              contest.map((element) => {
                let contestLink = "https://codeforces.com/contest/" + element.contestNumber;
                return (
                  <th><a href={contestLink} target="_blank" rel="noreferrer">{element.contestNumber}</a></th>
                )
              })
            }

          </tr>
        </thead>
        <tbody>
        
        {
              table.map((element) => {
                return (
                  <ScoreBoardTable pos={a++}e={element}/>
                )
              })
            }

         
        



        </tbody>
      </table>


    </div>

  )
}
