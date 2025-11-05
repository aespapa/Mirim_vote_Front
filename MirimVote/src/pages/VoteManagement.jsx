import styled from '@emotion/styled'
import Background from "../components/Background";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { Page, Main } from "../components/Page";
import { Title, SubTitle } from "../components/VoteTitles";
import VoteControl from "../components/VoteControl";
import VoteManage from '../components/VoteManage';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const TitleBtn = styled.button`
    width: 80px;
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

export default function VoteManagers() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const voteType = queryParams.get('type');
    const year = queryParams.get('year');
    const semester = queryParams.get('semester');
    const grade = queryParams.get('grade');
    const classNum = queryParams.get('class');

    const [candidates, setCandidates] = useState([]);
    const [originalCandidates, setOriginalCandidates] = useState([]); // To track deletions
    const [isAutoStopEnabled, setIsAutoStopEnabled] = useState(false);
    const [voterCount, setVoterCount] = useState(1);
    const [isStart, setIsStart] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [electionId, setElectionId] = useState(null);
    const [idToken, setIdToken] = useState();

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                setIdToken(await auth.currentUser.getIdToken());
            }
        });
    }, []);

    useEffect(() => {
        const fetchVoteDetails = async () => {
            try {
                setLoading(true);
                let currentElectionId;

                if (voteType === 'school') {
                    currentElectionId = `s_${year}`;
                } else if (voteType === 'class') {
                    currentElectionId = `c_${year}${semester}${grade}${classNum}`;
                } else {
                    setError('Invalid vote type or missing parameters.');
                    setLoading(false);
                    return;
                }
                setElectionId(currentElectionId);

                // 1. Fetch Election Settings
                const settingsResponse = await fetch(`http://localhost:3000/settings?electionId=${currentElectionId}`);
                if (!settingsResponse.ok) {
                    throw new Error(`Failed to fetch settings: ${settingsResponse.status}`);
                }
                const settingsData = await settingsResponse.json();
                if (!settingsData.ok || !settingsData.settings) {
                    throw new Error('Election settings not found.');
                }
                setIsAutoStopEnabled(settingsData.settings.autoClose);
                setVoterCount(settingsData.settings.voterCount);
                setIsStart(settingsData.settings.active);

                // 2. Fetch Candidates
                let apiUrl = `http://localhost:3000/apivote`;
                let queryParams = `?year=${year}`;

                if (voteType === 'school') {
                    apiUrl += `school-president`;
                } else if (voteType === 'class') {
                    apiUrl += `class-president`;
                    queryParams += `&semester=${semester}&grade=${grade}&class=${classNum}`;
                }

                const candidatesResponse = await fetch(`${apiUrl}${queryParams}`);
                if (!candidatesResponse.ok) {
                    throw new Error(`Failed to fetch candidates: ${candidatesResponse.status}`);
                }
                const candidatesData = await candidatesResponse.json();

                const fetchedCandidates = (candidatesData.list || candidatesData.data || []).map(item => ({
                    number: item.number, // Firebase doc ID
                    name: item.name || `${item.name1}${item.name2 ? `,${item.name2}` : ''}`,
                    isNew: false,
                }));
                setCandidates(fetchedCandidates);
                setOriginalCandidates(fetchedCandidates);

            } catch (err) {
                console.error("Error fetching vote details:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVoteDetails();
    }, [voteType, year, semester, grade, classNum]);

    const addName = () => {
        setCandidates([...candidates, { name: '', isNew: true }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Update Election Settings
            const settingsUpdateResponse = await fetch(`http://localhost:3000/settings/${electionId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    active: isStart, // isStart from VoteControl
                    voterCount: voterCount,
                    autoClose: isAutoStopEnabled,
                }),
            });
            if (!settingsUpdateResponse.ok) {
                throw new Error(`Failed to update settings: ${settingsUpdateResponse.status}`);
            }

            // 2. Handle Candidate Changes
            const candidatesToProcess = [];

            // Identify new candidates
            const newCandidates = candidates.filter(c => c.isNew);
            newCandidates.forEach(c => candidatesToProcess.push({
                action: 'create',
                data: c
            }));

            // Identify updated candidates (name changed)
            const updatedCandidates = candidates.filter(c => !c.isNew && originalCandidates.some(oc => oc.number === c.number && oc.name !== c.name));
            updatedCandidates.forEach(c => candidatesToProcess.push({
                action: 'update',
                data: c
            }));

            // Identify deleted candidates
            const deletedCandidates = originalCandidates.filter(oc => !candidates.some(c => c.number === oc.number));
            deletedCandidates.forEach(c => candidatesToProcess.push({
                action: 'delete',
                data: c
            }));

            await Promise.all(candidatesToProcess.map(async (item) => {
                let candidateApiUrl = `http://localhost:3000/apivote`;
                if (voteType === 'school') {
                    candidateApiUrl += `school-president`;
                } else {
                    candidateApiUrl += `class-president`;
                }

                if (item.action === 'create') {
                    const createBody = { year: Number(year) };
                    if (voteType === 'school') {
                        const names = item.data.name.split(',');
                        createBody.name1 = names[0].trim();
                        createBody.name2 = names[1] ? names[1].trim() : '';
                    } else {
                        createBody.name = item.data.name;
                        createBody.semester = Number(semester);
                        createBody.grade = Number(grade);
                        createBody.classNum = Number(classNum);
                    }
                    const createResponse = await fetch(candidateApiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(createBody),
                    });
                    if (!createResponse.ok) throw new Error(`Failed to create candidate: ${createResponse.status}`);
                } else if (item.action === 'update') {
                    const updateBody = {};
                    if (voteType === 'school') {
                        const names = item.data.name.split(',');
                        updateBody.name1 = names[0].trim();
                        updateBody.name2 = names[1] ? names[1].trim() : '';
                    } else {
                        updateBody.name = item.data.name;
                    }
                    const updateResponse = await fetch(`${candidateApiUrl}?number=${item.data.number}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updateBody),
                    });
                    if (!updateResponse.ok) throw new Error(`Failed to update candidate: ${updateResponse.status}`);
                } else if (item.action === 'delete') {
                    const deleteResponse = await fetch(`${candidateApiUrl}?number=${item.data.number}`, {
                        method: 'DELETE',
                    });
                    if (!deleteResponse.ok) throw new Error(`Failed to delete candidate: ${deleteResponse.status}`);
                }
            }));

            alert('저장 완료!');
            window.location.reload();
        } catch (error) {
            console.error('Error saving vote details:', error);
            setError(error.message);
            alert(`저장 실패: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const voteDelete = async () => {
        if (!confirm("정말 이 선거를 삭제하시겠습니까? 모든 후보자와 설정이 영구적으로 삭제됩니다.")) {
            return;
        }

        setLoading(true);
        try {
            // 1. Fetch all candidates for this election
            let candidateApiUrl = `http://localhost:3000/apivote`;
            let queryParams = `?year=${year}`;

            if (voteType === 'school') {
                candidateApiUrl += `school-president`;
            } else if (voteType === 'class') {
                candidateApiUrl += `class-president`;
                queryParams += `&semester=${semester}&grade=${grade}&class=${classNum}`;
            }

            const candidatesResponse = await fetch(`${candidateApiUrl}${queryParams}`);
            if (!candidatesResponse.ok) {
                throw new Error(`Failed to fetch candidates for deletion: ${candidatesResponse.status}`);
            }
            const candidatesData = await candidatesResponse.json();
            const candidatesToDelete = (candidatesData.list || candidatesData.data || []);

            // 2. Delete all candidates
            await Promise.all(candidatesToDelete.map(async (candidate) => {
                const deleteCandidateResponse = await fetch(`${candidateApiUrl}?number=${candidate.number}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${idToken}`
                    },
                });
                if (!deleteCandidateResponse.ok) {
                    console.error(`Failed to delete candidate ${candidate.number}: ${deleteCandidateResponse.status}`);
                    // Don't throw here, try to delete other candidates
                }
            }));

            // 3. Delete Election Settings
            const deleteSettingsResponse = await fetch(`http://localhost:3000/settings/${electionId}`, {
                method: 'DELETE',
            });
            if (!deleteSettingsResponse.ok) {
                throw new Error(`Failed to delete election settings: ${deleteSettingsResponse.status}`);
            }

            alert('선거가 성공적으로 삭제되었습니다.');
            window.location.href = '/dashboard'; // Redirect to dashboard
        } catch (error) {
            console.error('Error deleting vote:', error);
            setError(error.message);
            alert(`선거 삭제 실패: ${error.message}`);
        } finally {
            setLoading(false);
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
                        placeholder={candidate.isNew ? "ex) 김ㅇㅇ, 이ㅁㅁ" : ""}
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
                            <TitleBtn type='button' onClick={() => { window.history.back() }}>취소</TitleBtn>
                            <TitleBtn type='button' onClick={() => { voteDelete() }} color="red">삭제</TitleBtn>
                        </TitleBtnBox>
                        <TitleText>
                            <Title>{voteType == 'school' ? `전교회장 선거` : `${semester}학기 학급회장 선거`}</Title>
                            <SubTitle>{`${year}학년도 ${voteType == 'class' ? `${grade}학년 ${classNum}반` : ''} `}</SubTitle>
                        </TitleText>
                    </TitleBox>
                    <Box>
                        <Label>후보자 관리</Label>
                        <CandidateBox>
                            {renderCandidates()}
                            <AddCandidate type="button" onClick={addName}>후보 추가</AddCandidate>
                        </CandidateBox>
                    </Box>
                    <VoteControl
                        isStart={isStart}
                        setIsStart={setIsStart}
                        electionId={electionId}
                    />
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