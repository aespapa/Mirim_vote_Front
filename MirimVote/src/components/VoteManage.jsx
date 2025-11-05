import styled from '@emotion/styled'
import { useEffect, useState } from 'react';

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

const VoteManagement = styled.div`
    border: 1px solid #666666;
    border-radius: 20px;
    background-color: #f9f9f9;
    padding: 32px;
`

const AutoStopBox = styled.div`
    display: flex;
    justify-content: space-between;
`

const AutoStopTextBox = styled.div``

const AutoStopTitle = styled.p`
    font-size: 20px;
    margin: 0;
    color: #222222;
    font-weight: 600;
`

const AutoStopContent = styled.p`
    font-size: 12px;
    margin: 0;
    color: #444444;
`

const ButtonBox = styled.div``

const SwitchContainer = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
`;

const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + .slider {
    background-color: #437F5A;
  }

  &:focus + .slider {
    box-shadow: 0 0 1px #437F5A;
  }

  &:checked + .slider:before {
    transform: translateX(26px);
  }
`;

const SwitchSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;

  &:before {
    position: absolute;
    content: "";
    height: 30px;
    width: 30px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
`;

const VoterCountBox = styled.div`
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
`;

const VoterCountInput = styled.input`
    border: 1px solid #888888;
    border-radius: 10px;
    padding: 8px;
    font-size: 16px;
    width: 35%; /* 30-40% range */
`;

export default function VoteManage({ isAutoStopEnabled, setIsAutoStopEnabled, voterCount, setVoterCount }) {

    return (
        <Box>
            <Label>투표 관리</Label>
            <VoteManagement>
                <AutoStopBox>
                    <AutoStopTextBox>
                        <AutoStopTitle>자동 종료</AutoStopTitle>
                        <AutoStopContent>만약 투표수가 유권자수와 동일하다면 자동으로 투표가 종료됩니다</AutoStopContent>
                    </AutoStopTextBox>
                    <ButtonBox>
                        <SwitchContainer>
                            <SwitchInput type="checkbox" checked={isAutoStopEnabled} onChange={() => setIsAutoStopEnabled(!isAutoStopEnabled)} />
                            <SwitchSlider className="slider" />
                        </SwitchContainer>
                    </ButtonBox>
                </AutoStopBox>
                <VoterCountBox>
                    <label>유권자 수: </label>
                    <VoterCountInput type="number" value={voterCount} onChange={e => setVoterCount(e.target.value) } min={1} max={999} />
                </VoterCountBox>
            </VoteManagement>
        </Box>
    )
}