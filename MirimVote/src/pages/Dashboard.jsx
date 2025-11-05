import styled from '@emotion/styled'
import Background from "../components/Background";
import Footer from "../components/Footer";
import Header from "../components/Header";
import VoteList from "../components/VoteList";
import { Page, Main } from "../components/Page";
import { useEffect, useState } from 'react';

export default function Dashboard() {
    const [voteData, setVoteData] = useState([]);

    useEffect(() => {
        async function schoolfecth() {
            try {
                const response = await fetch('http://localhost:3000/apivoteschool-president/all')
                const data = await response.json()
                console.log(data);

                setVoteData(prevVoteData => {
                    const newVotes = [];
                    const existingYears = new Set(
                        prevVoteData
                            .filter(vote => vote.type === 'school')
                            .map(vote => vote.year)
                    );

                    for (const item of data.list) {
                        const year = item.year;
                        if (!existingYears.has(year)) {
                            existingYears.add(year);
                            newVotes.push({
                                type: 'school',
                                title: "전교회장 선거",
                                year: year,
                                finish: false
                            });
                        }
                    }
                    return [...prevVoteData, ...newVotes];
                });
            }
            catch (error) {
                console.error("에러 발생 : ", error);
            }
        }
        schoolfecth();
    }, [])

    useEffect(() => {
        async function classfecth() {
            try {
                const response = await fetch('http://localhost:3000/apivoteclass-president/all')
                const data = await response.json()
                console.log(data);

                setVoteData(prevVoteData => {
                    const newVotes = [];
                    const existingKeys = new Set(
                        prevVoteData
                            .filter(vote => vote.type === 'class')
                            .map(vote => `${vote.year}|${vote.semester}|${vote.grade}|${vote.classNum}`)
                    );

                    for (const item of data.list) {
                        const key = `${item.year}|${item.semester}|${item.grade}|${item.classNum}`;
                        if (!existingKeys.has(key)) {
                            existingKeys.add(key); 
                            newVotes.push({
                                type: 'class',
                                title: `${item.grade}학년 ${item.classNum}반 학급회장 선거`,
                                year: item.year,
                                finish: false,
                                semester: item.semester,
                                grade: item.grade,
                                classNum: item.classNum
                            });
                        }
                    }
                    return [...prevVoteData, ...newVotes];
                });
            }
            catch (error) {
                console.error("에러 발생 : ", error);
            }
        }
        classfecth();
    }, [])
    
    // const data = [
    //     { id: 1, title: "전교회장 선거", finish: false, type: "school", year: 2025 },
    //     { id: 2, title: "2학기 학급회장 선거", finish: false, type: "class", year: 2025, grade: 2, class: 4, semester: 2 },
    //     { id: 3, title: "1학기 학급회장 선거", finish: true, type: "class", year: 2025, grade: 2, class: 4, semester: 1 },

    // ]
    console.log(voteData);

    return (
        <Page>
            <Header />
            <Main>
                <Background />
                <VoteList list={voteData} />
            </Main>
            <Footer />
        </Page>
    )
}

