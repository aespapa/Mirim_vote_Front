import styled from '@emotion/styled'
import Background from "../components/Background";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { Button } from "../components/VoteButton";
import { Title, SubTitle } from "../components/VoteTitles";
import { Page, Main } from "../components/Page";
import CircleCheck from "../assets/CircleCheck.svg";
const url = new URL(window.location.href);
const urlParams = url.searchParams;
const year = urlParams.get('year');
const type = urlParams.get('type');

const FinishBox = styled.div`
    border: 1px solid #888;
    border-radius: 20px;
    background-color: #f9f9f9;
    text-align: center;
    margin: 20px 0 20px 0;
    padding: 40px 20px 20px 20px;
    width: 350px;
`;

const FinishText = styled.p`
    font-size: 36px;
    font-weight: 600;
    margin-bottom: 8px;
`;

const ThankText = styled.p`
    font-size: 24px;
    font-weight: 300;
    color: #288157;
`;

export default function VoteEnd() {

    return (
        <Page>
            <Header />
            <Main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Background />
                <Title>{type === 'school' ? '전교회장 선거' : `${urlParams.get('grade')}학년 ${urlParams.get('class')}반 학급회장 선거`}</Title>
                <SubTitle>{type === 'school' ? `${year}학년도` : `${year}학년도 ${urlParams.get('semester')}학기`}</SubTitle>
                <FinishBox>
                    <img src={CircleCheck} alt="투표 완료" style={{ width: 72, height: 72 }} />
                    <FinishText>투표가 완료되었습니다!</FinishText>
                    <ThankText>소중한 한 표 감사합니다!</ThankText>
                </FinishBox>
                <Button onClick={() => handleGoHome()}>메인으로 가기</Button>
            </Main>
            <Footer />
        </Page>
    );
}

function handleGoHome() {
    window.location.href = "/dashboard";
}