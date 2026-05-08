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
            for (const matchId of matchIds) {
                try {
                    const detailRes = await fetch(`/api/match-detail/${matchId}`);
                    const match = await detailRes.json();
                    
                    if (match.error) continue;
                    
                    // 일단 모든 전적을 보여주도록 필터 해제 (디버깅용)
                    renderMatch(match, puuid);
                } catch (e) {
                    console.error('Match error:', e);
                }
            }

            if (resultContainer.innerHTML === '') {
                resultContainer.innerHTML = '<div class="placeholder">표시할 전적이 없습니다.</div>';
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
        const gameMode = match.info.gameMode;
        
        // Data Dragon 이미지 (버전 14.9.1로 업데이트)
        const champImg = `https://ddragon.leagueoflegends.com/cdn/14.9.1/img/champion/${championName}.png`;

        const card = document.createElement('div');
        card.className = `match-card ${win ? 'win' : 'loss'}`;
        card.innerHTML = `
            <img src="${champImg}" alt="${championName}" class="champion-icon" onerror="this.src='https://ddragon.leagueoflegends.com/cdn/14.9.1/img/profileicon/29.png'">
            <div class="match-info">
                <div class="result-text">${win ? '승리' : '패배'} <span style="font-size: 0.8rem; font-weight: normal; opacity: 0.7;">(${gameMode})</span></div>
                <div class="kda">KDA: ${kda}</div>
            </div>
            <div class="game-date">${new Date(match.info.gameCreation).toLocaleDateString()}</div>
        `;
        resultContainer.appendChild(card);
    }
});
