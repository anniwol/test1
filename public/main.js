document.addEventListener('DOMContentLoaded', () => {
    const riotIdInput = document.getElementById('riot-id');
    const searchBtn = document.getElementById('search-btn');
    const resultContainer = document.getElementById('result-container');
    const themeBtn = document.getElementById('theme-btn');

    // 테마 토글
    themeBtn.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.body.setAttribute('data-theme', newTheme);
        themeBtn.textContent = newTheme === 'light' ? '☀️' : '🌙';
    });

    searchBtn.addEventListener('click', async () => {
        const fullId = riotIdInput.value.trim();
        if (!fullId.includes('#')) {
            alert('닉네임#태그 형식으로 입력해주세요. (예: 닉네임#KR1)');
            return;
        }

        const [name, tag] = fullId.split('#');
        resultContainer.innerHTML = '<div class="loading">전적을 검색 중입니다...</div>';

        try {
            // 1. PUUID 가져오기
            const accountRes = await fetch(`/api/summoner/${name}/${tag}`);
            const accountData = await accountRes.json();
            
            if (!accountRes.ok) throw new Error(accountData.error || '계정을 찾을 수 없습니다.');
            const puuid = accountData.puuid;

            // 2. 매치 목록 가져오기
            const matchesRes = await fetch(`/api/matches/${puuid}`);
            const matchIds = await matchesRes.json();

            if (matchIds.error) throw new Error(matchIds.error);
            if (!Array.isArray(matchIds) || matchIds.length === 0) {
                resultContainer.innerHTML = '<div class="placeholder">최근 전적이 없습니다.</div>';
                return;
            }

            resultContainer.innerHTML = ''; // 로딩 메시지 제거

            // 3. 각 매치 상세 정보 가져오기
            let foundMayhem = false;
            for (const matchId of matchIds) {
                try {
                    const detailRes = await fetch(`/api/match-detail/${matchId}`);
                    const match = await detailRes.json();
                    
                    if (match.error) continue;
                    
                    // 아수라장(ARAM Mayhem) Queue ID: 1700, 1710 등을 필터링
                    // 라이엇 문서에 따라 변동될 수 있어 gameMode와 queueId를 함께 체크
                    const isMayhem = match.info.queueId === 1700 || 
                                     match.info.queueId === 1710 || 
                                     match.info.gameMode === 'MAYHEM' ||
                                     (match.info.gameMode === 'ARAM' && match.info.gameType === 'EVENT_GAME');

                    if (isMayhem) {
                        renderMatch(match, puuid);
                        foundMayhem = true;
                    }
                } catch (e) {
                    console.error('Match error:', e);
                }
            }

            if (!foundMayhem) {
                resultContainer.innerHTML = '<div class="placeholder">최근 20경기 중 "아수라장" 전적이 없습니다. 일반 칼바람과는 구분되어 표시됩니다.</div>';
            }

        } catch (error) {
            resultContainer.innerHTML = `<div class="placeholder" style="color: #e84057;">오류: ${error.message}</div>`;
            console.error(error);
        }
    });

    function renderMatch(match, puuid) {
        const participant = match.info.participants.find(p => p.puuid === puuid);
        if (!participant) return;

        const win = participant.win;
        const kda = `${participant.kills} / ${participant.deaths} / ${participant.assists}`;
        const championName = participant.championName;
        
        // 아수라장 특전 마크 (예: 증강 시스템 아이콘 대신 텍스트)
        const mayhemLabel = '<span class="mayhem-badge">아수라장</span>';
        
        const champImg = `https://ddragon.leagueoflegends.com/cdn/14.9.1/img/champion/${championName}.png`;

        const card = document.createElement('div');
        card.className = `match-card ${win ? 'win' : 'loss'}`;
        card.innerHTML = `
            <img src="${champImg}" alt="${championName}" class="champion-icon" onerror="this.src='https://ddragon.leagueoflegends.com/cdn/14.9.1/img/profileicon/29.png'">
            <div class="match-info">
                <div class="result-text">
                    ${win ? '승리' : '패배'} ${mayhemLabel}
                </div>
                <div class="kda">KDA: ${kda}</div>
            </div>
            <div class="game-date">${new Date(match.info.gameCreation).toLocaleDateString()}</div>
        `;
        resultContainer.appendChild(card);
    }
});
