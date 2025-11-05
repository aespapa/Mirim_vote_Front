import styled from '@emotion/styled'
import Background from "../components/Background";
import Footer from "../components/Footer";
import Header from "../components/Header";
import VoteManage from '../components/VoteManage';
import { Page, Main } from "../components/Page";
import { Title, SubTitle } from "../components/VoteTitles";
import { useEffect, useRef, useState } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const TitleBtn = styled.button`
    width: 120px;
    height: 40px;
    border-radius: 10px;
    border: 1px solid #888888;
    background-color: #F9F9F9;
    cursor: pointer;
    font-size: 24px;
    margin-left: 8px;
    font-family: "Pretendard Variable", Pretendard, system-ui, Roboto, 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif;
    color: ${props => props.color || 'black'};
`;
const FormBox = styled.form`
    /* display: flex; */
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
`;
const TitleText = styled.div`
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
`;
const TitleBtnBox = styled.div`
    margin-top: 24px;
`;
const TitleBox = styled.div`
    display: flex;
`
const Box = styled.div`
    display: flex;
    flex-direction: column;
    padding: 8px;
`
const Label = styled.p`
    color: #222;
    font-size: 32px;
    font-weight: 600;
    margin: 20px 0 10px 3px;
`
const CandidateBox = styled.div`
    border: 1px solid #666666;
    border-radius: 20px;
    background-color: #f9f9f9;
    padding: 32px;
    display: grid;
    gap: 24px;
`
const InputCandidate = styled.div`
    display: flex;
    border: 1px solid #888888;
    border-radius: 10px;
    background-color: #EFFFEF;
`
const NumberBox = styled.div`
    width: 40px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #888888;
    margin: -0.5px;
    border-radius: 10px;
    color: #437F5A;
    font-size: 36px;
    font-weight: bold;
`
const InputName = styled.input`
    border: none;
    margin-left: 10px;
    background-color : rgb(255,255,255, 0);
    font-size: 28px;
    flex: 1;
    :focus {
        outline: none;
    }
`
const DeleteButton = styled.button`
    width: 60px;
    height: 60px;
    border: 0px;
    border-radius: 0px 10px 10px 0px;
    background: none;
    color: #dc3545;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    &:hover {
        background-color: rgba(220, 53, 69, 0.1);
    }
`
const AddCandidate = styled.button`
    background-color: #EFFFEF;
    border: 1px solid #888888;
    height: 40px;
    border-radius: 10px;
    cursor: pointer;
`

const VoteTypeBox = styled.div`
    border: 1px solid #666666;
    border-radius: 20px;
    background-color: #f9f9f9;
    padding: 32px;
    margin-bottom: 24px;
`;

const Select = styled.select`
    border: 1px solid #888888;
    border-radius: 10px;
    padding: 8px;
    font-size: 16px;
    margin-right: 16px;
`;
const YearInput = styled.input`
    border: 1px solid #888888;
    border-radius: 10px;
    padding: 8px;
    font-size: 16px;
    width: 100px;
    margin-right: 16px;
`;


const FlexContainer = styled.div``

const VoteType = styled.div``

