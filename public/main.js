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
            if (!accountRes.ok) throw new Error('계정을 찾을 수 없습니다.');
            const account = await accountRes.json();
            const puuid = account.puuid;

            // 2. 매치 목록 가져오기
            const matchesRes = await fetch(`/api/matches/${puuid}`);
            const matchIds = await matchesRes.json();

            if (matchIds.length === 0) {
                resultContainer.innerHTML = '<div class="placeholder">최근 전적이 없습니다.</div>';
                return;
            }

            resultContainer.innerHTML = ''; // 로딩 메시지 제거

            // 3. 각 매치 상세 정보 가져오기 (병렬 처리)
            for (const matchId of matchIds) {
                const detailRes = await fetch(`/api/match-detail/${matchId}`);
                const match = await detailRes.json();
                
                // 아수라장 모드 또는 칼바람 나락 필터링 (Queue ID 450 = ARAM)
                // 아수라장의 정확한 Queue ID는 라이엇 문서 업데이트에 따라 다를 수 있음
                if (match.info.queueId === 450 || match.info.gameMode === 'ARAM') {
                    renderMatch(match, puuid);
                }
            }

            if (resultContainer.innerHTML === '') {
                resultContainer.innerHTML = '<div class="placeholder">칼바람 전적이 없습니다.</div>';
            }

        } catch (error) {
            resultContainer.innerHTML = `<div class="placeholder">${error.message}</div>`;
        }
    });

    function renderMatch(match, puuid) {
        const participant = match.info.participants.find(p => p.puuid === puuid);
        if (!participant) return;

        const win = participant.win;
        const kda = `${participant.kills} / ${participant.deaths} / ${participant.assists}`;
        const championName = participant.championName;
        // Data Dragon을 이용한 챔피언 이미지 (버전에 따라 업데이트 필요)
        const champImg = `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${championName}.png`;

        const card = document.createElement('div');
        card.className = `match-card ${win ? 'win' : 'loss'}`;
        card.innerHTML = `
            <img src="${champImg}" alt="${championName}" class="champion-icon">
            <div class="match-info">
                <div class="result-text">${win ? '승리' : '패배'}</div>
                <div class="kda">KDA: ${kda}</div>
            </div>
            <div class="game-date">${new Date(match.info.gameCreation).toLocaleDateString()}</div>
        `;
        resultContainer.appendChild(card);
    }
});
