import styled from '@emotion/styled'
import Background from "../components/Background";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { Button } from "../components/VoteButton";
import { Title, SubTitle } from "../components/VoteTitles";
import { Page, Main } from "../components/Page";
import { useState, useEffect } from "react";

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 40px;
`;

const Card = styled.div`
  display: flex;
  width: 66%;
  align-items: center;
  background: #fff;
  border-radius: 16px;
  border: 2px solid ${({ selected }) => (selected ? "#4b7c5a" : "#222")};
  padding: 24px;
  cursor: pointer;
  
  transition: box-shadow 0.2s, border 0.2s;
`;

const Number = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #e6f4e6;
  border: 1px solid #666;
  color: #288157;
  font-size: 48px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24px;
`;

const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Names = styled.div`
  font-size: 30px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const Desc = styled.div`
  font-size: 18px;
  font-weight: 300;
  color: #444;
`;

const SelectedInfo = styled.div`
  text-align: center;
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 24px;
`;


export default function Vote() {
    const [selected, setSelected] = useState(null);
    const [data, setData] = useState([]);

    const url = new URL(window.location.href);
    const urlParams = url.searchParams;
    const info = [urlParams.get('year')]
    const type = urlParams.get('type');
    if (type == 'class') {
        info.push(urlParams.get('semester'));
        info.push(urlParams.get('grade'));
        info.push(urlParams.get('class'));
    }

    useEffect(() => {
        let query = `?year=${info[0]}`;
        if (type == 'class') {
            query += `&semester=${info[1]}&grade=${info[2]}&class=${info[3]}`;
        }

        async function fetchData() {
            try {
                const response = await fetch(`http://localhost:3000/apivote${type}-president${query}`);
                const responseData = await response.json();
                console.log("Fetched data:", responseData);
                setData(responseData.list);
            }
            catch (error) {
                console.error("에러 발생 : ", error)
            }
        }

        fetchData();

    }, []);

    // 선택한 후보를 서버에 제출
    function handleSubmit(selected) {
        if (selected == null) {
            alert("후보를 선택해주세요.");
            return;
        }

        fetch(`http://localhost:3000/apivote${type}-president/${data[selected].number}/vote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => {
            if (res.ok) {
                window.location.href = "/vote/vote-end" + window.location.search;
            }
        }).catch(err => {
            alert("오류가 발생했습니다. 다시 시도해주세요.")
        });

    }

    return (
        <Page>
            <Header />
            <Background />
            <Main>
                <Title>{type === 'school' ? '전교회장 선거' : `${info[2]}학년 ${info[3]}반 학급회장 선거`}</Title>
                <SubTitle>{type === 'school' ? `${info[0]}학년도` : `${info[0]}학년도 ${info[1]}학기`}</SubTitle>
                <CardList style={{ alignItems: "center" }}>
                    {data.map((c, index) => (
                        <Card
                            key={index}
                            selected={selected === index}
                            onClick={() => setSelected(index)}
                            style={{
                                boxShadow: selected === index ? "6px 6px 0 #4b7c5a" : "none",
                                border: selected === index ? "3px solid #4b7c5a" : "1.5px solid #222",
                            }}
                        >
                            <Number>{index + 1}</Number>
                            <CardInfo>
                                <Names>{type === 'school' ? `${c.name1} / ${c.name2}` : c.name}</Names>
                            </CardInfo>
                        </Card>
                    ))}
                </CardList>
                <SelectedInfo>
                    {selected != null ? `선택한 후보 : ${selected + 1}번` : "후보를 선택해주세요."}
                </SelectedInfo>
                <Button onClick={() => handleSubmit(selected)}>선택 완료</Button>
            </Main>
            <Footer />
        </Page>
    );
}