export default function VoteAdd() {
    const [candidates, setCandidates] = useState([{ name: '', isNew: true }]);
    const [isAutoStopEnabled, setIsAutoStopEnabled] = useState(false);
    const [voterCount, setVoterCount] = useState(1);
    const [voteType, setVoteType] = useState('school');
    const [year, setYear] = useState(new Date().getFullYear());
    const [semester, setSemester] = useState(1);
    const [grade, setGrade] = useState(1);
    const [classNum, setClassNum] = useState(1);
    const [idToken, setIdToken] = useState();

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                setIdToken(await auth.currentUser.getIdToken());
            }
        });
    }, []);

    const addName = () => {
        setCandidates([...candidates, { name: '', isNew: true }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            for (let item of candidates) {
                const voteData = {
                    // candidates,
                    // isAutoStopEnabled,
                    // voterCount,
                    year: Number(year),
                };

                if (item.name.trim() == '') {
                    alert("이름이 공백이 존재합니다.")
                    continue;
                }

                if (voteType == 'school') {
                    const names = item.name.split(",");
                    voteData.name1 = names[0];
                    voteData.name2 = names[1];
                }
                else {
                    voteData.name = item.name;
                    voteData.semester = Number(semester);
                    voteData.grade = Number(grade);
                    voteData.classNum = Number(classNum);
                }

                voteData.electionId = `${voteType[0]}_${voteData.year}`;
                if (voteType == 'class') {
                    voteData.electionId += `${voteData.semester}${voteData.grade}${voteData.classNum}`;
                }

                const response1 = await fetch(`http://localhost:3000/settings`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        electionId: voteData.electionId,
                        active: false,
                        voterCount: voterCount,
                        autoClose: isAutoStopEnabled,
                    })
                });
                if (!response1.ok) {
                    alert("이미 생성된 투표입니다.")
                    continue;
                }

                delete voteData.electionId;

                const response2 = await fetch(`http://localhost:3000/apivote${voteType}-president`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${idToken}`
                    },
                    body: JSON.stringify(voteData)
                });
                const data2 = await response1.json();
                console.log(data2);

                alert("추가 완료!")
                window.location.href = '/dashboard';
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleOptionChange = (index, value) => {
        const newCandidates = [...candidates];
        newCandidates[index] = { ...newCandidates[index], name: value };
        setCandidates(newCandidates);
    };

    const handleDelete = (index) => {
        setCandidates(candidates.filter((_, i) => i !== index));
    };

    const renderCandidates = () => {
        return candidates.map((candidate, index) => {
            return (
                <InputCandidate key={index}>
                    <NumberBox>
                        {index + 1}
                    </NumberBox>
                    <InputName
                        name='names[]'
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        value={candidate.name}
                        placeholder={candidate.isNew ? voteType == 'school' ? "ex) 김ㅇㅇ,이ㅁㅁ" : 'ex) 김ㅇㅇ' : ""}
                    />
                    <DeleteButton
                        type="button"
                        onClick={() => handleDelete(index)}
                    >
                        삭제
                    </DeleteButton>
                </InputCandidate>
            );
        });
    };

    return (
        <Page>
            <Header />
            <Main>
                <Background />
                <FormBox onSubmit={handleSubmit}>
                    <TitleBox>
                        <TitleBtnBox>
                            <TitleBtn type='submit'>저장</TitleBtn>
                            <TitleBtn type='button' onClick={() => { window.history.back() }} color="red">취소</TitleBtn>
                        </TitleBtnBox>
                        <TitleText>
                            <Title>{"새로운 선거 추가"}</Title>
                        </TitleText>
                    </TitleBox>
                    <VoteType>
                        <Label>투표 종류</Label>
                        <VoteTypeBox>
                            <FlexContainer style={{ gap: '10px' }}>
                                <Select value={voteType} onChange={e => setVoteType(e.target.value)}><option value="school">전교회장</option><option value="class">학급회장</option></Select><YearInput type="number" value={year} readOnly />
                                {voteType === 'class' && (<>
                                    <Select value={semester} onChange={e => setSemester(e.target.value)}>
                                        <option value={1}>1학기</option>
                                        <option value={2}>2학기</option>
                                    </Select>
                                    <Select value={grade} onChange={e => setGrade(e.target.value)}>
                                        <option value={1}>1학년</option>
                                        <option value={2}>2학년</option>
                                        <option value={3}>3학년</option>
                                    </Select>
                                    <Select value={classNum} onChange={e => setClassNum(e.target.value)}>
                                        <option value={1}>1반</option>
                                        <option value={2}>2반</option>
                                        <option value={3}>3반</option>
                                        <option value={4}>4반</option>
                                        <option value={5}>5반</option>
                                        <option value={6}>6반</option>
                                    </Select></>)}
                            </FlexContainer>
                        </VoteTypeBox>
                    </VoteType>
                    <Box>
                        <Label>후보자 관리</Label>
                        <CandidateBox>
                            {renderCandidates()}
                            <AddCandidate type="button" onClick={addName}>후보 추가</AddCandidate>
                        </CandidateBox>
                    </Box>
                    <VoteManage
                        isAutoStopEnabled={isAutoStopEnabled}
                        setIsAutoStopEnabled={setIsAutoStopEnabled}
                        voterCount={voterCount}
                        setVoterCount={setVoterCount}
                    />
                </FormBox>
            </Main>
            <Footer />
        </Page>
    )
}